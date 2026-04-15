import os
import numpy as np
import pandas as pd
import joblib
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, root_mean_squared_error, r2_score

DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "merged_all_table.csv")
MODEL_PATH = os.path.join(os.path.dirname(__file__), "trained_models/pm25_model_lr.joblib")
SCALER_PATH = os.path.join(os.path.dirname(__file__), "trained_models/pm25_scaler_lr.joblib")

FEATURES = ["pm25_outdoor", "windspeed", "aqi", "temp_outdoor", "humid"]
TARGET = "pm25_indoor"


def load_and_preprocess_data() -> tuple[np.ndarray, np.ndarray, StandardScaler]:
    """Load data, handle missing values, and create scaler"""
    df = pd.read_csv(DATA_PATH)
    
    # Select features and target, drop NaN values
    df = df[FEATURES + [TARGET]].dropna()
    
    # Drop rows where sensor readings are zero (sensor dropout)
    df = df[(df["pm25_outdoor"] > 0) & (df[TARGET] > 0)]
    
    X = df[FEATURES].values
    y = df[TARGET].values
    
    # Normalize features using StandardScaler
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    return X_scaled, y, scaler


def train() -> dict:
    """Train linear regression model with normalized features"""
    X_scaled, y, scaler = load_and_preprocess_data()

    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y, test_size=0.2, random_state=42
    )

    # Use Linear Regression with normalized features
    model = LinearRegression()
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    metrics = {
        "mae": round(mean_absolute_error(y_test, y_pred), 4),
        "rmse": round(root_mean_squared_error(y_test, y_pred), 4),
        "r2": round(r2_score(y_test, y_pred), 4),
        "train_samples": len(X_train),
        "test_samples": len(X_test),
    }

    # Save both model and scaler
    joblib.dump(model, MODEL_PATH)
    joblib.dump(scaler, SCALER_PATH)
    
    print(f"Model saved to {MODEL_PATH}")
    print(f"Scaler saved to {SCALER_PATH}")
    print(f"MAE:  {metrics['mae']}")
    print(f"RMSE: {metrics['rmse']}")
    print(f"R²:   {metrics['r2']}")
    return metrics


def predict(pm25_outdoor: float, windspeed: float, aqi: float, temp_outdoor: float, humid: float) -> float:
    """Predict PM25 indoor level using normalized features"""
    if not os.path.exists(MODEL_PATH) or not os.path.exists(SCALER_PATH):
        raise FileNotFoundError(
            "Model or scaler not found. Run pm25_predictor_lr.train() first."
        )
    
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    
    # Create feature array and normalize using the fitted scaler
    features = np.array([[pm25_outdoor, windspeed, aqi, temp_outdoor, humid]])
    features_scaled = scaler.transform(features)
    
    return float(model.predict(features_scaled)[0])


if __name__ == "__main__":
    train()
