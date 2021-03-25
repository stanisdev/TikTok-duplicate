import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsDate, IsInt, IsMobilePhone, IsUUID, Length, Max, MaxLength, Min, MinLength } from 'class-validator';

@Entity('user')
export class UserEntity {
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

  @Column()
  @IsDate()
  createdAt: Date;
}
