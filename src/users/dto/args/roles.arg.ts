import { ArgsType, Field } from "@nestjs/graphql";
import { IsArray } from "class-validator";
import { Roles } from "src/auth/enums/roles.enum";

@ArgsType()
export class RolesArgs {

    @Field( () => [Roles], {nullable: true})
    @IsArray()
    roles: Roles[] = []

}