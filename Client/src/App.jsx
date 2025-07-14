import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Room from './pages/Room';
import Home from './pages/Home';
import CanvasPage from './pages/Canvas'; // placeholder for your canvas component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/room' element={<Room/>}/>
        <Route path="/canvas/:roomId" element={<CanvasPage />} />
      </Routes>
    </Router>
  );
}

export default App;
