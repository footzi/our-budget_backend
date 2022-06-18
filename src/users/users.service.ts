import { Injectable } from '@nestjs/common';
import { User } from './interfaces/users.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { Crypt } from '../utils/crypt';
import { USER_ROLES } from './users.constants';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<User>
  ) {}

  /**
   * Поиск пользователя по логину
   * @param {string} login - логин
   */
  async findByLogin(login: string): Promise<User | undefined> {
    return this.usersRepository.findOneBy({ login });
  }

  /**
   * Поиск пользователя по id
   * @param {number} id - логин
   */
  async findById(id: number): Promise<User | undefined> {
    return this.usersRepository.findOneBy({ id });
  }

  /**
   * Создание нового пользователя
   */
  async create(createUserDTO: CreateUserDto): Promise<User> {
    const findedUser = await this.findByLogin(createUserDTO.login);

    if (findedUser) {
      throw new Error('Пользователь с данным логином уже существует');
    }

    const hashedPassword = createUserDTO.password ? await Crypt.hash(createUserDTO.password) : '';

    const user: User = {
      ...createUserDTO,
      roles: [USER_ROLES.USER],
      password: hashedPassword,
    };

    const newUser = await this.usersRepository.save(user);

    const { password, ...rest } = newUser;

    return rest;
  }

  // /**
  //  * Создает нового клиента
  //  * @param {Client} client - данные нового клиента
  //  */
  // async createNewClient(client: Client): Promise<Client> {
  //   const newUser = await this.create({ ...client, roles: JSON.stringify([USER_ROLES.CLIENT]) });
  //
  //   return UserUtils.convertToClient(newUser);
  // }

  // /**
  //  * Получение списка всех клиентов
  //  *
  //  */
  // async getAllClients() {
  //   const users = await this.usersRepository.find({
  //     where: {
  //       roles: Equal(`{${USER_ROLES.CLIENT}}`),
  //     },
  //     relations: ['pets'],
  //   });
  //
  //   return users.map((user) => UserUtils.convertToClient(user));
  // }
}
