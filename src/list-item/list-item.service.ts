import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateListItemInput } from './dto/create-list-item.input';
import { UpdateListItemInput } from './dto/update-list-item.input';
import { InjectRepository } from '@nestjs/typeorm';
import { ListItem } from './entities/list-item.entity';
import { Repository } from 'typeorm';
import { PaginationArgs } from 'src/common/dtos/args/pagination.args';
import { SearchArgs } from 'src/common/dtos/args/search.args';
import { List } from 'src/lists/entities/list.entity';

@Injectable()
export class ListItemService {

  constructor(
    @InjectRepository( ListItem)
    private readonly listItemsRepository: Repository<ListItem>
  ){

  }

  async create(createListItemInput: CreateListItemInput) : Promise<ListItem> {

    const {itemId,  listId, ...data} = createListItemInput

    const newListItem = this.listItemsRepository.create(
      {
        ...data,
        item: {id: itemId},
        list: { id: listId}
      } 
    );

    return await this.listItemsRepository.save(newListItem);
  }

  async findAll(list: List, paginationArgs: PaginationArgs, searchArgs: SearchArgs) {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    const queryBuilder = this.listItemsRepository.createQueryBuilder("list_items")
                          .innerJoin("list_items.item", 'item')
                          .take(limit)
                          .skip(offset)
                          .where("list_items.listId = :listId", {listId: list.id})
                        
    if(search){
      queryBuilder.andWhere("LOWER(item.name) LIKE :name", {name: `${search.toLowerCase()}`})
    }

    return await queryBuilder.getMany();    
  }

  async countListItemByListId(list: List): Promise<Number>{
    return await this.listItemsRepository.count({
      where:{
        list: { id: list.id}
      }
    })
  }


  async findOne(id: string) : Promise<ListItem> {
    return await this.listItemsRepository.findOneBy({id});
  }

  async update(id: string, updateListItemInput: UpdateListItemInput) : Promise<ListItem> {    

    const newListItem = await this.listItemsRepository.preload(
      updateListItemInput
    );

    if(! newListItem) throw new NotFoundException("ListItem not found");

    return await this.listItemsRepository.save(newListItem);
  }

  remove(id: number) {
    return `This action removes a #${id} listItem`;
  }
}
