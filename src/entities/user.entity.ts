import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IsDate, IsInt, IsMobilePhone, IsUUID, Length, Max, MaxLength, Min, MinLength } from 'class-validator';
import { Code } from './code.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID(4)
  id: string;

  @Column()
  @IsMobilePhone()
  phone: string;

  @Column()
  @MinLength(5)
  @MaxLength(40)
  username: string;

  @Column()
  @Length(60)
  password: string;

  @Column()
  @Length(5)
  salt: string;

  @Column()
  @IsInt()
  @Min(0)
  @Max(10)
  status: number;

  @OneToMany(() => Code, code => code.user)
  codes: Code[];

  @Column()
  @IsDate()
  createdAt: Date;
}
