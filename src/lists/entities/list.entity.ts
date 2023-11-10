import { Field, ID, Int, ObjectType } from "@nestjs/graphql";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ListItem } from "./list_item.entity";

@Entity()
@ObjectType()
export class List {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id:string;

  @ManyToOne( () => User, (user) => user.lists, {nullable: false} )
  @Index()
  @Field( () => User)
  user:User;

  @Column({type:'uuid'})
  @Field(() => ID)
  userId: string
  

  @Column({type: 'varchar'})
  @Field(() => String)  
  name:string;

  @OneToMany(() => ListItem, (listItem) => listItem.list)
  @Field(() => [ListItem])
  listItems:ListItem[];
  
}
