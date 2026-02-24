import { Body, Controller, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/createUser.dto';
import { LoginDto } from './dto/login.dto';

@Controller('api/auth')
export class AuthController {
    constructor(private readonly authService:AuthService){}

    @Post('register')
    register(@Body() data:CreateUserDto){
        return this.authService.register(data)
    }

    @Post('login')
    login(@Body() data:LoginDto){
        return this.authService.login(data)
    }

      @Post('reset-password')
  async resetPassword(
    @Query('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.authService.resetPassword(token, newPassword);
  }
}

// {
//   "email": "rahul.teacher@gmail.com",
//   "password": "123456"
// }
// {
//      "email": "amit.student@gmail.com",
//   "password": "123456",
// }