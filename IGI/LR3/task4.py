"""
Task 4: Analyze Text
Lab: 1
Title: Text Analysis
Version: 1.0
Developer: Chuiko Rygor
Date: 2025-03-05
"""

def task4a(sentence: str) -> int:
    """
    Count how many words have the minimum length.
    
    Args:
        sentence (str): Input sentence.
    
    Returns:
        int: Number of words with the minimum length.
    """
    words = sentence.split()
    min_length = min(len(word) for word in words)  # Find the minimum length
    min_count = sum(1 for word in words if len(word) == min_length)  # Count words with the minimum length
    return min_count

def task4b(sentence: str) -> list[str]:
    """
    Print all words followed by a period.
    
    Args:
        sentence (str): Input sentence.
    
    Returns:
        list[str]: List of words followed by a period.
    """
    words = sentence.split()
    result = [word + '.' for word in words if word.endswith('.')]
    return result

def task4_main():
    """Main function for Task 4: runs analysis on a predefined text."""
    sample_text = "The dog runs fast. The cat sleeps. A big ball is here."
    
    # Part a: Count words with the minimum length
    print("4a: Number of words with the minimum length:", task4a(sample_text))
    
    # Part b: Words followed by a period
    print("\n4b: Words followed by a period:")
    for word in task4b(sample_text):
        print(word)

