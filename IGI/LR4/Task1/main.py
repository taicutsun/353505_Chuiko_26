import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from forest import Forest
from tree import Tree

def main():
    forest = Forest()
    forest.add_tree(Tree("Pine", 1000, 800))
    forest.add_tree(Tree("Oak", 500, 450))
    forest.add_tree(Tree("Birch", 300, 250))
    
    forest.save_to_csv("forest_data.csv")
    forest.load_from_csv("forest_data.csv")
    
    forest.save_to_pickle("forest_data.pkl")
    forest.load_from_pickle("forest_data.pkl")
    
    forest.print_statistics()
    
    species = input("\nEnter tree species to search: ")
    tree = forest.find_tree_by_species(species)
    if tree:
        print(f"\nInformation about {species}:")
        print(tree)
    else:
        print(f"\nNo data found for {species}")

if __name__ == "__main__":
    main()
