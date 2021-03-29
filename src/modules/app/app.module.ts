import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { AppController } from './app.controller';
import configuration from '../../config/configuration';

@Module({
  imports: [
    AuthModule,
    UserModule,
    TypeOrmModule.forRoot(
      configuration().db
    ),
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
