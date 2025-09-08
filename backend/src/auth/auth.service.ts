import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { Role } from '../role.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Role) private roleRepo: Repository<Role>,
    private jwtService: JwtService,
  ) {}


  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.userRepo.findOne({ where: { email }, relations: ['roles'] });
    if (user && await bcrypt.compare(pass, user.password)) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload = { username: user.email, sub: user.id, roles: user.roles.map(r => r.name) };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        roles: user.roles.map(r => r.name)
      }
    };
  }

  async register(data: { nombre: string; email: string; password: string; roles?: string[] }) {
    const exists = await this.userRepo.findOne({ where: { email: data.email } });
    if (exists) throw new UnauthorizedException('Email ya registrado');
    const hash = await bcrypt.hash(data.password, 10);
    let roles: Role[] = [];
    if (data.roles && data.roles.length) {
      roles = await this.roleRepo.find({ where: data.roles.map(name => ({ name })) });
    } else {
      const userRole = await this.roleRepo.findOne({ where: { name: 'editor' } });
      if (userRole) roles = [userRole];
    }
    const user = this.userRepo.create({ ...data, password: hash, roles });
    await this.userRepo.save(user);
    return this.login(user);
  }
}
