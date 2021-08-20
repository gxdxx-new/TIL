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

- 기본 경로는 C:\Program Files\MysQL\MySQL Server 8.0\bin
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
// console
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

### 3.3. 컬럼(column)과 로우(row)

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

| Field      | Type         | Null | Key | Default           | Extra             |
| :--------- | :----------- | :--- | :-- | :---------------- | :---------------- |
| id         | int          | NO   | PRI | NULL              | auto_increment    |
| name       | varchar(20)  | NO   | UNI | NULL              |                   |
| age        | int unsigned | NO   |     | NULL              |                   |
| married    | tinyint(1)   | NO   |     | NULL              |                   |
| comment    | text         | YES  |     | NULL              |                   |
| created_at | datetime     | NO   |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |

테이블 삭제하기

- DROP TABLE 테이블명

```javascript
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

```javascript
// console
mysql> SHOW TABLES;
```

| Tables_in_nodejs |
| ---------------- |
| comments         |
| users            |

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

- SELECT \* 은 모든 컬럼을 선택한다는 의미이다.

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
  - WHERE 조건을 적지 않으면 컬럼의 모든 값이 새값으로 바뀌기 때문에 주의

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

### 5.1. 시퀄라이즈 ORM

SQL 작업을 쉽게 할 수 있도록 도와주는 라이브러리이다.

- ORM: Object Relational Mapping: **객체와 데이터를 매핑**(1대1 짝지음)
- MySQL 외에도 다른 RDB(Maria, Postgre, SQLite, MSSQL)와도 호환된다.
- 자바스크립트 문법으로 데이터베이스를 조작 가능하다.

### 5.2. 시퀄라이즈 CLI 사용하기

시퀄라이즈 명령어를 사용하기 위해 sequelize-cli를 설치한다.

- mysql2는 MySQL DB가 아닌 드라이버이다(Node.js와 MySQL을 이어주는 역할).

```javascript
// console
$ npm i express morgan nunjucks sequelize sequelize-cli mysql2
$ npm i -D nodemon
```

npx sequelize init으로 시퀄라이즈 구조를 생성한다.

```javascript
// console
$ npx sequelize init
```

### 5.3. models/index.js 수정

- require(../config/config) 설정을 로딩한다.
- new Sequelize(옵션들···)로 DB와 연결이 가능하다.

```javascript
// models/index.js

const Sequelize = require("Sequelize");

const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);
db.sequelize = sequelize;

module.exports = db;
```

### 5.4. MySQL 연결하기

app.js를 작성한다.

- sequelize.sync로 연결한다.

```javascript
// app.js

const express = require("express");
const paht = require("path");
const morgan = require("morgan");
const nunjucks = require("nunjucks");

const { sequelize } = require("./models");

const app = express();
app.set("port", process.env.PORT || 3001);
app.set("view engine", "html");
nunjucks.configure("views", {
  express: app,
  watch: true,
});
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("데이터베이스 연결 성공");
  })
  .catch((err) => {
    console.error(err);
  });

app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기중");
});
```

### 5.5. config.json 설정하기

DB 연결 정보를 넣는다.

```javascript
// config/config.json

{
    "development": {
        "username": "root",
        "password": "[root 비밀번호]",
        "database": "nodejs",
        "host": "127.0.0.1",
        "dialect": "mysql"
    },
}
```

### 5.6. 연결 테스트하기

npm start로 실행해서 SELECT 1+1 AS RESULT가 나오면 연결이 성공한 것이다.

### 5.7. 모델 생성하기

테이블에 대응되는 시퀄라이즈 모델을 생성한다.

- 시퀄라이즈 모델은 MySQL의 테이블과 같다.
- 시퀄라이즈는 id를 자동으로 넣어주기 때문에 생략이 가능하다.

```javascript
// models/user.js

const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            name: {
                type: Sequelize.STRING(20),
                allowNull: false,
                unique: true,
            },
            age: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
            },
            married: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
            },
            comment: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
            {
                sequelize,
                tiemstamps: false,
                underscored: false,
                modelName: 'User',
                tableName: 'users',
                paranoid: false,
                charset: 'utf8',
                collate: 'utf8_general_ci'
            });
    }
    static associate(db) {}
};
```

define 메서드의 세 번째 인자는 테이블 옵션이다.

- timestamps: true면 createdAt(생성 시간), updatedAt(수정 시간) 컬럼을 자동으로 만든다.
- 예제에서는 직접 created_at 컬럼을 만들었으므로 false로 한다.
- paranoid 옵션은 true면 deletedAt(삭제 시간) 컬럼을 만든다, 로우 복구를 위해 완전히 삭제하지 않고 deletedAt에 표시해둔다.
- underscored 옵션은 캐멀케이스로 생성되는 컬럼을 스네이크케이스로 생성한다.
  - createdAt -> created_at
- modelName은 모델 이름, tableName 옵션은 테이블 이름을 설정한다.
  - User(모델), users(테이블) Post(모델) posts(테이블)
- charset과 collate는 한글 설정을 위해 필요하다(이모티콘 넣으려면 utf8mb4로).

### 5.8. 모델 옵션들

시퀄라이즈 모델의 자료형은 MySQL의 자료형과 조금 다르다.
|MySQL|시퀄라이즈|
|:---|:---|
|VARCHAR(100)|STRING(100)|
|INT|INTEGER|
|TINYINT|BOOLEAN|
|DATETIME|DATE|
|INT UNSIGNED|INTEGER.UNSIGNED|
|NOT NULL|allowNull: false|
|UNIQUE|unique: true|
|DEFAULT now()|defaultValue: Sequelize.NOW|

### 5.9. 댓글 모델 생성하기

comment.js를 생성한다.

```javascript
// models/commnet.js

const Sequelize = require("sequelize");

module.exports = class Comment extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        comment: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        create_at: {
          type: Sequelize.DATE,
          allowNull: true,
          defaultValue: Sequelize.NOW,
        },
      },
      {
        sequelize,
        timestamps: false,
        modelName: "Comment",
        tableName: "comments",
        paranoid: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }

  static associate(db) {}
};
```

### 5.10. 댓글 모델 활성화하기

index.js에 모델을 연결한다.

- init으로 sequelize와 연결한다.
- associate로 관계를 설정한다.

```javascript
// models/index.js

const Sequelize = require('sequelize');
const User = require('./user');
const Comment = require('./comment');
...
db.sequelize = sequelize;

db.User = User;
db.Comment = Comment;

User.init(sequelize);
Comment.init(sequelize);

User.associate(db);
Comment.associate(db);

module.exports = db;
```

### 5.11. 관계 정의하기

users 모델과 comments 모델 간의 관계를 정의한다.

- 1:N 관계 (사용자 한 명이 댓글 여러 개 작성)
- 시퀄라이즈에서는 1:N 관계를 hasMany로 표현한다(사용자.hasMany(댓글)).
- 반대의 입장에서는 belongTo(댓글.belongsTo(사용자))
- belongsTo가 있는 테이블에 컬럼이 생긴다(댓글 테이블에 commenter 컬럼)

```javascript
// models/user.js

...
    static associate(db) {
        db.User.hasMany(db.Comment, { foreignKey: 'commenter', sourceKey: 'id' });
    }
};
```

- User의 외래키인 Comment의 commenter라는 컬럼이 User의 id를 참조하고 있다.

```javascript
// models/ comment.js

...
    static associate(db) {
        db.Comment.belongsTo(db.User, { foreignKey: 'commenter', targetKey: 'id' });
    }
};
```

<img width="350" alt="model" src="https://user-images.githubusercontent.com/35963403/125903564-b1b5efb3-7fed-4b2e-9328-36f4994da6bd.PNG">

### 5.12. 1대1 관계

ex) 사용자 테이블과 사용자 정보 테이블

- db.User.hasOne(db.Info, { foreignKey: 'UserId', sourceKey: 'id' });
- db.Info.belongsTo(db.User, { foreignKey: 'UserId', targetKey: 'id' });

### 5.13. N대M 관계

ex) 게시글과 해시태그 테이블

- 하나의 게시글이 여러 개의 해시태그를 가질 수 있고 하나의 해시태그가 여러 개의 게시글을 가질 수 있다.
- DB 특성상 다대다 관계는 중간 테이블이 생긴다.

  - 중간 테이블 없애기 : 정규화 위반(컬럼에는 한가지 데이터만 들어갈 수 있다).
  - db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });
  - db.Hasgtag.belongsToMany(db.Post, { through: 'PostHashtag' });

    <img width="450" alt="NvsM" src="https://user-images.githubusercontent.com/35963403/125904168-6a34a1f5-e725-4d30-80db-9a1b8a6d53b9.PNG">

### 5.14. 시퀄라이즈 쿼리 알아보기

SQL 쿼리와 시퀄라이즈 쿼리의 차이점

```javascript
// SQL
INSERT INTO nodejs.users (name, age, married, comment) VALUES ('don', 26, 0, '자기소개1');

// Sequelize
const { User } = require('../models');
User.create({
    name: 'don',
    age: 26,
    married: false,
    comment: '자기소개1',
});

// SQL
SELECT * FROM nodejs.users;

// Sequelize
const { User } = require('../models');
User.findAll({});

// SQL
SELECT name, married FROM nodejs.users;

// Sequelize
const { User } = require('../models');
User.findAll({
    attributes: ['name', 'married'],
});
```

```javascript
// SQL
SELECT name, age FROM nodejs.users WHERE married = 1 AND age > 30;

// Sequelize
const { Op } = require('sequelize');
const { User } = require('../models');
User.findAll({
    attributes: ['name', 'age'],
    whre: {
        married: true,
        age: { [Op.gt]: 30 },
    },
});

// SQL
SELECT id, name FROM users WHERE married = 0 OR age > 30;

// Sequelize
const { Op } = require('sequelize');
const { User } = require('../models');
User.findAll({
    attributes: ['id', 'name'],
    whre: {
        [Op.or]: [{ married: false }, { age: { [Op.gt]: 30 } }],
    },
});
```

- 특수한 기능들의 경우 Sequelize.Op의 연산자를 사용한다.
  - gt: >
  - lt: <
  - gte: >=
  - lte: <=
  - ne: not equal
  - or

```javascript
// SQL
SELECT id, name FROM users ORDER BY age DESC;

// Sequelize
User.findAll({
    attributes: ['id', 'name'],
    order: [['age', 'DESC']],
});

// SQL
SELECT id, name FROM users ORDER BY age DESC LIMIT 1;

// Sequelize
User.findAll({
    attributes: ['id', 'name'],
    order: [['age', 'DESC']],
    limit: 1,
});

// SQL
SELECT id, name FROM users ORDER BY age DESC LIMIT 1 OFFSET 1;

// Sequelize
User.findAll({
    attributes: ['id', 'name'],
    order: [['age', 'DESC']],
    limit: 1,
    offset: 1,
});
```

수정

```javascript
// SQL
UPDATE nodejs.users SET comment = '바꿀 내용' WHERE id = 2;

// Sequelize
User.update({
    comment: '바꿀 내용',
}, {
    where: { id: 2 },
});
```

삭제

```javascript
// SQL
DELETE FROM nodejs.users WHERE id = 2;

// Sequelize
User.destroy({
    where: { id: 2 },
});
```

id가 1번, 3번, 5번인 사람을 지우기

```javascript
// Sequelize
User.destroy({
  where: { id: { [Op.in]: [1, 3, 5] } },
});
```

### 5.15. 관계 쿼리

```javascript
// Sequelize
const user = await User.findOne({});
console.log(user.nick); // 사용자 닉네임
```

- 결괏값이 자바스크립트 객체이다.

```javascript
// Sequelize
const user = await User.findOne({
  include: [
    {
      model: Comment,
    },
  ],
});
console.log(user.Comments); // 사용자 댓글
```

- include로 JOIN과 비슷한 기능을 수행 가능하다(관계 있는것들을 엮을 수 있다).
- 사용자 가져오면서 사용자가 쓴 댓글들을 가져온다.

```javascript
// Sequelize
db.sequelize.models.PoshHashtag;
```

- 다대다 모델은 다음과 같이 접근이 가능하다.

```javascript
// Sequelize
const user = await User.findOne({});
const comments = await user.getComments();
console.log(comments); // 사용자 댓글
```

- get + 모델명으로 관계 있는 데이터 로딩이 가능하다.

```javascript
// Sequelize
// 관계를 설정할 때 as로 등록
db.User.hasMany(db.Comment, {
  foreignKey: "commenter",
  sourceKey: "id",
  as: "Answers",
});
// 쿼리할 때는
const user = await User.findOne({});
const comments = await user.getAnswers();
console.log(comments); // 사용자 댓글
```

- as로 모델명 변경이 가능하다.

```javascript
const user = await User.findOne({
  include: [
    {
      model: Comment,
      where: {
        id: 1,
      },
      attributes: ["id"],
    },
  ],
});

// or

const Comments = await user.getComments({
  where: {
    id: 1,
  },
  attributes: ["id"],
});
```

- include나 관계 쿼리 메서드에도 where나 atrributes를 사용한다.

```javascript
const user = await User.findOne({});
const comment = await Comment.create();
await user.addComment(comment);
// or
await user.addComment(comment.id);
```

- 생성 쿼리

```javascript
const user = await User.findOne({});
const comment1 = await Comment.create();
const comment2 = await Comment.create();
await user.addComment([comment1, comment2]);
```

- 여러 개를 추가할 때는 배열로 추가 가능하다.

수정은 set + 모델명, 삭제는 remove + 모델명이다.

### 5.16. raw 쿼리

```javascript
const [result, metadata] = await sequelize.query("SELECT * FROM comments");
console.log(result);
```

- 직접 SQL을 쓸 수 있다.

### 5.17. 쿼리 수행하기

```javascript
// routes/index.js

const express = require("express");
const User = require("../models/user");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.render("sequelize", { users });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
```

```javascript
// routes/users.js

const express = require("express");
const User = require("../models/user");
const Comment = require("../models/comment");

const router = express.Router();

router
  .route("/")
  .get(async (req, res, next) => {
    try {
      const users = await User.findAll();
      res.json(users);
    } catch (err) {
      console.error(err);
      next(err);
    }
  })
  .post(async (req, res, next) => {
    try {
      const user = await User.create({
        name: req.body.name,
        age: req.body.age,
        married: req.body.married,
      });
      console.log(user);
      res.status(201).json(user);
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

router.get("/:id/comments", async (req, res, next) => {
  try {
    const comments = await Comment.findAll({
      include: {
        model: User,
        where: { id: req.params.id },
      },
    });
    console.log(comments);
    res.json(comments);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
```

```javascript
// routes/comment.js

const express = require("express");
const { Comment } = require("../models");

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const comment = await Comment.create({
      commenter: req.body.id,
      comment: req.body.comment,
    });
    console.log(comment);
    res.status(201).json(comment);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router
  .route("/:id")
  .patch(async (req, res, next) => {
    try {
      const result = await Comment.update(
        {
          comment: req.body.comment,
        },
        {
          where: { id: req.params.id },
        }
      );
      res.json(result);
    } catch (err) {
      console.error(err);
      next(err);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const result = await Comment.destroy({ where: { id: req.params.id } });
      res.json(result);
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

module.exports = router;
```

users, comments 라우터

- get, post, delete, patch 같은 요청에 대한 라우터 연결이다.
- 데이터는 JSON 형식으로 응답한다.

### 5.18. 서버 접속하기

npm start로 서버를 시작한다.

- localhsot:3000 으로 접속하면 시퀄라이즈가 수행하는 SQL문이 콘솔에 찍힌다.
