import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { VideoModule } from '../video/video.module';
import { AppController } from './app.controller';
import { I18nModule, I18nJsonParser } from 'nestjs-i18n';
import configuration from '../../config/configuration';
import { join } from 'path';

@Module({
  imports: [
    AuthModule,
    UserModule,
    VideoModule,
    TypeOrmModule.forRoot(configuration().db),
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      parser: I18nJsonParser,
      parserOptions: {
        path: join(configuration().dirs.src, 'i18n'),
      },
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
