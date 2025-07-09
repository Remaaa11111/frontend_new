import React, { useState } from "react";
import { MailOutlined, PhoneOutlined, CheckCircleFilled, CloseOutlined } from '@ant-design/icons';

const ContactUs = () => {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    nickName: "",
    email: "",
    phone: "",
    address: "",
    message: "",
  });

  // Untuk close manual notifikasi sukses
  const handleCloseNotif = () => setSent(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !form.fullName.trim() ||
      !form.nickName.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.address.trim() ||
      !form.message.trim()
    ) {
      setError("Please complete all fields!");
      setSent(false);
      setTimeout(() => setError(""), 1500);
      return;
    }
    setError("");
    setSent(true);
    setTimeout(() => setSent(false), 2500);
    setForm({
      fullName: "",
      nickName: "",
      email: "",
      phone: "",
      address: "",
      message: "",
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#5483a7',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, Arial, sans-serif',
      position: 'relative',
    }}>
      {/* Notifikasi sukses ala booking success */}
      {sent && (
        <div style={{
          position: 'fixed',
          top: 32,
          right: 32,
          zIndex: 9999,
          background: '#fff',
          borderRadius: 14,
          boxShadow: '0 2px 16px #3a5c7a22',
          padding: '20px 32px 20px 24px',
          minWidth: 340,
          maxWidth: 400,
          display: 'flex',
          alignItems: 'flex-start',
        }}>
          <CheckCircleFilled style={{ color: '#22c55e', fontSize: 32, marginRight: 18, marginTop: 2 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 20, color: '#222', marginBottom: 2 }}>Message Sent</div>
            <div style={{ color: '#444', fontSize: 15 }}>Your message has been sent successfully.</div>
          </div>
          <button onClick={handleCloseNotif} style={{
            background: 'none',
            border: 'none',
            color: '#888',
            fontSize: 18,
            cursor: 'pointer',
            marginLeft: 12,
            marginTop: 2,
            padding: 0,
          }} aria-label="Close notification">
            <CloseOutlined />
          </button>
        </div>
      )}
      {/* Notifikasi error */}
      {error && (
        <div style={{
          position: 'fixed',
          top: 32,
          right: 32,
          zIndex: 9999,
          color: '#991b1b',
          background: '#fee2e2',
          borderRadius: 8,
          padding: '10px 24px',
          fontWeight: 600,
          fontSize: 16,
          fontFamily: 'inherit',
          border: '1px solid #ef4444',
          boxShadow: '0 2px 8px #3a5c7a22',
        }}>
          {error}
        </div>
      )}
      <div style={{
        display: 'flex',
        background: 'rgba(255,255,255,0.97)',
        borderRadius: 24,
        boxShadow: '0 2px 16px #3a5c7a44',
        maxWidth: 950,
        width: '100%',
        margin: '40px auto',
        padding: 0,
        overflow: 'hidden',
      }}>
        {/* Kiri: Info Kontak */}
        <div style={{
          background: '#5483a7',
          color: '#fff',
          flex: 1,
          padding: '48px 36px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          fontFamily: 'inherit',
        }}>
          <h2 style={{ fontWeight: 800, marginBottom: 18, fontSize: 36, letterSpacing: 1, marginTop: 0, fontFamily: 'inherit' }}>Contact Us</h2>
          <div style={{ fontSize: 18, marginBottom: 0, fontWeight: 400, fontFamily: 'inherit' }}>
            Not sure what book you’re looking for?
          </div>
          <div style={{ fontSize: 16, marginBottom: 28, fontWeight: 400, fontFamily: 'inherit', marginTop: 6 }}>
            The team at Tales to GO! is here to help you explore and find titles that match your reading needs, just reach out!
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12, fontSize: 18, fontFamily: 'inherit' }}>
            <MailOutlined style={{ marginRight: 10, fontSize: 20 }} /> admin@gmail.com
          </div>
          <div style={{ display: 'flex', alignItems: 'center', fontSize: 18, fontFamily: 'inherit' }}>
            <PhoneOutlined style={{ marginRight: 10, fontSize: 20 }} /> 08123456789
          </div>
        </div>
        {/* Kanan: Formulir */}
        <form onSubmit={handleSubmit} style={{
          flex: 2,
          padding: '48px 36px',
          display: 'flex',
          flexDirection: 'column',
          background: '#fff',
          fontFamily: 'inherit',
        }}>
          <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: '#222', fontFamily: 'inherit' }}>
            We’d love to hear from you!<br />Let’s get in touch
          </div>
          <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
            <input type="text" name="fullName" value={form.fullName} onChange={handleChange} placeholder="Full Name" style={inputStyle} required />
            <input type="text" name="nickName" value={form.nickName} onChange={handleChange} placeholder="Nick Name" style={inputStyle} required />
          </div>
          <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" style={inputStyle} required />
            <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" style={inputStyle} required />
          </div>
          <input type="text" name="address" value={form.address} onChange={handleChange} placeholder="Address" style={{ ...inputStyle, marginBottom: 16 }} required />
          <textarea name="message" value={form.message} onChange={handleChange} placeholder="Your Message" style={{ ...inputStyle, minHeight: 80, marginBottom: 24, resize: 'vertical' }} required />
          <button type="submit" style={buttonStyle}>Send Message</button>
        </form>
      </div>
    </div>
  );
};

const inputStyle = {
  flex: 1,
  padding: '12px',
  border: '1px solid #d1d5db',
  borderRadius: 8,
  fontSize: 16,
  marginBottom: 0,
  background: '#f9fafb',
  fontFamily: 'inherit',
  outline: 'none',
};

const buttonStyle = {
  background: '#5483a7',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  padding: '12px 0',
  fontWeight: 700,
  fontSize: 18,
  cursor: 'pointer',
  marginTop: 8,
  fontFamily: 'inherit',
  transition: 'none',
};

export default ContactUs;