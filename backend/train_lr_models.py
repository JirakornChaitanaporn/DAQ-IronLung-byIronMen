"""
Training script for Linear Regression PM predictors with data normalization

This script trains three linear regression models (PM1, PM10, PM25) with StandardScaler
normalization for feature scaling.

Usage:
    python train_lr_models.py
"""

import sys
import os

# Add parent directory to path to import models
sys.path.insert(0, os.path.dirname(__file__))

from models import pm1_predictor_lr, pm10_predictor_lr, pm25_predictor_lr


def main():
    """Train all three linear regression models"""
    print("=" * 60)
    print("Training Linear Regression PM Predictors with Normalization")
    print("=" * 60)
    
    models = [
        ("PM1", pm1_predictor_lr),
        ("PM10", pm10_predictor_lr),
        ("PM25", pm25_predictor_lr),
    ]
    
    results = {}
    
    for model_name, predictor in models:
        print(f"\n[{model_name}] Training Linear Regression model...")
        print("-" * 60)
        try:
            metrics = predictor.train()
            results[model_name] = metrics
            print(f"✓ {model_name} model trained successfully!\n")
        except Exception as e:
            print(f"✗ Error training {model_name} model: {str(e)}\n")
            results[model_name] = None
    
    # Print summary
    print("\n" + "=" * 60)
    print("TRAINING SUMMARY")
    print("=" * 60)
    
    for model_name in ["PM1", "PM10", "PM25"]:
        metrics = results[model_name]
        if metrics:
            print(f"\n{model_name} Linear Regression:")
            print(f"  MAE:          {metrics['mae']}")
            print(f"  RMSE:         {metrics['rmse']}")
            print(f"  R²:           {metrics['r2']}")
            print(f"  Train size:   {metrics['train_samples']}")
            print(f"  Test size:    {metrics['test_samples']}")
        else:
            print(f"\n{model_name}: FAILED")
    
    print("\n" + "=" * 60)
    print("Training complete! Models and scalers saved.")
    print("=" * 60)


if __name__ == "__main__":
    main()
