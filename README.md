# Smart Lung — IoT Indoor Air Quality Monitor

*Note for DA please go to backend then preprocess to see EDA and Merging table. Also Please go to data for our data for model.

An IoT system that measures and predicts indoor dust density (PM2.5) by combining real-time sensor readings with outdoor air quality and weather data.

**Team IronMen**
- Munyin Sam — 6710545962
- Jirakorn Chaitanaporn — 6710545474

---

## Overview

Most people are aware of outdoor air pollution during dust season, but overlook that dust levels indoors can be just as harmful. Smart Lung addresses this by monitoring both indoor and outdoor environments simultaneously, then using that combined data to predict how outdoor conditions will affect indoor air quality.

The system collects PM1.0, PM2.5, PM10, temperature, and humidity from two PMS7003 sensors (one indoors, one outdoors), enriches it with live data from the IQAir and weather forecast APIs, and exposes everything through a FastAPI backend and a Next.js dashboard.

---

## Features

- Real-time indoor & outdoor dust readings (PM1.0, PM2.5, PM10)
- Live temperature and humidity from both sensors
- IQAir AQI integration for outdoor air quality index
- Weather API integration (temperature, windspeed, rainfall, humidity)
- 12-hour historical trend chart comparing indoor vs outdoor PM levels
- Smart recommendation banner — tells you whether to open windows or keep them closed
- Predictive analytics model (scikit-learn) estimating future indoor dust levels

---

## Tech Stack

| Layer | Technology |
|---|---|
| Microcontroller | KidBright (MicroPython via Thonny IDE) |
| Sensor | PMS7003 (×2, connected via JST 3AF-8 cable) |
| Database | PostgreSQL |
| Backend | FastAPI (Python) |
| Frontend | Next.js 16 + Tailwind CSS + Recharts |
| ML Model | scikit-learn, Pandas, NumPy |
| External APIs | IQAir API, Weather Forecast API |

---

## Project Structure

```
DAQ-IronLung-byIronMen/
├── backend/
│   ├── api.py               # FastAPI app — sensor data endpoints
│   └── db_config.py.example # Database connection config template
└── frontend/
    ├── app/
    │   ├── layout.tsx
    │   └── page.tsx          # Main dashboard page
    ├── components/
    │   ├── Navbar.tsx
    │   ├── SensorPanel.tsx   # Indoor / outdoor sensor card
    │   ├── AirChart.tsx      # 12-hour PM trend chart
    │   ├── WeatherWidget.tsx # Weather API card
    │   └── AqiWidget.tsx     # IQAir AQI card
    └── lib/
        └── fakeData.ts       # Fake data & AQI/PM2.5 label helpers
```

---

## Data Models

### `project_kidbright_indoor`
| Field | Type | Description |
|---|---|---|
| id | int | Record ID |
| ts | datetime | Timestamp |
| temp_dht | int | Temperature (°C) |
| humidity | int | Relative humidity (%) |
| pm1 | int | PM1.0 (µg/m³) |
| pm25 | int | PM2.5 (µg/m³) |
| pm10 | int | PM10 (µg/m³) |

### `project_kidbright_outdoor`
| Field | Type | Description |
|---|---|---|
| id | int | Record ID |
| ts | datetime | Timestamp |
| temp_dht | int | Temperature (°C) |
| humidity | int | Relative humidity (%) |
| pm1 | int | PM1.0 (µg/m³) |
| pm25 | int | PM2.5 (µg/m³) |
| pm10 | int | PM10 (µg/m³) |

### `project_aqi_api`
| Field | Type | Description |
|---|---|---|
| id | int | Record ID |
| ts | datetime | Timestamp |
| lat | float | Latitude |
| lon | float | Longitude |
| aqi | int | Air Quality Index (IQAir) |

### `project_weather_api`
| Field | Type | Description |
|---|---|---|
| id | int | Record ID |
| ts | datetime | Timestamp |
| lat | float | Latitude |
| lon | float | Longitude |
| humid | int | Humidity (%) |
| rainfall | int | Rainfall (mm) |
| temp | float | Temperature (°C) |
| windspeed | float | Wind speed (km/h) |

---

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL database (hosted at `iot.cpe.ku.ac.th` for this project)

### Backend

```bash
cd backend

# Install dependencies
pip install fastapi uvicorn pymysql dbutils pydantic

# Configure database connection
cp db_config.py.example db_config.py
# Edit db_config.py with your credentials

# Run the API server
uvicorn api:app --reload
```

The API will be available at `http://localhost:8000`.
Interactive docs: `http://localhost:8000/docs`

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The dashboard will be available at `http://localhost:3000`.

> The frontend currently uses fake data from `lib/fakeData.ts`. Replace the imports in `app/page.tsx` with `fetch()` calls to your FastAPI endpoints when the backend is ready.

---

## Hardware

| Component | Description | Qty |
|---|---|---|
| PMS7003 | Dust sensor — measures PM1.0, PM2.5, PM10 | 2 |
| KidBright | Microcontroller board with WiFi (MicroPython) | 2 |
| JST 3AF-8 Cable | Connects PMS7003 to KidBright | 2 |

---

## PM2.5 Reference Scale

| PM2.5 (µg/m³) | Category |
|---|---|
| 0 – 12 | Good |
| 12 – 35 | Moderate |
| 35 – 55 | Unhealthy for Sensitive Groups |
| 55 – 150 | Unhealthy |
| 150+ | Hazardous |
