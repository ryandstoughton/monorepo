# TODO: Figure out how to isolate database connection details to its own file.
from sqlalchemy import create_engine
from sqlmodel import Session


engine = create_engine(
    "postgresql://mtg:mtg@localhost:5433/mtg",
    echo="debug",
)


def get_session():
    with Session(engine) as session:
        yield session
