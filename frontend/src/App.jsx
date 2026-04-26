import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './components/Home'
import Article from './components/Article'
import Challenges from './components/Challenges'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="article/:id" element={<Article />} />
          <Route path="challenges" element={<Challenges />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
