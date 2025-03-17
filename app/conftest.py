import os
import sys

os.environ["MODE"] = "TEST"
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))