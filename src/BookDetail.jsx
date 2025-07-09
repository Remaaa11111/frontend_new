import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Layout, Row, Col, Typography, Tag, Card, Alert,
  Divider, Rate, InputNumber, Button, Space, Breadcrumb, Spin, notification, DatePicker
} from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { sendData } from './utils/api';
import dayjs from 'dayjs';

const { Title, Paragraph, Text } = Typography;
const { Content } = Layout;

const BookDetail = () => {
  // Semua hook di sini
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [api, contextHolder] = notification.useNotification();
  const [bookingLoading, setBookingLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [tanggalPinjam, setTanggalPinjam] = useState(dayjs());
  const [tanggalKembali, setTanggalKembali] = useState(dayjs().add(7, 'day'));

  // Hitung bookingDays (termasuk hari pinjam dan hari kembali)
  let bookingDays = tanggalKembali.diff(tanggalPinjam, 'day');
  if (bookingDays < 1) bookingDays = 1;

  // Validasi tanggal kembali
  useEffect(() => {
    if (tanggalKembali.isBefore(tanggalPinjam, 'day')) {
      api.error({ message: 'Invalid Date', description: 'Return date cannot be before borrow date.' });
      setTanggalKembali(tanggalPinjam);
    }
  }, [tanggalPinjam, tanggalKembali]);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
        const res = await fetch(`${apiUrl}/api/books/${id}`);
        if (!res.ok) throw new Error('Gagal mengambil data buku');
        const data = await res.json();
        setBook(data);
      } catch (err) {
        console.error(err);
        setErrorMsg(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  if (loading) {
    return (
      <Layout style={{ padding: '24px' }}>
        <Spin tip="Loading..." size="large" fullscreen />
      </Layout>
    );
  }

  if (errorMsg || !book) {
    return (
      <Layout style={{ padding: '24px' }}>
        <Alert
          message="Error"
          description={errorMsg || "Data tidak ditemukan"}
          type="error"
          showIcon
        />
      </Layout>
    );
  }

  // Fungsi booking buku
  const handleBooking = async () => {
    setBookingLoading(true);
    try {
      // Ambil token
      const token = localStorage.getItem('access_token') || localStorage.getItem('token');
      if (!token) throw new Error('You must login first!');
      
      // Coba ambil id_anggota dari /api/profile
      let id_anggota = null;
      try {
        const profileRes = await fetch('http://localhost:5000/api/profile', {
          method: 'GET',
          mode: 'cors',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (profileRes.ok) {
          const profile = await profileRes.json();
          id_anggota = profile.id_anggota;
        }
      } catch (profileErr) {
        console.log('Profile fetch failed, trying alternative method:', profileErr);
      }
      
      // Jika tidak bisa ambil dari profile, coba ambil dari token atau gunakan default
      if (!id_anggota) {
        // Coba decode token untuk mendapatkan user info
        try {
          const tokenPayload = JSON.parse(atob(token.split('.')[1]));
          id_anggota = tokenPayload.id_anggota || tokenPayload.sub || '2'; // fallback ke ID 2
        } catch (tokenErr) {
          id_anggota = '2'; // fallback default
        }
      }
      
      if (!id_anggota) throw new Error('Failed to get member ID.');
      
      // Siapkan tanggal pinjam & kembali dari input user
      const tanggal_pinjam = tanggalPinjam.format('YYYY-MM-DD');
      const tanggal_kembali = tanggalKembali.format('YYYY-MM-DD');
      
      // Siapkan FormData
      const payload = {
        user_id: id_anggota,
        book_id: id,
        tanggal_pinjam,
        tanggal_kembali,
        status: 'borrowed' // <-- sesuai API baru
      };
      console.log('Payload:', payload);
      const data = await sendData('/api/loans/create', payload, true); // true = kirim sebagai JSON
      
      if (data.id_peminjaman) {
        // Update stok buku
        const stokBaru = (book.stok_buku || 0) - quantity;
        if (stokBaru >= 0) {
          const updatePayload = {
            judul: book.judul,
            penulis: book.penulis,
            genre: book.genre || '',
            cover_image: book.cover_image || '',
            deskripsi: book.deskripsi || '',
            stok_buku: stokBaru.toString(),
            status: stokBaru === 0 ? 'not available' : 'available',
            harga: book.harga?.toString() || '0'
          };
          await sendData(`/api/books/update/${id}`, updatePayload, true, 'PUT'); // true = kirim sebagai JSON
          // Update state book di frontend
          setBook(prev => ({
            ...prev,
            stok_buku: stokBaru,
            status: stokBaru === 0 ? 'not available' : 'available'
          }));
        }
        api.success({ message: 'Booking Success', description: 'Book has been added to your borrowings.' });
        setTimeout(() => navigate('/my-borrowings'), 1200);
      } else {
        throw new Error(data?.error || data?.message || 'Booking failed');
      }
    } catch (err) {
      api.error({ message: 'Booking Failed', description: err.message });
    } finally {
      setBookingLoading(false);
    }
  };

  // Hitung total harga
  const hargaPerHari = Number(String(book.harga).replace(/\./g, ''));
  const totalPrice = book ? (hargaPerHari * bookingDays * quantity) : 0;

  return (
    <Layout style={{ background: '#f0f2f5', padding: '24px', width: '100%' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>
        Book Detail
      </Title>
      <Card variant="outlined">
        <Breadcrumb
          items={[
            { title: 'Books', onClick: () => navigate('/books') },
            { title: book.judul }
          ]}
        />

        <Row gutter={24}>
          <Col span={8}>
            <img
              src={book.cover_image || 'https://via.placeholder.com/300x450?text=No+Image'}
              alt={book.judul}
              style={{ width: '100%', height: 'auto', borderRadius: '12px' }}
            />
          </Col>
          <Col span={16}>
            <Title level={3}>{book.judul}</Title>
            <Text type="secondary">by {book.penulis}</Text>

            <div style={{ margin: '16px 0' }}>
              <Space align="center">
                <Rate disabled defaultValue={Number(book.rating) || 4} />
                <Text>{book.rating || 4} (100 reviews)</Text>
              </Space>
            </div>

            <div>
              {(book.genre || '').split(',').map(g => (
                <Tag color="blue" key={g.trim()}>{g.trim()}</Tag>
              ))}
            </div>

            <Paragraph style={{ marginTop: 16 }}>{book.deskripsi}</Paragraph>

            <Paragraph style={{ fontSize: 16, fontWeight: 500 }}>
              Harga per hari: <Text type="success" strong>
                Rp {hargaPerHari.toLocaleString('id-ID')}
              </Text>
            </Paragraph>

            <Divider />
            <Row justify="space-between" align="middle">
              <Col><Title level={4}>Stok: {book.stok_buku} pcs</Title></Col>
              <Col>
                <Space>
                  <Text>Quantity:</Text>
                  <InputNumber 
                    min={1} 
                    max={book.stok_buku} 
                    value={quantity}
                    onChange={setQuantity}
                  />
                </Space>
              </Col>
            </Row>

            <Row justify="space-between" align="middle" style={{ marginTop: 16 }}>
              <Col>
                <Text strong>Booking Days:</Text> {bookingDays} day(s)
              </Col>
              <Col>
                <Title level={4}>
                  Total: <Text type="success" strong>
                    Rp {totalPrice.toLocaleString('id-ID')}
                  </Text>
                </Title>
              </Col>
            </Row>
            <Row style={{ marginTop: 16 }} gutter={16}>
              <Col>
                <Text>Borrow Date:</Text>
                <DatePicker value={tanggalPinjam} onChange={setTanggalPinjam} format="YYYY-MM-DD" />
              </Col>
              <Col>
                <Text>Return Date:</Text>
                <DatePicker value={tanggalKembali} onChange={setTanggalKembali} format="YYYY-MM-DD" />
              </Col>
            </Row>

            <Button
              type="primary"
              icon={<ShoppingCartOutlined />}
              size="large"
              style={{ width: '100%', marginTop: 16 }}
              loading={bookingLoading}
              onClick={handleBooking}
            >
              Booking online now
            </Button>
          </Col>
        </Row>
      </Card>
      {contextHolder}
    </Layout>
  );
};

export default BookDetail;