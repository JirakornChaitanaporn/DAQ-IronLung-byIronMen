import pandas as pd
import numpy as np
from models.pm1_predictor import predict as predict_pm1
from models.pm25_predictor import predict as predict_pm25
from models.pm10_predictor import predict as predict_pm10
from models.pm1_predictor_lr import predict as predict_pm1_lr
from models.pm25_predictor_lr import predict as predict_pm25_lr
from models.pm10_predictor_lr import predict as predict_pm10_lr


class Singleton(type):
    """Metaclass for singleton pattern - ensures only one instance exists"""
    _instances = {}

    def __call__(cls):
        if cls not in cls._instances:
            cls._instances[cls] = super(Singleton, cls).__call__()
        return cls._instances[cls]


class IndoorPredictor(metaclass=Singleton):
    """
    Singleton wrapper for indoor air quality prediction using RandomForest models.
    Models are loaded once and reused across all prediction calls for efficiency.
    """
    def predict_pm1(self, pm1_outdoor: float, windspeed: float, aqi: float, temp_outdoor: float, humid: float) -> float:
        """Predict indoor PM1 using RandomForest model"""
        return predict_pm1(pm1_outdoor, windspeed, aqi, temp_outdoor, humid)

    def predict_pm25(self, pm25_outdoor: float, windspeed: float, aqi: float, temp_outdoor: float, humid: float) -> float:
        """Predict indoor PM2.5 using RandomForest model"""
        return predict_pm25(pm25_outdoor, windspeed, aqi, temp_outdoor, humid)

    def predict_pm10(self, pm10_outdoor: float, windspeed: float, aqi: float, temp_outdoor: float, humid: float) -> float:
        """Predict indoor PM10 using RandomForest model"""
        return predict_pm10(pm10_outdoor, windspeed, aqi, temp_outdoor, humid)


class IndoorPredictorLR(metaclass=Singleton):
    """
    Singleton wrapper for indoor air quality prediction using LinearRegression models.
    Models and scalers are loaded once and reused across all prediction calls for efficiency.
    """
    def predict_pm1(self, pm1_outdoor: float, windspeed: float, aqi: float, temp_outdoor: float, humid: float) -> float:
        """Predict indoor PM1 using LinearRegression model"""
        return predict_pm1_lr(pm1_outdoor, windspeed, aqi, temp_outdoor, humid)

    def predict_pm25(self, pm25_outdoor: float, windspeed: float, aqi: float, temp_outdoor: float, humid: float) -> float:
        """Predict indoor PM2.5 using LinearRegression model"""
        return predict_pm25_lr(pm25_outdoor, windspeed, aqi, temp_outdoor, humid)

    def predict_pm10(self, pm10_outdoor: float, windspeed: float, aqi: float, temp_outdoor: float, humid: float) -> float:
        """Predict indoor PM10 using LinearRegression model"""
        return predict_pm10_lr(pm10_outdoor, windspeed, aqi, temp_outdoor, humid)