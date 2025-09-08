
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Tour {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	nombre: string;

	@Column()
	destino: string;

	@Column('text')
	descripcion: string;

	@Column('decimal')
	precio: number;

	@Column({ type: 'date' })
	fecha_inicio: string;
}
