import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Tour } from '../../tours/entities/tour.entity';
import { User } from '../../user.entity';

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  telefono: string;

  @Column()
  correo: string;

  @ManyToOne(() => Tour, { eager: true })
  tour: Tour;

  @ManyToOne(() => User, { eager: true, nullable: true })
  user: User;

  @Column()
  cantidad: number;
}
