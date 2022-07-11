import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { User } from '../users/interfaces/users.interface';
import { Auths } from './entitites/auth.entity';
import { Auth, Tokens } from './interfaces/auth.interfaces';
import { Crypt } from '../utils/crypt';
import { GenerateRandom } from '../utils/generateRandom';
import { SignUpDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(Auths)
    private authRepository: Repository<Auths>
  ) {}

  /**
   * Проверка пользователя
   *
   * @param {string} login - логин
   * @param {string} pass - пароль
   */
  async validateUser(login: string, pass: string): Promise<User | null> {
    const user = await this.usersService.findByLogin(login);

    if (user && user.password && (await Crypt.compare(pass, user.password))) {
      delete user.password;
      return user;
    }
    return null;
  }

  /**
   * Отправка пользователя только при авторизации
   *
   * @param {number} userId - id пользователя
   */
  async getUser(userId: number): Promise<User | null> {
    const user = await this.usersService.getById(userId);

    if (user) {
      return user;
    }
    return null;
  }

  /**
   * Авторизация пользователя
   *
   * @param {User} user - пользователь
   */
  async login(user: User): Promise<{ user: User; tokens: Tokens }> {
    const accessToken = this.jwtService.sign({ login: user.login, id: user.id, roles: user.roles });
    const refreshToken = this.jwtService.sign(
      { id: user.id, key: GenerateRandom.string() },
      {
        expiresIn: this.configService.get('jwt').refreshExpiresIn,
      }
    );

    const hashedRefreshToken = await Crypt.hash(refreshToken);

    await this.saveRefresh(user.id, hashedRefreshToken);

    return {
      user: user,
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  async signUp(signUpDto: SignUpDto): Promise<{ user: User; tokens: Tokens } | null> {
    if (!signUpDto.login || !signUpDto.password || !signUpDto.password2 || !signUpDto.firstName) {
      throw new HttpException('Переданы не все обязательные поля', HttpStatus.BAD_REQUEST);
    }

    if (signUpDto.password !== signUpDto.password2) {
      throw new HttpException('Пароли не совпадают', HttpStatus.BAD_REQUEST);
    }

    const user = await this.usersService.create(signUpDto);

    if (user) {
      return await this.login(user);
    } else {
      return null;
    }
  }

  /**
   * Выходит из системы
   *
   * @param {number} userId  id пользователя
   */
  async logout(userId: number) {
    return await this.removeRefresh(userId);
  }

  /**
   * Сохранение токена
   *
   * @param {number} userId - id пользователя
   * @param {string} refresh - токен
   */
  async saveRefresh(userId: number, refresh: string): Promise<void> {
    const token = await this.getAuthData(userId);

    if (token) {
      await this.authRepository.update(token.id, { refresh, userId });
    } else {
      await this.authRepository.save({ refresh, userId });
    }
  }

  /**
   * Обновление токена
   *
   * @param {number} id - id токена
   * @param {number} userId - id пользователя
   * @param {string} refresh - токен
   */
  async updateRefresh(id: number, userId: number, refresh: string): Promise<void> {
    await this.authRepository.update(id, { refresh, userId });
  }

  /**
   * Удаление токена
   *
   * @param {number} userId - id пользователя
   */
  async removeRefresh(userId: number): Promise<void> {
    await this.authRepository.delete({ userId });
  }

  /**
   * Получение данных авторизации из БД
   *
   * @param {number} userId - id пользователя
   */
  async getAuthData(userId: number): Promise<Auth | undefined> {
    return await this.authRepository.findOneBy({ userId });
  }
}
