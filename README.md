# tabula-sapiens-3d-viewer
3D data explorer for Tabula Sapiens datasets - Blood samples demo

Live demo available here: https://momimomo.github.io/tabula-sapiens-3d-viewer/

## 1. What's the purpose?

It is suprising to me that still so much visual analysis of the genome and cell data is reduced to only 2D!    

I decided to create 3D charts explorer based on available data from Tabula Sapiens project, similar to CELLxGENE, but in 3D. 

Along with some intuitive filters, maybe in future it will allow for easier visual analysis of test samples
when looking for multiple aspects of the analysed data. 

For now, it is also a great benchmark of browser performance, as single dataset holds around 50.000 data points.

This basic implementation is looking at the data from Blood Single Cell dataset.

The problem at hand was that the files that can be found there are quite big, and in multidimensional format.
However, via combination of tools, I was able to create a proof of concept for performant 3D charts with dynamic filters.
You can see the example via the link above. 

## 2. Install prerequisites

Docker is used to containerize a Flask application and a PostgreSQL database, ensuring a consistent and isolated environment for development. 

Frontend can be built outside of a docker container, but it should run via docker-compose.
    
## 3. Data

I implemented a method to load .h5ad files and process their contents, extracting cell metadata and dimensionality reduction data (.obsm), 
particularly focusing on UMAP coordinates for visualizations. 
    
You will need to download this data from: https://figshare.com/articles/dataset/Tabula_Sapiens_release_1_0/14267219
    
## 4. API Development

Currently I developed Flask endpoints to:
- Load data from .h5ad files into the database.
- Summarize the dataset, providing insights into its structure (e.g., .obs, .var, .obsm, .varm, and .uns components).
- Fetch and serve cell data, enabling downstream analysis and visualization.

## 5. Local development

    a. First, grab a .h5ad files from Tabula Sapiens website:
    https://figshare.com/articles/dataset/Tabula_Sapiens_release_1_0/14267219
    Then, unpack it and put it into /backend/datasets.
    
    b. Run `docker-compose up`in the folder with docker-compose file.
    
    c.* You might need to remove migrations folder and run `flask db init` from the web container.
    
    d. After everything starts, you might need to run a curl (replace filename) :
    ```
      curl -X POST http://localhost:5000/summarize_h5ad -H "Content-Type: application/json" -d '{"path":"/app/datasets/<filename>.h5ad"}'
    ```
    Then, everything should work if you uncomment real calls in frontend api (fetchData.js) as it currently doesnt require backend.
    
    *But you shouldn't need to! Migrations folder is stored in the repo and should automatically load into the docker container.

## 6. UI - next steps

I've implemented the frontend features using React, react-window for scrollable, searchable lists, and three.js for interactive 3D visualizations, aiming to enhance data exploration and presentation.
    
I'm now considering the scalability and performance optimizations, especially for handling large datasets and complex queries. 
Currently 50.000 elements are shown on list dynamically, along with 50.000 points live on the 3D screen which is a good result, 
but can be further optimized via various techniques.

However, going above 1 000 000 points in JavaScript can be a challenge, so additional optimizations, including chunking, or creating denser cloud points would be necessary.
Also, more changes to the Flask API endpoints would be necessary, to allow filtering on the backend level.
    
Contact me if you think that you have a good idea what can be the most beneficial trajectory of this project for any potential users!
