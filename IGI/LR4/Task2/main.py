"""
Developer: Chuiko Grisha
Lab: 4
Task: 2
Program: Text Analysis
Version: 1.0
Date: 2025-05-01
"""

from text_analyzer import CombinedAnalyzer

def main():
    """Main function to interact with the user."""
    while True:
        input_file = input("Enter the input file path (or 'quit' to exit): ")
        if input_file.lower() == 'quit':
            break
        output_file = input("Enter the output file name: ")
        zip_file = input("Enter the zip file name: ")
        
        analyzer = CombinedAnalyzer(input_file)
        try:
            analyzer.read_file()
            analyzer.process_text()
            analyzer.save_results(output_file)
            analyzer.zip_results(output_file, zip_file)
            print("\nAnalysis Results:")
            for key, value in analyzer.results.items():
                print(f"{key}: {value}")
            print("\nZip file created successfully.")
        except Exception as e:
            print(f"Error: {e}")
        
        repeat = input("\nAnalyze another file? (yes/no): ").lower()
        if repeat != 'yes':
            break

if __name__ == "__main__":
    main()