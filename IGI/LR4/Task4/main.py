"""
Developer: Chuiko Grisha
Lab: 4
Task: Geometric Shapes
Version: 1.0
Date: 2025-01-05

Main module for testing geometric shape classes.
"""

from shapes import Rhombus

def get_positive_float(prompt: str) -> float:
    """Get validated positive float input."""
    while True:
        try:
            value = float(input(prompt))
            if value <= 0:
                raise ValueError
            return value
        except ValueError:
            print("Please enter a positive number")

def get_color(prompt: str) -> str:
    """Get color input with basic validation."""
    while True:
        color = input(prompt).strip().lower()
        if len(color) >= 3:
            return color
        print("Color name must be at least 3 characters")

def main_menu():
    """Command-line interface for shape operations."""
    while True:
        print("\nGeometric Shapes Program")
        print("1. Create Rhombus")
        print("2. Exit")
        
        choice = input("Enter your choice: ")
        
        if choice == '2':
            break
            
        shape = None
        try:
            if choice == '1':
                 side = get_positive_float("Enter side length: ")
                 angle = get_positive_float("Enter acute angle (in degrees): ")
                 color = get_color("Enter color: ")
                 shape = Rhombus(side, angle, color)

            else:
                print("Invalid choice")
                continue
            
            # Common operations
            print("\n" + shape.get_info())
            label = input("Enter label text (optional): ")
            filename = input("Enter filename to save (optional): ").strip()
            shape.draw(label=label, filename=filename)
            
        except Exception as e:
            print(f"Error: {str(e)}")
        
        if input("\nCreate another shape? (y/n): ").lower() != 'y':
            break

if __name__ == "__main__":
    main_menu()