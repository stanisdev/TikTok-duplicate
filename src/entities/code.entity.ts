import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsDate, MaxLength, IsUUID } from 'class-validator';

@Entity('codes')
export class Code {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsUUID(4)
  user_id: string;

  @Column()
  @MaxLength(40)
  code: string;

  @Column()
  @IsDate()
  expire_at: Date;
}
