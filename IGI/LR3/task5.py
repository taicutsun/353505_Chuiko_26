"""
Task 5: Process List of Integers
Lab: 1
Title: List Processor
Version: 1.0
Developer: Chuiko Rygor
Date: 2025-03-05
"""
from initialization import input_list_user, generate_list_random
from utils import get_valid_input

def display_list(lst: list):
    """Display the list elements."""
    print("List elements:", lst)

def compute_min_and_sum(lst: list) -> tuple[int, int]:
    """
    Find the minimum absolute value element and sum of positive elements 
    between the first and last positive elements in the list.
    
    Args:
        lst (list): List of integers.
    
    Returns:
        tuple[int, int]: Minimum absolute value and sum between positive elements.
    """
    # Finding the minimum element by absolute value
    min_element = min(lst, key=abs)
    
    # Find the first and last positive elements
    first_positive = next((i for i, x in enumerate(lst) if x > 0), None)
    last_positive = next((i for i in reversed(range(len(lst))) if lst[i] > 0), None)
    
    sum_between = 0
    if first_positive is not None and last_positive is not None and first_positive < last_positive:
        sum_between = sum(x for x in lst[first_positive + 1:last_positive] if x > 0)
    
    return min_element, sum_between

def task5_main():
    """Main function for Task 5: handles list initialization and processing."""
    print("Initialize list:")
    print("1. User input")
    print("2. Random generator")
    choice = get_valid_input("Select method (1/2): ", int, lambda x: x in (1, 2))
    lst = input_list_user() if choice == 1 else generate_list_random()
    display_list(lst)
    min_element, sum_between = compute_min_and_sum(lst)
    print(f"Minimum element by absolute value: {min_element}")
    print(f"Sum of positive elements between the first and last positive elements: {sum_between}")
