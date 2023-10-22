import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignupInput } from './dtos/inputs/signup.input';
import { AuthResponse } from './dtos/types/auth-response.type';
import { LoginInput } from './dtos/inputs/login.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation( () => AuthResponse , { name: 'signup'})
  async signup(@Args('signupInput') signupInput: SignupInput): Promise<AuthResponse>{
    return await this.authService.signup(signupInput);
  }

  @Mutation(() => AuthResponse , { name: 'login'})
  async login(@Args('LoginInput') loginInput: LoginInput): Promise<AuthResponse>{
    return await this.authService.login(loginInput);
  }
  
  @Query(() => AuthResponse, {name:'revalidate'})
  @UseGuards(JwtAuthGuard)
  async revalidateToken(
    @CurrentUser() user: User
  ): Promise<AuthResponse>{
    return await  this.authService.revalidateToken(user);    
  }
  
}
