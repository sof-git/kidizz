import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
  RelationId,
} from 'typeorm';
import { ChildCare } from '../childCare/childCare.entity';
import { User } from '../user/user.entity';

@Entity()
export class Child {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  firstname: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  lastname: string;

  // A single relationship to User
  @ManyToOne(() => User, { nullable: false })
  user: User;

  // Automatically get the userId from the user relation
  @RelationId((child: Child) => child.user)
  userId: number;

  // A many-to-many relationship with ChildCare
  @ManyToMany(() => ChildCare, (childCare) => childCare.children)
  @JoinTable({
    name: 'child_care_assignment', // Name of the junction table
    joinColumn: { name: 'childId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'childCareId', referencedColumnName: 'id' },
  })
  childCares: ChildCare[];

  @RelationId((child: Child) => child.childCares)
  childCareIds: number[];
}
