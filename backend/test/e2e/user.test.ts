import { INestApplication } from "@nestjs/common";
import { TestingModule, Test } from "@nestjs/testing";
import { AppModule } from "src/app.module";
import { User } from "src/database/entities/user.entity";
import { TestHelpers } from "test/helpers/general.helper";
import { HttpService } from "@nestjs/axios";
import { TestUserDataHelper } from "test/helpers/db/user-data.helper";
import { CreateUserDto } from "src/logic/users/dto/create-user.dto";
import request from "supertest";
import { randomInt } from "crypto";
import { Repository } from "typeorm";

const mockedHttpService = TestHelpers.getMockedHttpService();

describe("User Module Test", () => {
  let app: INestApplication;

  let testingModule: TestingModule;

  let accessToken = "";

  let userRepository: Repository<User>;

  let mockUser: User;

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(HttpService)
      .useValue(mockedHttpService)
      .compile();

    app = testingModule.createNestApplication();

    await app.init();
  });

  beforeEach(async () => {
    jest.resetAllMocks();

    await TestHelpers.cleanAllPostgresData(testingModule);

    userRepository = testingModule.get("UserRepository");

    mockUser = await TestUserDataHelper.generateAndSaveUser(testingModule);
  });

  describe("(POST) - create", () => {
    it("should create a new user with valid data", async () => {
      const payload: Partial<CreateUserDto> = {
        userName: "test user",
        password: "1283333",
      };

      await request(app.getHttpServer())
        .post(`/api/v1/users`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send(payload)
        .expect(201);

      const savedUser = await userRepository
        .createQueryBuilder("user")
        .where("user.userName =:userName", {
          userName: payload.userName,
        })
        .getOne();

      expect({ ...payload }).toEqual({
        userName: savedUser.userName,
        password: savedUser.password,
      });
    });

    it("should not create a user with existing email", async () => {
      const payload: Partial<CreateUserDto> = {
        userName: mockUser.userName,
        password: "19202033",
      };

      await request(app.getHttpServer())
        .post(`/api/v1/users`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send(payload)
        .expect(403, `User (${payload.userName}) Already Exist`);
    });
  });

  describe("(GET) - find user by ID", () => {
    it("should find a user by valid ID", async () => {
      const { body } = await request(app.getHttpServer())
        .get(`/api/v1/users/${mockUser.id}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200);

      expect(body).toEqual({
        ...mockUser,
      });
    });

    it("should throw an exception for an invalid user ID", async () => {
      await request(app.getHttpServer())
        .get(`/api/v1/users/${randomInt(1000, 99999)}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(404, "User not found");
    });
  });
});
