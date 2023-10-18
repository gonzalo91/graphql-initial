import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemInput } from './dto/create-item.input';
import { UpdateItemInput } from './dto/update-item.input';
import { Item } from './entities/item.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ItemsService {

  constructor(
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
  ){

  }

  async create(createItemInput: CreateItemInput) : Promise<Item> {
    const newItem = this.itemsRepository.create( createItemInput );

    await this.itemsRepository.save(newItem);

    return newItem;
  }

  async findAll(): Promise<Item[]>{
    return this.itemsRepository.find();
  }

  async findOne(id: string) : Promise<Item>{
    const item =  await this.itemsRepository.findOneBy({ id });

    if(! item) throw new NotFoundException("Item id not found");

    return item;
  }

  async update(updateItemInput: UpdateItemInput) : Promise<Item>{
    const item = await this.itemsRepository.preload(updateItemInput);
    if(! item) throw new NotFoundException("Item id not found");
    await this.itemsRepository.save(item);

    return item;

  }

  async remove(id: string) : Promise<Item> {
    const item = await this.findOne(id);

    const t = await this.itemsRepository.remove(item);    

    return {...item, id,};
  }
}
