from config import db

class Cell(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    cell_id = db.Column(db.String, unique=True, nullable=False)
    data = db.Column(db.JSON)  # Existing metadata
    obsm_data = db.Column(db.JSON)  # New field for .obsm data

    def to_dict(self):
        return {
            'id': self.id,
            'cell_id': self.cell_id,
            'data': self.data,
            'obsm_data': self.obsm_data
        }