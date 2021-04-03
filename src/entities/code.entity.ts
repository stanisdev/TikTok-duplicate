import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IsDate, MaxLength, IsNumber, IsPositive } from 'class-validator';
import { User } from './user.entity';

export enum CodeType {
  SMS = 0,
  JWT_ACCESS = 1,
  JWT_REFRESH = 2,
}

@Entity('codes')
export class Code {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @MaxLength(40)
  code: string;

  @Column()
  @IsNumber()
  @IsPositive()
  type: CodeType;

  @ManyToOne(() => User, (user) => user.codes)
  user: User;

  @Column()
  @IsDate()
  expireAt: Date;
}
