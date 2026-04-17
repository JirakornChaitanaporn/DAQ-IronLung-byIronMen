import joblib

class Singleton(type):
    """Metaclass for singleton pattern - ensures only one instance exists"""
    _instances = {}
    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super(Singleton, cls).__call__(*args, **kwargs)
        return cls._instances[cls]


class IndoorPredictor(metaclass=Singleton):
    """
    Singleton Facade. RF Models are loaded into RAM exactly ONCE 
    when this class is first called, and never read from disk again.
    """
    def __init__(self):
        print("Loading all RF models into memory...")
        self.pm1_model = joblib.load("models/trained_models/pm1_model.joblib")
        self.pm25_model = joblib.load("models/trained_models/pm25_model.joblib")
        self.pm10_model = joblib.load("models/trained_models/pm10_model.joblib")

    def predict_pm1(self, pm1_outdoor: float, windspeed: float, aqi: float, temp_outdoor: float, humid: float) -> float:
        return float(self.pm1_model.predict([[pm1_outdoor, windspeed, aqi, temp_outdoor, humid]])[0])

    def predict_pm25(self, pm25_outdoor: float, windspeed: float, aqi: float, temp_outdoor: float, humid: float) -> float:
        return float(self.pm25_model.predict([[pm25_outdoor, windspeed, aqi, temp_outdoor, humid]])[0])

    def predict_pm10(self, pm10_outdoor: float, windspeed: float, aqi: float, temp_outdoor: float, humid: float) -> float:
        return float(self.pm10_model.predict([[pm10_outdoor, windspeed, aqi, temp_outdoor, humid]])[0])


class IndoorPredictorLR(metaclass=Singleton):
    """
    Singleton Facade. LinearRegression Models are loaded into RAM exactly ONCE.
    """
    def __init__(self):
        print("Loading all LR models into memory...")
        # Adjust these filenames to match whatever you named your Linear Regression joblibs
        self.pm1_model_lr = joblib.load("models/trained_models/pm1_model_lr.joblib")
        self.pm25_model_lr = joblib.load("models/trained_models/pm25_model_lr.joblib")
        self.pm10_model_lr = joblib.load("models/trained_models/pm10_model_lr.joblib")

    def predict_pm1(self, pm1_outdoor: float, windspeed: float, aqi: float, temp_outdoor: float, humid: float) -> float:
        return float(self.pm1_model_lr.predict([[pm1_outdoor, windspeed, aqi, temp_outdoor, humid]])[0])

    def predict_pm25(self, pm25_outdoor: float, windspeed: float, aqi: float, temp_outdoor: float, humid: float) -> float:
        return float(self.pm25_model_lr.predict([[pm25_outdoor, windspeed, aqi, temp_outdoor, humid]])[0])

    def predict_pm10(self, pm10_outdoor: float, windspeed: float, aqi: float, temp_outdoor: float, humid: float) -> float:
        return float(self.pm10_model_lr.predict([[pm10_outdoor, windspeed, aqi, temp_outdoor, humid]])[0])