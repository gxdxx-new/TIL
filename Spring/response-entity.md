## ResponseEntity 타입

- #### @RestController는 별도의 뷰를 제공하지 않는 형태로 서비스를 실행한다.
- #### 따라서 리턴 데이터가 예외적인 상황에서 문제가 발생할 수 있다.
- #### 웹의 경우 HTTP 상태코드가 이러한 정보를 나타내는 데 사용된다.
- #### 스프링에서 제공하는 ResponseEntity 타입은 개발자가 직접 결과 <mark>데이터와 HTTP 상태코드를 제어할 수 있는 클래스</mark>이다.
- #### ResponseEntity를 사용하면 404나 500 같은 에러를, 전송하고 싶은 데이터와 함께 전송할 수 있다.

---

### ResponseEntity 예제

#### HTTP 상태코드만 보내기

```java
@RequestMapping("/sendErrorAuth")
public ResponseEntity<Void> sendListAuth() {
    return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
}
```

- 해당 URI를 요청하면 리턴타입으로 선언된 ResponseEntity는 결과 데이터로 HTTP 상태코드(400)를 헤더 메시지로 보낸다.

#### 결과 데이터와 HTTP 상태코드 같이 보내기

```java
@RequestMapping("/sendErrorNot")
public ResponseEntity<List<SampleVO>> sendListNot() {

    List<SampleVO> samples = new ArrayList<>();
    for (int i = 0; i < 10; i++) {
        SampleVO sample = new SampleVO();
        sample.setSampleNo(i);
        sample.setFirstName("얄라차");
        sample.setLastName("개발자" + i);
        samples.add(sample);
    }

    return new ResponseEntity<>(samples, HttpStatus.NOT_FOUND);
}
```

- 해당 URI를 요청하면 리턴타입에 list 데이터와 HTTP 상태코드(404)를 전송한다.
- 화면에 전송한 결과를 보여주면서, 상태코드도 함께 전달된다.