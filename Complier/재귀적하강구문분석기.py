def getNextSymbol():
  symbol = sentence[0]
  sentence.append(symbol)
  del sentence[0]
  return symbol

def getSymbol():
  symbol = sentence[-1]
  return symbol

def PS(symbol):
  print(symbol, 'PS')
  if(symbol == 'a'):
    pa(getSymbol())
    PA(getSymbol())
    pb(getSymbol())

def PA(symbol):
  print(symbol, 'PA')
  if(symbol == 'a'):
      pa(getSymbol())
      PS(getSymbol())
  elif(symbol == 'b'):
      pb(getSymbol())

def pa(symbol):
  print(symbol, 'pa')
  if(symbol == 'a'):
    getNextSymbol()

def pb(symbol):
  print(symbol, 'pa')
  if(symbol == 'b'):
    getNextSymbol()

sentence = list(input())

PS(getNextSymbol())

if(getSymbol() == '$'):
  print('accept')
else:
  print('error')