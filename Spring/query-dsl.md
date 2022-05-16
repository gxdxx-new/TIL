## QueryDSL

- 쿼리를 자바코드로 작성할 수 있게 도와주는 기술이다.
- Spring Data JPA로 해결하지 못하는 복잡한 쿼리/동적 쿼리를 해결할 수 있다.
- 자바코드로 작성하기 때문에 문법오류를 컴파일 시점에 잡아낼 수 있다.
- 오픈소스 프로젝트다.
- 일반적으로 복잡한 Creteria를 대체하는 JPQL 빌더다.
JPA의 표준스펙이 아니므로 약간의 설정이 더 필요하다.
복잡한 쿼리와 동적쿼리를 깔쌈하게 해결해준다.
쿼리를 자바 코드로 작성할 수 있다. 따라서 문법오류를 컴파일단계에서 잡아줄 수 있다.

### JPQL vs QueryDSL

#### JPQL

```java
String username = "gracelove"
String query = "select m from Member m "+
 "where m.username = :username";

List<Member> result = em.createQuery(query, Member.class)
                            .getResult.List();
```

#### QueryDSL

```java
String username = "gracelove
List<Member> result = queryFactory
                            .select(member)
                            .from(member)
                            .where(member.username.eq(username))
                            .fetch();
```

- 자바 코드이기 때문에 ide의 도움을 받을 수 있다.
- 컴파일 단계에서 오류를 발견할 수 있다.
- 자바 코드다 보니, 메서드추출도 할 수 있어서 재사용성 또한 높아진다.

