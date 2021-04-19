import { Get, Controller } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: "The endpoint to check API's availability" })
  root(): string {
    return "It's working";
  }
}
