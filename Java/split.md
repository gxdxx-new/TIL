## String.split()

- #### 특정 문자를 기준으로 문자열을 잘라서 배열에 넣어주는 메소드이다.

```java
public String[] split(String regex)
public String[] split(String regex, int limit)
```

- 인자 regex는 정규표현식(regex)으로 문자열 패턴을 받고, 그 패턴과 일치하는 문자열을 기준으로 잘라준다.
- 인자 limit는 문자열을 나눌 최대 개수이다. 인자로 2를 전달하면 리턴되는 배열의 길이가 2 이하가 된다.

<img src="https://user-images.githubusercontent.com/35963403/163364287-ca7b1ba7-7681-4235-88b5-8d1afe45d4ad.PNG" width="400">

- 위 그림과 같이 split() 함수는 String값을 특정 문자를 기준으로 끊어서 배열에 저장시켜 준다.

---

### split() 사용법

#### 공백, limit의 개수만큼 문자열 자르는 예제

```java
String str = "Hi guys This is split example";

String[] result = str.split(" ");
String[] result2 = str.split(" ", 2);
String[] result3 = str.split(" ", 3);

System.out.println(Arrays.toString(result));
System.out.println(Arrays.toString(result2));
System.out.println(Arrays.toString(result3));
```

```
[Hi, guys, This, is, split, example]    // result
[Hi, guys This is split example]        // result2
[Hi, guys, This is split example]       // result3
```

---

#### 개행 문자 \n로 문자열 자르는 예제

```java
String str = "Hi guys\n" +
        "This is split example\n" +
        "I'll show you how to use split method";
String[] result = str.split("\n");

System.out.println(Arrays.toString(result));
```

```
[Hi guys, This is split example, I'll show you how to use split method]
```

---

#### 정규표현식(regex)과 split으로 문자열 자르는 예제

```java
String str = "This island is beautiful";
String[] result = str.split("is");
String[] result2 = str.split("\\bis\\b");

System.out.println(Arrays.toString(result));
System.out.println(Arrays.toString(result2));
```

```
[Th,  , land ,  beautiful]
[This island ,  beautiful]
```