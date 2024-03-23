import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotAcceptableException,
} from '@nestjs/common';
import { IntraUserDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Tokens } from 'src/types';
import { GetUser } from 'src/decorators';
import { User } from '@prisma/client';
import { EncryptionService } from 'src/encryption/encryption.service';
import axios, { AxiosError } from 'axios';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private encrypt: EncryptionService,
  ) {}

  async logout(user: User) {
    await this.prisma.user.update({
      where: { email: user.email },
      data: {
        isOnLine: false,
        Status: 'offline',
        accessToken: 'offline',
        refreshToken: 'logout',
      },
    });
  }

  // TODO: implement the logging using intra 42
  async loginInra(dto: IntraUserDto): Promise<Tokens> {
    try {
      if (!dto) {
        throw new NotAcceptableException();
      }


      // get the user data from intra 42 api's
      // const dataIntra: IntraUserDto = await this.fetchDataUserFromIntra(code);

      

      // check if the user is already in the database by fetching the user by email address

      const user: User = await this.prisma.user.findFirst({
        where: { usernameOld: dto.login },
      });

      // if the user exists in the database just return the tokens
      if (user) {

        // update the status of the user
        await this.prisma.user.update({
          where: { id: user.id},
          data: {
            isOnLine: true,
            Status: 'online'
          }
        })

        // here need to set redirect tow factor to true 
        if (user.twoFactor) {

          await this.prisma.user.update({
            where: { id: user.id },
            data: {
              twoFactor: true, 
              towFactorToRedirect: true,
            }
          })

          // check  if the user has already logged in
        
          // the user has already tokens so need just to decrypt them and return them
          if (user.refreshToken !== "logout" && user.accessToken !== "offline") {

            // need to decrypt the tokens from the user and return them
            const accToken: string = await this.encrypt.decrypt(user.accessToken);
            const refToken: string = await this.encrypt.decrypt(user.refreshToken);

            return {
              access_token: accToken,
              refresh_token: refToken
            }
          }  // the user it just off line but his has already logged in the server
            // need to create a new access token and return it
          else if (user.refreshToken !== "logout") {

            // decrypt the refresh token from the user 
            const refToken: string = await this.encrypt.decrypt(user.refreshToken);
            
            // create the access token
            const acctoken = await this.generateJwtToken(user.id, user.email, 60 * 60);

            // encrypt the access token
            const hashToken = await this.encrypt.encrypt(acctoken);

            // update the user access token
            const updateUser: User = await this.prisma.user.update({
              where: { id: user.id },
              data: {
                accessToken: hashToken
              }
            })

            return {
              access_token: acctoken,
              refresh_token: refToken
            }

          }

        }

        return await this.returnTokens(user.id, user.email);
      }

      // store new user in database
      const newUser: User = await this.prisma.user.create({
        data: {
          username: dto.login,
          email: dto.email,
          fullName: dto.fullName,
          avatarUrl: dto.avatarUrl,
          usernameOld: dto.login,
          isOnLine: true,
          Status: 'online',
          accessToken: 'offline',
          refreshToken: 'logout',
          twoFactor: false,
          towFactorToRedirect: false,
          qrCodeFileName: 'nothing',
          towFactorSecret: 'nothing',
          levelGame: 0,
        },
      });

      // make sure the user is created and return tokens
      if (newUser) {
        return await this.returnTokens(newUser.id, newUser.email);
      } else {
        throw new NotAcceptableException();
      }
    } catch (error) {
      throw new NotAcceptableException();
    }
  }

  async refreshToken(@GetUser() user: User): Promise<Tokens | null> {

    if (user.refreshToken === "logout") {
      return null;
    }

    const access_token: string = await this.generateJwtToken(
      user.id,
      user.email,
      60 * 60,
    );

    const hashAT: string = await this.encrypt.encrypt(access_token);

    const userN: User = await this.prisma.user.update({
      where: { id: user.id },
      data: { accessToken: hashAT, isOnLine: true },
    });
    
    const refresh_token: string = await this.encrypt.decrypt(userN.refreshToken);

    return {
      access_token,
      refresh_token
    }
  }

  async generateTokens(id: string, email: string): Promise<Tokens> {
    try {
      // generate the tokens for the user
      const [at, rt] = await Promise.all([
        this.generateJwtToken(id, email, 60 * 60),
        this.generateJwtToken(id, email, 60 * 60 * 24 * 7),
      ]);

      return {
        access_token: at,
        refresh_token: rt,
      };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  // generate the JWT token
  async generateJwtToken(
    id: string,
    email: string,
    expiresIn: number,
  ): Promise<string> {
    const secret: string = process.env.SECRET_JWT_TOKEN;

    const token = this.jwt.sign(
      {
        sub: id,
        email,
      },
      {
        secret,
        expiresIn,
      },
    );

    return token;
  }

  private async returnTokens(id: string, email: string): Promise<Tokens> {
    // generate the tokens and store the email address and username in the jwt token
    const tokens: Tokens = await this.generateTokens(id, email);

    // encrypt the access token
    const hashAT: string = await this.encrypt.encrypt(tokens.access_token);

    // encrypt the refresh token
    const hashRT: string = await this.encrypt.encrypt(tokens.refresh_token);

    // update the user access refresh tokens
    const updateUser = await this.prisma.user.update({
      where: { id: id },
      data: { accessToken: hashAT, refreshToken: hashRT },
    });

    if (!updateUser) {
      throw new NotAcceptableException();
    }

    return tokens;
  }

  private async fetchDataUserFromIntra(code: string): Promise<IntraUserDto> {
    try {
      // get grant type
      const grant_type: string = process.env.INTRA_GRANT_TYPE;

      // get client id
      const client_id: string = process.env.INTRA_CLIENT_ID;

      // get client secret
      const client_secret: string = process.env.INTRA_CLIENT_SECRET;

      // get redirect url
      const redirect_uri: string = process.env.INTRA_REDIRECT_URI;

      const form = {
        grant_type,
        client_id,
        client_secret,
        code,
        redirect_uri,
      };

      // make a req to the intra to get the access token
      const res = await axios.post(
        'https://api.intra.42.fr/oauth/token/',
        form,
        {
          timeout: 2000,
        },
      );

      if (!res.data) {
        this.logger.debug('No data from intra 42');
        throw new NotAcceptableException();
      }

      // get the access_token from data of intra 42
      const { access_token } = res.data;

      // check if the access token is here
      if (access_token === undefined) {
        this.logger.debug('No access token found');
        throw new NotAcceptableException();
      }

      // add the bearer string to the access token
      const headerAccessToken = 'Bearer ' + access_token;

      // get info of the user with his access token
      const dataInra = await axios.get('https://api.intra.42.fr/v2/me', {
        headers: {
          Authorization: headerAccessToken,
        },
      });

      if (!dataInra.data) {
        this.logger.debug('No info user from intra');
        throw new NotAcceptableException();
      }

      // extract data from dataIntra
      const { usual_full_name, login, email } = dataInra.data;

      const { link } = dataInra.data.image;

      let extractedData: IntraUserDto = new IntraUserDto();

      // store the data
      extractedData.login = login;
      extractedData.fullName = usual_full_name;
      extractedData.avatarUrl = link;
      extractedData.email = email;

      // check if the data is here
      if (
        extractedData.email === undefined ||
        extractedData.avatarUrl === undefined ||
        extractedData.fullName === undefined ||
        extractedData.login === undefined
      ) {
        throw new NotAcceptableException();
      }

      return extractedData;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new HttpException('Success', HttpStatus.OK);
      }
      this.logger.error(error);
      throw new NotAcceptableException();
    }
  }
}
