

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ToursService } from './tours.service';
import { ToursController } from './tours.controller';
import { Tour } from './entities/tour.entity';
import { AuthModule } from '../auth/auth.module';
import { AbilityFactory } from '../auth/ability.factory';
import { PoliciesGuard } from '../auth/policies.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Tour]), AuthModule],
  controllers: [ToursController],
  providers: [ToursService, AbilityFactory, PoliciesGuard],
})
export class ToursModule {}
