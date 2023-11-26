import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { ListItem } from 'src/list-item/entities/list-item.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name:'items'})
@ObjectType()
export class Item {
  
  @PrimaryGeneratedColumn('uuid')
  @Field( () => ID)
  id: string;

  @Field()
  @Column()
  name:string;

  @Column({ nullable: true})
  @Field( () => String, { nullable: true})
  quantityUnits?:string;

  @ManyToOne( () => User, (user) => user.items, {nullable: false} )
  @Index()
  @Field( () => User)
  user:User;

  @Column()
  @Field( () => String)
  userId: string;

  @OneToMany( () => ListItem, (listItem) => listItem.item, {lazy: true})
  listItem: ListItem[]

}
