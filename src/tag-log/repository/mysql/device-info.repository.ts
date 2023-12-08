import { InjectRepository } from '@nestjs/typeorm';
import { DeviceInfo } from 'src/entities/device-info.entity';
import { DeviceInfoDto } from 'src/tag-log/dto/device-info.dto';
import { Repository } from 'typeorm';
import { IDeviceInfoRepository } from '../interface/device-info-repository.interface';

export class DeviceInfoRepository implements IDeviceInfoRepository {
  constructor(
    @InjectRepository(DeviceInfo)
    private deviceInfoRepository: Repository<DeviceInfo>,
  ) {}

  async findAll(): Promise<DeviceInfoDto[]> {
    return await this.deviceInfoRepository.find();
  }
}
