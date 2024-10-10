import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChildDto } from './child.dto';
import { Child } from './child.entity';
import { ChildCare } from '../childCare/childCare.entity';
import { User } from '../user/user.entity';

@Injectable()
export class ChildService {
  constructor(
    @InjectRepository(Child)
    private childRepository: Repository<Child>,
    @InjectRepository(ChildCare)
    private childCareRepository: Repository<ChildCare>,
    @InjectRepository(User)
    private userRepository: Repository<User>, // Inject User repository to find users
  ) {}

  async create(childDto: ChildDto, userId: number): Promise<Child> {
    // Find the user by userId
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Find the ChildCare entity by childCareId
    const childCare = await this.childCareRepository.findOne({
      where: { id: childDto.childCareId },
    });
    if (!childCare) {
      throw new NotFoundException(
        `ChildCare with ID ${childDto.childCareId} not found`,
      );
    }

    // Create a new child entity and associate it with the user and child care
    const newChild = this.childRepository.create({
      ...childDto,
      user, // Associate the user with the child
      childCares: [childCare], // Associate with the specific ChildCare
    });

    // Save the new child to the database
    return await this.childRepository.save(newChild);
  }

  async findOne(id: number): Promise<Child> {
    const child = await this.childRepository.findOne({ where: { id } });
    if (!child) {
      throw new NotFoundException(`Child with ID ${id} not found.`);
    }
    return child;
  }

  async getChildrenByChildCare(childCareId: number): Promise<Child[]> {
    const childCare = await this.childCareRepository.findOne({
      where: { id: childCareId },
    });

    if (!childCare) {
      throw new NotFoundException(
        `ChildCare with ID ${childCareId} not found.`,
      );
    }

    return this.childRepository
      .createQueryBuilder('child')
      .innerJoinAndSelect('child.childCares', 'childCare')
      .where('childCare.id = :childCareId', { childCareId })
      .getMany();
  }

  async delete(id: number): Promise<Child> {
    const child = await this.childRepository.findOneBy({ id });
    if (!child) {
      throw new NotFoundException(`Child with ID ${id} not found.`);
    }
    await this.childRepository.delete(id);
    return child;
  }
  async getChildrenForExport(childCareId?: number): Promise<any[]> {
    // Query to get children and their associated childCares
    let query = this.childRepository
      .createQueryBuilder('child')
      .leftJoinAndSelect('child.childCares', 'childCare')
      .select(['child.id', 'child.firstname', 'child.lastname']);

    // Apply filtering if a specific childCareId is provided
    if (childCareId) {
      query = query.where('childCare.id = :childCareId', { childCareId });
    }

    const children = await query.getMany();
    // Ensure no duplicates if not filtering by childCareId
    const uniqueChildren = childCareId
      ? children // Return as is for specific child care
      : Array.from(
          new Map(children.map((child) => [child.id, child])).values(),
        ); // Remove duplicates based on child ID

    // Format response for CSV
    return uniqueChildren.map((child) => ({
      ID: child.id,
      Firstname: child.firstname,
      Lastname: child.lastname,
    }));
  }
}
