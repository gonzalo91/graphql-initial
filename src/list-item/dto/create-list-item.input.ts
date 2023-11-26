import { InputType, Int, Field, ID } from '@nestjs/graphql';
import { IsBoolean, IsNumber, IsOptional, IsUUID, Max, Min } from 'class-validator';

@InputType()
export class CreateListItemInput {
  
  @Field(() => Number, { nullable: true})
  @IsNumber()
  @Min(0)
  @Max(65000)
  @IsOptional()
  quantity: number = 0;

  @Field(() => Boolean, {nullable: true})
  @IsBoolean()
  @IsOptional()
  completed: boolean = false;

  @IsUUID()
  @Field(() => ID, {nullable: false})
  listId: string;

  @IsUUID()
  @Field(() => ID, {nullable: false})
  itemId: string;

}
