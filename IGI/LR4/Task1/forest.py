import csv
import pickle
from typing import List
from tree import Tree

class Forest:
    """
    Represents a forest area with multiple tree species.
    """
    def __init__(self):
        self.trees: List[Tree] = []
    
    def add_tree(self, tree: Tree):
        self.trees.append(tree)
    
    def get_total_trees(self) -> int:
        """Returns the total number of trees in the forest."""
        return sum(tree.total_count for tree in self.trees)
    
    def get_total_healthy_trees(self) -> int:
        """Returns the total number of healthy trees."""
        return sum(tree.healthy_count for tree in self.trees)
    
    def get_total_sick_percentage(self) -> float:
        """Returns the percentage of sick trees in the entire forest."""
        total = self.get_total_trees()
        if total == 0:
            return 0
        return ((total - self.get_total_healthy_trees()) / total) * 100
    
    def find_tree_by_species(self, species: str) -> Tree:
        """Finds a tree by its species name."""
        for tree in self.trees:
            if tree.species.lower() == species.lower():
                return tree
        return None
    
    def save_to_csv(self, filename: str):
        """Saves forest data to a CSV file."""
        try:
            with open(filename, mode='w', newline='', encoding='utf-8') as file:
                writer = csv.writer(file)
                writer.writerow(["Species", "Total Count", "Healthy Count"])
                for tree in self.trees:
                    writer.writerow([tree.species, tree.total_count, tree.healthy_count])
        except Exception as e:
            print(f"Error saving CSV file: {e}")
    
    def load_from_csv(self, filename: str):
        """Loads forest data from a CSV file."""
        try:
            with open(filename, mode='r', newline='', encoding='utf-8') as file:
                reader = csv.reader(file)
                next(reader)  # Skip header row
                self.trees = [Tree(row[0], int(row[1]), int(row[2])) for row in reader]
        except Exception as e:
            print(f"Error loading CSV file: {e}")
    
    def save_to_pickle(self, filename: str):
        """Saves forest data to a binary pickle file."""
        try:
            with open(filename, 'wb') as file:
                pickle.dump(self.trees, file)
        except Exception as e:
            print(f"Error saving pickle file: {e}")
    
    def load_from_pickle(self, filename: str):
        """Loads forest data from a binary pickle file."""
        try:
            with open(filename, 'rb') as file:
                self.trees = pickle.load(file)
        except Exception as e:
            print(f"Error loading pickle file: {e}")
    
    def print_statistics(self):
        """Prints forest statistics."""
        total_trees = self.get_total_trees()
        print(f"\nForest Statistics:")
        print(f"1. Total number of trees: {total_trees}")
        print(f"2. Total healthy trees: {self.get_total_healthy_trees()}")
        print(f"3. Percentage of sick trees: {self.get_total_sick_percentage():.1f}%")
        print("\n4. Species distribution:")
        for tree in self.trees:
            print(f"{tree.species}:")
            print(f"  - Total: {tree.total_count} ({tree.get_species_percentage(total_trees):.1f}%)")
            print(f"  - Healthy: {tree.healthy_count}")
            print(f"  - Sick: {tree.get_sick_count()} ({tree.get_sick_percentage():.1f}%)") 