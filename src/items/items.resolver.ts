import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { ItemsService } from './items.service';
import { Item } from './entities/item.entity';
import { CreateItemInput } from './dto/create-item.input';
import { UpdateItemInput } from './dto/update-item.input';
import { ParseUUIDPipe, UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';

@Resolver(() => Item)
@UseGuards( JwtAuthGuard )
export class ItemsResolver {
  constructor(private readonly itemsService: ItemsService) {}

  @Mutation(() => Item)
  async createItem(
    @Args('createItemInput') createItemInput: CreateItemInput,
    @CurrentUser() currentUser: User,
  ) : Promise<Item> {
    return this.itemsService.create(createItemInput, currentUser);
  }

  @Query(() => [Item], { name: 'items' })
  async findAll(@CurrentUser() currentUser: User,) : Promise<Item[]>{
    return await this.itemsService.findAll(currentUser);
  }

  @Query(() => Item, { name: 'item' })
  async findOne(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string, @CurrentUser() currentUser: User) {
    const item = await this.itemsService.findOne(id);    

    if(item.userId != currentUser.id){
      throw new UnauthorizedException();
    }

    return item;
  }

  @Mutation(() => String)
  async updateItem(@Args('updateItemInput') updateItemInput: UpdateItemInput, @CurrentUser() currentUser: User) : Promise<string> {
    const item = await this.itemsService.findOne(updateItemInput.id);

    if(item.userId != currentUser.id){
      throw new UnauthorizedException();
    }

    await this.itemsService.update(item.id, updateItemInput);

    return item.id;
  }

  @Mutation(() => Item)
  async removeItem(@Args('id', { type: () => ID }) id: string, @CurrentUser() currentUser: User) : Promise<Item> {
    const item = await this.itemsService.remove(id);

    if(item.userId != currentUser.id){
      throw new UnauthorizedException();
    }

    return item;
  }
}
