expression = "3*(2+1)"
def cal(str):
    try:
        print
    except:
        print

def split(expr):
    stack = []
    current = ""
    for char in expr:
        if char == '(':
            stack.append(current)
            current = char
        elif char == ')':
            current += char
    return current
