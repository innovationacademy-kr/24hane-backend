<div align="center">

<img width="312" alt="24시간이 모자라" src="https://user-images.githubusercontent.com/27172454/204820918-082dfc20-b77a-46f3-8ab9-3a3cd39abc67.png" />

[![GitHub Stars](https://img.shields.io/github/stars/innovationacademy-kr/42checkin_v3-backend?style=for-the-badge)](https://github.com/innovationacademy-kr/42checkin_v3-backend/stargazers)
[![GitHub Issues](https://img.shields.io/github/issues/innovationacademy-kr/42checkin_v3-backend?style=for-the-badge)](https://github.com/innovationacademy-kr/42checkin_v3-backend/issues)
[![Current Version](https://img.shields.io/badge/version-3.1.1-green?style=for-the-badge)](https://github.com/innovationacademy-kr/42checkin_v3-backend/releases/tag/v3.1.1)

</div>

# **24 HANE(24 hours are not enough)**

## 목차

- [💬 프로젝트 소개](#-프로젝트-소개)
- [🛠 기술 스택](#-기술-스택)
- [💻 구동 및 실행](#-구동-및-실행)
- [🗂 위키](https://github.com/innovationacademy-kr/42checkin_v3-backend/wiki)

<br/>

## 💬 프로젝트 소개

### 공식 웹사이트 (42 계정 필요)

- https://24hoursarenotenough.42seoul.kr

### HTTP API 명세

- http://api.24hoursarenotenough.42seoul.kr/docs/

### 프로젝트 개요 및 목표
- 체류시간을 기준으로 지원금을 지급하는 것으로 운영정책이 변경됨에 따라 약 1,500여명의 학생에게 지원금을 지급하기 위해 체류시간에 대한 데이터가 필요한 상황입니다.
- 학생에겐 본인의 체류시간을 제공해야 합니다.
- 운영진에겐 1,500여명 이상의 학생에게 지원금을 지급하기 위한 월별 체류시간을 산정해주어야 합니다.

### 프로젝트 내용
- 학생이 패용하는 출입카드의 고유 ID를 이용해 입/퇴실 데이터를 이용하여 체류시간 산정
- 24HANE 프론트앤드 개발자 팀원에게 요구사항에 맞는 API 제공
- 운영진에게 요구사항에 맞는 형태로 약 1,500명의 학생에 대한 월별 체류시간 제공
  - 운영진의 요구사항에 따라 현재 Google Sheet를 이용하기 때문에 API만 제공합니다.

### 기술적 도전
해당 백앤드 서비스를 **1,500여명 이상의 카뎃들**과 관리자에게 더 양질의 서비스를 제공하기 위해 아래와 같은 주제에 대해 고민을 하였습니다.
- 지원금이 걸린 만큼 출입기록 산정에 에러가 없어야 합니다.
- 1,500여명 이상의 카뎃들이 출입 누적 시간(오늘, 이번 달) 현황을 조회하기 위해 수시로 조회할 때 견고하게 동작되어야 합니다.
  - 몇십만 건의 레코드가 저장된 출입기록 테이블에 대해 수시로 Full Scan을 수행합니다.
- 관리자는 1,500여명 이상의 카뎃들에 대한 월별 출입기록을 산정하기 위해 월마다 조회합니다.
  - 별도의 최적화를 하지 않으면 Full Scan을 최소 1,500회 수행해야 합니다.
- 교육시설 출입시 출입 카드를 태깅하는데 출입 카드가 교육기간 내 최소 3번이 변경됩니다.


## 🛠 기술 스택

<div>
  
<table border="1">
  <th align="center">분야</th>
  <th align="center">기술스택</th>
  <th align="center">선정이유</th>
  <tr>
    <td rowspan="8" align="center">Back-End</td>
    <td>TypeScript</td>
    <td>컴파일 타임에 에러를 검출하여 서비스 과정에서 발생할 수 있는 오류를 최소화</td>
  </tr>
  <tr>
    <td>ESLint</td>
    <td>코딩 컨벤션에 위배되거나 안티 패턴을 미리 검출하여 에러 발생 요소를 최소화</td>
  </tr>
  <tr>
    <td>Prettier</td>
    <td>기본적인 코딩룰 적용으로 가독성 향상</td>
  </tr>
  <tr>
    <td>NestJS</td>
    <td>백엔드에 필요한 기술들인 IoC, DI, AOP 등이 적용되어 있고, Express.js 프레임워크 대비 구조화됨</td>
  </tr>
  <tr>
    <td>MySQL</td>
    <td>많이 사용되는 만큼 래퍼런스를 찾기 쉽고, 개발 과정에서 생기는 문제에 대한 해결책을 찾기 용이</td>
  </tr>
  <tr>
    <td>TypeORM</td>
    <td>SQL raw query로 작성하는 것보다 유지 보수 측면에서 유리하고, 추후 다른 DBMS로 쉽게 전환 가능</td>
  </tr>
  <tr>
    <td>Swagger</td>
    <td>프론트엔드 팀원들 또는 운영진에게 HTTP API 사양 명세를 하기 위해 사용</td>
  </tr>
  <tr>
    <td>Passport</td>
    <td>OAuth2 적용을 위해 사용</td>
  </tr>
  <tr>
    <td rowspan="3" align="center">Infra</td>
    <td>PM2</td>
    <td>프로젝트 배포 시 node 데몬을 관리할 때 사용</td>
  </tr>
  <tr>
    <td>AWS RDS</td>
    <td>EC2에 DB를 넣지 않고 별도의 서비스로 분리하여 유지보수 및 관리, 확장 용이</td>
  </tr>
  <tr>
    <td>Github Actions</td>
    <td>CI/CD를 적용하여 검증 및 반복 작업의 자동화로 개발의 편의성을 위함</td>
  </tr>
</table>

</div>
<br/>


## 💻 구동 및 실행
해당 앱은 환경변수가 설정되어 있어야 정상적으로 실행됨을 보증합니다. 또한 MySQL Database와의 연결이 필요합니다.

자세한 방법은 [가이드](./guide.md)를 참조해 주세요.

### 앱 실행

```bash
# 개발 모드로 앱 실행
$> npm run start

# 개발 모드로 앱 실행 (코드 변경 시 자동으로 앱 재시작)
$> npm run start:dev

# 배포 모드로 앱 실행
$> npm run start:prod
```

### 테스트 (jest)

```bash
# 단위 테스트
$> npm run test

# e2e 테스트
$> npm run test:e2e

# 단위 테스트 커버리지 측정
$> npm run test:cov
```

### pm2 배포를 위한 shell command
pm2 명령어가 실행 가능할 때에만 동작하는 쉘입니다.

앱이 실행중이 아니라면 실행하고, 기존에 앱이 실행 중이면 reload 하는 쉘 스크립트입니다.

현재 무중단 배포가 엄밀하게 설정되어 있는 상황이 아니라 추후 수정이 필요할 수도 있습니다.

```bash
$> bash pm2-run.sh
```
