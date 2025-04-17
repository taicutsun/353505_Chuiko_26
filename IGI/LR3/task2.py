"""
Task 2: Calculate average of even numbers
Lab: 1
Title: Even Numbers Average Calculator
Version: 1.0
Developer: [Your Name]
Date: [Current Date]
"""

def calculate_even_average():
    """
    Calculate the average of even numbers entered by the user.
    The loop ends when the number 1 is entered.
    """
    even_sum = 0
    even_count = 0
    
    while True:
        try:
            num = int(input("Enter an integer (1 to stop): "))
            
            if num == 1:
                break
                
            if num % 2 == 0:  # Check if number is even
                even_sum += num
                even_count += 1
                
        except ValueError:
            print("Invalid input. Please enter an integer.")
    
    # Calculate average if there were even numbers, otherwise return 0
    return even_sum / even_count if even_count > 0 else 0

def task2_main():
    """Main function for Task 26: handles input and displays the result."""
    print("Enter integers. The program will calculate the average of even numbers.")
    print("Enter 1 to stop.")
    
    average = calculate_even_average()
    
    if average == 0:
        print("No even numbers were entered.")
    else:
        print(f"The average of even numbers entered is: {average:.2f}")

if __name__ == "__main__":
    task2_main()