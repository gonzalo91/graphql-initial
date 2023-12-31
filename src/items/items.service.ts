import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemInput } from './dto/create-item.input';
import { UpdateItemInput } from './dto/update-item.input';
import { Item } from './entities/item.entity';
import { Equal, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { PaginationArgs } from 'src/common/dtos/args/pagination.args';
import { off } from 'process';
import { SearchArgs } from 'src/common/dtos/args/search.args';

@Injectable()
export class ItemsService {

  constructor(
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
  ){

  }

  async create(createItemInput: CreateItemInput, user: User) : Promise<Item> {
    const newItem = this.itemsRepository.create( {...createItemInput, user} );

    await this.itemsRepository.save(newItem);

    return newItem;
  }

  async findAll(user: User, paginationArgs: PaginationArgs, searchArgs: SearchArgs): Promise<Item[]>{
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    const queryBuilder = this.itemsRepository.createQueryBuilder("items")
                          .take(limit)
                          .skip(offset)
                          .where("items.userId = :userId", {userId: user.id})
                        
    if(search){
      queryBuilder.andWhere("LOWER(name) LIKE :name", {name: `${search.toLowerCase()}`})
    }

    return await queryBuilder.getMany();    
  }

  async findOne(id: string) : Promise<Item>{
    const item =  await this.itemsRepository.findOneBy({ id, });

    if(! item) throw new NotFoundException("Item id not found");

    return item;
  }

  async update(id: string, updateItemInput: UpdateItemInput) : Promise<Boolean>{
            
    const x = await this.itemsRepository.update(id, updateItemInput);
    
    return x.affected > 0;
  }

  async remove(id: string) : Promise<Item> {
    const item = await this.findOne(id);

    await this.itemsRepository.remove(item);    

    return {...item, id,};
  }

  async itemCountByUser(user: User): Promise<number>{
    return this.itemsRepository.count({where: {userId: user.id}})
  }
}
