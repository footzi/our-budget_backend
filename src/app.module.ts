import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import { format, transports } from 'winston';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { Auths } from './auth/entitites/auth.entity';
import { BalanceModule } from './balance/balance.module';
import { BalanceHistories } from './balance/enitites/balance-history.entity';
import { Balances } from './balance/enitites/balance.entity';
import { CategoriesModule } from './categories/categories.module';
import { Categories } from './categories/entities/categories.entity';
import configuration from './config';
import { ExpensesFact } from './expenses/entities/expenses-fact.entity';
import { ExpensesPlan } from './expenses/entities/expenses-plan.entity';
import { ExpensesModule } from './expenses/expenses.module';
import { IncomesFact } from './incomes/entities/incomes-fact.entity';
import { IncomesPlan } from './incomes/entities/incomes-plan.entity';
import { IncomesModule } from './incomes/incomes.module';
import { SavingsFact } from './savings/entities/savings-fact.entity';
import { SavingsGoal } from './savings/entities/savings-goal.entity';
import { SavingsPlan } from './savings/entities/savings-plan.entity';
import { SavingsModule } from './savings/savings.module';
import { Users } from './users/entities/users.entity';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

@Module({
  imports: [
    AuthModule,
    CategoriesModule,
    ExpensesModule,
    IncomesModule,
    BalanceModule,
    SavingsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        ...config.get('database'),
        entities: [
          Auths,
          Users,
          Categories,
          ExpensesPlan,
          ExpensesFact,
          IncomesPlan,
          IncomesFact,
          SavingsPlan,
          SavingsFact,
          SavingsGoal,
          Balances,
          BalanceHistories,
        ],
      }),
      inject: [ConfigService],
    }),
    WinstonModule.forRoot({
      format: format.combine(format.timestamp(), format.json(), format.prettyPrint()),
      transports: [
        new transports.File({
          filename: path.join(__dirname, '../logs/error.log'),
          level: 'error',
        }),
        new transports.File({ filename: path.join(__dirname, '../logs/warn.log'), level: 'warn' }),
        new transports.File({ filename: path.join(__dirname, '../logs/info.log'), level: 'info' }),
      ],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
