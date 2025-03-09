import { TestHelpers } from "./general.helper";


export class TestIntegrationRequestsMockHelper {
    static readonly session = {
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJJQ01TIiwiaWF0IjoxNjgxMzEwNzg4LCJleHAiOjE2ODEzOTcxODgsImlzcyI6IlJ3YW5kYSBTb2NpYWwgU2VjdXJpdHkgQm9hcmQifQ.YPWaQ9r_U46a_Ykb_Mm_FTMCNzSRXDGPX-oUfTQa8S8',
      expiration: new Date().setDate(new Date().getDate() + 2),
    };

    static mockOtpSession(url: string, hasError: boolean): any {
      if (url === 'session') {
        if (hasError)
          return TestHelpers.throwHttpException(''); // TODO: throw exception message with enum
  
        return TestHelpers.mock200With(this.session);
      }
    }
}
