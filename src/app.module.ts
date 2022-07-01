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
import { ExpensesFact } from './expenses/entities/expenses-fact.entity';
import { IncomesPlan } from './incomes/entities/incomes-plan.entity';
import { IncomesFact } from './incomes/entities/incomes-fact.entity';
import { IncomesModule } from './incomes/incomes.module';
import { BalanceModule } from './balance/balance.module';
import { SavingsPlan } from './savings/entities/savings-plan.entity';
import { SavingsFact } from './savings/entities/savings-fact.entity';
import { SavingsGoal } from './savings/entities/savings-goal.entity';
import { SavingsModule } from './savings/savings.module';

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
        ],
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
