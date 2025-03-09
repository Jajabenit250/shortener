import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class GoogleService {
  private readonly logger = new Logger(GoogleService.name);
  private oAuth2Client: OAuth2Client;

  constructor(private readonly configService: ConfigService) {
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    this.oAuth2Client = new OAuth2Client(clientId);
  }

  /**
   * Verify Google ID token and return user info
   */
  async verifyIdToken(idToken: string): Promise<any> {
    try {
      const ticket = await this.oAuth2Client.verifyIdToken({
        idToken,
        audience: this.configService.get<string>('GOOGLE_CLIENT_ID'),
      });

      const payload = ticket.getPayload();
      
      return {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      };
    } catch (error) {
      this.logger.error(
        `Google token verification failed: ${error.message}`,
        error.stack,
        GoogleService.name,
      );
      throw error;
    }
  }
}
