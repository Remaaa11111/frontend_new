import React from "react";
import bookshelfBg from "./assets/bookshelf.jpg";

const ContactUs = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: `url(${bookshelfBg}) center/cover no-repeat`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        maxWidth: 600,
        width: '100%',
        margin: "40px auto",
        padding: 0,
        background: "rgba(255,255,255,0.94)",
        borderRadius: 24,
        boxShadow: "0 4px 32px #b6c6e6aa",
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: 300,
      }}>
        <h2 style={{ color: '#2563eb', fontWeight: 800, marginBottom: 18, fontSize: 36, letterSpacing: 1, marginTop: 0 }}>Contact Admin</h2>
        <div style={{ fontSize: 28, marginBottom: 18, fontWeight: 600, color: '#111' }}>
          <strong>Name:</strong> Code and Chaos
        </div>
        <div style={{ fontSize: 28, fontWeight: 600, marginBottom: 0, color: '#111' }}>
          <strong>Email:</strong> codeandchaos@gmail.com
        </div>
      </div>
    </div>
  );
};

export default ContactUs;