import {
  Controller,
  Get,
  Param,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RegisteredUserPipe } from '../../common/pipes/registeredUser.pipe';
import { UserInfoResponse, UserVideosResponse } from './user.interface';
import { UtilsService } from '../../shared/providers/utils.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':userId/follow')
  @UseGuards(AuthGuard)
  async follow(
    @Param('userId', new RegisteredUserPipe()) followingId: string,
    @Request() { user },
  ): Promise<void> {
    await this.userService.follow(user.id, followingId);
  }

  @Get(':userId/unfollow')
  @UseGuards(AuthGuard)
  async unfollow(
    @Param('userId') unfollowingId: string,
    @Request() { user },
  ): Promise<void> {
    await this.userService.unfollow(user.id, unfollowingId);
  }

  @Get(':username')
  @UseGuards(AuthGuard)
  async userInfo(
    @Param('username') username: string,
    @Request() { user: viewer },
  ): Promise<UserInfoResponse> {
    return this.userService.getUserInfo(viewer, username);
  }

  @Get(':userId/videos')
  @UseGuards(AuthGuard)
  async getUserVideos(
    @Param('userId', new RegisteredUserPipe()) userId: string,
    @Query('limit') limit: string,
    @Query('page') page: string,
    @Request() { user: viewer },
  ): Promise<UserVideosResponse[]> {
    const pagination = UtilsService.parsePagination(limit, page);
    return this.userService.getUserVideos(userId, viewer, pagination);
  }
}
