import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Code } from '../../entities';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthServiceRepository } from './auth.repository';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([User, Code]), JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, AuthServiceRepository],
})
export class AuthModule {}
