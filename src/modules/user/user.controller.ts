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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':userId/follow')
  @ApiOperation({ summary: 'Follow to a user' })
  async follow(
    @Param('userId', new RegisteredUserPipe()) followingId: string,
    @Request() { user },
  ): Promise<void> {
    await this.userService.follow(user.id, followingId);
  }

  @Get(':userId/unfollow')
  @ApiOperation({ summary: 'Unfollow a user' })
  async unfollow(
    @Param('userId') unfollowingId: string,
    @Request() { user },
  ): Promise<void> {
    await this.userService.unfollow(user.id, unfollowingId);
  }

  @Get(':username')
  @ApiOperation({ summary: "Get the most essential user's information" })
  async userInfo(
    @Param('username') username: string,
    @Request() { user: viewer },
  ): Promise<UserInfoResponse> {
    return this.userService.getUserInfo(viewer, username);
  }

  @Get(':userId/videos')
  @ApiOperation({ summary: "Navigate available user's videos" })
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
