"""
Main module to run the program.
Lab: Various Tasks
Version: 1.0
Developer: Chuiko Rygor
Date: 2025-03-05
"""
from task1 import task1_main
from task2 import task2_main
from task3 import task3_main
from task4 import task4_main
from task5 import task5_main
from utils import get_valid_input

def main_menu():
    """Display the main menu and handle user input to run tasks."""
    while True:
        print("\nMain Menu")
        print("1. Exp series")
        print("2. Sum Every Second Integer")
        print("3. Lowercase Consonant Word Counter")
        print("4. Analyze text")
        print("5. Process list")
        print("6. Exit")
        choice = get_valid_input("Select task (1-6): ", int, lambda x: 1 <= x <= 6)
        if choice == 1:
            task1_main()
        elif choice == 2:
            task2_main()
        elif choice == 3:
            task3_main()
        elif choice == 4:
            task4_main()
        elif choice == 5:
            task5_main()
        elif choice == 6:
            break
        input("\nPress Enter to continue...")

if __name__ == "__main__":
    main_menu()