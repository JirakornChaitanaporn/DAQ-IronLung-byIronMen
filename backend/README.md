pip install requirements.txt

# How to Run the Backend Web App

Follow these steps to set up and run the backend API server:

## 1. Navigate to the backend directory

```
cd backend
```

## 2. Create a Python virtual environment

```
python -m venv .venv
```

## 3. Activate the virtual environment

- On macOS/Linux:
	```
	source .venv/bin/activate
	```
- On Windows:
	```
	.venv\Scripts\activate
	```

## 4. Install dependencies

```
pip install -r requirements.txt
```

## 5. Configure the database

Ensure your database is running and the connection details in `db_config.py` are correct.

## 6. Start the FastAPI server

```
uvicorn api:app --reload
```

The backend API will be available at [http://localhost:8000](http://localhost:8000).

---