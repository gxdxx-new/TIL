## 단위 테스트

---

### 단위 테스트 vs 통합 테스트

- #### 단위 테스트: 하나의 모듈을 기준으로 독립적으로 진행되는 가장 작은 단위의 테스트

  - 모듈은 애플리케이션에서 작동하는 하나의 기능 또는 메소드이다.
  - 즉, 애플리케이션을 구성하는 하나의 기능이 올바르게 동작하는지 독립적으로 테스트하는 것이다.
  - 독립적으로 테스트하기 때문에 어떤 코드를 리팩토링해도 빠르게 문제 여부를 확인할 수 있다.

- #### 통합 테스트: 여러 모듈을 통합하는 과정에서 모듈 간의 호환성을 확인하기 위해 수행되는 테스트

  - 독립적인 기능에 대한 테스트가 아니라 웹 페이지로부터 API를 호출해 올바르게 동작하는지 확인하는 것이다.
  - 캐시나 db등 다른 컴포넌트들과 실제로 연결해야 하고, 시스템을 구성하는 컴포넌트들이 많아질수록 테스트 비용이 커진다.

---

### 단위 테스트 작성의 필요성

- #### 테스팅에 대한 시간과 비용을 절감
- #### 새로운 기능을 추가할 때 수시로 빠르게 테스트하며 문제 파악
- #### 리팩토링할 때 안전성 확보
- #### 코드에 대한 문서화

---

### 단위 테스트의 문제점과 Stub

- #### 다른 객체 대신에 가짜 객체 (Mock Object)를 주입해 어떤 결과를 반환하라고 정해진 답변을 준비시켜야 한다.

  - 일반적인 애플리케이션에서는 1개의 기능을 처리하기 위해 다른 객체들과 메시지를 주고 받아야 한다.
  - 하지만 단위 테스트는 독립적인 테스트이기 때문에 다른 객체와 메시지를 주고받을 때의 문제를 해결하기 위해 가짜 객체가 필요하다.
  - ex) db에 새로운 데이터를 추가하는 코드를 테스트할 때
    - 가짜 db (Mock Database)를 주입해 insert 처리할 때 반드시 1을 반환하도록 해주는 것이 stub이다.

---

### 좋은 단위 테스트의 특징

#### 요구 사항의 변경으로 실제 코드가 변경되는 경우

- #### 변경된 코드를 검증해 잠재적인 버그가 생길 가능성을 줄여준다.
- #### 테스트 코드도 수정해야할 경우를 위해 다음을 준수해야 한다.

  - 1개의 테스트 함수에 대해 assert를 최소화한다.
  - 1개의 테스트 함수는 1가지 개념만을 테스트한다.

### FIRST

1. Fast: 테스트는 빠르게 동작해 자주 돌릴 수 있어야 한다.
2. Independent: 각각의 테스트는 독립적이며 서로 의존해서는 안된다.
3. Repeatable: 어느 환경에서도 반복 가능해야 한다.
4. Self-Validating: 테스트는 성공 또는 실패의 결과로 bool 값을 내어 자체적으로 검증되어야 한다.
5. Timely: 테스트는 적시에 즉, 테스트하려는 실제 코드를 구현하기 직전에 구현해야 한다.

---

<br/>

## JUnit을 이용한 Java 단위 테스트 코드 작성법

### Java 단위 테스트 작성 준비

---

#### 필요 라이브러리

  - JUnit5: 자바 단위 테스트를 위한 테스팅 프레임워크
  - AssertJ: 자바 테스트를 돕기 위해 다양한 문법을 지원하는 라이브러리

---

#### given-when-then 패턴

  - 1개의 단위 테스트를 3가지 단계로 나누어 처리하는 패턴
  - given(준비): 어떠한 데이터가 준비되었을 때
  - when(실행): 어떠한 함수를 실행하면
  - then(검증): 어떠한 결과가 나와야한다.

---

#### 테스트 코드 작성 공통 규칙

```java
@DisplayName("로또 번호 갯수 테스트")
@Test
void lottoNumberSizeTest() {
    //given
    
    //when
        
    //then
}
```

- #### @Test

  - 해당 메소드가 단위 테스트임을 명시하는 어노테이션

- #### @DisplayName

  - 테스트 이름을 메소드명이 아닌 직접 부여한 이름으로 사용 가능하게 해주는 어노테이션

---

<br/>

### 단위 테스트 작성 예시

---

### 로또 생성기 Java 코드

```java
public class LottoNumberGenerator {
    
    public List<Integer> generate(final int money) {
        if (!isValidMoney(money)) {
            throw new RuntimeException("올바른 금액이 아닙니다.");
        }
        return generate();
    }
    
    private boolean isValidMoney(final int money) {
        return money == 1000;
    }
    
    private List<Integer> generate() {
        return new Random()
                .ints(1, 45 + 1)
                .distinct()
                .limit(6)
                .boxed()
                .collect(Collectors.toList());
    }
    
}
```

---

### 1. 로또 번호 갯수 테스트

```java
@DisplayName("로또 번호 갯수 테스트")
@Test
void lottoNumberSizeTest() {
        //given
        final LottoNumberGenerator lottoNumberGenerator = new LottoNumberGenerator();
        final int price = 1000;

        //when
        final List<Integer> lottoNumber = lottoNumberGenerator.generate(price);

        //then
        assertThat(lottoNumber.size()).isEqualTo(6);
}
```

- #### given

  - 로또를 생성받기 위해 필요한 로또 생성기 객체와 금액을 초기화한다.

- #### when

  - 생성한 금액으로 로또를 생성한다.

- #### then

  - 생성된 로또가 6개 숫자를 갖는지 검증한다.

---

### 2. 로또 번호 범위 테스트

```java
@DisplayName("로또 번호 범위 테스트")
@Test
void lottoNumberRangeTest() {
        //given
        final LottoNumberGenerator lottoNumberGenerator = new LottoNumberGenerator();
        final int price = 1000;

        //when
        final List<Integer> lottoNumber = lottoNumberGenerator.generate(price);

        //then
        assertThat(lottoNumber.stream().allMatch(v -> v >= 1 && v <= 45)).isTrue();
}
```

- #### then

  - 모든 로또 숫자가 1에서 45 사이인지를 boolean 값으로 검사한다.

---

### 3. 잘못된 로또 금액 테스트

```java
@DisplayName("잘못된 로또 금액 테스트")
@Test
void lottoNumberInvalidMoneyTest() {
        //given
        final LottoNumberGenerator lottoNumberGenerator = new LottoNumberGenerator();
        final int price = 2000;

        //when
        final RuntimeException exception = assertThrows(RuntimeException.class, () -> lottoNumberGenerator.generate(price));

        //then
        assertThat(exception.getMessage()).isEqualTo("올바른 금액이 아닙니다.");
}
```

- #### when

  - 예외를 assertThrows()로 감싸서 처리해야 한다.

---

<br/>

# JUnit과 Mockito 기반의 Spring 단위 테스트 코드 작성법

## Mockito 소개 및 사용법

---

### Mockito: 개발자가 동작을 직접 제어할 수 있는 가짜(Mock) 객체를 지원하는 테스트 프레임워크

- Spring과 같은 웹 애플리케이션에서 여러 객체들간의 의존성은 단위 테스트를 어렵게 한다.
- Mockito를 활용해 가짜 객체에 원하는 결과를 Stub해 단위 테스트를 진행할 수 있다.
- Mock을 하지 않아도 되는 경우면 하지 않는게 제일 좋다.

---

### Mockito 사용법

#### 1. Mock 객체 의존성 주입

- #### @Mock: Mock 객체를 만들어 반환해주는 어노테이션
- #### @Spy: Stub하지 않은 메소드들은 원본 메소드 그대로 사용하는 어노테이션
- #### @InjectMocks: @Mock 또는 @Spy로 생성된 가짜 객체를 자동으로 주입시켜주는 어노테이션
- ex) UserController에 대한 단위테스트를 하는 경우
  - @Mock 어노테이션으로 가짜 UserService를 만들고
  - @InjectMocks 어노테이션으로 UserController에 주입

#### 2. Stub로 결과 처리

- #### doReturn(): Mock 객체가 특정한 값을 반환해야 하는 경우
- #### doNothing(): Mock 객체가 아무것도 반화하지 않은 경우(void)
- #### doThrow(): Mock 객체가 예외를 발생시키는 경우
- ex) UserService의 findAllUser() 호출 시에 빈 ArrayList를 반환하는 경우
  - doReturn(new ArrayList()).when(userService).findAllUser();

#### 3. Mockito와 Junit의 결합

- #### Junit4: @RunWith(MockitoJUnitRunner.class)
- #### Junit5: @ExtendWith(MockitoExtension.class)

---

<br/>

## Spring 컨트롤러 단위 테스트 작성 예시

### 사용자 회원가입 / 목록 조회 API

```java
@RestController
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;
    
    @PostMapping("/user/signUp")
    public ResponseEntity<String> signUp(@RequestBody final SignUpDto signUpDto) {
        return userService.isEmailExists(signUpDto.getEmail())
                ? ResponseEntity.badRequest().build()
                : ResponseEntity.ok(TokenUtils.generateJwtToken(userService.signUp(signUpdto)));
    }
    
    @GetMapping("/user/list")
    public ResponseEntity<UserListResponseDTO> findAll() {
        final UserListResponseDTO userListResponseDTO = UserListResponseDTO.builder()
                .userList(userService.findAll()).build();
        
        return ResponseEntity.ok(userListResponseDTO);
    }
    
}
```

---

### 단위 테스트 작성 준비

```java
@ExtendWith(MockitoExtension.class)
class UserControllerTest {
    
    @InjectMocks
    private UserController userController;
    
    @Mock
    private UserService userService;
    
    private MockMvc mockMvc;
    
    @BeforEach
    public void init() {
        mockMvc = MockMvcBuilders.standaloneSetup(userController).build();
    }
    
}
```

- #### @ExtenWith(MockitoExtension.class)

  - Junit5와 Mockito를 연동하는 어노테이션

- #### @Mock

  - UserController에서 UserService를 사용하므로 UserService에 가짜 Mock 객체 주입

- #### @InjectMocks

  - 테스트 대상인 UserController에 UserService를 주입

- #### MockMvc

  - UserController에 대한 API 요청을 받아 넘겨주는 별도의 객체

---

### 1. 회원가입 성공 테스트

```java
@DisplayName("회원 가입 성공") 
@Test void signUpSuccess() throws Exception {  
    // given    
    final SignUpDTO signUpDTO = signUpDTO();   
    doReturn(false).when(userService).isEmailDuplicated(signUpDTO.getEmail());  
    doReturn(new User("a", "b", UserRole.ROLE_USER)).when(userService).signUp(any(SignUpDTO.class));

    // when   
    final ResultActions resultActions = mockMvc.perform(  
            MockMvcRequestBuilders.post("/user/signUp")   
                    .contentType(MediaType.APPLICATION_JSON)         
                    .content(new Gson().toJson(signUpDTO))
        );   
    
    // then   
    final MvcResult mvcResult = resultActions.andExpect(status().isOk()).andReturn();  
    final String token = mvcResult.getResponse().getContentAsString();  
    assertThat(token).isNotNull();
}

private SignUpDTO signUpDTO() {    
    final SignUpDTO signUpDTO = new SignUpDTO(); 
    signUpDTO.setEmail("test@test.test"); 
    signUpDTO.setPw("test");   
    return signUpDTO; 
}
```

- #### (given) userService의 signUp 함수에 대한 매개변수로 signUpDTO가 아닌 any()를 사용한 이유
  - Spring에서 HTTP Body로 전달된 데이터는 MessageConverter에 의해 새로운 객체로 변환된다.
  - 새로운 객체로 변환되는 것은 Spring에서 하는 것이기 때문에 API로 전달되는 파라미터 SignUpDTO를 직접 조작할 수 없다.
  - 따라서 SignUpDTO 클래스의 어떠한 객체도 처리할 수 있도록 any()를 사용한다.
    - any의 파라미터는 안줘도 되지만, 클래스의 타입을 주는게 좋다.

- #### when

  - mockMvc의 perform에 요청에 대한 정보를 작성해 넘겨주어야 한다.
  - 요청 정보를 작성하기 위해 MockMvcRequestBuilders를 이용해 요청 메소드 종류, 내용, 파라미터를 설정한다.
  - 보내는 데이터는 객체가 아닌 Json이여야 하므로 Gson을 활용해 변환한다.

- #### then

  - 회원가입 API 호출 결과로 200 Response와 JWT 토큰을 발급받은 것을 검증한다.

---

### 2. 이메일이 중복되어 회원가입 실패

```java
@DisplayName("이메일이 중복되어 회원 가입 실패") 
@Test 
void signUpFailByDuplicatedEmail() throws Exception {   
    // given   
    final SignUpDTO signUpDTO = signUpDTO();  
    doReturn(true).when(userService).isEmailDuplicated(signUpDTO.getEmail());   
    
    // when  
    final ResultActions resultActions = mockMvc.perform(   
            MockMvcRequestBuilders.post("/user/signUp")    
        .contentType(MediaType.APPLICATION_JSON)            
        .content(new Gson().toJson(signUpDTO))  
        );   
    
    // then
        resultActions.andExpect(status().isBadRequest());
}
```

- #### given

  - isEmailDuplicated의 결과로 true를 반환한다.
  - 이메일이 중복된 경우에는 UserService의 SignUp 메소드가 호출되지 않는다.
    - 불필요한 Stub이 있으면 테스트에 실패하므로 SignUp에 대한 Stub을 제거해준다.

- #### then

  - Response Status가 BadRequest인지 확인한다.



---

### 3. 사용자 목록 조회

```java
@DisplayName("사용자 목록 조회") 
@Test
void getUserList() throws Exception {   
    // given
        doReturn(userList()).when(userService).findAll();
        
    // when   
    final ResultActions resultActions = mockMvc.perform(   
            MockMvcRequestBuilders.get("/user/list")  
        );  
    
    // then   
    final MvcResult mvcResult = resultActions.andExpect(status().isOk()).andReturn(); 
    final UserListResponseDTO response = new Gson().fromJson(mvcResult.getResponse().getContentAsString(), UserListResponseDTO.class);   
    assertThat(response.getUserList().size()).isEqualTo(5);
} 

private List<User> userList() {  
    final List<User> userList = new ArrayList<>(); 
    for (int i = 0; i < 5; i++) {   
        userList.add(new User("test@test.test", "test", UserRole.ROLE_USER)); 
    }   
    return userList;
}
```

- #### given

  - UserService의 findAll에 대한 Stub이 필요하다.

- #### when

  - 호출하는 HTTP 메소드를 GET으로, URL을 "/user/list"로 작성한다.

- #### then

  - HTTP Status가 OK이고, 주어진 Json 데이터를 객체로 변환해 확인해야 한다.

---

<br/>

## Spring 서비스 계층 단위 테스트 작성 예시

### 사용자 회원가입 / 목록 조회 비즈니스 로직

```java
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserServiceImpl {   
    
    private final UserRepository userRepository;  
    
    private final BCryptPasswordEncoder passwordEncoder; 
    
    @Transactional   
    public User signUp(final SignUpDTO signUpDTO) {   
        final User user = User.builder()      
                .email(signUpDTO.getEmail())    
                .pw(passwordEncoder.encode(signUpDTO.getPw()))   
                .role(UserRole.ROLE_USER)          
                .build();     
        
        return userRepository.save(user);
    }  
    
    public boolean isEmailDuplicated(final String email) {  
        return userRepository.existsByEmail(email);  
    }  
    
    public List<User> findAll() {  
        return userRepository.findAll(); 
    } 

}
```

---

### 단위 테스트 작성 준비

```java
@ExtendWith(MockitoExtension.class)
class UserServiceTest {   
    
    @InjectMocks  
    private UserService userService; 
    
    @Mock  
    private UserRepository userRepository;
    
    @Spy 
    private BCryptPasswordEncoder passwordEncoder;
    
}
```

- #### @Spy

  - 실제로 사용자 비밀번호를 암호화해야 되기 때문에 @Spy로 실제 메소드로 동작하도록 한다.

---

### 1. 회원가입 성공 테스트

```java
@DisplayName("회원 가입")
@Test 
void signUp() { 
    // given
    final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    final SignUpDTO signUpDTO = signUpDTO();
    final String encryptedPw = encoder.encode(signUpDTO.getPw()); 
    
    // when
    doReturn(new User(signUpDTO.getEmail(), encryptedPw, UserRole.ROLE_USER)).when(userRepository).save(any(User.class));
    final User user = userService.signUp(signUpDTO); 
    
    // then
    assertThat(user.getEmail()).isEqualTo(signUpDTO.getEmail()); 
    assertThat(encoder.matches(signUpDTO.getPw(), user.getPw())).isTrue();
    
    // verify
    verify(userRepository, times(1)).save(any(User.class)); 
    verify(passwordEncoder, times(1)).encode(any(String.class));
}
```

- #### verify

  - Mock된 객체의 해당 메소드가 몇 번 호출되었는지 검증한다.
  - passwordEncoder의 encode 메소드와 userRepository의 save 메소드가 각각 1번씩만 호출되었는지 검증한다.

---

### 2. 이메일 중복 여부 테스트

```java
@DisplayName("이메일 중복 여부")
@Test 
void isEmailDuplicated() {  
    // given   
    final SignUpDTO signUpDTO = signUpDTO();  
    doReturn(true).when(userRepository).existsByEmail(signUpDTO.getEmail());  
    
    // when    
    final boolean isDuplicated = userService.isEmailDuplicated(signUpDTO.getEmail());  
    
    // then
    assertThat(isDuplicated).isTrue();
}
```

---

### 3. 사용자 목록 조회 테스트

```java
@DisplayName("사용자 목록 조회")
@Test 
void findAll() {   
    // given
    doReturn(userList()).when(userRepository).findAll();
    
    // when   
    final List<User> userList = userService.findAll();   
    
    // then  
    assertThat(userList.size()).isEqualTo(5); 
} 

private List<User> userList() { 
    final List<User> userList = new ArrayList<>();
    for (int i = 0; i < 5; i++) {
        userList.add(new User("test@test.test", "test", UserRole.ROLE_USER)); 
    } 
    
    return userList;
}
```