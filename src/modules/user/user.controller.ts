import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Request } from 'express';
// import { MyJwtGuard } from '../auth/guard';

@Controller('users')
export class UserController {
  @UseGuards(AuthGuard('jwt'))
  // @UseGuards(MyJwtGuard)
  @Get('me')
  // me(@Req() req: Request){
  //   return req.user;
  // }
  me(@Req() user: User){
    return user;
  }
}
