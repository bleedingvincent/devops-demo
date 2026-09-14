from pydantic import BaseModel, Field

class ItemBase(BaseModel):
    name: str

class ItemCreate(ItemBase):
    description: str | None = Field(None, max_length=500)

class ItemOut(BaseModel):
    id: int
    name: str
    description: str | None = Field(None, max_length=500)

    class Config:
        from_attributes = True
