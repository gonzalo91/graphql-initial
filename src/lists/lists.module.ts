import { Module } from '@nestjs/common';
import { ListsService } from './lists.service';
import { ListsResolver } from './lists.resolver';
import { List } from './entities/list.entity';
import { ListItem } from './entities/list_item.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [ListsResolver, ListsService],
  imports: [
    TypeOrmModule.forFeature([List, ListItem]),
  ]
})
export class ListsModule {}
