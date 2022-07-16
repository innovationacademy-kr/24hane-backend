import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import Cluster from 'src/enums/cluster.enum';
import InOut from 'src/enums/inout.enum';

export class WebhookRequestDto {
  @IsDateString()
  timestamp: Date;

  @IsOptional()
  @IsEnum(Cluster)
  cluster?: Cluster;

  @IsString()
  intraId: string;

  @IsEnum(InOut)
  inout: InOut;
}
