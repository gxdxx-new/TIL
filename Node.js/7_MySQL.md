# **MySQL**
## **1. 데이터베이스**
---
### 1.1. 데이터베이스란
데이터를 서버 메모리에 저장하는 것의 단점
- 서버를 재시작하면 데이터도 사라져버린다.
    - 영구적으로 저장할 공간이 필요하다.

MySQL 관계형 데이터베이스란
- 데이터베이스: 관련성을 가지며 중복이 없는 데이터들의 집합이다.
- DBMS: 데이터베이스를 관리하는 시스템이다.
- RDBMS: 관계형 데이터베이스를 관리하는 시스템이다.
- 서버의 하드 디스크나 SSD 등의 저장 매체에 데이터를 저장한다.
- 서버 종료 여부와 상관 없이 데이터를 계속 사용할 수 있다.
- 여러 사람이 동시에 접근할 수 있고, 권한을 따로 줄 수 있다.

<br/>

## **2. MySQL, 워크벤치 설치하기**
---
### 2.1. MySQL 접속해보기
콘솔(cmd)에서 MySQL이 설치된 경로로 이동한다.
- 기본 경로는 C:\Program Files\MySQL Server 8.0\bin
- -h는 호스트, -u는 사용자, -p는 비밀번호를 의미한다.
```javascript
// console
$ mysql -h localhost -u root -p
Enter password: [비밀번호 입력]
mysql>
```
- 프롬프트가 mysql>로 바뀌면 성공한 것이다.
- 프롬프트를 종료하려면 exit을 입력하면 된다.

<br/>

## **3. 데이터베이스, 테이블 생성하기**
---
### 3.1. 데이터베이스 생성하기
console에서 MySQL 프롬프트에 접속한다.
- CREATE SCHEMA nodejs; 로 nodejs 데이터베이스를 생성한다.
- use nodejs; 로 생성한 데이터베이스를 선택한다.
```javascript
// console
mysql> CREATE SCHEMA `nodejs` DEFAULT CHARACTER SET utf8;
Query OK, 1 row affected (0.01sec)
mysql> use nodejs;
Database changed
```

### 3.2. 테이블 생성하기
MySQL 프롬프트에서 테이블을 생성한다.
- CREATE TABLE [데이터베이스명.테이블명]으로 테이블을 생성한다.
- 사용자 정보를 저장하는 테이블
```javascript
mysql> CREATE TABLE nodejs.users (
    -> id INT NOT NULL AUTO_INCREMENT,
    -> name VARCHAR(20) NOT NULL,
    -> age INT UNSIGNED NOT NULL,
    -> married TINYINT NOT NULL,
    -> comment TEXT NULL,
    -> created_at DATETIME NOT NULL DEFAULT now(),
    -> PRIMARY KEY(id),
    -> UNIQUE INDEX name_UNIQUE (name ASC))
    -> COMMENT = '사용자 정보'
    -> DEFAULT CHARACTER SET = utf8
    -> ENGINE  = InnoDB 
)
Query OK, 0 row affected (0.09 sec)
```

### 3.3. 컬럼(column)과 로우(row_
- 나이, 결혼 여부, 성별 같은 정보가 컬럼이다.
- 실제로 들어가는 데이터는 로우이다.

### 3.4. 컬럼 옵션들
id INT NOT NULL AUTO_INCREMENT
- 컬럼명 옆의 것들은 컬럼에 대한 옵션들이다.
    - INT: 정수 자료형(FLOAT, DOUBLE은 실수)
    - VARCHAR: 문자열 자료형, 가변 길이(CHAR은 고정 길이)
    - TEXT: 긴 문자열은 TEXT로 별도 저장
    - DATETIME: 날짜 자료형 저장
    - TINYINT: -128에서 127까지 저장하지만 여기서는 1 또는 0만 저장해 불 값 표현
    - NOT NULL: 빈 값은 받지 않는다는 뜻(NULL은 빈 값 허용)
    - AUTO_INCREMENT: 숫자 자료형인 경우 다음 로우가 저장될 때 자동으로 1 증가
    - UNSIGNED: 0과 양수만 허용
    - ZEROFILL: 숫자의 자리 수가 고정된 경우 빈 자리에 0을 넣음
    - DEFAULT now(): 날짜 컬럼의 기본값을 현재 시간으로

### 3.5. Primary Key, Unique Index
- PRIMARY KEY(id)
    - id가 테이블에서 로우를 특정할 수 있게 해주는 고유한 값임을 의미한다.
- UNIQUE INDEX name_UNIQUE (name ASC)
    - 해당 컬럼(name)이 고유해야 함을 나타내는 옵션이다.
    - name_UNIQUE는 이 옵션의 이름(아무거나 다른 걸로 지어도 됨)이다.
    - ASC는 인덱스를 오름차순으로 저장한다(내림차순은 DESC).

### 3.6. 테이블 옵션
- COMMENT
    - 테이블에 대한 보충 설명을 한다.
- DEFAULT CHARSET
    - utf8로 설정해야 한글이 입력된다.
- ENGINE: InnoDB를 사용한다.

### 3.7. 테이블 생성되었는지 확인하기
DESC 테이블명
```javascript
// console
mysql> DESC users;
```

| Field        | Type          | Null  | Key   | Default   | Extra |
|:---          |:---           |:---   |:---   |:---       |:---|
| id           | int           | NO    | PRI   | NULL      | auto_increment|
| name         | varchar(20)   | NO    | UNI   | NULL      | |
| age          | int unsigned  | NO    |       | NULL      | |
| married      | tinyint(1)    | NO    |       | NULL      | |
| comment      | text          | YES   |       | NULL      | |
| created_at   | datetime      | NO    |       | CURRENT_TIMESTAMP     | DEFAULT_GENERATED |

테이블 삭제하기
- DROP TABLE 테이블명
```javascrit
// console
mysql> DROP TABLE users;
```

### 3.8. 댓글 테이블 저장하기
comments 테이블 생성
```javascript
// console
mysql> CREATE TABLE nodejs.comments (
    -> id INT NOT NULL AUTO_INCREMENT
    -> commenter INT NOT NULL,
    -> comment VARCHAR(100) NOT NULL,
    -> created_at DATETIME NOT NULL DEFAULT now(),
    -> PRIMARY KEY(id),
    -> INDEX commenter_idx( commenter ASC ),
    -> CONSTRAINT commenter
    -> FOREIGN KEY (commenter)
    -> REFERENCES nodejs.users (id)
    -> ON DELETE CASCADE
    -> ON UPDATE CASCADE
    -> COMMENT = '댓글'
    -> DEFAULT CHARSET=utf8mb4
    -> ENGINE=InnoDB; 
)
Query OK, 0 row affected (0.09 sec)
```

### 3.9. 외래키(foreign key)
댓글 테이블은 사용자 테이블과 관계가 있다(사용자가 댓글을 달기 때문에).
- 외래키를 두어 두 테이블이 관계가 있다는 것을 표시한다.
- FOREIGN KEY (컬럼명) REFERENCES 데이터베이스.테이블명 (컬럼)
- FOREIGN KEY (commenter) REFERENCES nodejs.users (id)
    - 댓글 테이블에는 commenter 컬럼이 생기고 사용자 테이블의 id값이 저장된다.
- ON DELETE CASCADE, ON UPDATE CASCADE
    - 사용자 테이블의 로우가 지워지고 수정될 때 댓글 테이블의 연관된 로우들도 같이 지워지고 수정된다.
    - 데이터를 일치시키기 위해 사용하는 옵션(CASCADE 대신 SET NULL과 NO ACTION도 있다)

### 3.10. 테이블 목록 보기
SHOW TABLES;
```javscript
// console
mysql> SHOW TABLES;
```
| Tables_in_nodejs|
|---|
| comments |
| users |

<br/>

## **4. CRUD 작업하기**
---
### 4.1. CRUD
Create, Read, Update, Delete의 두문자어이다.
- 데이터베이스에서 많이 하는 작업 4가지이다.

### 4.2. Create
INSERT INTO 테이블 (컬럼명들) VALUES (값들)
```javascript
// console
mysql> INSERT INTO nodejs.users (name, age, married, comment) VALUES ('don', 26, 0, '자기소개1');
Query OK, 1 row affected (0.01 sec)
```

### 4.3. Read
SELECT 컬럼 FROM 테이블명
- SELECT * 은 모든 컬럼을 선택한다는 의미이다.
```javascript
// console
mysql> SELECT * FROM nodejs.users;
```
- 컬럼만 따로 추리는 것도 가능하다.
```javascript
// console
mysql> SELECT name, married FROM nodejs.users;
```

### 4.4. Read 옵션들
WHERE로 조건을 주어 선택이 가능하다.
- AND로 여러가지 조건을 동시에 만족하는 것을 찾는다.
```javascript
// console
mysql> SELECT name, age FROM nodejs.users WHERE married = 1 AND age > 30;
```
- OR로 여러가지 조건 중 하나 이상을 만족하는 것을 찾는다.
```javascript
// console
mysql> SELECT id, name FROM nodejs.users WHERE married = 0 OR age > 30;
```

### 4.5. 정렬해서 찾기
ORDER BY로 특정 컬럼 값을 순서대로 정렬이 가능하다.
- DESC는 내림차는, ASC는 오름차순
```javascript
// console
mysql> SELECT id, name FROM nodejs.users ORDER BY age DESC;
```

### 4.6. LIMIT, OFFSET
- LIMIT으로 조회할 개수를 제한한다.
```javascript
// console
mysql> SELECT id, name FROM nodejs.users ORDER BY age DESC LIMIT 1;
```
- OFFSET으로 앞의 로우들을 스킵이 가능하다.
    - OFFSET 2면 세 번째 것부터 찾는다.
```javascript
// console
mysql> SELECT id, name FROM nodejs.users ORDER BY age DESC LIMIT 1 OFFSET 1;
```

### 4.7. Update
데이터베이스에 있는 데이터를 수정하는 작업이다.
- UPDATE 테이블명 SET 컬럼=새값 WHERE 조건
```javascript
// console
mysql> UPDATE nodejs.users SET comment = '바꿀 내용' WHERE id = 2;
```

### 4.8. Delete
데이터베이스에 있는 데이터를 삭제하는 작업이다.
- DELETE FROM 테이블명 WHERE 조건
```javascript
// console
mysql> DELETE FROM nodejs.users WHERE id = 2;
```

<br/>

## **5. 시퀄라이즈 사용하기**
---