import uvicorn
from fastapi import FastAPI
from cards.router import router as cards_router


app = FastAPI()
app.include_router(cards_router)

def main():
    uvicorn.run("server.main:app", host="0.0.0.0", port=8000, reload=True)
