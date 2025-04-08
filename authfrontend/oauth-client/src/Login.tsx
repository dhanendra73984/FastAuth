import { useEffect, useState } from 'react';
import { FaGithub, FaGoogle } from 'react-icons/fa';
import './Login.css';

const Login = () => {
  const [loading, setLoading] = useState(true);
  const backendURL = 'http://localhost:5000/api/auth';

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000); // simulate loading
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="login-container">
      <div className={`login-card ${loading ? 'spinning' : ''}`}>
        <div>
          <h1 className="login-title">
            Welcome to <span className="highlight">FastAuth</span>
          </h1>
          <p className="login-subtitle">Sign in with your account to continue</p>

          <div className="login-buttons">
            <a href={`${backendURL}/github`} className="btn github-btn">
              <FaGithub className="icon" />
              <span>Continue with GitHub</span>
            </a>
            <a href={`${backendURL}/google`} className="btn google-btn">
              <FaGoogle className="icon" />
              <span>Continue with Google</span>
            </a>
          </div>
        </div>

        <p className="login-footer">
          By continuing, you agree to our <span className="link">Terms of Service</span> and{' '}
          <span className="link">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
};

export default Login;
