import pymysql
from dbutils.pooled_db import PooledDB
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from db_config import DB_HOST, DB_USER, DB_PASSWD, DB_NAME
from datetime import datetime, date

pool = PooledDB(creator=pymysql,
                host=DB_HOST,
                user=DB_USER,
                password=DB_PASSWD,
                database=DB_NAME,
                maxconnections=1,
                blocking=True)

app = FastAPI()

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