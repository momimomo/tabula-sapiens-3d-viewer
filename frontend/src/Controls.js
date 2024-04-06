// src/Controls.js
import React from 'react';
import RangeSlider from './RangeSlider';

const Controls = ({
  zMetric,
  onZMetricChange,
  filters,
  onFilterChange,
  zMinMax,
  setzMinMax,
  filterBy,
  setFilterBy,
  autorotate,
  setAutorotate
}) => {
  const handleFilterInputChange = (axis, minOrMax, value) => {
    const numericValue = isNaN(value) ? 0 : Number(value);
    const newRange = [...filters[axis]];
    newRange[minOrMax] = numericValue;
    onFilterChange(axis, newRange);
  };

  const handleZMinMaxChange = (minOrMax, value) => {
    const numericValue = isNaN(value) ? 0 : Number(value);
    const newRange = [...zMinMax];
    newRange[minOrMax] = numericValue;
    setzMinMax(newRange);
  };

  const handleDataFilterKeyChange = (e) => {
    console.log('e  :: ', e.target.value)
    setFilterBy({...filterBy, key: e.target.value});
  };

  const handleDataFilterValueChange = (e) => {
    setFilterBy({...filterBy, value: e.target.value});
  };

  return (
    <div style={{ padding: "20px"}}>
      <div style={{marginBottom: '12px' }}>
        <label htmlFor="z-metric-select">Z Metric: </label>
        <select
          id="z-metric-select"
          value={zMetric}
          onChange={(e) => onZMetricChange(e.target.value)}
        >
          <option value="n_counts_UMIs">n_counts_UMIs</option>
          <option value="n_genes">n_genes</option>
        </select>
        <label htmlFor={'autorotate-checkbox'}>Autorotate: </label>

        <input
            type="checkbox"
            id={'autorotate-checkbox'}
            value={'autorotate-checkbox'}
            checked={autorotate}
            onChange={e => setAutorotate(!autorotate)}
          />
      </div>
      {["x", "y", "z"].map((axis) => (
        <div key={axis} style={{height: '48px'}}>
          <label>{`${axis.toUpperCase()} Min:`}</label>
          <input
            type="number"
            value={filters[axis][0]}
            onChange={(e) => handleFilterInputChange(axis, 0, e.target.value)}
          />
          <label>{`${axis.toUpperCase()} Max:`}</label>
          <input
            type="number"
            value={filters[axis][1]}
            onChange={(e) => handleFilterInputChange(axis, 1, e.target.value)}
          />
          <div style={{marginTop: '8px'}}>
          <RangeSlider
            axis={axis}
            maxRangeValue={axis === 'z' ? zMinMax[1] : undefined}
            range={filters[axis]}
            onRangeChange={onFilterChange}
          />
          </div>
        </div>
      ))}
      <div style={{marginTop: '12px'}}>
        <label>Z-Axis Range Min:</label>
        <input
          type="number"
          value={zMinMax[0]}
          onChange={(e) => handleZMinMaxChange(0, e.target.value)}
        />
        <label>Z-Axis Range Max:</label>
        <input
          type="number"
          value={zMinMax[1]}
          onChange={(e) => handleZMinMaxChange(1, e.target.value)}
        />
      </div>
      <div style={{marginTop: '12px'}}>
        <label>Data Filter Key:</label>
        <input
          type="text"
          value={filterBy?.key}
          onChange={handleDataFilterKeyChange}
        />
        <label>Data Filter Value:</label>
        <input
          type="text"
          value={filterBy?.value}
          onChange={handleDataFilterValueChange}
        />
      </div>
    </div>
  );
};

export default Controls;
