import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {
    
  }

  @Post('register')
  register(@Body() authDTO: AuthDTO){
    console.log(authDTO.email, authDTO.password);
    return this.authService.register(authDTO);
  }

  @Post('login')
  login(@Body() authDTO: AuthDTO){
    return this.authService.login(authDTO);
  }
}
