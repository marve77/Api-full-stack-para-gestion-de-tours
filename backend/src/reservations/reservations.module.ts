import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { Reservation } from './entities/reservation.entity';
import { Tour } from '../tours/entities/tour.entity';
import { AuthModule } from '../auth/auth.module';
import { AbilityFactory } from '../auth/ability.factory';
import { PoliciesGuard } from '../auth/policies.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation, Tour]), AuthModule],
  controllers: [ReservationsController],
  providers: [ReservationsService, AbilityFactory, PoliciesGuard],
})
export class ReservationsModule {}
