import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '../users/users.module';
import { ValidatorModule } from '../validator/validator.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Auths } from './entitites/auth.entity';
import { RolesGuard } from './guards/roles.guard';
import { JwtRefreshStrategy } from './jwt-refresh.strategy';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Auths]),
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get('jwt').secret,
        signOptions: { expiresIn: config.get('jwt').expiresIn },
      }),
      inject: [ConfigService],
    }),
    ValidatorModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, RolesGuard, JwtRefreshStrategy],
  exports: [AuthService],
})
export class AuthModule {}
