import React, { useState } from 'react';
import styles from './Register.module.css';
import { Link } from 'react-router-dom';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import logo from './assets/logo.png';
import bookshelfBg from './assets/bookshelf.jpg';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirm) {
      setError('Password dan Confirm Password harus sama');
      return;
    }

    // Buat FormData
    const formData = new FormData();
    formData.append('nama', form.username.trim());
    formData.append('email', form.email.trim());
    formData.append('phone', form.phone.trim());
    formData.append('password', form.password);
    formData.append('confirm_password', form.confirm);
    formData.append('role', 'member');

    try {
      const response = await fetch('http://127.0.0.1:5000/api/auth/register', {
        method: 'POST',
        // Jangan set Content-Type, browser akan otomatis
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        alert('Registrasi berhasil! Silakan login.');
        window.location.href = '/';
      } else {
        setError(data.error || 'Registrasi gagal');
      }
    } catch (err) {
      setError('Terjadi kesalahan jaringan');
    }
  };

  return (
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
        <h2 className={styles.title}>Create an Account</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
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
          <Link to="/login" className={styles.signupLink}>Log In</Link>
        </div>
      </div>
    </div>
  );
};

export default Register; 