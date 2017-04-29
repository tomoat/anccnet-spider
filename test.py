matrix = [
     [1, 2, 3, 4],
     [5, 6, 7, 8],
     [9, 10, 11, 12],
 ]

transposed = []
for i in range(4):
    print("i", i)
    t_list = []
    for row in matrix:
        print("row", row)
        t_list.append(row[i])
        print("t_list**********", t_list)
        transposed.append(t_list)
        # transposed.append(list(t_list))

        print("transposed//////////////", transposed)

# $$$$$$$$$$$4
transposed = []
for i in range(4):
    t_list = []
    for row in matrix:
        t_list.append(row[i])

    transposed.append(t_list)

# Transpose has been implemented in numpy and it works with python arrays:

import numpy as np
np.transpose(matrix)
# $$$$$$$$$$$$$$

transposed = []
for i in range(4):
print("i", i)
t_list = []
for row in matrix:
    print("row", row)
    t_list.append(row[i])
    print("t_list**********", t_list)
    transposed.append(t_list[::])

    print("transposed//////////////", transposed)

