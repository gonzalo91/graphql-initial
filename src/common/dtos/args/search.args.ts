import { ArgsType, Field, Int } from "@nestjs/graphql";
import { IsOptional, IsString, Max, Min, MinLength } from "class-validator";

@ArgsType()
export class SearchArgs{

    @Field(() => Int, {nullable: true})    
    @IsOptional()
    @IsString()
    @MinLength(3)
    search?: string;    

}