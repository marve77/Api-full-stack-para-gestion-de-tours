import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from '../user.entity';
import { Role } from '../role.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PoliciesGuard } from '../auth/policies.guard';
import { AbilityFactory } from '../auth/ability.factory';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  controllers: [UsersController],
  providers: [UsersService, JwtAuthGuard, PoliciesGuard, AbilityFactory],
})
export class UsersModule {}
