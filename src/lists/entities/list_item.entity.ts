
import { List } from "./list.entity";

import { Field, ID, Int, ObjectType } from "@nestjs/graphql";
import { Item } from "src/items/entities/item.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'list_items'})
@ObjectType()
export class ListItem{
    @PrimaryGeneratedColumn('uuid')
    @Field(() => ID)
    id:string;

    @ManyToOne( () => List, (list) => list.listItems, {nullable: false} )
    @Index()
    @Field( () => List)
    list:List;

    @ManyToOne( () => Item)
    @Index()
    @Field( () => Item)
    item:Item;

    @Column('int')
    @Field(() => Int)
    quantity:number;
}