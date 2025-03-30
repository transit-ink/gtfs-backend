import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agency } from './agency.entity';

@Injectable()
export class AgencyService {
  constructor(
    @InjectRepository(Agency)
    private agencyRepository: Repository<Agency>,
  ) {}

  async findAll(): Promise<Agency[]> {
    return this.agencyRepository.find();
  }

  async findById(id: string): Promise<Agency> {
    const agency = await this.agencyRepository.findOne({
      where: { agency_id: id },
    });
    if (!agency) {
      throw new NotFoundException(`Agency with ID ${id} not found`);
    }
    return agency;
  }

  async create(agency: Agency): Promise<Agency> {
    const newAgency = this.agencyRepository.create(agency);
    return this.agencyRepository.save(newAgency);
  }

  async update(id: string, agency: Agency): Promise<Agency> {
    const existingAgency = await this.findById(id);
    const updatedAgency = this.agencyRepository.merge(existingAgency, agency);
    return this.agencyRepository.save(updatedAgency);
  }
}
