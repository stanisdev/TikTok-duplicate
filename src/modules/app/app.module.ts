import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { AppController } from './app.controller';
import { I18nModule, I18nJsonParser } from 'nestjs-i18n';
import configuration from '../../config/configuration';

@Module({
  imports: [
    AuthModule,
    UserModule,
    TypeOrmModule.forRoot(configuration().db),
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      parser: I18nJsonParser,
      parserOptions: {
        path: '/home/stas/Documents/Code/TikTok-duplicate/src/i18n',
      },
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
