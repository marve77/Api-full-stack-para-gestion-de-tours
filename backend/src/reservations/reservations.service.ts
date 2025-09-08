
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Tour } from '../tours/entities/tour.entity';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private reservationsRepository: Repository<Reservation>,
    @InjectRepository(Tour)
    private toursRepository: Repository<Tour>,
  ) {}

  async create(dto: CreateReservationDto, user: any): Promise<Reservation> {
    const tour = await this.toursRepository.findOne({ where: { id: dto.tour } });
    if (!tour) throw new Error('Tour no encontrado');
    const reservation = this.reservationsRepository.create({
      nombre: dto.nombre,
      telefono: dto.telefono,
      correo: dto.correo,
      cantidad: dto.cantidad,
      tour: tour,
      user: user && user.userId ? { id: user.userId } : undefined,
    });
    return this.reservationsRepository.save(reservation);
  }

  findAll(): Promise<Reservation[]> {
    return this.reservationsRepository.find();
  }

  async findOne(id: number): Promise<Reservation> {
    const reservation = await this.reservationsRepository.findOne({ where: { id } });
    if (!reservation) throw new Error('Reservation no encontrada');
    return reservation;
  }

  async update(id: number, dto: UpdateReservationDto): Promise<Reservation> {
    const reservation = await this.reservationsRepository.findOne({ where: { id } });
    if (!reservation) throw new Error('Reservation no encontrada');
    if (dto.tour) {
      const tour = await this.toursRepository.findOne({ where: { id: dto.tour } });
      if (!tour) throw new Error('Tour no encontrado');
      reservation.tour = tour;
    }
    if (dto.nombre !== undefined) reservation.nombre = dto.nombre;
    if (dto.telefono !== undefined) reservation.telefono = dto.telefono;
    if (dto.correo !== undefined) reservation.correo = dto.correo;
    if (dto.cantidad !== undefined) reservation.cantidad = dto.cantidad;
    return this.reservationsRepository.save(reservation);
  }

  async remove(id: number): Promise<void> {
    await this.reservationsRepository.delete(id);
  }

  async getWeeklyEarnings(): Promise<{ earnings: number, byTour: { tourId: number, tourName: string, earnings: number }[] }> {
    // No hay campo de fecha, así que devolvemos la suma total y desglose por tour
    const reservations = await this.reservationsRepository.find({ relations: ['tour'] });
    const byTourMap = new Map<number, { tourId: number, tourName: string, earnings: number }>();
    let total = 0;
    for (const r of reservations) {
      const amount = (r.tour?.precio || 0) * (r.cantidad || 0);
      total += amount;
      if (r.tour) {
        if (!byTourMap.has(r.tour.id)) {
          byTourMap.set(r.tour.id, { tourId: r.tour.id, tourName: r.tour.destino || r.tour.nombre || '', earnings: 0 });
        }
        byTourMap.get(r.tour.id)!.earnings += amount;
      }
    }
    return { earnings: total, byTour: Array.from(byTourMap.values()) };
  }
}
