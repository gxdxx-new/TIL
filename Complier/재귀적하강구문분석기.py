def getNextSymbol():           # 다음 symbol을 찾는 함수
  sentence.append(sentence[0]) # symbol을 입력문자열 뒤에 추가
  del sentence[0]              # symbol을 입력문자열 앞에서 삭제
  return getSymbol()           # symbol 리턴

def getSymbol():               # symbol을 리턴하는 함수
  return sentence[-1]          # getNextSymbol() 함수에서 뒤에 추가했던 symbol을 리턴

def errorSymbol():             # error symbol
  sentence.append(-1)          # 입력문자열 뒤에 -1을 추가해 ab$ 같은 문장을 에러 처리

def PS(symbol):                # 논터미널 기호 S에 대한 함수
  if(symbol == 'a'):           # symbol이 a이면
    pa(getSymbol())            # pa 함수 호출
    PA(getSymbol())            # PA 함수 호출
    pb(getSymbol())            # pb 함수 호출
  else:                        # symbol이 a가 아니면
    errorSymbol()              # 다음 symbol을 -1로

def PA(symbol):                # 논터미널 기호 A에 대한 함수
  if(symbol == 'a'):           # symbol이 a이면
      pa(getSymbol())          # pa 함수 호출
      PS(getSymbol())          # PS 함수 호출
  elif(symbol == 'b'):         # symbol이 b이면
      pb(getSymbol())          # pb 함수 호출
  else:                        # symbol이 a, b 둘다 아니면
    errorSymbol()              # 다음 symbol을 -1로

def pa(symbol):                # 터미널 기호 a에 대한 함수
  if(symbol == 'a'):           # symbol이 a이면
    getNextSymbol()            # 다음 symbol 찾기
  else:                        # symbol이 a가 아니면
    errorSymbol()              # 다음 symbol을 -1로

def pb(symbol):                # 터미널 기호 b에 대한 함수
  if(symbol == 'b'):           # symbol이 b이면
    getNextSymbol()            # 다음 symbol 찾기
  else:                        # symbol이 b가 아니면
    errorSymbol()              # 다음 symbol을 -1로

sentence = list(input('Input String: '))  # 문장 입력받기

PS(getNextSymbol())            # 다음 symbol을 PS 함수에 파라미터로 넣고 함수 실행

if(getSymbol() == '$'):        # symbol이 $이면
  print('Accept!')             # Accept!
else:                          # symbol이 $가 아니면
  print('Not Accept!')         # Not Accept!