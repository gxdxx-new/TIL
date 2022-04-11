## 엔티티와 DTO를 분리해야 하는 이유

### [ 엔티티(Entity) 또는 도메인 객체(Domain Object)와 DTO를 분리해야 하는 이유 ]

- ### 1. 관심사의 분리
- ### 2. Validation 로직 및 불필요한 코드와의 분리
- ### 3. API 스펙과의 분리
- ### 4. API 스펙의 파악이 용이

---

### 1. 관심사의 분리 (seperation of concerns, SoC)

- 엔티티와 DTO를 분리해야 하는 가장 큰 이유이다.
- 서로 다른 관심사들을 분리해 변경 가능성을 최소화하고, 유연하며 확장 가능한 아키텍처를 구축하도록 도와준다.

- #### DTO(Data Transfer Object)

  - **DTO(Data Transfer Object)의 핵심 관심사는 데이터의 전달**이다.
  - DTO는 데이터를 담고, 다른 계층(Layer) 또는 다른 컴포넌트들로 데이터를 넘겨주기 위한 자료구조(Data Structure)이다.
  - 따라서 어떠한 기능 및 동작이 없어야 한다.

- #### 엔티티(Entity), 도메인 객체(Domain Object)

  - **엔티티는 핵심 비즈니스 로직을 담는 비즈니스 도메인 영역의 일부**이다.
  - 엔티티 또는 도메인 객체는 비즈니스 로직이 추가될 수 있다.
  - 엔티티 또는 도메인 객체는 다른 계층이나 컴포넌트들 사이에서 전달을 위해 사용되는 객체가 아니다.

---

### 2. Validation 로직 및 불필요한 코드와의 분리

- Spring에서 요청에 대한 데이터를 검증하기 위해 @Valid 어노테이션을 사용한다.
- @Valid 처리를 위해서는 @NotNull, @NotEmpty, @Size 등과 같은 유효성 검증 어노테이션들을 변수에 붙여주어야 한다.
- JPA도 변수에 @Id, @Column 등과 같은 어노테이션들을 활용해 객체와 관계형 데이터베이스를 매핑해주는데,
- DTO와 엔티티를 분리하지 않는다면 엔티티의 코드가 상당히 복잡해진다.

```java
@Entity 
@Table 
@Getter
@Builder 
@NoArgsConstructor
@AllArgsConstructor 
public class Membership {
    
    @NotNull
    @Size(min = 0) 
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false) 
    private Long id; 
    
    @NotNull
    @Enumerated(EnumType.STRING)
    private MembershipType membershipType; 
    
    @NotBlank
    @Column(nullable = false)
    private String userId;
    
    @NotNull @Size(min = 0) 
    @Setter
    @Column(nullable = false)
    @ColumnDefault("0") 
    private Integer point; 
    
    @CreationTimestamp 
    @Column(nullable = false, length = 20, updatable = false)
    private LocalDateTime createdAt; 
    
    @UpdateTimestamp 
    @Column(length = 20) 
    private LocalDateTime updatedAt;
    
}
```

- 위 코드처럼 엔티티와 DTO를 분리하지 않으면 유지보수가 힘들어진다.
- 또한 위의 엔티티 클래스의 생성일자(createdAt)나 수정일자(updatedAt)를 나타내는 변수들은 API 요청이나 응답에서는 필요가 없다.
- 그렇기 때문에 응답에서 해당 변수를 제거하기 위해서는 @JsonIgnore 등과 같은 또 다른 어노테이션들을 통해 별도의 작업이 필요할 것이다.
- **이렇게 계속 엔티티 클래스를 사용하면 핵심 비즈니스 도메인 코드들이 아닌 요청/응답을 위한 값, 유효성 검증을 위한 코드 등이 추가되면서**
- **엔티티 클래스가 지나치게 비대해지고, 확장 및 유지보수 등에서 매우 어려움을 겪게 된다.**

---

### 3. API 스펙의 유지

다음과 같은 엔티티 클래스를 API의 응답으로 활용하고 있을 경우

```java
@Entity
@Table 
@Getter 
@Builder 
@NoArgsConstructor
@AllArgsConstructor 
public class Membership {
    
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    @Column(nullable = false)
    private Long id;
    
    @Enumerated(EnumType.STRING)
    private MembershipType membershipType;
    
    @Column(nullable = false) 
    private String userId; 
    
    @Setter
    @Column(nullable = false) 
    @ColumnDefault("0") 
    private Integer point; 
    
}
```

다음과 같은 Json 메시지를 받게 된다.

```json
{
  "id" : "15", 
  "membershipType" : "NAVER",
  "userId" : "NC10523", 
  "point" : "10000"
}
```

- 그런데 내부 정책의 변경으로 userId를 memberId로 변경해야 하는 상황일 경우
- DTO를 사용하지 않으면 userId가 memberId로 바뀜에 따라 API의 스펙이 변경된다.
- 이로 인해 API를 사용하던 사용자들은 모두 장애를 겪게 된다.
- 테이블에 새로운 컬럼을 추가하는 경우에도 엔티티에 새로운 변수가 추가되고 API 스펙이 변경된다.
- 이러한 상황들을 위해 **DTO를 이용해 독립성을 높임으로써 변경이 전파되는 것을 방지**해야 한다.
- 만약 응답을 위한 DTO 클래스를 활용하고 있으면, 엔티티 클래스의 변수가 변경되어도 **API 스펙이 변경되지 않으므로 안전성을 확보**할 수 있다.

---

### 4. API 스펙의 파악이 용이

- DTO를 통해 **API 스펙을 어느정도 파악**할 수 있다.
- 다음과 같은 사용자 등록 API에 대한 Request DTO가 있을 경우

```java
@Getter 
@RequiredArgsConstructor
public class UserRequestDto { 
    
    @Email
    @Size(max = 100) 
    private final String email; 
    
    @NotBlank 
    private final String pw;
    
    @NotNull 
    private final UserRole userRole;
    
    @Min(12) 
    private final int age; 
    
}
```

- DTO를 작성함으로써 어느정도 API 스펙들을 알 수 있다.
- email의 값은 email 포맷이어야 하고, 최대 글자수가 100이며 pw는 비어있어서는 안되는 등을 파악할 수 있다.
- 다른 사람이 작성한 API 호출 코드를 파악할 때 요청/응답을 손쉽게 파악할 수 있다.