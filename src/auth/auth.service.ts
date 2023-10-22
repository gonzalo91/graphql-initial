import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { SignupInput } from './dtos/inputs/signup.input';
import { AuthResponse } from './dtos/types/auth-response.type';
import { UsersService } from 'src/users/users.service';
import { LoginInput } from './dtos/inputs/login.input';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ){

    }

    async signup(signupInput: SignupInput): Promise<AuthResponse>{
        const user = await this.usersService.create(signupInput);

        const token = await this.getJWTToken({ id: user.id});

        return { user, token};
    }

    async login(loginInput: LoginInput): Promise<AuthResponse>{

        const user = await this.usersService.findOneByEmail(loginInput.email);

        const passwordMatches = await  bcrypt.compare(loginInput.password, user.password)

        if(! passwordMatches){
            throw new BadRequestException("Credentials are not valid");
        }

        const token = await this.getJWTToken({ id: user.id});

        return {
            user, token
        };

    }

    private async  getJWTToken(userId){
        return await this.jwtService.signAsync({id: userId});
    }


    async validateUser(id: string): Promise<User>{
        const user = await this.usersService.findOneById(id);

        if(! user.isActive){
            throw new UnauthorizedException("User is not active");
        }

        delete user.password;

        return user;
    }

    async revalidateToken(user: User): Promise<AuthResponse>{

        const token = await this.getJWTToken(user.id);

        return {
            user, token,
        }
    }

}
