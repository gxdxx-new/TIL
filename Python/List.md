## **List**
---
### List 자료형
리스트의 마지막 요솟값 출력
```python
>>> a = [1, 2, 3]
>>> a[-1]
3
```

리스트 슬라이싱
```python
>>> a = [1, 2, 3, 4, 5]
>>> a[0:2]
[1, 2]

# 문자열 슬라이싱
>>> b = "12345"
>>> b[0:2]
'12'
```

리스트 반복하기
```python
>>> a = [1, 2, 3]
>>> a * 3
[1, 2, 3, 1, 2, 3, 1, 2, 3]
```

리스트 길이구하기
```python
>>> a = [1, 2, 3]
>>> len(a)
3
```

del 함수 사용해 리스트 요소 삭제하기
```python
>>> a = [1, 2, 3]
>>> del a[1]
>>> a
[1, 3]
```

리스트에 요소 추가
```python
>>> a = [1, 2, 3]
>>> a.append(4)
>>> a
[1, 2, 3, 4]
```

리스트 정렬
```python
>>> a = [1, 4, 3, 2]
>>> a.sort()
>>> a
[1, 2, 3, 4]
```

리스트 뒤집기
```python
>>> a = ['a', 'c', 'b']
>>> a.reverse()
>>> a
['b', 'c', 'a']
```

위치 반환(index)
```python
>>> a = [1,2,3]
>>> a.index(3)
2
>>> a.index(1)
0
```

리스트에 요소 삽입(insert)
- insert(a, b)는 a번째 위치에 b를 넣는다.
```python
>>> a = [1, 2, 3]
>>> a.insert(0, 4)
>>> a
[4, 1, 2, 3]
```

리스트 요소 제거(remove)
- remove(x)는 첫 번째로 나오는 x를 삭제한다.
```python
>>> a = [1, 2, 3, 1, 2, 3]
>>> a.remove(3)
>>> a
[1, 2, 1, 2, 3]
```

리스트 요소 꺼내기(pop)
- 맨 마지막 요소를 리턴하고 그 요소는 삭제한다.
```python
>>> a = [1,2,3]
>>> a.pop()
3
>>> a
[1, 2]
```

리스트에 포함된 요소 x의 개수 세기(count)
```python
>>> a = [1,2,3,1]
>>> a.count(1)
2
```

리스트 확장(extend)
- extend(x)에서 x에는 리스트만 올 수 있고 원래의 a 리스트에 x 리스트를 더하게 된다.
```python
>>> a = [1,2,3]
>>> a.extend([4,5])
>>> a
[1, 2, 3, 4, 5]
>>> b = [6, 7]
>>> a.extend(b)
>>> a
[1, 2, 3, 4, 5, 6, 7]
```

## **헷갈리는 것들**
---
append와 insert의 차이
- append는 마지막 위치에 넣는다.
- insert는 입력한 위치에 넣는다.

del과 remove의 차이
- del은 인자에 삭제할 인덱스를 넣는다.
- remove는 인자에 삭제할 값을 넣는다.

<mark>**sort와 sorted의 차이**</mark>
>| sort | sorted |
>|:---|:---|
>| list 데이터 타입에만 사용 가능 |  |
>| 원본 list 자체 값이 변경됨 | 원본 list 값이 변경되지 않음 |
>| return값은 None | return값은 sort된 새로운 리스트 |
```python
# sort
>>> data = [('kong', 7), ('don', 26), ('bae', 22)]
>>> data.sort(key = lambda data : data[1], reverse = True)
>>> print(data)
[('don', 26), ('bae', 22), ('kong', 7)]

# sorted
>>> data = [('kong', 7), ('don', 26), ('bae', 22)]
>>> sorted_data = sorted(data, key = lambda data : data[1], reverse = True)
>>> print(data)
[('kong', 7), ('don', 26), ('bae', 22)]
>>> print(sorted_data)
[('don', 26), ('bae', 22), ('kong', 7)]
```

<mark>**2차원 리스트 선언**</mark>
```python
>>> data = [[-1] * 5]
>>> print(data)
[[-1, -1, -1, -1, -1]]


>>> data = [[-1]] * 5
>>> print(data)
[[-1], [-1], [-1], [-1], [-1]]


>>> data = [[-1] for _ in range(5)]
>>> print(data)
[[-1], [-1], [-1], [-1], [-1]]


>>> data = [[-1] * 5 for _ in range(5)]
>>> print(data)
[[-1, -1, -1, -1, -1], [-1, -1, -1, -1, -1], [-1, -1, -1, -1, -1], [-1, -1, -1, -1, -1], [-1, -1, -1, -1, -1]]
```