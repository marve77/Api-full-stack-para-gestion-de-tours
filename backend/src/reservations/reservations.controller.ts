
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PoliciesGuard } from '../auth/policies.guard';
import { CheckPolicies } from '../auth/check-policies.decorator';

@Controller('reservations')
@UseGuards(JwtAuthGuard, PoliciesGuard)
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Get('weekly-earnings')
  @CheckPolicies((ability) => ability.can('read', 'Reservation'))
  getWeeklyEarnings() {
    return this.reservationsService.getWeeklyEarnings();
  }

  @Post()
  @CheckPolicies((ability) => ability.can('create', 'Reservation'))
  create(@Body() dto: CreateReservationDto, @Request() req) {
    return this.reservationsService.create(dto, req.user);
  }

  @Get()
  @CheckPolicies((ability) => ability.can('read', 'Reservation'))
  findAll() {
    return this.reservationsService.findAll();
  }

  @Get(':id')
  @CheckPolicies((ability) => ability.can('read', 'Reservation'))
  findOne(@Param('id') id: string) {
    return this.reservationsService.findOne(+id);
  }

  @Patch(':id')
  @CheckPolicies((ability) => ability.can('update', 'Reservation'))
  update(@Param('id') id: string, @Body() dto: UpdateReservationDto) {
    return this.reservationsService.update(+id, dto);
  }

  @Delete(':id')
  @CheckPolicies((ability) => ability.can('delete', 'Reservation'))
  remove(@Param('id') id: string) {
    return this.reservationsService.remove(+id);
  }
}
