## HashMap

- #### Map 인터페이스를 구현한 Map 컬렉션이다.
- #### 키와 값으로 구성된 Entry 객체를 저장하는 구조를 가진 자료구조이다.
  - 키와 값으로 구성되는 데이터를 매핑(mapping) 또는 엔트리(entry)라 한다. 
  - 여기서 키와 값은 모두 객체이다.
- #### 값은 중복 저장될 수 있지만 키는 중복 저장될 수 없다.
- #### 기존에 저장된 키와 동일한 키로 값을 저장하면 기존의 값은 없어지고 새로운 값으로 대치된다.
- #### 해싱(hashing)을 사용하기 때문에 많은 양의 데이터를 검색하는 데 성능이 뛰어나다.

<img src="https://user-images.githubusercontent.com/35963403/160379971-109abe91-d990-47d4-981e-d8d908c94df6.PNG" width="700">

- 해시 함수를 통해 키와 값이 저장되는 위치를 결정하므로, 사용자는 그 위치를 알 수 없고 삽입되는 순서와 들어있는 위치 또한 알 수 없다.

### HashMap 사용법

#### HashMap 선언

```java
HashMap<String,String> map1 = new HashMap<String,String>(); // HashMap생성
HashMap<String,String> map2 = new HashMap<>();  // new에서 타입 파라미터 생략가능
HashMap<String,String> map3 = new HashMap<>(map1);  // map1의 모든 값을 가진 HashMap생성
HashMap<String,String> map4 = new HashMap<>(10);    // 초기 용량(capacity)지정
HashMap<String,String> map5 = new HashMap<>(10, 0.7f);  // 초기 capacity,load factor지정
HashMap<String,String> map6 = new HashMap<String,String>() {{    // 초기값 지정
    put("a","b");
}};
```

- 키타입과 값타입을 파라미터로 주고 기본생성자를 호출하면 된다.
- 저장공간을 넘어서면 List처럼 저장공간을 추가로 늘리지만 List처럼 한 칸씩 늘리는게 아니라 약 2배로 늘리기 때문에 과부하가 발생할 수 있다.
- 그렇기 때문에 초기에 저장할 데이터의 개수를 알고 있으면 초기 용량을 지정해주는게 좋다.

#### HashMap 값 추가

```java
HashMap<Integer,String> map = new HashMap<>();  // new에서 타입 파라미터 생략가능
map.put(1,"사과"); //값 추가
map.put(2,"바나나");
map.put(3,"포도");
```

- put(key, value) 메소드를 사용하면 된다.
- 같은 키값이 HashMap 내부에 존재하면 기존의 값은 새로 입력되는 값으로 바뀐다.

#### HashMap 값 삭제

```java
HashMap<Integer,String> map = new HashMap<Integer,String>(){{   // 초기값 지정
    put(1,"사과");
    put(2,"바나나");
    put(3,"포도");
}};
map.remove(1); // key값 1 제거
map.clear(); // 모든 값 제거
```

- remove(key) 메소드를 사용하면 키값으로 Map의 요소를 삭제할 수 있다.
- 모든 값을 제거할 때는 clear() 메소드를 사용한다.

#### HashMap 값 출력

```java
HashMap<Integer,String> map = new HashMap<Integer,String>(){{   // 초기값 지정
    put(1,"사과");
    put(2,"바나나");
    put(3,"포도");
}};
		
System.out.println(map); // 전체 출력 : {1=사과, 2=바나나, 3=포도}
System.out.println(map.get(1)); // key값 1의 value얻기 : 사과
		
// entrySet() 활용
for (Entry<Integer, String> entry : map.entrySet()) {
    System.out.println("[Key]:" + entry.getKey() + " [Value]:" + entry.getValue());
}
// [Key]:1 [Value]:사과
// [Key]:2 [Value]:바나나
// [Key]:3 [Value]:포도

// KeySet() 활용
for(Integer i : map.keySet()){ // 저장된 key값 확인
    System.out.println("[Key]:" + i + " [Value]:" + map.get(i));
}
// [Key]:1 [Value]:사과
// [Key]:2 [Value]:바나나
// [Key]:3 [Value]:포도
```

- 특정 키의 값을 가져오려면 get(key) 메소드를 사용하면 된다.
- entrySet()은 키와 값 모두 필요할 경우 사용한다.
- keySet()은 키만 필요할 경우 사용한다.
- keySet()으로 키만 받아서 get(key)로 값을 찾을 수도 있지만, 이 과정에서 시간이 걸려서 데이터가 많을 경우 성능 저하가 발생할 수 있다.

#### Iterator 사용

```java
HashMap<Integer,String> map = new HashMap<Integer,String>(){{   // 초기값 지정
    put(1,"사과");
    put(2,"바나나");
    put(3,"포도");
}};
		
// entrySet().iterator()
Iterator<Entry<Integer, String>> entries = map.entrySet().iterator();
while(entries.hasNext()){
    Map.Entry<Integer, String> entry = entries.next();
    System.out.println("[Key]:" + entry.getKey() + " [Value]:" +  entry.getValue());
}
// [Key]:1 [Value]:사과
// [Key]:2 [Value]:바나나
// [Key]:3 [Value]:포도
		
// keySet().iterator()
Iterator<Integer> keys = map.keySet().iterator();
while(keys.hasNext()){
    int key = keys.next();
    System.out.println("[Key]:" + key + " [Value]:" +  map.get(key));
}
// [Key]:1 [Value]:사과
// [Key]:2 [Value]:바나나
// [Key]:3 [Value]:포도
```

- Iterator을 사용해 Map 안의 전체 요소를 출력할 수도 있다.