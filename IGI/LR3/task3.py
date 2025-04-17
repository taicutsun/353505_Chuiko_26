"""
Task 3: Count Words Starting with Lowercase Letters
Lab: 1
Title: Count Words Starting with Lowercase
Version: 1.0
Developer: Chuiko Rygor
Date: 2025-03-05
"""

def count_words_starting_with_lowercase(s: str) -> int:
    """
    Count the number of words in the input string that start with a lowercase letter.
    
    Args:
        s (str): Input string.
    
    Returns:
        int: Number of words starting with a lowercase letter.
    """
    words = s.split()
    count = sum(1 for word in words if word[0].islower())
    return count

def task3_main():
    """Main function for Task 3: handles input and displays results."""
    s = input("Enter string: ")
    count = count_words_starting_with_lowercase(s)
    print(f"Count of words, started w lowercase: {count}")
