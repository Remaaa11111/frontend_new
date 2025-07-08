import React, { useState } from 'react';
import styles from './Register.module.css';
import { Link } from 'react-router-dom';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirm: '',
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === 'confirm' || e.target.name === 'password') {
      if (e.target.value !== (e.target.name === 'confirm' ? form.password : form.confirm)) {
        setError('Password dan Confirm Password harus sama');
      } else {
        setError('');
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        {/* Ilustrasi handphone dan buku */}
        <svg width="320" height="320" viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="320" height="320" rx="20" fill="#4B7CA8"/>
          <g>
            <rect x="60" y="40" width="120" height="200" rx="16" fill="#fff" stroke="#222" strokeWidth="3"/>
            <ellipse cx="120" cy="120" rx="20" ry="20" fill="#222"/>
            <rect x="100" y="140" width="80" height="24" rx="6" fill="#FFA726"/>
            <rect x="90" y="170" width="90" height="20" rx="6" fill="#66BB6A"/>
            <rect x="110" y="195" width="70" height="16" rx="6" fill="#66BB6A"/>
            <rect x="120" y="60" width="50" height="6" rx="3" fill="#E57373"/>
            <rect x="120" y="75" width="60" height="6" rx="3" fill="#64B5F6"/>
          </g>
        </svg>
      </div>
      <div className={styles.right}>
        <h2 className={styles.title}>Create an Account</h2>
        <form className={styles.form}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              type="text"
              name="phone"
              placeholder="Phone number"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <span
              className={styles.inputIcon}
              style={{ cursor: 'pointer' }}
              onClick={() => setShowPassword(v => !v)}
              tabIndex={0}
            >
              {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
            </span>
          </div>
          <div className={styles.inputGroup}>
            <input
              type={showConfirm ? 'text' : 'password'}
              name="confirm"
              placeholder="Confirm Password"
              value={form.confirm}
              onChange={handleChange}
              required
            />
            <span
              className={styles.inputIcon}
              style={{ cursor: 'pointer' }}
              onClick={() => setShowConfirm(v => !v)}
              tabIndex={0}
            >
              {showConfirm ? <EyeOutlined /> : <EyeInvisibleOutlined />}
            </span>
          </div>
          {error && (
            <div style={{ color: 'red', fontSize: '0.98rem', marginTop: '-10px', marginBottom: '8px', textAlign: 'left', width: '100%' }}>
              {error}
            </div>
          )}
          <button type="submit" className={styles.loginBtn} style={{ marginTop: 8 }} disabled={!!error || !form.password || !form.confirm}>Sign Up</button>
        </form>
        <div className={styles.signupRow} style={{ marginTop: 18, marginBottom: 0 }}>
          <span>Already have an account?</span>
          <Link to="/" className={styles.signupLink}>Log In</Link>
        </div>
      </div>
    </div>
  );
};

export default Register; 