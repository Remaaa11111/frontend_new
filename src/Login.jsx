import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { notification } from 'antd';
import { AuthContext } from './providers/AuthProvider';
import styles from './Login.module.css';
import logo from './assets/logo.png';
import bookshelfBg from './assets/bookshelf.jpg';

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
    // const formData = new FormData();
    // formData.append('email', email);
    // formData.append('password', password);
    // formData.append('role', role);

    const payload = {
      email,
      password,
      role,
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (response.ok && data?.access_token) {
        // ⬇️ SIMPAN TOKEN DI LOCAL STORAGE
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user)); // <-- pastikan data.user ada id-nya

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
        <div
          className={styles.left}
          style={{
            backgroundImage: `url(${bookshelfBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Logo dihapus, hanya background bookshelf */}
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
              User
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
