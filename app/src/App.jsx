import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TextGen from './component/TextGen'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <TextGen/>
      </div>
    </>
  )
}

export default App
