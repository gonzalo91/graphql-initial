import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { SignupInput } from 'src/auth/dtos/inputs/signup.input';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt'
import { PaginationArgs } from 'src/common/dtos/args/pagination.args';
import { SearchArgs } from 'src/common/dtos/args/search.args';

@Injectable()
export class UsersService {

  private logger = new Logger("UsersService")

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User> ,
  ){}

  async create(signupInput: SignupInput) : Promise<User>{

    try {

      const existingUser = await this.usersRepository.findOne({where: {email: signupInput.email}})

      if(existingUser) throw new Error("User already exists");

      const password = await bcrypt.hash(signupInput.password, 10);

      const newUser = this.usersRepository.create({...signupInput, password});

      return await this.usersRepository.save(newUser);

    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }    
  }

  async findAll( paginationArgs: PaginationArgs, searchArgs: SearchArgs): Promise<User[]> {

    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    const queryBuilder = this.usersRepository.createQueryBuilder("items")
                          .take(limit)
                          .skip(offset)                          
                        
    if(search){
      queryBuilder.andWhere("LOWER(fullName) LIKE :name", {name: `${search.toLowerCase()}`})
    }

    return await queryBuilder.getMany();    
  }

  async findOneByEmail(email: string) : Promise<User> {

    try {      
      return await this.usersRepository.findOneByOrFail({email});
    } catch (error) {
      throw new Error("User not found")
    }

  }

  async findOneById(id: string) : Promise<User> {    
    try {      
      return await this.usersRepository.findOneByOrFail({id});
    } catch (error) {
      this.logger.log(error)
      throw new Error("User not found (id)")
    }

  }


  async findOne(id: string) : Promise<User> {
    throw new Error ("User not found");
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }
  
  async block(id: string) :Promise<User> {
    throw new Error("Not Implemented");
  }
}
