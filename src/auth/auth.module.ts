import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { RolesGuard } from './guards/roles.guard';
import { JwtRefreshStrategy } from './jwt-refresh.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auths } from './entitites/auth.entity';

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
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, RolesGuard, JwtRefreshStrategy],
  exports: [AuthService],
})
export class AuthModule {}
