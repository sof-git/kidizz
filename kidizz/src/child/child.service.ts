import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChildDto } from './child.dto';
import { Child } from './child.entity';
import { ChildCare } from '../childCare/childCare.entity';
import { User } from '../user/user.entity';
import { PassThrough, Readable } from 'stream';

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

    // Check if the child already exists
    const child = await this.childRepository.findOne({
      where: { firstname: childDto.firstname, lastname: childDto.lastname },
      relations: ['childCares'], // Include childCares to update if necessary
    });

    if (child) {
      // If the child exists, check if the child is already associated with the childCare
      if (!child.childCares.some((care) => care.id === childCare.id)) {
        // If the childCare is not yet associated, add it
        child.childCares.push(childCare);
      }

      // Save the updated child entity
      return await this.childRepository.save(child);
    } else {
      // If the child does not exist, create a new child entity
      const newChild = this.childRepository.create({
        ...childDto,
        user, // Associate the user with the child
        childCares: [childCare], // Associate with the specific ChildCare
      });

      // Save the new child to the database
      return await this.childRepository.save(newChild);
    }
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

  async removeChildCare(
    childId: number,
    childCareId: number,
    userId: number,
  ): Promise<Child | void> {
    // Find the child by childId, including their associated childCares
    const child = await this.childRepository.findOne({
      where: { id: childId },
      relations: ['childCares'],
    });

    if (!child) {
      throw new NotFoundException(`Child with ID ${childId} not found`);
    }

    // Ensure the child belongs to the user
    if (child.userId !== userId) {
      throw new NotFoundException('Unauthorized');
    }
    // Check if the childCare exists in the child's childCares array
    const childCareIndex = child.childCares.findIndex(
      (care) => care.id === childCareId,
    );

    if (childCareIndex === -1) {
      throw new NotFoundException(
        `ChildCare with ID ${childCareId} not found for this child`,
      );
    }

    // Remove the childCare from the array
    child.childCares.splice(childCareIndex, 1);

    // If no childCares remain, delete the child
    if (child.childCares.length === 0) {
      await this.childRepository.remove(child);
      return; // Return void since the child is deleted
    }

    // Save the updated child entity if there are still childCares associated
    return await this.childRepository.save(child);
  }
  async getChildrenForExport(childCareId?: number): Promise<Readable> {
    const queryBuilder = this.childRepository
      .createQueryBuilder('child')
      .leftJoinAndSelect('child.childCares', 'childCare')
      .orderBy('child.lastname', 'ASC');
    if (childCareId) {
      queryBuilder.andWhere('childCare.id = :childCareId', { childCareId });
    }

    const stream = new PassThrough(); // Create a streaming pipeline

    // Write CSV headers
    stream.write('id,firstname,lastname,childCareIds\n');

    const streamQuery = await queryBuilder.stream(); // Await the Readable stream from TypeORM
    streamQuery.on('data', (row: any) => {
      // Ensure childCares exists and map over it, otherwise use an empty string
      // Construct the CSV row
      const csvRow = `${row.child_id},${row.child_firstname},${row.child_lastname}\n`;

      // Write the row to the CSV stream
      stream.write(csvRow);
    });

    streamQuery.on('end', () => {
      // End the stream once all data is processed
      stream.end();
    });

    streamQuery.on('error', (err) => {
      // Handle any errors that occur during streaming
      throw new Error(`Error streaming data: ${err.message}`);
    });

    // Return the stream, so the controller can handle the response piping
    return stream;
  }
}
