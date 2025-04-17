"""
Task 1: List Processing
Lab: 1
Title: List Element Analyzer
Version: 1.0
Developer: [Your Name]
Date: [Current Date]
"""

def sum_negatives(lst: list) -> int:
    """
    Calculate the sum of all negative elements in the list.
    
    Args:
        lst (list): List of integers.
    
    Returns:
        int: Sum of negative elements.
    """
    return sum(x for x in lst if x < 0)

def product_between_min_max(lst: list) -> int:
    """
    Calculate the product of elements between the maximum and minimum elements.
    
    Args:
        lst (list): List of integers.
    
    Returns:
        int: Product of elements between min and max.
             Returns 0 if min and max are adjacent or if list is empty.
    """
    if not lst:
        return 0
    
    min_val = min(lst)
    max_val = max(lst)
    min_index = lst.index(min_val)
    max_index = lst.index(max_val)
    
    # Ensure start is before end
    start, end = sorted([min_index, max_index])
    
    # If adjacent or same element, return 0
    if end - start <= 1:
        return 0
    
    product = 1
    for num in lst[start+1:end]:
        product *= num
    
    return product

def task5_main():
    """Main function for Task 1: handles list processing."""
    sample_list = [2, -3, 5, -1, 0, 8, -4, 7]
    print("Sample list:", sample_list)
    
    # Calculate sum of negatives
    negative_sum = sum_negatives(sample_list)
    print(f"Sum of negative elements: {negative_sum}")
    
    # Calculate product between min and max
    product = product_between_min_max(sample_list)
    print(f"Product between min and max elements: {product}")

if __name__ == "__main__":
    task5_main()