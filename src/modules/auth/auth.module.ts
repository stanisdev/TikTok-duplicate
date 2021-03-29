import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Code } from 'src/entities/code.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../config/configuration';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Code]),
    ConfigModule.forRoot({
      load: [configuration]
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}