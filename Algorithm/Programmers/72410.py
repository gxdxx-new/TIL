def solution(new_id):
    
    #1
    step1 = new_id.lower()
    
    #2
    step2 = ''
    possibleLetters = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','0','1','2','3','4','5','6','7','8','9','-','_','.']
    for i in range(len(new_id)):
        for j in range(len(possibleLetters)):
            if(step1[i] == possibleLetters[j]):
                step2 += step1[i]
                break
    
    #3
    step3 = step2
    while '..' in step3:
        step3 = step3.replace('..', '.')
    
    #4
    step4 = step3
    if(step4[0] == '.'):
        step4 = step4.replace('.', '', 1)
    if(step4 != ''):
        if(step4[-1] == '.'):
            step4 = step4[:-1]
    #5
    step5 = step4
    if(step5 == ''):
        step5 = 'a'
    #6
    step6 = step5
    if(len(step6) >= 16):
        step6 = step6[:15]
    if(step6[-1] == '.'):
        step6 = step6[:-1]

    #7
    step7 = step6
    while(len(step7) <= 2):
        step7 = step7 + step7[-1]
                
    answer = step7
    return answer