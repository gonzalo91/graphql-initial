

import { Field, ID, Int, ObjectType } from "@nestjs/graphql";
import { Item } from "src/items/entities/item.entity";
import { List } from "src/lists/entities/list.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'list_items'})
@ObjectType()
export class ListItem{
    @PrimaryGeneratedColumn('uuid')
    @Field(() => ID)
    id:string;

    @ManyToOne( () => List, (list) => list.listItems, {nullable: false, lazy: true, onDelete: "CASCADE"},  )
    @Index()    
    list:List;

    @Column()
    @Field( () => String)
    listId: string;

    @ManyToOne( () => Item, (item) => item.userId,  {lazy: true})
    @Index()
    @Field( () => Item,)
    item:Item;

    @Column()
    @Field( () => String)
    itemId: string;

    @Column({type: 'numeric'})
    @Field(() => Number)
    quantity:number;

    @Column({type: 'boolean'})
    @Field(() => Boolean)
    completed: boolean;
}