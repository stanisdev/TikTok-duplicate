import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthServiceRepository } from '../auth/auth.repository';
import { UserServiceRepository } from './user.repository';
import { Video, Code, UserRelationship, User } from '../../entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Code, UserRelationship, Video]),
    JwtModule.register({}),
  ],
  controllers: [UserController],
  providers: [UserService, AuthServiceRepository, UserServiceRepository],
})
export class UserModule {}
