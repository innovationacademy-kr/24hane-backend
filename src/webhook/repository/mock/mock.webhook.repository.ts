import { Inout } from 'src/entities/inout.entity';

export default class MockWebhookRepository {
  MockEntity: Inout[] = [];

  async insert(data: any): Promise<void> {
    this.MockEntity.push({
      seq: this.MockEntity.length,
      intra_id: data.intraId,
      timestamp: data.timestamp,
      inout: data.inout,
      cluster: data.cluster,
    });
  }
}
