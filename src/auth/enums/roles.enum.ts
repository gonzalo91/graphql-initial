
import { registerEnumType } from "@nestjs/graphql";

export enum Roles{

    ADMIN = "ADMIN",
    USER  = "USER",
    SUPER_USER = "SUPER_USER"

}

registerEnumType(Roles, { name: 'ValidRoles'})