
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './user.entity';
import { Role } from './role.entity';

import { AuthModule } from './auth/auth.module';
import { SeederService } from './seeder/seeder.service';
import { ToursModule } from './tours/tours.module';
import { UsersModule } from './users/users.module';
import { Tour } from './tours/entities/tour.entity';
import { Reservation } from './reservations/entities/reservation.entity';
import { ReservationsModule } from './reservations/reservations.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 55432,
      username: 'nestuser',
      password: 'nestpass',
      database: 'nestdb',
  entities: [User, Role, Tour, Reservation],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Role]),
    AuthModule,
  ToursModule,
  UsersModule,
  ReservationsModule,
  ],
  controllers: [AppController],
  providers: [AppService, SeederService],
})
export class AppModule {}
