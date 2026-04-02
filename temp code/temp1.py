import math
expression = "(5+2)*3*sqrt(2)"
def cal(str):
    try:
        result = eval(str)
        return result
    except:
        return "Erreur : expression invalide"
print(cal(expression))