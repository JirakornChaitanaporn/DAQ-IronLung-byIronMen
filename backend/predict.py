import pandas as pd
import numpy as np
from models.pm1_predictor import predict as predict_pm1


class Singleton(type):
    _instances = {}

    def __call__(cls):
        if cls not in cls._instances:
            cls._instances[cls] = super(Singleton, cls).__call__()
        return cls._instances[cls]


class IndoorPredictor(metaclass=Singleton):
    def predict_pm1(self, pm1_outdoor: float, windspeed: float, aqi: float, temp_outdoor: float, humid: float) -> float:
        return predict_pm1(pm1_outdoor, windspeed, aqi, temp_outdoor, humid)