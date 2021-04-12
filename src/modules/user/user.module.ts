import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { Code } from '../../entities/code.entity';
import { UserRelationship } from '../../entities/userRelationship.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthServiceRepository } from '../auth/auth.repository';
import { UserServiceRepository } from './user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Code, UserRelationship]),
    JwtModule.register({}),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    AuthServiceRepository,
    UserServiceRepository,
  ],
})
export class UserModule {}
