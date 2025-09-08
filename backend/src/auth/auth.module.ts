
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { User } from '../user.entity';
import { Role } from '../role.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { AbilityFactory } from './ability.factory';
import { JwtAuthGuard } from './jwt-auth.guard';
import { PoliciesGuard } from './policies.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
    PassportModule,
    JwtModule.register({
      secret: 'jwt_secret',
      signOptions: { expiresIn: '30m' },
    }),
  ],
  providers: [AuthService, JwtStrategy, AbilityFactory, JwtAuthGuard, PoliciesGuard],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
