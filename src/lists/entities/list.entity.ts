import { Field, ID, Int, ObjectType } from "@nestjs/graphql";
import { ListItem } from "src/list-item/entities/list-item.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";


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

  @OneToMany(() => ListItem, (listItem) => listItem.list, {lazy: true})
  listItems:ListItem[];
  
}
