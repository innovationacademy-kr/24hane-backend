# 개요

- 해당 저장소는 클러스터에 출입하는 42 교육생들의 입장인원을 파악하고, 교육생들의 클러스터 체류시간을 확인할 수 있는 서비스의 서버 프로젝트입니다.
- 기존 체크인 서비스는 해당 [링크](https://bitbucket.org/42seoul/checkin_back/src/develop/)에서 확인하실 수 있습니다.

# 프로젝트 구조

```plain
├── src
└── test
```
- `src`
  - 소스 코드 및 단위 테스트가 저장된 디렉토리
- `test`
  - e2e 테스트 코드가 저장된 디렉토리

# 앱 구동 및 실행
해당 앱은 환경변수가 설정되어 있어야 정상적으로 실행됨을 보증합니다. 또한 MySQL Database와의 연결이 필요합니다.

## 앱 실행

```bash
# 개발 모드로 앱 실행
$> npm run start

# 개발 모드로 앱 실행 (코드 변경 시 자동으로 앱 재시작)
$> npm run start:dev

# 배포 모드로 앱 실행
$> npm run start:prod
```

## 테스트 (jest)

```bash
# 단위 테스트
$> npm run test

# e2e (일종의 통합) 테스트
$> npm run test:e2e

# 단위 테스트 커버리지 측정
$> npm run test:cov
```

## pm2 배포를 위한 shell command
pm2 명령어가 실행 가능할 때에만 동작하는 쉘입니다.

앱이 실행중이 아니라면 실행하고, 기존에 앱이 실행 중이면 reload 하는 쉘 스크립트입니다.

현재 무중단 배포가 엄밀하게 설정되어 있는 상황이 아니라 추후 수정이 필요할 수도 있습니다.

```bash
$> bash pm2-run.sh
```