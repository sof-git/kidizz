import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ChildCare } from './childCare.entity';
import { ChildCareDto } from './childCare.dto';
import { Child } from '../child/child.entity';
import { User } from 'src/user/user.entity';
import { sendEmailsInBatches } from './notification.service';
@Injectable()
export class ChildCareService {
  constructor(
    @InjectRepository(ChildCare)
    private readonly childCareRepository: Repository<ChildCare>,
    @InjectRepository(Child)
    private readonly childRepository: Repository<Child>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    createChildCareDto: ChildCareDto,
    userId: number, // Expecting userId directly
  ): Promise<ChildCare> {
    const newChildCare = this.childCareRepository.create(createChildCareDto);

    // Set userId from the passed userId parameter
    newChildCare.userId = userId;
    // Check if a child care with the same name already exists
    const found = await this.childCareRepository.findOne({
      where: { name: newChildCare.name },
    });
    if (found) {
      throw new HttpException('Child care already exists', HttpStatus.CONFLICT);
    }
    return this.childCareRepository.save(newChildCare);
  }

  async findOne(id: number): Promise<ChildCare> {
    return this.childCareRepository.findOneBy({ id });
  }

  async delete(id: number, userId: number): Promise<void> {
    // Find the child care and children with the child
    const childCare = await this.childCareRepository.findOne({
      where: { id: id },
    });

    if (!childCare) {
      throw new HttpException('Child care not found', HttpStatus.NOT_FOUND);
    }

    const childrenDifferentsUserId = await this.childRepository
      .createQueryBuilder('child')
      .leftJoinAndSelect('child.childCares', 'childCare')
      //where has two params id and userId to check is differents user
      .where('childCare.id = :id', { id: id })
      .andWhere('child.userId != :userId', { userId: userId })
      .getMany();
    if (childrenDifferentsUserId.length > 0) {
      // user childrenDifferentsUserId to find users with the userId field
      const uniqueUserIds = Array.from(
        new Set(childrenDifferentsUserId.map((child) => child.userId)),
      );
      const users = await this.userRepository.find({
        where: { id: In(uniqueUserIds) },
        select: ['email'], // Only fetch the email field
      });
      const emailsToInform = users.map((user) => user.email);

      // Batch the email sending (3 emails at a time)
      await sendEmailsInBatches(emailsToInform);
      //thow unathorized
      throw new HttpException(
        `Unauthorized to delete child care with children associated with users: ${users
          .map((user) => user.email)
          .join(', ')}`,
        HttpStatus.UNAUTHORIZED,
      );
    }

    //ensure there is no child with user different from
    await this.childCareRepository.delete(id);
  }

  // Add a new method to find all child care entities
  async findAll(): Promise<ChildCare[]> {
    return this.childCareRepository.find();
  }
}
