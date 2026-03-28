import pymysql
from dbutils.pooled_db import PooledDB
from fastapi import FastAPI, HTTPException
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
    humidity:int
    rainfall:int
    temp:float
    windspeed:float

