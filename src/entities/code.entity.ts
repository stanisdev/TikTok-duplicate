import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsDate, MaxLength, IsUUID } from 'class-validator';

@Entity('code')
export class CodeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsUUID(4)
  userId: string;

  @Column()
  @MaxLength(40)
  code: string;

  @Column()
  @IsDate()
  expireAt: Date;
}
