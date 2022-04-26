## @NotNull, @NotEmpty, @NotBlank 사용법 및 차이점

- #### API에 따라서 같은 값이여도 필수인 경우가 있고, 아닌 경우가 있다.
- #### 따라서, 해당 API의 파라미터에 따라 별도의 오류 메시지와 조건이 필요하다.
- #### 이 때 @NotNull, @NotEmpty, @NotBlank를 사용하면 쉽게 처리할 수 있다.
- #### 이 세가지 Annotation은 Bean Validation (Hibernate Validation)에서 제공하는 표준 Validation이다.

---

### Bean Validaiton 사용법

```java
public class UserLoginRequestDto {
    
    @NotNull(message = "이름은 Null 일 수 없습니다!")
    @Size(min = 1, max = 10, message = "이름은 1 ~ 10자 이여야 합니다!") 
    private String name;

    @NotNull(message = "이름은 Null 일 수 없습니다!")
    @Min(1)
    @Max(10)
    @Email
    private String email;
    
}
```

- @NotNull은 이름 그래도 Null만 허용하지 않는다. ""이나 " "은 허용한다.
- @Size는 최소, 최대 사이즈를 지정할 수 있고, 형식에 맞지 않는 경우 메시지를 담아 예외를 던질 수 있다.
- @Min, @Max는 @Size에서 min, max를 의미한다.
- @Email은 이메일 형식이 아닌 경우 예외를 던진다.

---

### DTO를 쓰는 이유

- 도메인에 어떤 값이 모든 요청 및 응답에 필요하지 않음에도 불필요하게 사용되는 것을 막아준다.
- 각각의 DTO에 필요한 데이터만 정의하고, 필수 값에 대한 조건 체크나 DTO에서 도메인으로 변환하거나, 도메인에서 DTO로 변환하는 로직은 DTO에 담아야 한다.
- 그렇게 되면 @NotNull과 같은 Validation도 DTO의 역할이 되기 때문에 DTO와 도메인의 역할과 책임이 좀 더 명확해진다.

---

### Controller 설정

```java
@PostMapping("/login")
public ResponseEntity login(@Valid @RequestBody UserLoginRequestDto loginUser) {    
    UserLoginResponseDto login = userService.login(loginUser);
    return new ResponseEntity<>(new BaseResult.Normal(login), HttpStatus.OK);
}
```

- DTO에서 Validation을 설정 후 사용하고자 하는 Controller 내 API에서 RequestBody에 @Valid를 추가해주면 설정된 Bean Validation을 사용할 수 있다.

---

### 예외 처리 방법

- 다음은 @ControllerAdvice 내 @ExceptionHandler에서 Bean Validation에 대한 오류가 발생하였을 경우(name 에 null 이 들어온 경우) 처리하기 위한 로직이다.

```java
@ExceptionHandler(MethodArgumentNotValidException.class)
public Object handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
    String errorMessage = e.getBindingResult()
    .getAllErrors()
    .get(0)
    .getDefaultMessage();

    printExceptionMessage(errorMessage);
    return new ResponseEntity<>(new BaseResult.Normal(INVALID_PARAMETER), HttpStatus.BAD_REQUEST);
}
 
```

- 만약, name에 null이 들어오면 MethodArgumentNotValidException의 예외가 던져진다.
- 따라서, 해당 예외를 ExceptionHandler에서 예외를 잡은 후,
- e.getBindingResult().getAllErrors().get(0).getDefaultMessage(); 와 같이 해당 DTO에서 선언한 message의 내용을 가져올 수있다.

---

## @NotNull, @NotEmpty, @NotBlank 차이점

### @NotNull

- #### Null만 허용하지 않는다.
- #### "" (초기화된 String) 이나 " " (공백)은 허용하게 된다.

```java
@Test
public void 사용자_이름_DTO_NotNull_체크() {
    //given
    UserLoginRequestDto user = UserLoginRequestDto.builder()
                                        .name(null)
                                        .email("")
                                        .phone(" ")
                                        .build();
    //when
    Set<ConstraintViolation<UserLoginRequestDto>> violations = validator.validate(user);

    //then
    assertThat(violations.size()).isEqualTo(1);
}
```

- name, email, phone에 모두 @NotNull이 걸려있을 경우,
- name은 null이 들어왔기 때문에 violations에 검증이 되어 잘못된 값이라 판단하여 추가가 된다.
- email은 빈 문자열, phone은 공백이기 때문에 violations에 추가되지 않는다.

---

### @NotEmpty

- #### Null, "" 을 허용하지 않는다.
- #### " " (공백)은 허용한다.

```java
@Test
public void 사용자_이름_DTO_NotNull_체크() {
    //given
    UserLoginRequestDto user = UserLoginRequestDto.builder()
                                    .name(null)
                                    .email("")
                                    .phone(" ")
                                    .build();
    //when
    Set<ConstraintViolation<UserLoginRequestDto>> violations = validator.validate(user);

    //then
    assertThat(violations.size()).isEqualTo(2);
}
```

- name, email, phone에 모두 @NotEmpty이 걸려있을 경우,
- name과 email은 violations에 검증이 되어 잘못된 값이라 판단하여 추가가 된다.
- phone은 " " (공백)이기 때문에 violations에 추가되지 않는다.

---

### @NotBlank

- #### Null, "", " " 모두 허용하지 않는다.

```java
@Test
public void 사용자_이름_DTO_NotNull_체크() {
     //given
     UserLoginRequestDto user = UserLoginRequestDto.builder()
                                     .name(null)
                                     .email("")
                                     .phone(" ")
                                     .build();
     //when
     Set<ConstraintViolation<UserLoginRequestDto>> violations = validator.validate(user);
      
     //then
     assertThat(violations.size()).isEqualTo(3);
}
```

- name, email, phone에 모두 @NotBlank가 걸려있을 경우,
- 모두 violations에 검증이 되어 잘못된 값이라 판단해 추가가 된다.