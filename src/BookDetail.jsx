import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Layout, Row, Col, Typography, Tag, Card, Alert,
  Divider, Rate, InputNumber, Button, Space, Breadcrumb, Spin
} from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { Content } = Layout;

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

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

  return (
    <Layout style={{ background: '#f0f2f5', padding: '24px', width: '100%' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>
        Book Detail
      </Title>
      <Card bordered={false}>
        <Breadcrumb>
          <Breadcrumb.Item onClick={() => navigate('/books')} style={{ cursor: 'pointer' }}>
            Books
          </Breadcrumb.Item>
          <Breadcrumb.Item>{book.judul}</Breadcrumb.Item>
        </Breadcrumb>

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
              Harga: <Text type="success" strong>Rp {book.harga}</Text>
            </Paragraph>

            <Divider />
            <Row justify="space-between" align="middle">
              <Col><Title level={4}>Stok: {book.stok_buku} pcs</Title></Col>
              <Col>
                <Space>
                  <Text>Quantity:</Text>
                  <InputNumber min={1} max={book.stok_buku} defaultValue={1} />
                </Space>
              </Col>
            </Row>

            <Button
              type="primary"
              icon={<ShoppingCartOutlined />}
              size="large"
              style={{ width: '100%', marginTop: 16 }}
              onClick={() => alert('Booking feature belum tersedia')}
            >
              Booking online now
            </Button>
          </Col>
        </Row>
      </Card>
    </Layout>
  );
};

export default BookDetail;
