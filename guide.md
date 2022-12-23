# 실행 가이드

## 1. docker를 이용한 MySQL 실행

별도의 DB 서버가 없을 경우 docker를 이용해 MySQL을 실행해야 합니다. docker를 이용해 MySQL을 실행할 경우 DDL과 샘플 데이터까지 미리 삽입합니다.

### 1-1. DDL과 샘플 데이터가 포함된 SQL 파일 준비

아래의 DDL과 샘플 데이터를 별도의 파일로 저장합니다. 확장자는 `*.sql` 이어야 합니다.

내용 중 샘플 데이터는 적절하게 수정하고 추가합니다. 샘플 데이터를 여기서 삽입하지 않으려면 `INSERT` 문을 모두 제거하고 별도의 툴로 수동으로 삽입합니다.

```sql
# DDL
CREATE TABLE USER_INFO
(
    USER_ID       INT                   NOT NULL PRIMARY KEY,
    LOGIN         VARCHAR(50)           NOT NULL,
    IS_ADMIN      BOOLEAN               NOT NULL DEFAULT FALSE,
    CONSTRAINT IDX_UNIQUE UNIQUE (USER_ID)
);

CREATE TABLE CARD_ISSUANCE
(
    IDX             BIGINT      NOT NULL AUTO_INCREMENT PRIMARY KEY,
    USER_ID         INT         NOT NULL,
    CARD_ID         VARCHAR(20) NOT NULL,
    START_USE       DATETIME    NOT NULL,
    END_USE         DATETIME    NOT NULL DEFAULT '9999-12-31 23:59:59',
    CONSTRAINT FK_USER_ID FOREIGN KEY (USER_ID) REFERENCES USER_INFO (USER_ID),
    CONSTRAINT IDX_UNIQUE UNIQUE (IDX)
);

CREATE TABLE DEVICE_INFO
(
    DEVICE_ID       INT                 NOT NULL PRIMARY KEY,
    CAMPUS          VARCHAR(15)         NOT NULL,
    IO_TYPE         VARCHAR(3)          NOT NULL,
    CONSTRAINT DEVICE_ID_UNIQUE UNIQUE (DEVICE_ID)
);

CREATE TABLE TAG_LOG
(
    IDX             BIGINT      NOT NULL AUTO_INCREMENT PRIMARY KEY,
    TAG_AT          DATETIME    NOT NULL,
    CARD_ID         VARCHAR(15) NOT NULL,
    DEVICE_ID       INT         NOT NULL,
    CONSTRAINT IDX_UNIQUE UNIQUE (IDX)
);

CREATE TABLE PAIR_INFO
(
    IN_DEVICE       INT                 NOT NULL,
    OUT_DEVICE      INT                 NOT NULL,
    CONSTRAINT PAIR_INFO_PK PRIMARY KEY (IN_DEVICE, OUT_DEVICE)
);

# Sample Data

# 사용자 정보 (아이디, 로그인, 관리자 여부 - 0/1)
INSERT INTO USER_INFO (USER_ID, LOGIN, IS_ADMIN) VALUES (12345, 'kristine', 1);

# 카드 발급내역 (아이디, 카드 고유 ID, 카드 발급일, 카드 만료일)
INSERT INTO CARD_ISSUANCE (USER_ID, CARD_ID, START_USE, END_USE) VALUES (12345, '1234567890123', '2019-01-01 00:00:00', '9999-12-31 23:59:59');

# 태깅을 하는 단말 정보 (단말 고유 ID, 캠퍼스 - GAEPO/SEOCHO, 출입 - IN/OUT)
INSERT INTO DEVICE_INFO (DEVICE_ID, CAMPUS, IO_TYPE) VALUES (12, 'GAEPO', 'IN');

# 입-출 짝 정보들 (입장 단말 고유 ID, 퇴장 단말 고유 ID)
INSERT INTO PAIR_INFO (IN_DEVICE, OUT_DEVICE) VALUES (12, 13);

# 태깅한 로그 (태깅한 시간, 카드 고유 ID, 단말 고유 ID)
INSERT INTO TAG_LOG (TAG_AT, CARD_ID, DEVICE_ID) VALUES ('2022-08-19 14:41:44', '8501109000615', 15);
```

### 1-2. docker를 실행하기 위한 명령어 설정

아래 명령어에서 상황에 맞게 수정합니다. DB명, 계정은 그대로 사용하더래도 sql 파일이 존재하는 경로는 설정하여야 합니다.

아래의 `[*.sql만 존재하는 폴더의 절대경로]` 를 위에서 내려받은 sql 파일만이 존재하는 경로로 설정합니다.

```bash
docker run -d \
--name=24hane --hostname=24hane \
-e MYSQL_ROOT_PASSWORD=password42 \
-e MYSQL_DATABASE=checkin_v3 \
-e MYSQL_USER=checkin.local \
-e MYSQL_PASSWORD=password42 \
-v [*.sql만 존재하는 폴더의 절대경로]:/docker-entrypoint-initdb.d/ \
-p 3306:3306 \
mysql:latest
```

### 1-3. 명령어 실행

위 명령어를 실행하면 MySQL 서버가 구동됩니다.

### 1-4. 동작 테스트

DB 서버가 정상적으로 구동되는지는 다음 명령어를 이용해 테스트합니다.

```bash
$> docker ps
CONTAINER ID   IMAGE          COMMAND                  CREATED         STATUS         PORTS                               NAMES
3e9f9c2faa08   mysql:latest   "docker-entrypoint.s…"   7 seconds ago   Up 5 seconds   0.0.0.0:3306->3306/tcp, 33060/tcp   24hane
```

정상적으로 실행되고 있는지 `NAMES` 항목과 `STATUS` 항목을 이용해 확인합니다.

netcat 명령어가 사용 가능한 경우, 3306 포트가 잘 열려 있는지도 확인해 봅니다.

```bash
$> nc -z localhost 3306
Connection to localhost port 3306 [tcp/mysql] succeeded!
```

## 2. `.env` 설정

24hane 백앤드 앱을 실행하려면 환경에 맞는 여러 환경 변수들을 삽입해야 합니다. 리포지토리의 루트 디렉터리에 있는 `env.sample` 을 참고하여 설정합니다.

예를 들면 아래와 같이 설정할 수 있습니다.

```
PORT = 4242

DATABASE_HOST = localhost
DATABASE_PORT = 3306
DATABASE_USERNAME = checkin.local
DATABASE_PASSWORD = password42
DATABASE_NAME = checkin_v3

CLIENT_ID = 42인트라넷에서 발급받은 API ID
CLIENT_SECRET = 42인트라넷에서 발급받은 API SECRET KEY
CLIENT_CALLBACK = /user/login/callback/42

JWT_OR_SESSION_SECRET = 12345678
JWT_EXPIREIN = 28d

LOG_DEBUG = true
```

## 3. 앱 실행

리포지토리의 루트 디렉토리에서 `npm i` 를 실행한 다음 `npm run start:dev` 를 실행합니다.
