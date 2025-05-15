"""
Developer: Chuiko Grisha
Lab: 4
Task: 3
Program: Logarithmic Series Analysis
Version: 1.0
Date: 2025-05-01
"""

import math
import matplotlib.pyplot as plt
from typing import List, Tuple
from statistics import mean, median,variance, stdev

class LogSeriesAnalyzer:
    """Class for analyzing the series: ln((x+1)/(x-1)) = 2∑[1/((2n+1)x^(2n+1))]
    
    Attributes:
        x (float): Input value (must be |x| > 1)
        eps (float): Precision for series convergence
        terms (List[float]): List of series terms
        partial_sums (List[float]): Cumulative sums during calculation
    """
    
    def __init__(self, x: float, eps: float = 1e-6):
        """Initialize analyzer with parameters.
        
        Args:
            x: Input value (must satisfy |x| > 1)
            eps: Precision threshold (default: 1e-6)
        """
        if abs(x) <= 1:
            raise ValueError("Input x must satisfy |x| > 1")
        self.x = x
        self.eps = eps
        self.terms = []
        self.partial_sums = []

    def compute_series(self) -> Tuple[float, int]:
        """Calculate the series sum with term storage.
        
        Returns:
            Tuple containing (sum_total, number_of_terms)
        """
        sum_total = 0.0
        n = 0
        
        while True:
            # Calculate the nth term: 2/(2n+1)x^(2n+1)
            term = 2 / ((2 * n + 1) * (self.x ** (2 * n + 1)))
            
            if abs(term) < self.eps:
                break
                
            sum_total += term
            self.terms.append(term)
            self.partial_sums.append(sum_total)
            n += 1
            
        return sum_total, len(self.terms)

    @property
    def statistical_metrics(self) -> dict:
        """Calculate statistical parameters of the series terms."""
        if not self.terms:
            raise ValueError("No terms available. Run compute_series() first.")
            
        return {
            'mean': mean(self.terms),
            'median': median(self.terms),
            'variance': variance(self.terms),
            'stdev': stdev(self.terms)
        }

    def plot_comparison(self, save_path: str = "") -> None:
        """Generate comparison plot between series and actual ln((x+1)/(x-1))."""
        if not self.partial_sums:
            raise ValueError("No data available. Run compute_series() first.")

        plt.figure(figsize=(10, 6))
        x_vals = list(range(1, len(self.partial_sums) + 1))
        
        # Series approximation plot
        plt.plot(x_vals, self.partial_sums, 
                'b--', 
                label=f'Series Approximation (n={len(self.terms)})')
        
        # Actual value reference line
        actual_val = math.log((self.x + 1)/(self.x - 1))
        plt.axhline(y=actual_val, color='r', 
                   linestyle='-', 
                   label='ln((x+1)/(x-1))')
        
        plt.xlabel('Number of Terms')
        plt.ylabel('Function Value')
        plt.title(f'Series Convergence (x={self.x:.2f})')
        plt.legend()
        plt.grid(True)
        
        # Add annotation for final difference
        final_diff = abs(self.partial_sums[-1] - actual_val)
        plt.annotate(f'Final difference: {final_diff:.2e}',
                    xy=(0.5, 0.1), 
                    xycoords='axes fraction',
                    ha='center')
        
        if save_path:
            plt.savefig(save_path, dpi=300)
        plt.show()

    def plot_fixed_n_comparison(self, n: int, x_range: Tuple[float, float] = (1.1, 5.0), save_path: str = "") -> None:
        """Plot actual function and series sum for fixed number of terms over x range.
        
        Args:
            n: Number of terms to use in the series
            x_range: Tuple (start, end) for x values (default: 1.1 to 5.0)
            save_path: Path to save the plot (optional)
        """
        x_start, x_end = x_range
        x_values = [x_start + i * (x_end - x_start) / 100 for i in range(101)]
        
        # Calculate actual values
        actual_values = [math.log((x + 1)/(x - 1)) for x in x_values]
        
        # Calculate series sum for fixed n
        series_values = []
        for x in x_values:
            sum_total = 0.0
            for k in range(n):
                term = 2 / ((2 * k + 1) * (x ** (2 * k + 1)))
                sum_total += term
            series_values.append(sum_total)
        
        # Plotting
        plt.figure(figsize=(10, 6))
        plt.plot(x_values, actual_values, 'r-', label='ln((x+1)/(x-1))')
        plt.plot(x_values, series_values, 'b--', label=f'Series Sum (n={n})')
        
        plt.xlabel('x')
        plt.ylabel('Function Value')
        plt.title(f'Comparison of ln((x+1)/(x-1)) and Series Sum (n={n})')
        plt.legend()
        plt.grid(True)
        
        if save_path:
            plt.savefig(save_path, dpi=300)
        plt.show()

    def __str__(self) -> str:
        """String representation of analyzer state."""
        return f"LogSeriesAnalyzer(x={self.x}, eps={self.eps})" 