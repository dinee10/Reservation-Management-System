import { useState } from 'react'

import 'bootstrap/dist/css/bootstrap.min.css';

import Approutes from './routes/Approutes';



function App() {
  const [count, setCount] = useState(0)
  return (

    <Approutes/>

  );

 
}

export default App;

