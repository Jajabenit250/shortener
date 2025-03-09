import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigService } from './app-config.service';
import AppConfigs from './app.configs';
import { AppEnvironment } from 'src/common/constants/enum.constant';

// Global Module accessible across the application
@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const nodeEnvironment = AppConfigs.NODE_ENV || AppEnvironment.DEVELOPMENT;
        
        return {
          type: 'postgres',
          host: 'localhost',
          port: AppConfigs.DATABASE.DATABASE_PORT,
          username: AppConfigs.DATABASE.DATABASE_USER,
          password: AppConfigs.DATABASE.DATABASE_PASS,
          database: AppConfigs.DATABASE.DATABASE_NAME,
          entities:
            nodeEnvironment === AppEnvironment.TEST
              ? ['src/**/*.entity{.ts,.js}']
              : ['dist/**/*.entity{.ts,.js}'],
          migrations:
            nodeEnvironment === AppEnvironment.TEST
              ? ['src/database/migrations/*{.ts,.js}']
              : ['dist/src/database/migrations/**/*{.ts,.js}'],
          synchronize: true,
          logging: true,
        };
      },
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
