"""
Developer: Grisha Chuiko
Lab: 4
Task: NumPy Array Operations
Version: 1.0
Date: 2025-01-05
"""

import numpy as np

# 1. Create an integer matrix A[n, m]
n = 4  # rows
m = 5  # columns
A = np.random.randint(0, 100, size=(n, m))
print("Original matrix:\n", A)

# 2. Functions for creating arrays
zeros_array = np.zeros((2, 3))  # Array of zeros
ones_array = np.ones((3, 2))    # Array of ones
diag_array = np.eye(3)          # Identity matrix 3x3
print("\nArray of zeros:\n", zeros_array)
print("Array of ones:\n", ones_array)
print("Identity matrix:\n", diag_array)

# 3. Indexing and slicing
first_row = A[0]               # First row
last_col = A[:, -1]            # Last column
sub_matrix = A[1:3, 1:4]       # Submatrix
print("\nFirst row:", first_row)
print("Last column:", last_col)
print("Submatrix:\n", sub_matrix)

# 4. Element-wise operations
A_squared = A ** 2             # Square of each element
A_plus_10 = A + 10             # Increase by 10
print("\nMatrix squared:\n", A_squared)
print("Matrix +10:\n", A_plus_10)

# 5. Statistical operations
mean_val = np.mean(A)          # Arithmetic mean
median_val = np.median(A)      # Median
corr_matrix = np.corrcoef(A)   # Correlation matrix
variance = np.var(A)           # Variance
std_dev = np.std(A)            # Standard deviation

print("\nMean value:", mean_val)
print("Median:", median_val)
print("Correlation matrix:\n", corr_matrix)
print("Variance:", variance)
print("Standard deviation:", std_dev)

# 6. Elements exceeding the mean
above_mean = A[A > mean_val]
count_above_mean = len(above_mean)
print("\nNumber of elements above the mean:", count_above_mean)

# 7. Standard deviation calculated in two ways
# Method 1: Built-in function
std_method1 = np.std(above_mean)

# Method 2: Manual calculation
mean_above = np.mean(above_mean)
squared_diff = (above_mean - mean_above) ** 2
std_method2 = np.sqrt(np.mean(squared_diff))

# Rounding
std_method1_rounded = round(std_method1, 2)
std_method2_rounded = round(std_method2, 2)

print("\nStandard deviation (method 1):", std_method1_rounded)
print("Standard deviation (method 2):", std_method2_rounded)

# 8. Elements with absolute value greater than B
B = float(input("\nEnter number B: "))
C = A[np.abs(A) > B]  # Array C

print("\nArray C (elements with |x| > B):", C)
print("Number of such elements:", len(C))

# 9. Median of array C

# Method 1: Standard function
median_std = np.median(C)

# Method 2: Manual calculation via sorting
C_sorted = np.sort(C)
n_C = len(C)
if n_C % 2 == 1:
    median_manual = C_sorted[n_C // 2]
else:
    median_manual = (C_sorted[n_C // 2 - 1] + C_sorted[n_C // 2]) / 2

# Output
print("\nMedian (standard function):", median_std)
print("Median (manual calculation):", median_manual)