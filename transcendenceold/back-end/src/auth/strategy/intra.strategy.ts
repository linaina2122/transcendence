import { Strategy } from 'passport-42';
import { Injectable, Logger } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { IntraDto } from '../dto';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42auth') {

    private logger = new Logger(FortyTwoStrategy.name);

    constructor () { 
        super({
            clientID: process.env.INTRA_CLIENT_ID,
            clientSecret: process.env.INTRA_CLIENT_SECRET,
            callbackURL: process.env.INTRA_REDIRECT_URI,
            profileFields: {
				usual_full_name: 'usual_full_name',
				username: 'login',
				email: 'email',
				avatar: 'image_url',
			},
        });
    }

    async validate ( accessToken: string, refreshToken: string, profile: IntraDto ) {
        return profile;
    }
}