import { Controller, Get, Param, Request, UseGuards, UsePipes } from "@nestjs/common";
import { UserService } from "./user.service";
import { AuthGuard } from '../../common/guards/auth.guard';
import { IsUserRegistered } from 'src/common/pipes/isUserRegistered.pipe';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Get(':userId/follow')
  @UseGuards(AuthGuard)
  async follow(
    @Param('userId', new IsUserRegistered()) followingId: string,
    @Request() { user }
  ): Promise<void> {
    await this.userService.follow(user.id, followingId);
  }
}
