import { Range } from 'react-range';

const RangeSlider = ({ axis, range, onRangeChange, minRangeValue = -10, maxRangeValue = 10 }) => {
  // Assuming 'range' is passed in the same format as your filters, e.g., {x: [0, null], y: [0, null], z: [0, null]}
  // Convert 'null' to a maximum value for the slider. Determine a sensible maximum based on your data.
  const initialValues = range.map(value => value === null ? maxRangeValue : value);

  return (
    <Range
      step={0.1}
      min={minRangeValue}
      max={maxRangeValue}
      values={initialValues}
      onChange={values => onRangeChange(axis, values)}
      renderTrack={({ props, children }) => (
        <div {...props} style={{ ...props.style, height: '6px', width: '100%', backgroundColor: '#ccc' }}>
          {children}
        </div>
      )}
      renderThumb={({ props }) => (
        <div {...props} style={{ ...props.style, height: '16px', width: '16px', backgroundColor: '#999' }} />
      )}
    />
  );
};

export default RangeSlider
