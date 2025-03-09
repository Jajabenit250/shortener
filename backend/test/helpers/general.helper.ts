import { TestingModule } from "@nestjs/testing";
import { Observable, of } from "rxjs";
import { Connection } from "typeorm";

export class TestHelpers {
    /**
   * This will return the observable responseBody for the cases of 2XX
   * @param data
   * @param is201
   * @returns
   */
  static mock200With = (
    data: any,
    is201 = false,
  ): Observable<{ data: any; status: number }> => {
    return of({
      data,
      status: is201 ? 201 : 200,
    });
  };

  static throwHttpException = (error: string): any => {
    return of(new Error(error));
  };

  public static cleanAllPostgresData = async (
    testingModule: TestingModule,
  ): Promise<void> => {
    const connection = testingModule.get<Connection>(Connection);

    for (const entityMetadata of connection.entityMetadatas) {
      const entityRepository = connection.getRepository(entityMetadata.name);

      if (!entityMetadata.tableName.includes('user')) {
        await entityRepository.query(
          `TRUNCATE ${entityMetadata.tableName} RESTART IDENTITY CASCADE;`,
        );
      }
    }

    await testingModule.get('UserRepository').delete({});
  };

  static getMockedHttpService = (): Record<string, jest.Mock> => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    patch: jest.fn(),
  });
}