from contextlib import contextmanager
from sqlalchemy import create_engine
from sqlmodel import Session


engine = create_engine(
    "postgresql://mtg:mtg@localhost:5433/mtg",
)


@contextmanager
def session_context():
    db = Session(engine)
    try:
        yield db
    finally:
        db.close()


def get_session():
    db = Session(engine)
    try:
        yield db
    finally:
        db.close()
