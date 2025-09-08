
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { Tour } from './entities/tour.entity';

@Injectable()
export class ToursService {
  constructor(
    @InjectRepository(Tour)
    private readonly tourRepository: Repository<Tour>,
  ) {}

  async create(createTourDto: CreateTourDto): Promise<Tour> {
    const tour = this.tourRepository.create(createTourDto);
    return this.tourRepository.save(tour);
  }

  async findAll(): Promise<Tour[]> {
    return this.tourRepository.find();
  }

  async findOne(id: number): Promise<Tour> {
    const tour = await this.tourRepository.findOne({ where: { id } });
    if (!tour) throw new NotFoundException('Tour not found');
    return tour;
  }

  async update(id: number, updateTourDto: UpdateTourDto): Promise<Tour> {
    const tour = await this.tourRepository.preload({ id, ...updateTourDto });
    if (!tour) throw new NotFoundException('Tour not found');
    return this.tourRepository.save(tour);
  }

  async remove(id: number): Promise<void> {
    const tour = await this.tourRepository.findOne({ where: { id } });
    if (!tour) throw new NotFoundException('Tour not found');
    await this.tourRepository.remove(tour);
  }
}
