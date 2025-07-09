import React from "react";
import { useNavigate } from "react-router-dom";
import bookshelfBg from "./assets/bookshelf.jpg"; // Pastikan file ini ada di assets
// import logo from "./assets/logo.png"; // Uncomment jika ada logo.png

// Palet biru
const blue = {
    50: '#f4f7fb',
    100: '#e8eef6',
    200: '#cbdded',
    300: '#9ebfdb',
    400: '#6a9fc6',
    500: '#4783b0',
    600: '#356894',
    700: '#2c5478',
    800: '#284864',
    900: '#253d55',
    950: '#192838',
};

// SVG pattern buku terbuka (watermark)
const bookPattern = "url('data:image/svg+xml;utf8,<svg width=\"80\" height=\"60\" viewBox=\"0 0 80 60\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M10 50 Q40 20 70 50 Q40 40 10 50\" fill=\"%23e8eef6\" fill-opacity=\"0.18\" stroke=\"%239ebfdb\" stroke-width=\"1.2\"/><path d=\"M40 40 Q44 32 48 40\" fill=\"none\" stroke=\"%239ebfdb\" stroke-width=\"1.2\"/><path d=\"M40 40 Q36 32 32 40\" fill=\"none\" stroke=\"%239ebfdb\" stroke-width=\"1.2\"/></svg>')";

// Animasi buku terbuka (halaman bergerak)
const openBookSVG = `
  <svg width='420' height='180' viewBox='0 0 420 180' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <ellipse cx='210' cy='160' rx='200' ry='18' fill='${blue[100]}' fill-opacity='0.5'/>
    <path d='M30 150 Q210 60 390 150 Q210 120 30 150' fill='${blue[50]}' stroke='${blue[400]}' stroke-width='2'/>
    <g class="book-pages">
      <path d='M210 120 Q220 100 230 120' fill='none' stroke='${blue[400]}' stroke-width='2'/>
      <path d='M210 120 Q200 100 190 120' fill='none' stroke='${blue[400]}' stroke-width='2'/>
      <rect x='200' y='90' width='20' height='30' rx='4' fill='${blue[200]}' stroke='${blue[400]}' stroke-width='1'/>
    </g>
  </svg>
`;

// Lembaran buku melayang (akan dianimasikan)
const flyingPages = [
    { left: 80, size: 38, delay: 0 },
    { left: 320, size: 32, delay: 2 },
    { left: 900, size: 44, delay: 1 },
    { left: 1100, size: 36, delay: 3 },
];

// Tumpukan buku SVG pojok kiri bawah
const stackBooksSVG = `
  <svg width='120' height='80' viewBox='0 0 120 80' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <rect x='10' y='60' width='100' height='12' rx='3' fill='${blue[400]}'/>
    <rect x='20' y='45' width='80' height='12' rx='3' fill='${blue[600]}'/>
    <rect x='30' y='30' width='60' height='12' rx='3' fill='${blue[800]}'/>
    <rect x='40' y='15' width='40' height='12' rx='3' fill='${blue[300]}'/>
  </svg>
`;

// Efek glare/cahaya lembut
// Hapus glareStyle karena tidak dipakai

const ArrowIcon = () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 20 20" style={{ marginLeft: 8, verticalAlign: 'middle' }}><path d="M7 5l5 5-5 5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const MailIcon = () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 20 20" style={{ marginLeft: 8, verticalAlign: 'middle' }}><rect x="3" y="5" width="14" height="10" rx="2" stroke="#253d55" strokeWidth="2" /><path d="M3 7l7 5 7-5" stroke="#253d55" strokeWidth="2" /></svg>
);

// Hero illustration SVG (book & reading)
const HeroSVG = () => (
    <svg width="320" height="260" viewBox="0 0 320 260" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ maxWidth: '100%', height: 'auto' }}>
        <ellipse cx="160" cy="240" rx="120" ry="18" fill={blue[200]} fillOpacity="0.3" />
        <rect x="60" y="120" width="200" height="60" rx="12" fill={blue[50]} stroke={blue[400]} strokeWidth="2" />
        <rect x="80" y="100" width="160" height="60" rx="10" fill={blue[100]} stroke={blue[400]} strokeWidth="2" />
        <rect x="100" y="80" width="120" height="60" rx="8" fill={blue[200]} stroke={blue[400]} strokeWidth="2" />
        <path d="M160 80 Q170 60 180 80" stroke={blue[400]} strokeWidth="2" fill="none" />
        <circle cx="120" cy="150" r="10" fill={blue[400]} />
        <rect x="210" y="140" width="18" height="36" rx="6" fill={blue[400]} />
        <ellipse cx="220" cy="180" rx="18" ry="6" fill={blue[200]} />
        <rect x="140" y="60" width="40" height="20" rx="6" fill={blue[400]} />
        <ellipse cx="160" cy="60" rx="20" ry="6" fill={blue[200]} />
        <rect x="150" y="40" width="20" height="20" rx="6" fill={blue[100]} />
        <ellipse cx="160" cy="40" rx="10" ry="4" fill={blue[200]} />
        <rect x="110" y="180" width="100" height="10" rx="4" fill={blue[300]} />
    </svg>
);

const LandingPage = () => {
    const navigate = useNavigate();
    return (
        <div style={{
            minHeight: "100vh",
            width: '100vw',
            position: "relative",
            overflow: "hidden",
            fontFamily: "'Poppins', 'Nunito Sans', Arial, sans-serif",
        }}>
            {/* Header dengan nama website saja */}
            <header
                style={{
                    width: "100vw",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 24px 6px 24px",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    zIndex: 10,
                    background: "rgba(255,255,255,0.70)",
                    boxShadow: "0 2px 12px 0 rgba(37,61,85,0.08)",
                    borderBottom: "1.5px solid #e8eef6",
                }}
            >
                {/* <img src={logo} alt="Tales to GO Logo" style={{ height: 35, width: 35, marginRight: 8 }} /> */}
                <span style={{
                    fontWeight: 700,
                    fontSize: "1.25rem",
                    color: "#111",
                    letterSpacing: 1.1,
                    fontFamily: "'Poppins', 'Nunito Sans', Arial, sans-serif"
                }}>
                    Tales to GO!
                </span>
            </header>
            {/* Gambar rak buku sebagai background tengah */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: `url(${bookshelfBg}) center center/cover no-repeat fixed`,
                zIndex: 0
            }} />
            {/* Overlay biru tua transparan agar tulisan tetap jelas */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: blue[900],
                opacity: 0.55,
                zIndex: 2
            }} />
            {/* Kontainer flex agar card benar-benar di tengah layar */}
            <div style={{
                minHeight: '100vh',
                width: '100vw',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                zIndex: 3,
                // Hapus marginTop dan marginBottom di sini
            }}>
                {/* Card utama glassmorphism */}
                <div className="card-elegant" style={{
                    background: 'rgba(255,255,255,0.60)',
                    borderRadius: 18,
                    boxShadow: `0 12px 48px 0 ${blue[900]}`,
                    padding: "36px 64px 36px 64px",
                    maxWidth: 900,
                    minHeight: 220,
                    width: '96vw',
                    textAlign: "center",
                    zIndex: 4,
                    backdropFilter: "blur(16px)",
                    border: `1.5px solid ${blue[100]}`,
                    position: 'relative',
                    overflow: 'visible',
                    margin: '0 auto',
                    marginBottom: 32,
                    transition: 'box-shadow 0.3s, transform 0.3s',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <div style={{ marginBottom: 8 }}>
                        <h1 style={{
                            fontSize: '2.5rem',
                            fontWeight: 700,
                            margin: 0,
                            letterSpacing: 1.2,
                            color: blue[800],
                            textShadow: '0 2px 12px rgba(37,61,85,0.18)'
                        }}>
                            Welcome to
                        </h1>
                        <h2 style={{
                            fontSize: '3rem',
                            fontWeight: 800,
                            margin: 0,
                            letterSpacing: 1.5,
                            color: blue[500],
                            textShadow: '0 2px 12px rgba(37,61,85,0.18)'
                        }}>
                            Tales to GO!
                        </h2>
                    </div>
                    <p style={{
                        color: blue[700],
                        fontSize: '1.35rem',
                        fontWeight: 400,
                        marginBottom: 36,
                        lineHeight: 1.6
                    }}>
                        Explore our collection online and pick up your book directly at the store—no wasted trips!
                    </p>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 20,
                        marginTop: 8
                    }}>
                        <button className="btn-elegant" style={{
                            background: blue[500],
                            color: blue[50],
                            fontWeight: 700,
                            fontSize: '1.1rem',
                            border: "none",
                            borderRadius: 22,
                            padding: "14px 32px",
                            cursor: "pointer",
                            transition: "all 0.2s",
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 4
                        }} onClick={() => navigate('/login')}>
                            Get Started <ArrowIcon />
                        </button>
                        <button className="btn-elegant btn-secondary" style={{
                            background: blue[100],
                            color: blue[800],
                            fontWeight: 700,
                            fontSize: '1.1rem',
                            border: "none",
                            borderRadius: 22,
                            padding: "14px 32px",
                            cursor: "pointer",
                            transition: "all 0.2s",
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 4
                        }} onClick={() => navigate('/contact')}>
                            Contact Us <MailIcon />
                        </button>
                    </div>
                </div>
                <style>{`
                .card-elegant:hover {
                    box-shadow: 0 16px 48px 0 ${blue[900]};
                    transform: scale(1.018);
                }
                .btn-elegant:hover {
                    transform: scale(1.05);
                    box-shadow: 0 6px 24px 0 ${blue[600]};
                    background: linear-gradient(90deg, ${blue[500]}, ${blue[600]});
                    color: #fff;
                }
                .btn-secondary.btn-elegant:hover {
                    background: ${blue[200]};
                    color: ${blue[900]};
                }
                @media (max-width: 900px) {
                    .card-elegant {
                        padding: 24px 6vw 24px 6vw !important;
                        max-width: 98vw !important;
                    }
                }
                @media (max-width: 600px) {
                    .card-elegant {
                        padding: 16px 2vw 16px 2vw !important;
                        max-width: 99vw !important;
                    }
                    h1, h2 { font-size: 1.5rem !important; }
                    p { font-size: 1rem !important; }
                }
            `}</style>
            </div>
            {/* Footer tengah bawah */}
            <footer style={{
                position: 'fixed',
                left: 0,
                bottom: 0,
                width: '100vw',
                textAlign: 'center',
                padding: '12px 0 8px 0',
                background: 'rgba(255,255,255,0.85)',
                color: '#111',
                fontWeight: 500,
                fontSize: '0.8rem',
                letterSpacing: 0.2,
                zIndex: 20,
                boxShadow: '0 -2px 12px 0 rgba(37,61,85,0.04)'
            }}>
                Copyright © 2025 TalesToGo.com - Powered by Code and Chaos
            </footer>
            <style>{`
                html, body {
                    overflow: hidden !important;
                }
            `}</style>
        </div>
    );
};

export default LandingPage;