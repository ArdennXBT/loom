import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Tracker from './pages/Tracker';
import Scanner from './pages/Scanner';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/tracker" element={<Tracker />} />
        <Route path="/scanner" element={<Scanner />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;