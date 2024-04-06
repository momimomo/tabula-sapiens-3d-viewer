import React from 'react';

function renderOnboardingText(step) {
    switch (step) {
      case 0:
        return `Welcome to Tabula Sapiens Blood Data 3D Visualizer! 
        
        This short guide will help you navigate through the features of this project.
        
        Currently, this appliation loads heavily processed Tabula Sapiens Blood Single Cells Dataset, 
        extracting cell ID, metadata and X_umap from obsm data for each cell from the .h5ad files,
        that can be found on the Tabula Sapiens project website. 
        
        The data processing has been done using Flask, PostgreSQL w/ SQLAlchemy, anndata and JavaScript.
        
        This processed dataset can be now explored using various controls and filters in 3D via this UI.
        `;
      case 1:
        return `Use your mouse buttons or touchpad to zoom and pan around the scene. 
        Hold Shift or Ctrl and drag to move the camera in the 3D viewport.
        
        The x and y points on the 3D chart are plotted using obsm_umap data, 
        which is also used for 2D charts on CELLxGENE. `;
      case 2:
        return `The sliders control the data range. Adjust them to filter the displayed data. 
        
        X and Y sliders control the gene expression, in same range as on CELLxGENE (-10,10).
        You can also filter by a chosen data attribute via Z slider, and the scale of the z-axis.
        
        The results in table on the left will be filterd based upon your selection.
        
        
        You can find more information in the parent repo about the tools used for this project.
        
        Have fun!
        Bartłomiej Jodłowski`;
      default:
        return "";
    }
  }
  
function OnboardingOverlay({ step, onNext, onSkip }) {
    // Generate the classname based on the step
  
    return (
        <div className="onboarding-overlay">
        <div className={`onboarding-text step-${step}`}>
          {renderOnboardingText(step)}
        </div>
        <div className="onboarding-buttons-container">
          <button className="onboarding-button" onClick={onNext}>Next</button>
          <button className="onboarding-button" onClick={onSkip}>Skip</button>
        </div>
      </div>
    );
  }
  export default OnboardingOverlay