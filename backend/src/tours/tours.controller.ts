
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ToursService } from './tours.service';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PoliciesGuard } from '../auth/policies.guard';
import { CheckPolicies } from '../auth/check-policies.decorator';
import { Action } from '../auth/action.enum';
import { Tour } from './entities/tour.entity';

@Controller('tours')
@UseGuards(JwtAuthGuard, PoliciesGuard)
export class ToursController {
  constructor(private readonly toursService: ToursService) {}

  @Post()
  @CheckPolicies((ability) => ability.can('create', 'Tour'))
  create(@Body() createTourDto: CreateTourDto) {
    return this.toursService.create(createTourDto);
  }

  @Get()
  @CheckPolicies((ability) => ability.can('read', 'Tour'))
  findAll() {
    return this.toursService.findAll();
  }

  @Patch(':id')
  @CheckPolicies((ability) => ability.can('update', 'Tour'))
  update(@Param('id') id: string, @Body() updateTourDto: UpdateTourDto) {
    return this.toursService.update(+id, updateTourDto);
  }

  @Delete(':id')
  @CheckPolicies((ability) => ability.can('delete', 'Tour'))
  remove(@Param('id') id: string) {
    return this.toursService.remove(+id);
  }
}
