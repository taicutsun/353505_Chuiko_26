"""
Task 4: Text Analysis
Lab: 1
Title: Basic Text Analysis
Version: 1.0
Developer: [Your Name]
Date: [Current Date]
"""

def count_words(text: str) -> int:
    """
    Count the number of words in the text.
    
    Args:
        text (str): Input text.
    
    Returns:
        int: Number of words.
    """
    words = text.split()
    return len(words)

def find_longest_word(text: str) -> tuple[str, int]:
    """
    Find the longest word and its position in the text.
    
    Args:
        text (str): Input text.
    
    Returns:
        tuple[str, int]: The longest word and its 1-based index.
    """
    words = text.split()
    if not words:
        return "", 0
    
    longest_word = max(words, key=len)
    position = words.index(longest_word) + 1  # 1-based index
    return longest_word, position

def print_odd_words(text: str) -> None:
    """
    Print each odd-positioned word (1st, 3rd, 5th, etc.).
    
    Args:
        text (str): Input text.
    """
    words = text.split()
    print("Odd-positioned words:")
    for i in range(0, len(words), 2):  # Start from 0 for 1st, 3rd etc. (0-based index)
        print(f"{i//2 + 1}. {words[i]}")

def task4_main():
    """Main function for Task 26: runs all text analysis functions."""
    sample_text = "The quick brown fox jumps over the lazy dog"
    
    print("Original text:", sample_text)
    
    # Part a: Count words
    word_count = count_words(sample_text)
    print(f"\n26a: Number of words: {word_count}")
    
    # Part b: Find longest word
    longest, position = find_longest_word(sample_text)
    print(f"\n26b: Longest word: '{longest}' at position {position}")
    
    # Part c: Print odd words
    print("\n26c:")
    print_odd_words(sample_text)

if __name__ == "__main__":
    task4_main()