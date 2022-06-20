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
import { ExpensesPlan } from './expenses/entities/expenses-plan.entity';
import { ExpensesModule } from './expenses/expenses.module';
import { IncomesController } from './incomes/incomes.controller';
import { IncomesService } from './incomes/incomes.service';
import { IncomesModule } from './incomes/incomes.module';
import { ExpensesFact } from './expenses/entities/expenses-fact.entity';

@Module({
  imports: [
    AuthModule,
    CategoriesModule,
    ExpensesModule,
    // IncomesModule,

    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        ...config.get('database'),
        entities: [Auths, Users, Categories, ExpensesPlan, ExpensesFact],
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController, IncomesController],
  providers: [AppService],
})
export class AppModule {}
