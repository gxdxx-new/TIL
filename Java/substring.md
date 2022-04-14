## String.substring()

- #### 문자열을 자를 때 사용하는 메소드이다.
- #### 인자로 전달된 index를 기준으로 문자열을 자르고 String을 리턴한다.

```java
public String substring(int beginIndex)
public String substring(int beginIndex, int endIndex)
```

- 인자로 beginIndex만 전달하면 이 **beginIndex가 포함된 문자부터 마지막까지** 잘라서 리턴한다.
- 인자로 beginIndex, endIndex를 모두 전달하면 **beginIndex을 포함한 문자부터 endIndex 이전 문자까지** 잘라서 리턴한다.

---

### substring() 사용법

#### beginIndex, endIndex를 사용해 문자열을 자르는 예제

```java
String str = "Hi guys. This is split example";
String result = str.substring(17);
String result2 = str.substring(17, 22);

System.out.println(result);
System.out.println(result2);
```

```
split example
split
```

- beginIndex로 17을, endIndex로 22를 전달하면, index 17을 포함하고 22를 포함하지 않는 문자열을 리턴한다.

---

#### indexOf()로 어떤 문자의 index를 찾고 그 index로 substring()에 전달하는 예제

```java
String str = "This island is beautiful";
int beginIndex = str.indexOf("is");
int endIndex = str.length();
String result = str.substring(beginIndex, endIndex);

System.out.println(result);
```

```java
is island is beautiful
```

- indexOf()는 인자로 전달된 문자열의 index를 리턴한다.
- 왼쪽에서 오른쪽 순서로 탐색해 가장 첫번째로 발견한 문자열의 index를 리턴한다.

---

#### lastIndexOf()와 substring()을 사용해 문자열을 자르는 에제

```java
String str = "This island is beautiful";
int beginIndex = str.lastIndexOf("is");
int endIndex = str.length();
String result = str.substring(beginIndex, endIndex);

System.out.println(result);
```

```
is beautiful
```

- 오른쪽에서부터 탐색하려면 lastIndexOf()를 사용하면 된다.