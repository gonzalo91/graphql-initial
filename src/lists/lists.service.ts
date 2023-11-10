import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateListInput } from './dto/create-list.input';
import { UpdateListInput } from './dto/update-list.input';
import { List } from './entities/list.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { PaginationArgs } from 'src/common/dtos/args/pagination.args';
import { SearchArgs } from 'src/common/dtos/args/search.args';

@Injectable()
export class ListsService {

  constructor(
    @InjectRepository(List)
    private readonly listRepository: Repository<List>
  ){}

  async create(createListInput: CreateListInput, user: User) : Promise<List> {
    const list = await this.listRepository.create({...createListInput, userId: user.id});
    await this.listRepository.save(list);    
    return list
  }

  async findAll(user: User, paginationArgs: PaginationArgs, searchArgs: SearchArgs) : Promise<List[]>{
    const queryBuilder = this.listRepository.createQueryBuilder("lists");

    queryBuilder.take(paginationArgs.limit)
                .skip(paginationArgs.offset)
                .where('lists.userId=:userId', {userId: user.id})
                .leftJoinAndSelect('lists.user', 'user');

    if(searchArgs.search){
      queryBuilder.andWhere('LOWER(name) LIKE :name', {name: searchArgs.search});
    }

    

    return queryBuilder.getMany();
  }

  async findOne(id: string) : Promise<List> {
    const list = await this.listRepository.findOne({
      where: { id }
    });

    if(! list) throw new NotFoundException();

    return list;
  }

  async update(id: string, updateListInput: UpdateListInput) : Promise<Boolean> {
    const updated = await this.listRepository.update(id, updateListInput);

    return updated.affected > 0;
  }

  async remove(id: string) : Promise<Boolean> {
    const result =  await this.listRepository.delete(id);
    return result.affected > 0;
  }
}
