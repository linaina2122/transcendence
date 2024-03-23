import { Injectable, Logger } from '@nestjs/common';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class EncryptionService {

  private logger = new Logger(EncryptionService.name);

  constructor() {}

  // get the secret from the config service
  private readonly key = process.env.ENCRYPT_SECRET;

  async encrypt(toEncrypt: string): Promise<string> {

    try {

      const toReturn: string = CryptoJS.AES.encrypt(toEncrypt,  this.key).toString();

      return toReturn;

    } catch (error) {
      this.logger.error(error.message);
    }
    
  }

  async decrypt(toDecrypt: string): Promise<string> {

    try {
      
      const decryptedBytes = CryptoJS.AES.decrypt(toDecrypt, this.key);

      const toReturn: string = decryptedBytes.toString(CryptoJS.enc.Utf8);

      return toReturn;

    } catch (error) {
      this.logger.error(error.message);
    }

  }
}
