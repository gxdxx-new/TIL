def solution(answers):
    answer = []
    answerA = 0
    answerB = 0
    answerC = 0
    a = [1, 2, 3, 4, 5]
    b = [2, 1, 2, 3, 2, 4, 2, 5]
    c = [3, 3, 1, 1, 2, 2, 4, 4, 5, 5]
    
    for i in range(len(answers)):
        if(answers[i] == a[i % 5]):
            answerA += 1
        if(answers[i] == b[i % 8]):
            answerB += 1     
        if(answers[i] == c[i % 10]):
            answerC += 1
    
    maxAnswer = max(answerA, answerB, answerC)
    if(answerA == maxAnswer):
        answer.append(1)
    if(answerB == maxAnswer):
        answer.append(2)
    if(answerC == maxAnswer):
        answer.append(3)
    
    return answer

answers = [1, 3, 2, 4, 2]
solution(answers)