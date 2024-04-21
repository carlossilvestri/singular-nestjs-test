import { Status } from '../../auth/models/status.model';
import { DefaultEntity } from '../../utils/entities/default.entity';
import { Column, Entity } from 'typeorm';

@Entity('products')
export class Product extends DefaultEntity {
  @Column({
    name: 'name',
  })
  name: string;

  @Column({
    name: 'description',
  })
  description: string;

  @Column('float', {
    default: 0,
  })
  price: number;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.AVAILABLE,
  })
  status: Status;
}
