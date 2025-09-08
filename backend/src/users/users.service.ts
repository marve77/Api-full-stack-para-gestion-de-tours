import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { Role } from '../role.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Role) private roleRepo: Repository<Role>,
  ) {}

  async create(dto: CreateUserDto) {
    const exists = await this.userRepo.findOne({ where: { email: dto.email } });
    if (exists) throw new Error('Email ya registrado');
    const hash = await bcrypt.hash(dto.password, 10);
    let roles: Role[] = [];
    if (dto.roles && dto.roles.length) {
      roles = await this.roleRepo.find({ where: dto.roles.map(name => ({ name })) });
    } else {
      const userRole = await this.roleRepo.findOne({ where: { name: 'editor' } });
      if (userRole) roles = [userRole];
    }
    const user = this.userRepo.create({ ...dto, password: hash, roles });
    return this.userRepo.save(user);
  }

  findAll() {
    return this.userRepo.find({ relations: ['roles'] });
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne({ where: { id }, relations: ['roles'] });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  async update(id: number, dto: UpdateUserDto) {
    // Preload sin roles, se asignan después
    const { roles, ...rest } = dto;
    const user = await this.userRepo.preload({ id, ...rest });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    if (dto.password) user.password = await bcrypt.hash(dto.password, 10);
    if (roles) {
      user.roles = await this.roleRepo.find({ where: roles.map(name => ({ name })) });
    }
    return this.userRepo.save(user);
  }

  async remove(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    await this.userRepo.remove(user);
  }
}
