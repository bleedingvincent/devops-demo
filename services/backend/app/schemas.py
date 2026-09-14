from pydantic import BaseModel

class ItemBase(BaseModel):
    name: str

class ItemCreate(ItemBase):
    description: str | None = None

class ItemOut(ItemBase):
    id: int
    description: str | None = None

    class Config:
        from_attributes = True
        orm_mode = True
