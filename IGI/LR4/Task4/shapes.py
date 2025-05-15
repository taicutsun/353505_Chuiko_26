"""
Developer: Chuiko Grisha
Lab: 4
Task: Geometric Shapes
Version: 1.0
Date: 2025-01-05

Module containing geometric shape classes with inheritance, polymorphism, and abstraction.
"""

from abc import ABC, abstractmethod
import math
import matplotlib.pyplot as plt
from matplotlib.patches import Polygon

class Color:
    """Represents a color with validation."""
    
    def __init__(self, color: str):
        self._color = color.lower()
    
    @property
    def color(self) -> str:
        """Get the color name."""
        return self._color
    
    @color.setter
    def color(self, value: str):
        """Set the color name with basic validation."""
        if not isinstance(value, str) or len(value) < 3:
            raise ValueError("Invalid color format")
        self._color = value.lower()

class GeometricShape(ABC):
    """Abstract base class for geometric shapes."""
    
    @abstractmethod
    def area(self) -> float:
        """Calculate the area of the shape."""
        pass
    
    @classmethod
    def shape_name(cls) -> str:
        """Get the shape's display name."""
        return cls.__name__

class Rhombus(GeometricShape):
    """Rhombus defined by side length and acute angle (in degrees)."""

    SHAPE_NAME = "Rhombus"

    def __init__(self, side: float, angle_deg: float, color: str):
        if side <= 0:
            raise ValueError("Side length must be positive")
        if not (0 < angle_deg < 180):
            raise ValueError("Angle must be between 0 and 180 degrees")
        self._side = side
        self._angle_deg = angle_deg
        self.color = Color(color)

    def area(self) -> float:
        angle_rad = math.radians(self._angle_deg)
        return self._side ** 2 * math.sin(angle_rad)

    def get_info(self) -> str:
        return "Shape: {name}\nColor: {color}\nSide: {side}\nAngle: {angle}°\nArea: {area:.2f}".format(
            name=self.SHAPE_NAME,
            color=self.color.color,
            side=self._side,
            angle=self._angle_deg,
            area=self.area()
        )

    def draw(self, label: str = "", filename: str = ""):
        angle_rad = math.radians(self._angle_deg)
        dx = self._side * math.cos(angle_rad)
        dy = self._side * math.sin(angle_rad)

        points = [
            (0, 0),
            (self._side, 0),
            (self._side - dx, dy),
            (-dx, dy)
        ]

        fig, ax = plt.subplots()
        rhombus = Polygon(points, closed=True, facecolor=self.color.color, edgecolor='black')
        ax.add_patch(rhombus)
        plt.text(0, 0, label, ha='center', va='center')
        ax.set_xlim(-self._side, self._side * 2)
        ax.set_ylim(-self._side, self._side)
        plt.title(self.SHAPE_NAME)
        plt.gca().set_aspect('equal', adjustable='box')

        if filename:
            plt.savefig(filename, dpi=300, bbox_inches='tight')
        plt.show()