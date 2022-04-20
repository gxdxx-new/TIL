## jqXHR (ajax 에러 처리)

- 게시글을 삭제할 때 ajax로 처리하는 도중에,
- ajax에서 에러가 발생했을 경우 응답으로부터 전달받은 에러 메시지를 alert() 하려했는데 실행되지 않는다.
- 아래처럼 jqXHR.responseJSON.message를 출력하려 했지만 되지 않았다.

```
error : function(jqXHR, status, error){

    if(jqXHR.status == '401'){
        alert('로그인 후 이용해주세요');
        location.href='/members/login';
    } else{
        alert(jqXHR.responseJSON.message);
    }

}
```

- 아래처럼 jqXHR.responseText를 출력하니 작동이 잘 되었다.

```
error : function(jqXHR, status, error){

    if(jqXHR.status == '401'){
        alert('로그인 후 이용해주세요');
        location.href='/members/login';
    } else{
        alert(jqXHR.responseText);
    }

}
```