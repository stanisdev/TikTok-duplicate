import { Controller, Get, Param, Request, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { AuthGuard } from '../../common/guards/auth.guard';
import { RegisteredUserPipe } from 'src/common/pipes/registeredUser.pipe';
import { UserInfoResponse } from "./user.interface";

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Get(':userId/follow')
  @UseGuards(AuthGuard)
  async follow(
    @Param('userId', new RegisteredUserPipe()) followingId: string,
    @Request() { user }
  ): Promise<void> {
    await this.userService.follow(user.id, followingId);
  }

  @Get(':userId/unfollow')
  @UseGuards(AuthGuard)
  async unfollow(
    @Param('userId') unfollowingId: string,
    @Request() { user }
  ): Promise<void> {
    await this.userService.unfollow(user.id, unfollowingId);
  }

  @Get(':username')
  @UseGuards(AuthGuard)
  async userInfo(
    @Param('username') username: string,
    @Request() { user: viewer }
  ): Promise<UserInfoResponse> {
    return this.userService.getUserInfo(viewer, username);
  }
}
