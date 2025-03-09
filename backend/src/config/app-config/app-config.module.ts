import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigService } from './app-config.service';
import AppConfigs from './app.configs';

// Global Module accessible accros
@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: AppConfigs.DATABASE.DATABASE_PORT,
      username: AppConfigs.DATABASE.DATABASE_USER,
      password: AppConfigs.DATABASE.DATABASE_PASS,
      database: AppConfigs.DATABASE.DATABASE_NAME,
      entities: ['dist/**/*.entity.ts'],
      synchronize: true,
      logging: true,
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
