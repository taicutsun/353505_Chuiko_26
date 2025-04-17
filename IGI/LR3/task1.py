"""
Task 1: Compute ln((x+1)/(x-1)) using power series.
Lab: 1
Title: Logarithm Series Calculation
Version: 1.0
Developer: [Your Name]
Date: [Current Date]
"""
import math
from utils import timer_decorator, get_valid_input

@timer_decorator
def compute_log_series(x: float, eps: float) -> tuple[float, int]:
    """
    Compute the sum of the logarithmic series up to the specified precision.
    
    Args:
        x (float): The input value (|x| > 1).
        eps (float): The precision (epsilon) for the series convergence.
    
    Returns:
        tuple[float, int]: The sum of the series and the number of terms added.
    """
    if abs(x) <= 1:
        raise ValueError("|x| must be greater than 1 for series convergence")
    
    sum_total = 0.0
    terms_added = 0
    max_terms = 500
    
    for n in range(0, max_terms):
        term = 1 / ((2*n + 1) * x**(2*n + 1))
        if abs(term) < eps:
            break
        sum_total += term
        terms_added += 1
    
    return 2 * sum_total, terms_added

def task1_main():
    """Main function for Task 26: handles user input and displays results."""
    
    x = get_valid_input("Enter x (|x| > 1): ", float, lambda val: abs(val) > 1, "|x| must be greater than 1")
    eps = get_valid_input("Enter epsilon (precision): ", float, lambda val: val > 0, "Epsilon must be positive.")
    
    try:
        sum_series, n = compute_log_series(x, eps)
        math_fx = math.log((x + 1)/(x - 1))
        print(f"{'x':<10} {'n':<10} {'F(x)':<15} {'MathF(x)':<15} {'eps':<10}")
        print(f"{x:<10.4f} {n:<10} {sum_series:<15.6f} {math_fx:<15.6f} {eps:<10.6f}")
    except ValueError as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    task1_main()