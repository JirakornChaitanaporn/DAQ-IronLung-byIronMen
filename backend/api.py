import pymysql
from dbutils.pooled_db import PooledDB
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from db_config import DB_HOST, DB_USER, DB_PASSWD, DB_NAME
from datetime import datetime, date
from predict import IndoorPredictor, IndoorPredictorLR
from suggestion import Suggest

pool = PooledDB(creator=pymysql,
                host=DB_HOST,
                user=DB_USER,
                password=DB_PASSWD,
                database=DB_NAME,
                maxconnections=1,
                blocking=True)

app = FastAPI()

# Initialize singleton predictors (cached globally)
rf_predictor = IndoorPredictor()
lr_predictor = IndoorPredictorLR()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["GET"],
    allow_headers=["*"],
)

class project_aqi_api(BaseModel):
    id: int
    ts: datetime
    lat: float
    lon: float
    aqi: int
    
class project_kidbright_indoor(BaseModel):
    id: int
    ts: datetime
    temp_dht: int
    humidity:int
    pm1:int
    pm25:int
    pm10: int
    
class project_kidbright_outdoor(BaseModel):
    id: int
    ts: datetime
    temp_dht: int
    humidity:int
    pm1:int
    pm25:int
    pm10: int
    
class project_weather_api(BaseModel):
    id: int
    ts: datetime
    lat: float
    lon: float
    humid:int
    rainfall:int
    temp:float
    windspeed:float

@app.get("/predicted_pm1_random_forest")
def get_predicted1():
    conn = pool.connection()
    cursor = conn.cursor(pymysql.cursors.DictCursor)

    cursor.execute("SELECT temp_dht, pm1 FROM project_kidbright_outdoor ORDER BY id DESC LIMIT 1")
    outdoor = cursor.fetchone()

    cursor.execute("SELECT humid, rainfall, temp, windspeed FROM project_weather_api ORDER BY id DESC LIMIT 1")
    weather = cursor.fetchone()

    cursor.execute("SELECT aqi FROM project_aqi_api ORDER BY id DESC LIMIT 1")
    aqi = cursor.fetchone()

    cursor.close()
    conn.close()
    now = datetime.now()

    ts = now.strftime("%Y-%m-%d %H:%M:%S")
    
    # Use cached singleton predictor (models loaded once)
    return {"ts": ts,"pm1": round(rf_predictor.predict_pm1(outdoor["pm1"], weather["windspeed"], aqi["aqi"], outdoor["temp_dht"], weather["humid"]))}

@app.get("/predicted_pm10_random_forest")
def get_predicted10():
    conn = pool.connection()
    cursor = conn.cursor(pymysql.cursors.DictCursor)

    cursor.execute("SELECT temp_dht, pm10 FROM project_kidbright_outdoor ORDER BY id DESC LIMIT 1")
    outdoor = cursor.fetchone()

    cursor.execute("SELECT humid, rainfall, temp, windspeed FROM project_weather_api ORDER BY id DESC LIMIT 1")
    weather = cursor.fetchone()

    cursor.execute("SELECT aqi FROM project_aqi_api ORDER BY id DESC LIMIT 1")
    aqi = cursor.fetchone()

    cursor.close()
    conn.close()
    now = datetime.now()

    ts = now.strftime("%Y-%m-%d %H:%M:%S")
    
    # Use cached singleton predictor (models loaded once)
    return {"ts": ts,"pm10": round(rf_predictor.predict_pm10(outdoor["pm10"], weather["windspeed"], aqi["aqi"], outdoor["temp_dht"], weather["humid"]))}


@app.get("/predicted_pm25_random_forest")
def get_predicted25():
    conn = pool.connection()
    cursor = conn.cursor(pymysql.cursors.DictCursor)

    cursor.execute("SELECT temp_dht, pm25 FROM project_kidbright_outdoor ORDER BY id DESC LIMIT 1")
    outdoor = cursor.fetchone()

    cursor.execute("SELECT humid, rainfall, temp, windspeed FROM project_weather_api ORDER BY id DESC LIMIT 1")
    weather = cursor.fetchone()

    cursor.execute("SELECT aqi FROM project_aqi_api ORDER BY id DESC LIMIT 1")
    aqi = cursor.fetchone()

    cursor.close()
    conn.close()
    now = datetime.now()

    ts = now.strftime("%Y-%m-%d %H:%M:%S")
    
    # Use cached singleton predictor (models loaded once)
    return {"ts": ts,"pm25": round(rf_predictor.predict_pm25(outdoor["pm25"], weather["windspeed"], aqi["aqi"], outdoor["temp_dht"], weather["humid"]))}
    

@app.get("/outdoor")
def get_kidbright_outdoor_data():
    conn = pool.connection()
    cursor = conn.cursor(pymysql.cursors.DictCursor)

    cursor.execute("""
        SELECT id, ts, temp_dht, pm1, pm25, pm10
        FROM project_kidbright_outdoor
    """)

    data = cursor.fetchall()

    cursor.close()
    conn.close()
    return data

@app.get("/outdoor_last_24hour")
def get_kidbright_outdoor_last_24hour():
    conn = pool.connection()
    cursor = conn.cursor(pymysql.cursors.DictCursor)

    cursor.execute("""
        SELECT id, ts, temp_dht, pm1, pm25, pm10
        FROM project_kidbright_outdoor
        WHERE ts >= NOW() - INTERVAL HOUR;
    """)

    data = cursor.fetchall()

    cursor.close()
    conn.close()
    return data


@app.get("/indoor")
def get_kidbright_indoor_data():
    conn = pool.connection()
    cursor = conn.cursor(pymysql.cursors.DictCursor)

    cursor.execute("""
        SELECT id, ts, temp_dht, pm1, pm25, pm10
        FROM project_kidbright_indoor
    """)
    
    data = cursor.fetchall()

    cursor.close()
    conn.close()
    return data

@app.get("/indoor_last_24hour")
def get_kidbright_indoor_last_24hour():
    conn = pool.connection()
    cursor = conn.cursor(pymysql.cursors.DictCursor)

    cursor.execute("""
        SELECT id, ts, temp_dht, pm1, pm25, pm10
        FROM project_kidbright_indoor
        WHERE ts >= NOW() - INTERVAL 24 HOUR;
    """)
    
    data = cursor.fetchall()

    cursor.close()
    conn.close()
    return data

@app.get("/aqi_api")
def get_aqi_api():
    conn = pool.connection()
    cursor = conn.cursor(pymysql.cursors.DictCursor)

    cursor.execute("""
        SELECT lat, lon, aqi
        FROM project_aqi_api
    """)
    
    data = cursor.fetchall()

    cursor.close()
    conn.close()
    return data

@app.get("/aqi_api_last_24hour")
def get_aqi_api_last_24hour():
    conn = pool.connection()
    cursor = conn.cursor(pymysql.cursors.DictCursor)

    cursor.execute("""
        SELECT lat, lon, aqi
        FROM project_aqi_api
        WHERE ts >= NOW() - INTERVAL 24 HOUR;
    """)
    
    data = cursor.fetchall()

    cursor.close()
    conn.close()
    return data


@app.get("/weather_api")
def get_weather_api():
    conn = pool.connection()
    cursor = conn.cursor(pymysql.cursors.DictCursor)

    cursor.execute("""
        SELECT lat, lon, humid, rainfall, temp, windspeed
        FROM project_weather_api
    """)
    
    data = cursor.fetchall()

    cursor.close()
    conn.close()
    return data

@app.get("/weather_api_last_24hour")
def get_weather_api_last_24hour():
    conn = pool.connection()
    cursor = conn.cursor(pymysql.cursors.DictCursor)

    cursor.execute("""
        SELECT lat, lon, humid, rainfall, temp, windspeed
        FROM project_weather_api
        WHERE ts >= NOW() - INTERVAL 24 HOUR;
    """)
    
    data = cursor.fetchall()

    cursor.close()
    conn.close()
    return data


@app.get("/predicted_pm1_linear_regression")
def get_predicted1_lr():
    conn = pool.connection()
    cursor = conn.cursor(pymysql.cursors.DictCursor)

    cursor.execute("SELECT temp_dht, pm1 FROM project_kidbright_outdoor ORDER BY id DESC LIMIT 1")
    outdoor = cursor.fetchone()

    cursor.execute("SELECT humid, rainfall, temp, windspeed FROM project_weather_api ORDER BY id DESC LIMIT 1")
    weather = cursor.fetchone()

    cursor.execute("SELECT aqi FROM project_aqi_api ORDER BY id DESC LIMIT 1")
    aqi = cursor.fetchone()

    cursor.close()
    conn.close()
    now = datetime.now()

    ts = now.strftime("%Y-%m-%d %H:%M:%S")
    
    # Use cached singleton predictor (models loaded once)
    return {"ts": ts, "pm1": round(lr_predictor.predict_pm1(outdoor["pm1"], weather["windspeed"], aqi["aqi"], outdoor["temp_dht"], weather["humid"]))}


@app.get("/predicted_pm10_linear_regression")
def get_predicted10_lr():
    conn = pool.connection()
    cursor = conn.cursor(pymysql.cursors.DictCursor)

    cursor.execute("SELECT temp_dht, pm10 FROM project_kidbright_outdoor ORDER BY id DESC LIMIT 1")
    outdoor = cursor.fetchone()

    cursor.execute("SELECT humid, rainfall, temp, windspeed FROM project_weather_api ORDER BY id DESC LIMIT 1")
    weather = cursor.fetchone()

    cursor.execute("SELECT aqi FROM project_aqi_api ORDER BY id DESC LIMIT 1")
    aqi = cursor.fetchone()

    cursor.close()
    conn.close()
    now = datetime.now()

    ts = now.strftime("%Y-%m-%d %H:%M:%S")
    
    # Use cached singleton predictor (models loaded once)
    return {"ts": ts, "pm10": round(lr_predictor.predict_pm10(outdoor["pm10"], weather["windspeed"], aqi["aqi"], outdoor["temp_dht"], weather["humid"]))}


@app.get("/predicted_pm25_linear_regression")
def get_predicted25_lr():
    conn = pool.connection()
    cursor = conn.cursor(pymysql.cursors.DictCursor)

    cursor.execute("SELECT temp_dht, pm25 FROM project_kidbright_outdoor ORDER BY id DESC LIMIT 1")
    outdoor = cursor.fetchone()

    cursor.execute("SELECT humid, rainfall, temp, windspeed FROM project_weather_api ORDER BY id DESC LIMIT 1")
    weather = cursor.fetchone()

    cursor.execute("SELECT aqi FROM project_aqi_api ORDER BY id DESC LIMIT 1")
    aqi = cursor.fetchone()

    cursor.close()
    conn.close()
    now = datetime.now()

    ts = now.strftime("%Y-%m-%d %H:%M:%S")
    
    # Use cached singleton predictor (models loaded once)
    return {"ts": ts, "pm25": round(lr_predictor.predict_pm25(outdoor["pm25"], weather["windspeed"], aqi["aqi"], outdoor["temp_dht"], weather["humid"]))}

@app.get("/suggestion")
def suggestion():
    conn = pool.connection()
    cursor = conn.cursor(pymysql.cursors.DictCursor)

    cursor.execute("SELECT temp_dht, pm25 , pm1, pm10 FROM project_kidbright_outdoor ORDER BY id DESC LIMIT 1")
    outdoor = cursor.fetchone()

    cursor.execute("SELECT humid, rainfall, temp, windspeed FROM project_weather_api ORDER BY id DESC LIMIT 1")
    weather = cursor.fetchone()

    cursor.execute("SELECT aqi FROM project_aqi_api ORDER BY id DESC LIMIT 1")
    aqi = cursor.fetchone()

    cursor.close()
    conn.close()
    now = datetime.now()

    ts = now.strftime("%Y-%m-%d %H:%M:%S")
    
    indoor_pm1 = round(lr_predictor.predict_pm1(outdoor["pm1"], weather["windspeed"], aqi["aqi"], outdoor["temp_dht"], weather["humid"]))
    indoor_pm10 = round(lr_predictor.predict_pm10(outdoor["pm10"], weather["windspeed"], aqi["aqi"], outdoor["temp_dht"], weather["humid"]))
    indoor_pm125 = round(lr_predictor.predict_pm25(outdoor["pm25"], weather["windspeed"], aqi["aqi"], outdoor["temp_dht"], weather["humid"]))
    
    indoor_dust_list = [indoor_pm1, indoor_pm10, indoor_pm125]
    outdoor_dust_list = [outdoor["pm1"], outdoor["pm10"], outdoor["pm25"]]
    
    return {"ts":ts ,"Suggestion":Suggest.suggest(indoor_dust_list, outdoor_dust_list)}