import os
import numpy as np
import pandas as pd
import joblib
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, root_mean_squared_error, r2_score

DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "merged_all_table.csv")
MODEL_PATH = os.path.join(os.path.dirname(__file__), "trained_models/pm10_model.joblib")

FEATURES = ["pm10_outdoor", "windspeed", "aqi", "temp_outdoor", "humid"]
TARGET = "pm10_indoor"





def load_data() -> tuple[np.ndarray, np.ndarray]:
    df = pd.read_csv(DATA_PATH)
    df = df[FEATURES + [TARGET]].dropna()
    df = df[(df["pm10_outdoor"] > 0) & (df[TARGET] > 0)]
    X = df[FEATURES].values
    y = df[TARGET].values
    return X, y


def train() -> dict:
    X, y = load_data()

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    model = RandomForestRegressor(
        n_estimators=100,
        max_depth=None,
        min_samples_leaf=2,
        random_state=42,
    )
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    metrics = {
        "mae": round(mean_absolute_error(y_test, y_pred), 4),
        "rmse": round(root_mean_squared_error(y_test, y_pred), 4),
        "r2": round(r2_score(y_test, y_pred), 4),
        "train_samples": len(X_train),
        "test_samples": len(X_test),
    }

    joblib.dump(model, MODEL_PATH)
    print(f"Model saved to {MODEL_PATH}")
    print(f"MAE:  {metrics['mae']}")
    print(f"RMSE: {metrics['rmse']}")
    print(f"R2:   {metrics['r2']}")
    return metrics


def predict(pm10_outdoor: float, windspeed: float, aqi: float, temp_outdoor: float, humid: float) -> float:
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(
            "Model not found. Run pm10_predictor.train() first."
        )
    model = joblib.load(MODEL_PATH)
    return float(model.predict([[pm10_outdoor, windspeed, aqi, temp_outdoor, humid]])[0])


if __name__ == "__main__":
    train()
