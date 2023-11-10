import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ListsService } from './lists.service';
import { List } from './entities/list.entity';
import { CreateListInput } from './dto/create-list.input';
import { UpdateListInput } from './dto/update-list.input';
import { User } from 'src/users/entities/user.entity';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PaginationArgs } from 'src/common/dtos/args/pagination.args';
import { SearchArgs } from 'src/common/dtos/args/search.args';

@Resolver(() => List)
@UseGuards( JwtAuthGuard )
export class ListsResolver {
  constructor(private readonly listsService: ListsService) {}

  @Mutation(() => List)
  async createList(
    @Args('createListInput') createListInput: CreateListInput,
    @CurrentUser() currentUser: User
  ) : Promise<List>{
    return await this.listsService.create(createListInput, currentUser);
  }

  @Query(() => [List], { name: 'lists' })
  async findAll(
    @CurrentUser() user: User,
    @Args() paginationArgs : PaginationArgs,
    @Args() searchArgs: SearchArgs
  ) : Promise<List[]> {
    const lists = await this.listsService.findAll(user, paginationArgs, searchArgs);
    
    return lists
  }

  @Query(() => List, { name: 'list' })
  async findOne(
    @CurrentUser() user : User,
    @Args('id', { type: () => String }) id: string
  ) : Promise<List> {
    const list = await this.listsService.findOne(id);

    
    if(list.userId !== user.id){
      throw new UnauthorizedException();
    }    

    return list;
  }

  @Mutation(() => Boolean, {name: 'updateList'})
  async updateList(
    @CurrentUser() user : User,
    @Args('updateListInput') updateListInput: UpdateListInput
  ) : Promise<Boolean> {

    const list = await this.listsService.findOne(updateListInput.id);

    if(list.userId !== user.id){
      throw new UnauthorizedException();
    }
    console.log(updateListInput)
    return await this.listsService.update(updateListInput.id, updateListInput);
  }

  @Mutation(() => List, {name: "removeList"})
  async removeList(
    @CurrentUser() user : User,
    @Args('id', { type: () => String }) id: string
  ) : Promise<List> {
    const list = await this.listsService.findOne(id);

    if(list.userId !== user.id){
      throw new UnauthorizedException();
    }

    const result = await this.listsService.remove(id);

    if(!result){
      throw new Error("No rows affected");
    }

    return list;
  }
}
