import { Resolver, Query, Mutation, Args, Int, ID, ResolveField, Parent } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesArgs } from './dto/args/roles.arg';
import { ItemsService } from 'src/items/items.service';
import { PaginationArgs } from 'src/common/dtos/args/pagination.args';
import { SearchArgs } from 'src/common/dtos/args/search.args';
import { Item } from 'src/items/entities/item.entity';

@Resolver(() => User)
@UseGuards(JwtAuthGuard)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly itemsService: ItemsService,
  ) {}
  

  @Query(() => [User], { name: 'users' })
  async findAll(
    @Args() validRoles: RolesArgs,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
    
  ) : Promise<User[]> {
    return  await this.usersService.findAll(paginationArgs, searchArgs);
  }

  @Query(() => User, { name: 'user' })
  async findOne(@Args('id', { type: () => ID }) id: string) : Promise<User> {
    return await this.usersService.findOne(id);
  }
  

  @Mutation(() => User)
  blockUser(@Args('id', { type: () => ID }) id: string): Promise<User> {
    return this.usersService.block(id);
  }

  @ResolveField( () => Int)
  async itemCount(
    @Parent() user: User
  ): Promise<number>{
    return this.itemsService.itemCountByUser(user);
  }

  @ResolveField(() => [Item])
  async items(
    @Parent() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs
  ): Promise<Item[]>{
    return await this.itemsService.findAll(user, paginationArgs, searchArgs);
  }

}
