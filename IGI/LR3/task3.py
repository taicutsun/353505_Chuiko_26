"""
Task 3: Count Words Starting with Lowercase Consonants
Lab: 1
Title: Lowercase Consonant Word Counter
Version: 1.0
Developer: Chuiko Rygor
Date: 2025-03-05
"""

def count_words_starting_with_lowercase_consonant(s: str) -> int:
    """
    Count the number of words in the input string that start with a lowercase consonant.
    
    Args:
        s (str): Input string.
    
    Returns:
        int: Number of words starting with a lowercase consonant.
    """
    consonants = "bcdfghjklmnpqrstvwxyz"
    words = s.split()
    count = 0
    for word in words:
        if word[0] in consonants:
            count += 1
    return count

def task3_main():
    """Main function for Task 3: handles input and displays results."""
    s = input("Enter a string: ")
    count = count_words_starting_with_lowercase_consonant(s)
    print(f"Number of words starting with a lowercase consonant: {count}")
