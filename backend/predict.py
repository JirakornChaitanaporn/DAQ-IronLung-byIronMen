import pandas as pd
import numpy as np
from models.pm1_predictor import PM1Predictor
from models.pm25_predictor import PM25Predictor
from models.pm10_predictor import PM10Predictor
from models.pm1_predictor_lr import PM1LRPredictor
from models.pm25_predictor_lr import PM25LRPredictor
from models.pm10_predictor_lr import PM10LRPredictor


class Singleton(type):
    """Metaclass for singleton pattern - ensures only one instance exists"""
    _instances = {}

    def __call__(cls):
        if cls not in cls._instances:
            cls._instances[cls] = super(Singleton, cls).__call__()
        return cls._instances[cls]


class IndoorPredictorRF(metaclass=Singleton):
    """
    Singleton wrapper for indoor air quality prediction using RandomForest models.
    Models are cached and reused across all prediction calls for efficiency.
    """
    def __init__(self):
        self.pm1_predictor = PM1Predictor()
        self.pm25_predictor = PM25Predictor()
        self.pm10_predictor = PM10Predictor()

    def predict_pm1(self, pm1_outdoor: float, windspeed: float, aqi: float, temp_outdoor: float, humid: float) -> float:
        """Predict indoor PM1 using RandomForest model (cached)"""
        return self.pm1_predictor.predict(pm1_outdoor, windspeed, aqi, temp_outdoor, humid)

    def predict_pm25(self, pm25_outdoor: float, windspeed: float, aqi: float, temp_outdoor: float, humid: float) -> float:
        """Predict indoor PM2.5 using RandomForest model (cached)"""
        return self.pm25_predictor.predict(pm25_outdoor, windspeed, aqi, temp_outdoor, humid)

    def predict_pm10(self, pm10_outdoor: float, windspeed: float, aqi: float, temp_outdoor: float, humid: float) -> float:
        """Predict indoor PM10 using RandomForest model (cached)"""
        return self.pm10_predictor.predict(pm10_outdoor, windspeed, aqi, temp_outdoor, humid)


class IndoorPredictorLR(metaclass=Singleton):
    """
    Singleton wrapper for indoor air quality prediction using LinearRegression models.
    Models and scalers are cached and reused across all prediction calls for efficiency.
    """
    def __init__(self):
        self.pm1_predictor = PM1LRPredictor()
        self.pm25_predictor = PM25LRPredictor()
        self.pm10_predictor = PM10LRPredictor()

    def predict_pm1(self, pm1_outdoor: float, windspeed: float, aqi: float, temp_outdoor: float, humid: float) -> float:
        """Predict indoor PM1 using LinearRegression model (cached)"""
        return self.pm1_predictor.predict(pm1_outdoor, windspeed, aqi, temp_outdoor, humid)

    def predict_pm25(self, pm25_outdoor: float, windspeed: float, aqi: float, temp_outdoor: float, humid: float) -> float:
        """Predict indoor PM2.5 using LinearRegression model (cached)"""
        return self.pm25_predictor.predict(pm25_outdoor, windspeed, aqi, temp_outdoor, humid)

    def predict_pm10(self, pm10_outdoor: float, windspeed: float, aqi: float, temp_outdoor: float, humid: float) -> float:
        """Predict indoor PM10 using LinearRegression model (cached)"""
        return self.pm10_predictor.predict(pm10_outdoor, windspeed, aqi, temp_outdoor, humid)