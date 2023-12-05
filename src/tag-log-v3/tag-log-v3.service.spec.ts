import { Test, TestingModule } from '@nestjs/testing';
import { TagLogService } from './tag-log-v3.service';
import { PairInfoDto } from './dto/pair-info.dto';
import { TagLogDto } from './dto/tag-log.dto';
import { DateCalculator } from 'src/utils/date-calculator.component';
import { UserService } from 'src/user/user.service';

const mocks = [
  {
    provide: UserService,
    useClass: jest.fn(),
  },
  {
    provide: 'ITagLogRepository',
    useClass: jest.fn(),
  },
  {
    provide: 'IPairInfoRepository',
    useClass: jest.fn(),
  },
  {
    provide: 'IDeviceInfoRepository',
    useClass: jest.fn(),
  },
];

describe('Tag Log (v2) unit 테스트', () => {
  let tagLogService: TagLogService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [TagLogService, DateCalculator, ...mocks],
    }).compile();

    tagLogService = app.get<TagLogService>(TagLogService);
  });

  // NOTE: 아래 테스트를 구동할 때 런타임의 타임존에 유의해야 합니다.
  describe('getAllPairsByTagLogs', () => {
    // NOTE: 짝은 1-2, 3-4 만 있다고 가정합니다.
    const pairs: PairInfoDto[] = [
      {
        in_device: 1,
        out_device: 2,
      },
      {
        in_device: 3,
        out_device: 4,
      },
    ];

    test('태그 로그가 존재하지 않는 케이스', async () => {
      // given
      const taglogs: TagLogDto[] = [];

      // when
      const resultPairs = tagLogService.getAllPairsByTagLogs(taglogs, pairs);

      //then
      expect(resultPairs).toHaveLength(0);
    });

    test('특정 일수 내 입-퇴실 짝이 맞는 일반적인 케이스', async () => {
      // given
      const taglogs: TagLogDto[] = [
        {
          idx: 1,
          tag_at: new Date('2023-03-19T05:10Z'), // 오후 2:10:00
          card_id: '',
          device_id: 1,
        },
        {
          idx: 2,
          tag_at: new Date('2023-03-19T06:00Z'), // 오후 3:00:00
          card_id: '',
          device_id: 2,
        },
      ];

      // when
      const resultPairs = tagLogService.getAllPairsByTagLogs(taglogs, pairs);

      //then
      expect(resultPairs).toHaveLength(1);
      expect(resultPairs).toHaveProperty('[0].durationSecond', 50 * 60); // 50 min
    });

    test('특정 일수 내 입-퇴실 짝이 맞긴 하지만, 중복으로 입실이 찍힌 케이스', async () => {
      // given
      const taglogs: TagLogDto[] = [
        {
          idx: 1,
          tag_at: new Date('2023-03-19T05:10Z'), // 오후 2:10:00
          card_id: '',
          device_id: 1,
        },
        {
          idx: 2,
          tag_at: new Date('2023-03-19T05:20Z'), // 오후 2:20:00
          card_id: '',
          device_id: 1,
        },
        {
          idx: 3,
          tag_at: new Date('2023-03-19T06:00Z'), // 오후 3:00:00
          card_id: '',
          device_id: 2,
        },
      ];

      // when
      const resultPairs = tagLogService.getAllPairsByTagLogs(taglogs, pairs);

      //then
      expect(resultPairs).toHaveLength(2);
      expect(resultPairs).toHaveProperty('[0].durationSecond', 40 * 60); // 40 min
      expect(resultPairs).toHaveProperty('[1].outTimeStamp', null); // 짝이 맞지 않음.
    });

    test('입-퇴실 짝이 월 경계 자정을 넘어가는 케이스', async () => {
      // given
      const taglogs: TagLogDto[] = [
        {
          idx: 1,
          tag_at: new Date('2023-02-28T14:00Z'), // 2월 말일 오후 11시
          card_id: '',
          device_id: 1,
        },
        {
          idx: 2,
          tag_at: new Date('2023-02-28T19:00Z'), // 3월 오전 4:00
          card_id: '',
          device_id: 2,
        },
      ];

      // when
      const resultPairs = tagLogService.getAllPairsByTagLogs(taglogs, pairs);

      //then
      expect(resultPairs).toHaveLength(2);
      expect(resultPairs).toHaveProperty('[0].durationSecond', 4 * 60 * 60); // 4 hr
      expect(resultPairs).toHaveProperty('[1].durationSecond', 60 * 60 - 1); // 1hr FIXME: 1초 손실됨.
    });

    test('자정 경계 테스트 (전날)', async () => {
      // given
      const taglogs: TagLogDto[] = [
        {
          idx: 1,
          tag_at: new Date('2023-02-28T14:59:59.999Z'), // 2월 말일 오후 11시 59분 59초 999ms
          card_id: '',
          device_id: 1,
        },
        {
          idx: 2,
          tag_at: new Date('2023-02-28T15:00:01Z'), // 3월 오전 12:00:01
          card_id: '',
          device_id: 2,
        },
      ];

      // when
      const resultPairs = tagLogService.getAllPairsByTagLogs(taglogs, pairs);

      //then
      expect(resultPairs).toHaveLength(2);
      expect(resultPairs).toHaveProperty('[0].durationSecond', 1); // 1 sec
      expect(resultPairs).toHaveProperty('[1].durationSecond', 0); // 0 sec
    });

    test('자정 경계 테스트 (다음날)', async () => {
      // given
      const taglogs: TagLogDto[] = [
        {
          idx: 1,
          tag_at: new Date('2023-02-28T15:00:00.000Z'), // 3월 오전 12시 정각
          card_id: '',
          device_id: 1,
        },
        {
          idx: 2,
          tag_at: new Date('2023-02-28T15:00:01Z'), // 3월 오전 12:00:01
          card_id: '',
          device_id: 2,
        },
      ];

      // when
      const resultPairs = tagLogService.getAllPairsByTagLogs(taglogs, pairs);

      //then
      expect(resultPairs).toHaveLength(1);
      expect(resultPairs).toHaveProperty('[0].durationSecond', 1); // 1 sec
    });
  });
  describe('removeDuplicates', () => {
    test('중복되지 않은 태그 로그', async () => {
      // given
      const taglogs: TagLogDto[] = [
        {
          idx: 1,
          tag_at: new Date('2023-03-19T05:10Z'), // 오후 2:10:00
          card_id: '',
          device_id: 1,
        },
        {
          idx: 2,
          tag_at: new Date('2023-03-19T06:00Z'), // 오후 3:00:00
          card_id: '',
          device_id: 2,
        },
      ];

      // when
      const resultPairs = tagLogService.removeDuplicates(taglogs);

      //then
      expect(resultPairs).toHaveLength(2);
    });
    test('중복되는 태그 로그', async () => {
      // given
      const taglogs: TagLogDto[] = [
        {
          idx: 1,
          tag_at: new Date('2023-03-19T05:10Z'), // 오후 2:10:00
          card_id: '',
          device_id: 1,
        },
        {
          idx: 2,
          tag_at: new Date('2023-03-19T06:00Z'), // 오후 3:00:00
          card_id: '',
          device_id: 2,
        },
        {
          idx: 3,
          tag_at: new Date('2023-03-19T06:00Z'), // 오후 3:00:00
          card_id: '',
          device_id: 2,
        },
        {
          idx: 4,
          tag_at: new Date('2023-03-19T06:00Z'), // 오후 3:00:00
          card_id: '',
          device_id: 2,
        },
      ];

      // when
      const resultPairs = tagLogService.removeDuplicates(taglogs);

      //then
      expect(resultPairs).toHaveLength(2);
    });
  });
});
