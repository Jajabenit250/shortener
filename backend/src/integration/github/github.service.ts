import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class GithubService {
  private readonly logger = new Logger(GithubService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  /**
   * Exchange GitHub authorization code for access token and user info
   */
  async getAccessTokenFromCode(code: string): Promise<any> {
    try {
      // Get access token
      const tokenResponse = await lastValueFrom(
        this.httpService.post(
          'https://github.com/login/oauth/access_token',
          {
            client_id: this.configService.get<string>('GITHUB_CLIENT_ID'),
            client_secret: this.configService.get<string>('GITHUB_CLIENT_SECRET'),
            code,
          },
          {
            headers: {
              Accept: 'application/json',
            },
          },
        ),
      );

      const accessToken = tokenResponse.data.access_token;

      // Get user info
      const userResponse = await lastValueFrom(
        this.httpService.get('https://api.github.com/user', {
          headers: {
            Authorization: `token ${accessToken}`,
          },
        }),
      );

      // Get user emails if not public
      let userEmail = userResponse.data.email;
      
      if (!userEmail) {
        const emailsResponse = await lastValueFrom(
          this.httpService.get('https://api.github.com/user/emails', {
            headers: {
              Authorization: `token ${accessToken}`,
            },
          }),
        );
        
        // Find primary email
        const primaryEmail = emailsResponse.data.find(
          (email) => email.primary && email.verified,
        );
        
        if (primaryEmail) {
          userEmail = primaryEmail.email;
        }
      }

      // Return user info with email
      return {
        accessToken,
        userInfo: {
          ...userResponse.data,
          email: userEmail,
        },
      };
    } catch (error) {
      this.logger.error(
        `GitHub code exchange failed: ${error.message}`,
        error.stack,
        GithubService.name,
      );
      throw error;
    }
  }
}
