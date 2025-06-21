from fastapi import FastAPI
from sqlalchemy import create_engine
import uvicorn

app = FastAPI()
engine = create_engine(
    "postgresql://mtg:mtg@localhost:5432/mtg",
    echo="debug",
    connect_args={"check_same_thread": False},
)


@app.get("/")
async def root():
    return {"message": "Hello World"}


def main():
    uvicorn.run("server.main:app", host="0.0.0.0", port=8000, reload=True)
