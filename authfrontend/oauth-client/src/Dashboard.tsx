import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      navigate('/');
    } else {
      localStorage.setItem('token', token);
      const payload = JSON.parse(atob(token.split('.')[1]));
      setEmail(payload.email);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h2>Welcome, {email}</h2>
      <button onClick={handleLogout} style={{ marginTop: '20px' }}>Logout</button>
    </div>
  );
};

export default Dashboard;
