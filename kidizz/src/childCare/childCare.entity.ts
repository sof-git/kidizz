import { User } from '../user/user.entity'; // Import User entity
import { Child } from '../child/child.entity'; // Import Child entity
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  Index,
} from 'typeorm';

@Entity()
export class ChildCare {
  @PrimaryGeneratedColumn()
  id?: number;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  // Relationship with User entity
  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user: User;

  // Ensure that userId is properly defined and nullable: false is set
  @Column({ type: 'int', nullable: false })
  userId: number;

  @ManyToMany(() => Child, (child) => child.childCares, { onDelete: 'CASCADE' })
  children: Child[];
}
