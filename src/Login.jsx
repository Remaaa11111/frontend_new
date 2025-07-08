import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { notification } from 'antd';
import { AuthContext } from './providers/AuthProvider';
import styles from './Login.module.css';

// Fungsi kirim data login ke backend
const sendData = async (url, formData) => {
  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });
  const data = await response.json();
  return { ok: response.ok, data };
};

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [role, setRole] = useState('member');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('role', role); // ⬅️ kirim role ke backend

    try {
      const { ok, data } = await sendData("http://127.0.0.1:5000/api/auth/login", formData);
      if (ok && data?.access_token) {
        // ⬇️ SIMPAN TOKEN DI LOCAL STORAGE
        localStorage.setItem("access_token", data.access_token);

        login(data.access_token); // simpan ke context juga

        // redirect berdasarkan role
        if (data.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        failedLogin(data?.error || "Email atau password salah.");
      }
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      failedLogin("Gagal terhubung ke server.");
    }
  };

  const failedLogin = (msg = "Email atau password salah.") => {
    api.error({
      message: 'Login Gagal',
      description: msg,
    });
  };

  return (
    <>
      {contextHolder}
      <div className={styles.container}>
        <div className={styles.left}>
          {/* SVG dekoratif */}
          <svg width="320" height="320" viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="320" height="320" rx="20" fill="#4B7CA8" />
            <g>
              <rect x="60" y="40" width="120" height="200" rx="16" fill="#fff" stroke="#222" strokeWidth="3" />
              <ellipse cx="120" cy="120" rx="20" ry="20" fill="#222" />
              <rect x="100" y="140" width="80" height="24" rx="6" fill="#FFA726" />
              <rect x="90" y="170" width="90" height="20" rx="6" fill="#66BB6A" />
              <rect x="110" y="195" width="70" height="16" rx="6" fill="#66BB6A" />
              <rect x="120" y="60" width="50" height="6" rx="3" fill="#E57373" />
              <rect x="120" y="75" width="60" height="6" rx="3" fill="#64B5F6" />
            </g>
          </svg>
        </div>

        <div className={styles.right}>
          <h2 className={styles.title}>Welcome to Tales to GO!</h2>

          {/* Tombol role switch */}
          <div className={styles.tabSwitch}>
            <button
              type="button"
              onClick={() => setRole('member')}
              style={{
                background: role === 'member' ? '#4B7CA8' : '#fff',
                color: role === 'member' ? '#fff' : '#4B7CA8',
                fontWeight: role === 'member' ? 'bold' : 'normal',
                border: '1.5px solid #4B7CA8',
                flex: 1,
                borderTopLeftRadius: 24,
                borderBottomLeftRadius: 24,
              }}
            >
              Member
            </button>
            <button
              type="button"
              onClick={() => setRole('admin')}
              style={{
                background: role === 'admin' ? '#4B7CA8' : '#fff',
                color: role === 'admin' ? '#fff' : '#4B7CA8',
                fontWeight: role === 'admin' ? 'bold' : 'normal',
                border: '1.5px solid #4B7CA8',
                flex: 1,
                borderTopRightRadius: 24,
                borderBottomRightRadius: 24,
              }}
            >
              Admin
            </button>
          </div>

          {/* Form login */}
          <form className={styles.form} onSubmit={handleLogin}>
            <div className={styles.inputGroup}>
              <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <span className={styles.inputIcon}>@</span>
            </div>

            <div className={styles.inputGroup}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <span
                className={styles.inputIcon}
                style={{ cursor: 'pointer' }}
                onClick={() => setShowPassword(prev => !prev)}
                tabIndex={0}
              >
                {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
              </span>
            </div>

            <div className={styles.optionsRow}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                />
                Remember Me
              </label>
            </div>

            <button type="submit" className={styles.loginBtn}>
              Log In
            </button>
          </form>

          <div className={styles.signupRow}>
            <Link to="/register" className={styles.signupLink}>Sign up</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
