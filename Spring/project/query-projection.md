## @QueryProjection (QueryDSL) 와 Projections

- #### 프로젝션이란 select절에 대상을 지정하는 것이다.
- #### @QueryProjection을 사용하면 컴파일 시에 타입 체크를 할 수 있어 안전하다.
- #### DTO가 Querydsl에 대한 의존성이 생긴다는 단점이 있다.

---

### QueryProjection 사용법

- 생성자를 통해 DTO를 조회하는 방법과 함께 사용된다.

```java
@Data
public class MemberDto {
 	private String username;
 	private int age;
 	public MemberDto() {}
    
 	@QueryProjection
 	public MemberDto(String username, int age) {
 		this.username = username;
 		this.age = age;
 	}
}
```

- DTO의 생성자에 @QueryProjection을 붙여준다.
- 이후 compileQuerydsl을 해주면 해당 DTO가 Q파일로 생성된다.

```java
QMember member = QMember.member;
List<MemberDto> result = queryFactory
 	.select(new QMemberDto(member.username, member.age))
 	.from(member)
 	.fetch();
```

- 생성된 Q타입은 위와 같이 사용할 수 있다.

---

## Projections

- #### QueryDSL은 세가지 방법을 통해 DTO로 조회할 수 있도록 지원한다.

  - **프로퍼티 접근 (Setter)**
  - **필드 직접 접근**
  - **생성자 사용**

---

### 1. 프로퍼티 접근법 - Setter 사용

- Projections.bean()을 사용한다.

```java
List<MemberDto> result = queryFactory
 	.select(Projections.bean(MemberDto.class,
		member.username,
		member.age))
 	.from(member)
 	.fetch();
```

---

### 2. 필드 직접 접근

- Projections.fields()을 사용한다.

```java
List<MemberDto> result = queryFactory
 	.select(Projections.fields(MemberDto.class,
		 member.username,
 		 member.age))
 	.from(member)
 	.fetch();
```

#### DTO와 Entity의 필드명이 다른 경우?

- #### ExpressionUtils.ad(source, alias): 필드나 서브 쿼리에 별칭 적용
- #### username.as("memberName"): 필드에 별칭 적용

```java
List<UserDto> fetch = queryFactory
 	.select(Projections.fields(UserDto.class,
 			member.username.as("name"),
 			ExpressionUtils.as(
 			JPAExpressions
 				.select(memberSub.age.max())
 				.from(memberSub), "age")
 			)
 	).from(member)
 	.fetch();
```

- Member Entity의 필드명은 username이고, UserDto의 필드명은 name인 경우 조회하는 예시이다.
- 추가로 age는 Member들 중 가장 나이가 높은 사람의 나이를 가져오는 예시이다.

---

### 3. 생성자 사용

- Projections.constructor()을 사용한다.

```java
List<MemberDto> result = queryFactory
 	.select(Projections.constructor(MemberDto.class,
 		member.username,
 		member.age))
 	.from(member)
	.fetch();
}
```