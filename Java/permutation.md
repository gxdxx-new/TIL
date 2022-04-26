## 순열과 조합

### 순열

- 순열은 n개의 값 중에서 r개의 숫자를 뽑는 경우이다.
- 조합과 다르게 뽑은 숫자들끼리의 순서가 중요하다.
- ex) x, y, z 에서 2개를 뽑는 법
  - xy, xz, yx, yz, zx, zy

```java
public int solution(String numbers) {

        char[] arr = numbers.toCharArray();
        char[] output = new char[arr.length];
        boolean[] visited = new boolean[arr.length];

        for (int i = 0; i < arr.length; i++) {
            perm(arr, output, visited, 0, arr.length, i + 1);
        }
        
}

public void perm(char[] numbers, char[] output, boolean[] visited, int depth, int n, int r) {
        
        if (depth == r) {
            print(output, r);
            return;
        }
 
        for (int i = 0; i < n; i++) {
            if (!visited[i]) {
                visited[i] = true;
                output[depth] = numbers[i];
                perm(numbers, output, visited, depth + 1, n, r);       
                visited[i] = false;
            }
        }
        
    }
    
    public void print(char[] arr, int r) {
        String x = "";
        for (int i = 0; i < r; i++) {
            x += arr[i];
        }
        hashSet.add(Integer.parseInt(x));
    }
```

- depth가 0, 1, 2, ... 올라가면서 depth만큼의 숫자를 뽑아낸다.
- 해당 dfs에서 이미 뽑은 수를 다시 뽑으면 안되므로 visited 배열을 이용한다.
- 아직 안뽑은 수를 뽑아서 true로 만들고 해당 dfs가 끝날 때 다른 순열에서 다시 쓸 수 있도록 false로 만든다.

<img src="https://user-images.githubusercontent.com/35963403/165243381-792b9459-f2c8-415e-8d03-d8ead59f19ad.PNG" width="700">

### 조합

- 순열과 다르게 뽑은 숫자들끼리의 순서는 필요하지 않다.
- ex) x, y, z 에서 2개를 뽑는 법
  - xy, xz, yz

```java
public void Combination(int[] arr, int index, int n, int k, int t, int[] newcomb) {
        if(k == 0) {
            for(int i=0; i<newcomb.length; i++){
                System.out.print(newcomb[i] + " ");
            }
            System.out.println("\n");
            return;
        } 
        
        if(t == n) return;
        
        newcomb[index] = arr[t];
        Combination(arr,index+1, n, k-1,t+1, newcomb);	//선택했을 때
        Combination(arr,index,   n, k,  t+1, newcomb);	//선택 안했을 때
    }
```

<img src="https://user-images.githubusercontent.com/35963403/165243388-7d7a467a-27ff-483e-83ac-fc44cd47a81b.PNG" width="700">