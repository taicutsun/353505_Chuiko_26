"""
Task 1: Compute exp using power series.
Lab: 1
Title: Exp Series Calculation
Version: 1.0
Developer: Chuiko Rygor
Date: 2025-03-05
"""
import math
from utils import timer_decorator, get_valid_input

@timer_decorator
def compute_exp_series(x: float, eps: float) -> tuple[float, int]:
    """
    Compute the sum of the exponential series up to the specified precision.
    
    Args:
        x (float): The input value.
        eps (float): The precision (epsilon) for the series convergence.
    
    Returns:
        tuple[float, int]: The sum of the series and the number of terms added.
    """
    sum_total = 1.0  # First term (n=0)
    terms_added = 1
    max_terms = 500
    for n in range(1, max_terms):
        term = x ** n / math.factorial(n)
        if abs(term) < eps:
            break
        sum_total += term
        terms_added += 1
    return sum_total, terms_added

def task1_main():
    """Main function for Task 1: handles user input and displays results."""
    
    x = get_valid_input("Enter x: ", float)
    eps = get_valid_input("Enter epsilon (precision): ", float, lambda x: x > 0, "Epsilon must be positive.")
    sum_series, n = compute_exp_series(x, eps)
    math_fx = math.exp(x)
    print(f"{'x':<10} {'n':<10} {'F(x)':<15} {'MathF(x)':<15} {'eps':<10}")
    print(f"{x:<10.4f} {n:<10} {sum_series:<15.6f} {math_fx:<15.6f} {eps:<10.6f}")