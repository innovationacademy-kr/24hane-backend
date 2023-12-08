import Cluster from 'src/enums/cluster.enum';
import InOut from 'src/enums/inout.enum';

export class DeviceInfoDto {
  device_id: number;
  campus: Cluster;
  io_type: InOut;
}
