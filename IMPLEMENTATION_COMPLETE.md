# Linear Regression Implementation Summary

## What Was Completed ✓

### 1. Three New Linear Regression Predictor Files Created

#### Files:
- **`backend/models/pm1_predictor_lr.py`**
- **`backend/models/pm10_predictor_lr.py`**
- **`backend/models/pm25_predictor_lr.py`**

#### Features of Each File:
- ✓ StandardScaler normalization of features
- ✓ Handles missing values (NaN)
- ✓ Filters zero sensor readings (sensor dropout detection)
- ✓ Trains on 80/20 split with fixed random_state
- ✓ Saves both model AND scaler for consistent predictions
- ✓ Linear Regression algorithm (simpler, faster, interpretable)
- ✓ Returns metrics: MAE, RMSE, R², train/test sample counts

### 2. Three New API Endpoints Added

#### Updated File:
- **`backend/api.py`**

#### New Endpoints:
1. `GET /predicted_pm1_linear_regression` → Returns PM1 prediction
2. `GET /predicted_pm10_linear_regression` → Returns PM10 prediction
3. `GET /predicted_pm25_linear_regression` → Returns PM25 prediction

#### Endpoint Response Format:
```json
{
  "ts": "2026-04-15 14:30:45",
  "pm1": 12.45
}
```

### 3. Training Script Created

#### File:
- **`backend/train_lr_models.py`**

#### Usage:
```bash
cd backend
python train_lr_models.py
```

This trains all 3 linear regression models together and displays a summary.

### 4. Documentation Created

#### File:
- **`backend/LINEAR_REGRESSION_MODEL_GUIDE.md`**

Complete guide including:
- Model overview
- Training instructions
- API endpoint details
- Code structure explanation
- Comparison with Random Forest
- Troubleshooting guide

## Data Processing Pipeline

Each linear regression model follows this preprocessing:

```
Raw Data (merged_all_table.csv)
    ↓
1. Select Features + Target
    ↓
2. Remove NaN Values
    ↓
3. Filter Out Zero Readings (Sensor Dropout)
    ↓
4. Extract Features (X) and Target (y)
    ↓
5. Normalize X using StandardScaler (fit on training data)
    ↓
6. Train/Test Split (80/20)
    ↓
7. Train LinearRegression Model
    ↓
8. Save Model + Scaler
```

## Model Artifacts Generated

When you run training, these files will be created:

```
backend/models/trained_models/
├── pm1_model_lr.joblib      (← LinearRegression model)
├── pm1_scaler_lr.joblib     (← StandardScaler)
├── pm10_model_lr.joblib
├── pm10_scaler_lr.joblib
├── pm25_model_lr.joblib
└── pm25_scaler_lr.joblib
```

## Next Steps

### 1. Train the Models (Required Before Using APIs)
```bash
cd /Users/sandeesan/Desktop/y2sem2/daq/DAQ-IronLung-byIronMen/backend
source venv/bin/activate
python train_lr_models.py
```

### 2. Verify Models Trained
Check that 6 new files were created in `backend/models/trained_models/`:
- `pm1_model_lr.joblib`
- `pm1_scaler_lr.joblib`
- `pm10_model_lr.joblib`
- `pm10_scaler_lr.joblib`
- `pm25_model_lr.joblib`
- `pm25_scaler_lr.joblib`

### 3. Test the New API Endpoints
```bash
# Terminal 1: Start the API
cd backend
source venv/bin/activate
uvicorn api:app --reload

# Terminal 2: Test the new endpoints
curl http://localhost:8000/predicted_pm1_linear_regression
curl http://localhost:8000/predicted_pm10_linear_regression
curl http://localhost:8000/predicted_pm25_linear_regression
```

## Comparison: What You Now Have

### Random Forest Models (Existing)
- Endpoints: `/predicted_pm1_random_forest`, `/predicted_pm10_random_forest`, `/predicted_pm25_random_forest`
- Files: `pm1_predictor.py`, `pm10_predictor.py`, `pm25_predictor.py`
- Models: `*_model.joblib` (Random Forest)

### Linear Regression Models (New)
- Endpoints: `/predicted_pm1_linear_regression`, `/predicted_pm10_linear_regression`, `/predicted_pm25_linear_regression`
- Files: `pm1_predictor_lr.py`, `pm10_predictor_lr.py`, `pm25_predictor_lr.py`
- Models: `*_model_lr.joblib` + `*_scaler_lr.joblib` (Linear Regression + Scaler)

## Key Advantages of Linear Regression + Normalization

1. **Data Normalization**: StandardScaler ensures all features contribute equally
2. **Interpretability**: Coefficients directly show feature importance
3. **Speed**: Faster training and inference than Random Forest
4. **Memory Efficient**: Smaller model files
5. **Consistency**: Scaler normalization ensures stable predictions across different input ranges

## Features Used in Predictions

All 5 models (RF + LR) use these same features:
```python
["pm_outdoor", "windspeed", "aqi", "temp_outdoor", "humid"]
```

## Verification Checklist

- ✅ 3 new predictor files created with linear regression + normalization
- ✅ 3 new API endpoints added to api.py
- ✅ Training script created
- ✅ Comprehensive documentation created
- ✅ Module imports verified working
- ✅ Ready for model training

## Questions?

Refer to `LINEAR_REGRESSION_MODEL_GUIDE.md` for:
- Detailed API documentation
- Code structure explanation
- Training instructions
- Troubleshooting guide
