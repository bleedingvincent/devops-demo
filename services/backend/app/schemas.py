from pydantic import BaseModel, Field


class ItemCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    description: str | None = None
    description: str | None = Field(None, max_length=500)


class ItemOut(BaseModel):
    id: int
    name: str
    description: str | None = None
