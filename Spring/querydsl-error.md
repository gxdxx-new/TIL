## No qualifying bean of type 'com.querydsl.jpa.impl.JPAQueryFactory' available:

```
Caused by: org.springframework.beans.factory.NoSuchBeanDefinitionException: 
No qualifying bean of type 'com.querydsl.jpa.impl.JPAQueryFactory' available: 
expected at least 1 bean which qualifies as autowire candidate.
```

- Querydsl 코드를 테스트할 때 @SpringBootTest를 하면 모든 빈이 주입되기 때문에 상관이 없다.
- 하지만 @DataJpaTest와 같은 슬라이싱 테스트를 할 때 문제가 발생한다.
- JpaQueryFactory가 persistenceLayer가 아니여서 빈 등록이 되지않아 발생하는 문제이다.

### 해결법

- 테스트 시 특정 부분의 빈만 등록해주면 된다.

```java
@DataJpaTest
public class HelloDataJpaTest {

    @Autowired
    EntityManager em;
    JPAQueryFactory queryFactory;

    @BeforeEach
    public void init() {
        queryFactory = new JPAQueryFactory(em);
    }
    
    ...
}
```

####  @TestConfiguration을 이용하는 방법

- 테스트에서만 사용할 용도의 @TestConfiguration을 이용해 JPAQueryFactory 만 Bean으로 생성해준다.

```java
@TestConfiguration
public class TestConfig {

    @PersistenceContext
    private EntityManager entityManager;

    @Bean
    public JPAQueryFactory jpaQueryFactory() {
        return new JPAQueryFactory(entityManager);
    }
}

```

- 이후 @Import 어노테이션을 사용해 해당 테스트용 빈을 주입해주면 JpaQueryFactory에 대한 빈도 생성되므로 Querydsl의 슬라이싱 테스트가 가능해진다

```java
@DataJpaTest
@ActiveProfiles("test")
@Import(TestConfig.class)
public class RepositoryTest {
}
```