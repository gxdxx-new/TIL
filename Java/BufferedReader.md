## BufferedReader, BufferedWriter (빠른 입출력)

- #### 입력된 데이터가 바로 전달되지 않고 중간에 버퍼링이 된 후에 전달된다.
- #### 출력도 중간에 버퍼를 거쳐서 간접적으로 출력 장치로 전달된다.
- #### InputStreamReader / OutputStreamReader와 같이 사용해 버퍼링을 하면
- #### 입출력 스트림으로부터 미리 버퍼에 데이터를 갖다 놓기 때문에 보다 효율적인 입출력이 가능하다.

---

## BufferedReader

### BufferedReader vs Scanner

- Scanner를 통해 입력 받으면 Space, Enter를 모두 경계로 인식하기 때문에 데이터를 가공하기 편리하다.
- BufferReader를 통해 입력 받으면 **Enter만 경계로 인식**하고
- **받은 데이터가 String으로 고정**되기 때문에 입력 받은 데이터를 가공하는 작업이 Scanner보다 많다.
- 많은 양의 데이터를 입력받는 경우 BufferReader를 통해 입력 받으면 **입력 시 Buffer를 활용해 훨씬 효율적**이다.

---

### BufferReader 사용법

```java
BufferedReader br = new BufferedReader(new InputStreamReader(System.in)); // 선언
String s = br.readLine(); // String
int i = Integer.parseInt(br.readLine()); // Int
```

- readLine() 메서드를 사용하면 입력 받을 수 있다.
- readLine() 시 리턴값이 String으로 고정되기 때문에 String이 아닌 다른 타입으로 입력 받으려면 **형변환**을 해주어야 한다.
- 예외처리를 꼭 해주어야 한다.
- try & catch 보다는 **throws IOException**을 적용한다.

---

### Read한 데이터 가공

```java
StringTokenizer st = new StringTokenizer(s); // StringTokenizer인자값에 입력 문자열 넣음
int a = Integer.parseInt(st.nextToken()); // 첫번째 호출
int b = Integer.parseInt(st.nextToken()); // 두번째 호출

String array[] = s.split(" "); // 공백마다 데이터 끊어서 배열에 넣음
```

- Read한 데이터는 Line 단위로만 나눠지기 때문에 공백 단위로 데이터를 가공하려면 추가 작업을 해주어야 한다.
- **StringTokenizer에 nextToken() 메서드를 사용하면 readLine()을 통해 입력받은 값을 공백 단위로 구분해 순서대로 호출**할 수 있다.
- String.split() 메서드를 사용해 배열에 공백 단위로 끊어서 데이터를 넣고 사용할 수도 있다.

---

## BufferedWriter

### BufferedWriter 사용법

```java
BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(System.out)); // 선언
String s = "abcdefg";   // 출력할 문자열
bw.write(s);    // 출력
bw.newLine();   // 줄바꿈
bw.flush(); // 남아있는 데이터를 모두 출력시킴
bw.close(); // 스트림을 닫음
```

- 버퍼를 사용하기 때문에 반드시 flush(), close()를 호출해야 한다.
- write() 메서드에는 자동 개행 기능이 없기 때문에 줄바꿈을 따로 처리해줘야 한다.