import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Auths } from './auth/entitites/auth.entity';
import configuration from './config';
import { Users } from './users/entities/users.entity';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { Categories } from './categories/entities/categories.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        ...config.get('database'),
        entities: [Auths, Users, Categories],
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
