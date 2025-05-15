"""
Developer: Chuiko Grisha
Lab: 4
Task: Text Analysis
Version: 1.0
Date: 2025-01-05
"""

import re
import zipfile
import os
from datetime import datetime

class BaseAnalyzer:
    """Base class for text analysis tasks.
    
    Attributes:
        _file_path (str): Path to the input file.
        text (str): Content of the input file.
        results (dict): Dictionary to store analysis results.
    """
    
    def __init__(self, file_path):
        """Initializes the analyzer with the input file path."""
        self._file_path = file_path
        self.text = ""
        self.results = {}
    
    @property
    def file_path(self):
        """Getter for file_path."""
        return self._file_path
    
    @file_path.setter
    def file_path(self, value):
        """Setter for file_path."""
        if not isinstance(value, str):
            raise ValueError("File path must be a string.")
        self._file_path = value
    
    def read_file(self):
        """Reads the text from the input file."""
        try:
            with open(self._file_path, 'r', encoding='utf-8') as f:
                self.text = f.read()
        except FileNotFoundError:
            raise FileNotFoundError(f"File {self._file_path} not found.")
        except Exception as e:
            raise Exception(f"Error reading file: {e}")
    
    def save_results(self, output_path):
        """Saves the analysis results to a file."""
        with open(output_path, 'w', encoding='utf-8') as f:
            for key, value in self.results.items():
                f.write(f"{key}: {value}\n")
    
    def zip_results(self, output_path, zip_path):
        """Archives the output file and stores zip info in results."""
        with zipfile.ZipFile(zip_path, 'w') as zipf:
            zipf.write(output_path, arcname=os.path.basename(output_path))
        
        with zipfile.ZipFile(zip_path, 'r') as zipf:
            info = zipf.getinfo(os.path.basename(output_path))
            self.results['Zip File Info'] = {
                'file_name': info.filename,
                'file_size': info.file_size,
                'compressed_size': info.compress_size,
                'modified': datetime(*info.date_time).strftime('%Y-%m-%d %H:%M:%S')
            }
        return info
    
    def __str__(self):
        """String representation of the analyzer."""
        return f"TextAnalyzer: {self._file_path}"

class GeneralAnalyzerMixin:
    """Mixin providing general text analysis methods."""
    
    def count_sentences(self):
        """Counts total sentences using regex."""
        sentences = re.findall(r'[^.!?]*[.!?]', self.text)
        self.results['Total sentences'] = len(sentences)
    
    def count_sentence_types(self):
        """Counts declarative, interrogative, and exclamatory sentences."""
        endings = re.findall(r'([.!?])', self.text)
        self.results['Declarative sentences'] = endings.count('.')
        self.results['Interrogative sentences'] = endings.count('?')
        self.results['Exclamatory sentences'] = endings.count('!')
    
    def average_sentence_length(self):
        """Calculates average sentence length in characters (words only)."""
        sentences = [s.strip() for s in re.split(r'[.!?]', self.text) if s.strip()]
        total = sum(len(word) for sent in sentences for word in re.findall(r'\w+', sent))
        avg = total / len(sentences) if sentences else 0
        self.results['Average sentence length'] = avg
    
    def average_word_length(self):
        """Calculates average word length in characters."""
        words = re.findall(r'\w+', self.text)
        avg = sum(map(len, words)) / len(words) if words else 0
        self.results['Average word length'] = avg
    
    def count_smileys(self):
        """Counts valid smileys using regex."""
        self.results['Smiley count'] = len(re.findall(r'[:;]-*([()\[\]])\1*', self.text))
    
    def process_general_tasks(self):
        """Executes all general analysis tasks."""
        self.count_sentences()
        self.count_sentence_types()
        self.average_sentence_length()
        self.average_word_length()
        self.count_smileys()

class SpecificAnalyzerMixin:
    """Mixin providing specific analysis tasks for variant 26."""
  
    def find_lowercase_consonant_words(self):
        """Finds words starting with lowercase consonant letters."""
        consonants = 'bcdfghjklmnpqrstvwxyz'
        self.results['Lowercase consonant words'] = re.findall(r'\b[' + consonants + r']\w*\b', self.text.lower())
    
    def check_license_plates(self):
        """Checks for valid license plate patterns."""
        plates = re.findall(r'\b\d{4}[A-Z]{2}\b', self.text.upper())
        self.results['Valid license plates'] = plates
    
    def count_min_length_words(self):
        """Counts words with minimum length."""
        words = re.findall(r'\b\w+\b', self.text)
        if not words:
            self.results['Min length words count'] = 0
            return
        
        min_len = min(len(word) for word in words)
        min_words = [word for word in words if len(word) == min_len]
        self.results['Min length words count'] = len(min_words)
        self.results['Min length words'] = min_words
    
    def find_comma_followed_words(self):
        """Finds words followed by a comma."""
        self.results['Comma followed words'] = re.findall(r'\b\w+\b(?=,)', self.text)
    
    def find_longest_y_ending_word(self):
        """Finds the longest word ending with 'y'."""
        y_words = [word for word in re.findall(r'\b\w+\b', self.text) if word.endswith(('y', 'Y'))]
        if y_words:
            max_len = max(len(word) for word in y_words)
            self.results['Longest y-ending word'] = [word for word in y_words if len(word) == max_len]
        else:
            self.results['Longest y-ending word'] = None
    
    def process_specific_tasks(self):
        """Executes all specific analysis tasks."""
        self.find_lowercase_consonant_words()
        self.check_license_plates()
        self.count_min_length_words()
        self.find_comma_followed_words()
        self.find_longest_y_ending_word()

class CombinedAnalyzer(BaseAnalyzer, GeneralAnalyzerMixin, SpecificAnalyzerMixin):
    """Combines general and specific text analysis."""
    
    def __init__(self, file_path):
        super().__init__(file_path)
    
    def process_text(self):
        """Processes both general and specific tasks."""
        self.process_general_tasks()
        self.process_specific_tasks()