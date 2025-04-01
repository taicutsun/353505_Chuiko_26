"""
Task 2: Sum Every Second Integer
Lab: 1
Title: Sum Every Second Integer
Version: 1.0
Developer: Chuiko Rygor
Date: 2025-03-05
"""

def sum_every_second_integer():
    """Sum every second integer entered by the user until the number 1 is entered."""
    total_sum = 0
    count = 0
    while True:
        try:
            num = int(input("Enter an integer (1 to stop): "))
            if num == 1:
                break
            if count % 2 == 1:
                total_sum += num
            count += 1
        except ValueError:
            print("Invalid input. Please enter an integer.")
    return total_sum

def task2_main():
    """Main function for Task 2: handles input and displays the result."""
    print("Enter integers. Enter 1 to stop.")
    total_sum = sum_every_second_integer()
    print(f"The sum of every second integer entered is: {total_sum}")
