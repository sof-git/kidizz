import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChildCare } from './childCare.entity';
import { ChildCareDto } from './childCare.dto';

@Injectable()
export class ChildCareService {
  constructor(
    @InjectRepository(ChildCare)
    private readonly childCareRepository: Repository<ChildCare>,
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

  async delete(id: number): Promise<void> {
    await this.childCareRepository.delete(id);
  }

  // Add a new method to find all child care entities
  async findAll(): Promise<ChildCare[]> {
    return this.childCareRepository.find();
  }
}
