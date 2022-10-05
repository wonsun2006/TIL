# MySQL 공부

## 로그인

1. cmd 에서 mysql -u [아이디] -p

   mysql로 로그인 하는 명령어이다.

   기본은 root로 되어 있을 것이며, 현재도 그 상태이니 root로 로그인한다.

2. mysql command line client 실행

   자동으로 로그인 과정으로 넘어간다.

   cmd에서 명령어를 뺀 정도의 과정인 듯 하다.

이후 비밀번호를 입력한 뒤, 원하는 작업을 진행하면 된다.

## SQL

### Database 생성

`CREATE DATABASE [DB이름]`

### Table 생성

`CREATE TABLE [table이름](속성 타입 ...)`

### 레이블 추가

`INSERT INTO [table이름](속성1, 속성2, ...) VALUES(속성1, 속성2, ...)`

table의 속성명은 입력하지 않아도 자동으로 부여해주나, 안전한 입력을 위해 써주는 것이 좋다.

## MySQL 명령어

### SHOW 명령어 : 목록 출력

`SHOW DATABASES`

`SHOW TABLES`

### USE 명령어 : Database 사용

`USE [DB이름]`
