import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IsDate, MaxLength, IsUUID } from 'class-validator';
import { User } from './user.entity';

@Entity('codes')
export class Code {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @MaxLength(40)
  code: string;

  @ManyToOne(() => User, user => user.codes)
  user: User;

  @Column()
  @IsDate()
  expireAt: Date;
}
