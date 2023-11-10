import { ExecutionContext, ForbiddenException, InternalServerErrorException, UnauthorizedException, createParamDecorator } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Roles } from "../enums/roles.enum";
import { User } from "src/users/entities/user.entity";

export const CurrentUser = createParamDecorator( (roles: Roles[] = [], context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create( context);
    const user : User = ctx.getContext().req.user;

    if(! user){
        throw new InternalServerErrorException("No user is in the request");
    }

    if( roles.length === 0) return user;

    const rolesIntersection = roles.filter( (r) => user.roles.includes(r))

    if(rolesIntersection.length === 0){
        throw new ForbiddenException("User does not have auth");
    }

    return user;
})