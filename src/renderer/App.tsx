import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import DiffText from './pages/DiffText';
import EncryptMatch from './pages/EncryptMatch';
import CurlTransform from './pages/CurlTransform';
import Beautifier from './pages/Beautifier';

function App() {
  return (
    <ConfigProvider>
      <Router>
        <Routes>
          <Route path="/diffText" element={<DiffText />} />
          <Route path="/encryptMatch" element={<EncryptMatch />} />
          <Route path="/curlTransform" element={<CurlTransform />} />
          <Route path="/beautifier" element={<Beautifier />} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;
