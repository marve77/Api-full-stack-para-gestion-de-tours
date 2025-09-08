import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { Role } from '../role.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeederService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Role) private roleRepo: Repository<Role>,
  ) {}

  async onApplicationBootstrap() {
    let adminRole = await this.roleRepo.findOne({ where: { name: 'admin' } });
    if (!adminRole) {
      adminRole = this.roleRepo.create({ name: 'admin' });
      await this.roleRepo.save(adminRole);
    }
    let editorRole = await this.roleRepo.findOne({ where: { name: 'editor' } });
    if (!editorRole) {
      editorRole = this.roleRepo.create({ name: 'editor' });
      await this.roleRepo.save(editorRole);
    }
    const admin = await this.userRepo.findOne({ where: { email: 'admin@admin.com' } });
    if (!admin) {
      const hash = await bcrypt.hash('admin123', 10);
      const user = this.userRepo.create({
        nombre: 'Admin',
        email: 'admin@admin.com',
        password: hash,
        roles: [adminRole],
      });
      await this.userRepo.save(user);
    }
  }
}
