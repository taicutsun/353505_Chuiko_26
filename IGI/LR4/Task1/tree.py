class Tree:
    """
    Represents a tree species with its population data.
    """
    def __init__(self, species: str, total_count: int, healthy_count: int):
        self.species = species
        self.total_count = total_count
        self.healthy_count = healthy_count
    
    def get_sick_count(self) -> int:
        """Returns the number of sick trees."""
        return self.total_count - self.healthy_count
    
    def get_sick_percentage(self) -> float:
        """Returns the percentage of sick trees."""
        return (self.get_sick_count() / self.total_count) * 100 if self.total_count > 0 else 0
    
    def get_species_percentage(self, total_trees: int) -> float:
        """Returns the percentage of this species among all trees."""
        return (self.total_count / total_trees) * 100 if total_trees > 0 else 0
    
    def __str__(self):
        return (f"{self.species}: Total={self.total_count}, "
                f"Healthy={self.healthy_count}, "
                f"Sick={self.get_sick_count()} "
                f"({self.get_sick_percentage():.1f}%)") 