import { useState } from 'react'
import './App.css'
import Footer from './components/Footer/Footer'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="bg-blue-500 text-white p-4">
  Hello, Tailwind CSS!
 
</div>

    </>
  )
}

export default App
