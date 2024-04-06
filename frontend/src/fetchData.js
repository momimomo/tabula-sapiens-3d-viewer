// this is a temporary solution just to load a single json file directly from repo
// on GH pages. Normally it was used like so, with the docker-compose setup locally:

// const fetchData = async () => {
//   const response = await fetch('http://localhost:5000/cells/all');
//   if (!response.ok) {
//     throw new Error('Network response was not ok');
//   }
//   return response.json();
// };


const fetchData = async () => {
    const response = await import('./ts_blood.json');
    return response.default;
  };
  
  export default fetchData;
  