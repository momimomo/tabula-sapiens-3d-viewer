// src/DataList.js
import React from 'react';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

const DataList = ({ data, zMetric }) => {
  const rowHeight = 400;

  const Row = ({ index, style }) => (
    <div style={style}>
      <h4>{data[index]?.id}</h4>
      X: {data[index]?.x}
      <br />
      Y: {data[index]?.y}
      <br />
      Z {data[index]?.z}
      <br />
      
      <h4>Ontology class:</h4>
      <p> {data[index]?.data?.cell_ontology_class}</p> 
      
      <h4> UMIs | n_genes:</h4>
      <p>  {data[index]?.data?.n_counts_UMIs} UMIs</p>

      <p>{data[index]?.data?.n_genes} n_genes</p>


    </div>
  );

  return (
    <AutoSizer>
        {({ height, width }) => (
            <List
            height={height}
            itemCount={data.length}
            itemSize={rowHeight}
            width={width}
            >
            {Row}
            </List>
        )}
    </AutoSizer>
  );
};

export default DataList;
