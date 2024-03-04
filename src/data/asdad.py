import string

valid_chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"


def next_id(cur_id):
    if len(cur_id) == 0:
        return "0"
    if cur_id[-1] == "Z":
        return next_id(cur_id[:-1]) + "0"
    return cur_id[:-1] + valid_chars[valid_chars.index(cur_id[-1]) + 1]


mystring = "1+1=5;2+2=6;3+3=7;4+4=8;1+2=9;1+3=a;1+4=b;2+3=c;2+4=d;3+4=e;"

def calc(mystring):
    biggest = "3"
    stringlen = 0
    if mystring != "":
        mystring = mystring.split(";")
        stringlen = len(mystring)-1
        mystring = [i.split("=") for i in mystring]
        for i in mystring:
            try:
                cur_id = i[1]
                # if cur_id is later than biggest, calculate the next id
                if len(cur_id) > len(biggest):
                    biggest = cur_id
                elif len(cur_id) == len(biggest):
                    for j in range(len(cur_id)):
                        if valid_chars.index(cur_id[j]) > valid_chars.index(biggest[j]):
                            biggest = cur_id
                            break
                        elif valid_chars.index(cur_id[j]) < valid_chars.index(biggest[j]):
                            break

            except:
                pass
    # get id to integer
    idint = 0

    for i in range(len(biggest)):
        j = len(biggest) - i - 1
        idint += ((valid_chars.index(biggest[j])+1) * (len(valid_chars) ** i))
    
    idint -= 1
    idint = ((idint * (idint-1))/2) + idint

    return f"next: {idint}\nwithout old: {idint - stringlen}"


calc(mystring)


