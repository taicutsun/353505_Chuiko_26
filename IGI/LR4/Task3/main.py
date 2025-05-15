"""
Developer: Chuiko Grisha
Lab: 4
Task: 3
Program: Logarithmic Series Analysis 
Version: 1.0
"""
import sys
import os
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parent.parent))
from series_analyzer import LogSeriesAnalyzer
from utils import get_valid_input
import math

def main():
    """Main workflow with user interaction."""
    print("Logarithmic Series Analysis Program")
    print("Series: ln((x+1)/(x-1)) = 2∑[1/((2n+1)x^(2n+1))]")
    print("Note: |x| must be greater than 1")
    
    while True:
        # Get input with validation for |x| > 1
        x = get_valid_input(
            "Enter x (|x| > 1): ", 
            float, 
            lambda x: abs(x) > 1,
            "Invalid input. |x| must be greater than 1"
        )
        
        eps = get_valid_input(
            "Enter precision (epsilon): ", 
            float, 
            lambda x: x > 0, 
            "Epsilon must be positive"
        )
        
        # Create analyzer and compute series
        analyzer = LogSeriesAnalyzer(x, eps)
        sum_series, n_terms = analyzer.compute_series()
        stats = analyzer.statistical_metrics
        
        # Calculate actual value using math.log
        actual_value = math.log((x + 1)/(x - 1))
        
        # Display results
        print("\nCalculation Results:")
        print(f"{'Series sum':<20}: {sum_series:.10f}")
        print(f"{'Actual value':<20}: {actual_value:.10f}")
        print(f"{'Absolute error':<20}: {abs(sum_series - actual_value):.10f}")
        print(f"{'Terms used':<20}: {n_terms}")
        
        print("\nStatistical Analysis:")
        for metric, value in stats.items():
            print(f"{metric.capitalize():<20}: {value:.6f}")
        
        # Generate and save convergence plot
        save_file = input("\nEnter filename to save convergence plot (empty to skip): ").strip()
        if save_file:
            analyzer.plot_comparison(save_file)
            print(f"Plot saved to {save_file}")
        
        # Plot fixed n comparison
        if input("\nPlot fixed n comparison? (y/n): ").lower() == 'y':
            n = get_valid_input(
                "Enter number of terms (n): ", 
                int, 
                lambda x: x > 0, 
                "n must be positive"
            )
            
            x_start = get_valid_input(
                "Enter start x value (> 1): ", 
                float, 
                lambda x: x > 1,
                "Start value must be greater than 1"
            )
            
            x_end = get_valid_input(
                "Enter end x value (> start): ", 
                float, 
                lambda x: x > x_start,
                f"End value must be greater than {x_start}"
            )
            
            save_fixed_n = input("Enter filename to save fixed n plot (empty to skip): ").strip()
            analyzer.plot_fixed_n_comparison(n, (x_start, x_end), save_fixed_n)
            if save_fixed_n:
                print(f"Fixed n plot saved to {save_fixed_n}")
        
        if input("\nRepeat analysis? (y/n): ").lower() != 'y':
            break

if __name__ == "__main__":
    main()