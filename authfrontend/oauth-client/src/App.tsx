import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
// import Login from './pages/Login';
// import Dashboard from './pages/Dashboard';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/oauth-success" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;


