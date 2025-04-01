"""
Utility functions for input validation and error handling.
Version: 1.0
Developer: Chuiko Rygor
Date: 2025-03-06
"""

import time

"""Get valid user input with specified type and validation."""
def get_valid_input(prompt: str, type_cast, validation=lambda x: True, error_msg="Invalid input."):
    while True:
        try:
            value = type_cast(input(prompt))
            if validation(value):
                return value
            print(error_msg)
        except ValueError:
            print(error_msg)


"""Decorator to measure function execution time."""
def timer_decorator(func):
    def wrapper(*args, **kwargs):
        start_time = time.time()
        result = func(*args, **kwargs)
        end_time = time.time()
        print(f"Time taken by {func.__name__}: {end_time - start_time:.6f} seconds")
        return result
    return wrapper