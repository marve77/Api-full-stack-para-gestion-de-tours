
import { IsString, IsNotEmpty, IsNumber, IsPositive, IsDateString } from 'class-validator';

export class CreateTourDto {
	@IsString()
	@IsNotEmpty()
	nombre: string;

	@IsString()
	@IsNotEmpty()
	destino: string;

	@IsString()
	@IsNotEmpty()
	descripcion: string;

	@IsNumber()
	@IsPositive()
	precio: number;

	@IsDateString()
	fecha_inicio: string;
}
