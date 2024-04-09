# Tabula Sapiens 3D Data Viewer

The Tabula Sapiens 3D Data Viewer is a web application designed to explore Tabula Sapiens datasets in three dimensions, focusing initially on blood samples. 
Live Demo: [Tabula Sapiens 3D Viewer](https://momimomo.github.io/tabula-sapiens-3d-viewer/)

Works best on 16:9 or 16:10 desktops with Google Chrome or Edge.

## Purpose

Despite the advanced state of genomic and cellular analysis, a significant portion of visual data analysis remains confined to two-dimensional representations. 

This project introduces a 3D data exploration tool, inspired by CELLxGENE, to facilitate a more intuitive and comprehensive visual analysis of genetic test samples. 

The tool is particularly useful for examining multiple aspects of data simultaneously and serves as an effective benchmark for browser performance, managing datasets with approximately 50,000 data points. 

Currently, the viewer is applied to explore the Blood Single Cell dataset.


### Installation Prerequisites

The backend infrastructure utilizes Docker to containerize both a Flask application and a PostgreSQL database, ensuring consistent, isolated development environments. While the frontend build process occurs outside Docker, it operates within a docker-compose environment for integration.

### Data Processing

To visualize the datasets, the viewer processes .h5ad files, extracting cell metadata and dimensionality reduction data, specifically UMAP coordinates, for 3D visualization. Data is sourced from the Tabula Sapiens release available online.

### API Development

The Flask backend supports several functions, including:
- Loading .h5ad file data into the database.
- Summarizing datasets to outline structure and components.
- Serving cell data for analysis and visualization.

### Local Development Setup

Local setup involves downloading .h5ad files, preparing the backend dataset directory, and executing `docker-compose up`. 
Curl for populating database:
`
curl -X POST http://localhost:5000/summarize_h5ad -H "Content-Type: application/json" -d '{"path":"/app/datasets/<filename>.h5ad"}'
`

### UI and Future Directions

The frontend is developed with React, employing react-window for efficient list management and three.js for 3D visualization. Future considerations focus on scalability and optimization for handling large datasets and complex queries. The current capacity includes dynamically displaying 50,000 elements in lists and 3D visualizations, with ambitions to scale beyond one million points through advanced techniques and backend filtering enhancements.

### Collaboration and Contact

The project is open for collaboration. Let me know if you have some ideas!

