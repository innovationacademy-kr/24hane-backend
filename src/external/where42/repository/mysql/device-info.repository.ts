import { InjectRepository } from '@nestjs/typeorm';
import { DeviceInfo } from 'src/entities/device-info.entity';
import { DeviceDto } from 'src/external/where42/dto/device.dto';
import { Repository } from 'typeorm';
import { IDeviceInfoRepository } from '../interface/device-info.repository.interface';

export class DeviceInfoRepository implements IDeviceInfoRepository {
  constructor(
    @InjectRepository(DeviceInfo)
    private deviceInfoRepository: Repository<DeviceInfo>,
  ) {}

  async getDeviceInfo(id: number): Promise<DeviceDto> {
    const result = await this.deviceInfoRepository.find({
      where: {
        device_id: id,
      },
    });
    if (result.length === 0) {
      return null;
    }
    return {
      id: result[0].device_id,
      cluster: result[0].campus,
      inoutState: result[0].io_type,
    };
  }
}
