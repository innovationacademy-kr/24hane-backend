import { CadetPerClusterDto } from 'src/statistics/dto/cadet-per-cluster.dto';

export interface IStatisticsRepository {
  /**
   * 현재시간 기준 클러스터 당 카뎃의 체류인원을 가져옴.
   * @param day 현재시간 뒤로 day일 만큼의 기록만 산정함.
   */
  getCadetPerCluster(day: number): Promise<CadetPerClusterDto[]>;
}
