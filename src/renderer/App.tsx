import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DiffText from './pages/DiffText';
import EncryptMatch from './pages/EncryptMatch';
import CurlTransform from './pages/CurlTransform';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/diffText" element={<DiffText />} />
        <Route path="/encryptMatch" element={<EncryptMatch />} />
        <Route path="/curlTransform" element={<CurlTransform />} />
      </Routes>
    </Router>
  );
}

export default App;
