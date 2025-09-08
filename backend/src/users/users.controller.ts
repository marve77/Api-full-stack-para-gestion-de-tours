import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PoliciesGuard } from '../auth/policies.guard';
import { CheckPolicies } from '../auth/check-policies.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, PoliciesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @CheckPolicies((ability) => ability.can('manage', 'all'))
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @CheckPolicies((ability) => ability.can('manage', 'all'))
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @CheckPolicies((ability) => ability.can('manage', 'all'))
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @CheckPolicies((ability) => ability.can('manage', 'all'))
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @CheckPolicies((ability) => ability.can('manage', 'all'))
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
