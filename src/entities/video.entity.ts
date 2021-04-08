import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IsDate, MaxLength, IsNumber, IsPositive, Min, Max } from 'class-validator';
import { User } from './user.entity';

export enum VideoAvailableFor {
  PUBLIC = 0,
  FRIENDS = 1,
  PRIVATE = 2,
}

@Entity('videos')
export class Video {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Min(100000000000000)
  @Max(999999999999999)
  publicId: number;

  @ManyToOne(() => User, (user) => user.videos)
  user

  @Column()
  @MaxLength(150)
  caption: string;

  @Column()
  @IsNumber()
  @IsPositive()
  availableFor: VideoAvailableFor;

  @Column('int', { array: true })
  allowUser: number[];

  @Column()
  @IsNumber()
  viewsCount: number;

  @Column()
  @IsDate()
  createdAt: Date;
}
