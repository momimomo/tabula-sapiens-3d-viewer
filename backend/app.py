from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
import os
import anndata
from config import db  
from models import Cell  # Ensure this import is below db initialization

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://user:password@db/tabula_sapiens'
db.init_app(app)  # Attach the app to the db instance
migrate = Migrate(app, db)

def process_obs_to_cells(adata):
    cells = []
    # Example: Assuming you're interested in UMAP coordinates stored in .obsm['X_umap']
    if 'X_umap' in adata.obsm.keys():
        umap_coordinates = adata.obsm['X_umap']
    else:
        umap_coordinates = None

    for index, (cell_id, metadata) in enumerate(adata.obs.iterrows()):
        cell_metadata = metadata.to_dict()  # Convert the Series to a dict
        # Extract .obsm data for this cell, if available
        cell_obsm_data = {}
        if umap_coordinates is not None:
            # Assuming each row in umap_coordinates corresponds to a cell, in the same order as adata.obs
            cell_obsm_data['umap'] = umap_coordinates[index].tolist()  # Convert numpy array to list

        cells.append(Cell(cell_id=cell_id, data=cell_metadata, obsm_data=cell_obsm_data))

    # Assume db_session is your SQLAlchemy session
    db.session.bulk_save_objects(cells)
    db.session.commit()


@app.route('/summarize_h5ad', methods=['POST'])
def summarize_h5ad():
    # Check if the request contains a path
    if not request.json or 'path' not in request.json:
        return jsonify({'error': 'Please provide the path to the .h5ad file'}), 400
    
    filepath = request.json['path']
    
    # Check if the file exists
    if not os.path.exists(filepath):
        return jsonify({'error': 'File not found'}), 404
    
    try:
        # Load the .h5ad file
        adata = anndata.read_h5ad(filepath)
        
        # Summarize the data
        summary = {
            'obs': str(adata.obs.head()),
            'var': str(adata.var.head()),
            'obsm_keys': list(adata.obsm.keys()),
            'varm_keys': list(adata.varm.keys()),
            'uns_keys': list(adata.uns.keys())
        }
        
        process_obs_to_cells(adata)
        
        return jsonify(summary)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
        

@app.route('/cells/all', methods=['GET'])
def get_metadata_by_cell_type():
    cells = Cell.query.all()
    cells_dict = [cell.to_dict() for cell in cells]  # Convert each Cell to a dict
    return jsonify(cells_dict)


if __name__ == '__main__':
    app.run(debug=True)
    
    
# @app.route('/cell_types', methods=['GET'])
# def get_cell_types():
#     cell_types_query = CellType.query.all()
#     cell_types_list = []
#     for cell_type in cell_types_query:
#         cell_types_list.append({
#             'id': cell_type.id,
#             'name': cell_type.name,
#             'metadata': [{
#                 'key': metadata.key,
#                 'value': metadata.value
#             } for metadata in cell_type.metadata]
#         })
#     return jsonify(cell_types_list)


