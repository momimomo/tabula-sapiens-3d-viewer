import React, { useState, useEffect, Suspense } from 'react';
import Visualize from './Visualize';
import DataList from './DataList';
import Controls from './Controls';
import fetchData from './fetchData';
import './App.css';
import OnboardingOverlay from './OnboardingOverlay';


function App() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [autorotate, setAutorotate] = useState(true);

  const [error, setError] = useState(null);
  const [zMinMax, setzMinMax] = useState([0, 1000]);
  

  const [zMetric, setZMetric] = useState('n_counts_UMIs'); // Default z-axis metric
  const [filters, setFilters] = useState({ x: [-10, 10], y: [-10, 10], z: [0, 1000] });
  
  const [filterBy, setFilterBy] = useState(null);
  
  const [onboardingActive, setOnboardingActive] = useState(true);
  const [onboardingStep, setOnboardingStep] = useState(0);

  const handleNext = () => {
    // Implement next step logic
    if (onboardingStep < 2) {
      setOnboardingStep(onboardingStep + 1)
    } else {
      setOnboardingStep(0)
      setOnboardingActive(false)
    }
  };

  const handleSkip = () => {
    setOnboardingActive(false);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const fetchedData = await fetchData();
        setData(fetchedData);
        console.log(fetchedData)
        
        const newData = filterData({data: fetchedData, zMaxVal: zMinMax[1], zMetric, filterBy})
        setFilteredData(newData)
        
        // const downloadData = fetchedData.map(i => ({
        //   cell_id: i.cell_id,
        //   data: {
        //     cell_ontology_class: i.data?.cell_ontology_class,
        //     n_counts_UMIs: i.data?.n_counts_UMIs,
        //     n_genes: i.data?.n_genes,
        //   },
        //   obsm_data: i.obsm_data
        // }))
        
        // downloadJsonData(JSON.stringify(downloadData), 'ts_blood.json')
        setLoading(false); 

      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleZMetricChange = (newMetric) => {
    setZMetric(newMetric);
  };

  const handleFilterChange = (axis, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [axis]: value,
    }));
    console.log(filters)
    const newData = filterData({data, zMaxVal: zMinMax[1], zMetric, filterBy})

    setFilteredData(newData)
  };
  
  const handleSetFilterBy = (filterByQuery) => {
    console.log('filterByQuery :: ', filterByQuery)
    setFilterBy(filterByQuery);
    const newData = filterData({data, zMaxVal: zMinMax[1], zMetric, filterBy: filterByQuery})
    setFilteredData(newData)
  }
    
  const filterData = ({data, zMaxVal, zMetric, filterBy}) => {
    const zScaleVal = zMaxVal === Infinity ? 1000 : zMaxVal;
    let filteredData = [];
    data.forEach(i => {
      const { umap } = i.obsm_data;
      const x = umap[0];
      const y = umap[1];
      const z = i.data?.[zMetric] * (1 / zScaleVal); 
      

      if (filterBy && filterBy.key && filterBy.value) {
        const shouldFilterBy = filterBy && filterBy.value === i.data[filterBy.key]
        if (shouldFilterBy) { 
          const isVisible = 
          (filters.x[0] === null || x >= filters.x[0]) && (filters.x[1] === null || x <= filters.x[1]) &&
          (filters.y[0] === null || y >= filters.y[0]) && (filters.y[1] === null || y <= filters.y[1]) &&
          (filters.z[0] === null || z >= filters.z[0]) && (filters.z[1] === null || z <= filters.z[1]);
          if (isVisible) {
            filteredData.push({id: i.cell_id, data: i.data, x, y, z}) 
          }
        }
      } else {
        const isVisible = 
        (filters.x[0] === null || x >= filters.x[0]) && (filters.x[1] === null || x <= filters.x[1]) &&
        (filters.y[0] === null || y >= filters.y[0]) && (filters.y[1] === null || y <= filters.y[1]) &&
        (filters.z[0] === null || z >= filters.z[0]) && (filters.z[1] === null || z <= filters.z[1]);  
        if (isVisible) {
          filteredData.push({id: i.cell_id, data: i.data, x, y, z}) 
        }
      }
    })
  
    return filteredData
  }
  


  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Suspense fallback={<div>Loading...</div>}>
    <div className="app">
      {onboardingActive && (
        <OnboardingOverlay
          step={onboardingStep}
          onNext={handleNext}
          onSkip={handleSkip}
        />
      )}
    <div className="data-list-container">
      <h3>Filtered results: </h3>
      <DataList data={filteredData} zMetric={zMetric} />
    </div>
    <div className="main-container">
      <Visualize autorotate={autorotate} zMaxVal={zMinMax[1]} data={filteredData} zMetric={zMetric} filters={filters} />
      <div className="controls-container">
        <Controls
          zMetric={zMetric}
          setAutorotate={setAutorotate}
          autorotate={autorotate}
          onZMetricChange={handleZMetricChange}
          filters={filters}
          onFilterChange={handleFilterChange}
          zMinMax={zMinMax}
          setzMinMax={setzMinMax}
          filterBy={filterBy}
          setFilterBy={handleSetFilterBy}
        />
      </div>
    </div>
  </div>
  </Suspense>

  );
}

export default App;