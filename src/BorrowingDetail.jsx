import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Layout,
  Row,
  Col,
  Typography,
  Tag,
  Card,
  Descriptions,
  Alert,
  Divider,
  Rate,
  Space,
  Breadcrumb,
  Spin,
} from 'antd';
import {
  CalendarOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const BorrowingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [borrowing, setBorrowing] = useState(null);
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

        const resBorrowing = await fetch(`${apiUrl}/api/loans/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!resBorrowing.ok) throw new Error('Gagal mengambil data peminjaman');
        const loanData = await resBorrowing.json();
        setBorrowing(loanData);

        const resBook = await fetch(`${apiUrl}/api/books/${loanData.book_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!resBook.ok) throw new Error('Gagal mengambil data buku');
        const bookData = await resBook.json();
        setBook(bookData);
      } catch (err) {
        setErrorMsg(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <Layout style={{ padding: '30px' }}>
        <Spin tip="Loading..." fullscreen />
      </Layout>
    );
  }

  if (errorMsg || !borrowing || !book) {
    return (
      <Layout style={{ padding: '30px' }}>
        <Alert
          message="Error"
          description={errorMsg || 'Data tidak ditemukan'}
          type="error"
          showIcon
        />
      </Layout>
    );
  }

  const isOverdue = borrowing.status?.toLowerCase() === 'overdue';

  return (
    <Layout style={{ background: '#f0f2f5', padding: '24px', width: '100%' }}>
      <Title level={2} style={{ marginBottom: '24px', textAlign: 'center' }}>
        Borrowing Detail
      </Title>
      <Card bordered={false} style={{ borderRadius: '8px', width: '100%' }}>
        {/* 
<Breadcrumb>
  <Breadcrumb.Item onClick={() => navigate('/books')} style={{ cursor: 'pointer' }}>
    Books
  </Breadcrumb.Item>
  <Breadcrumb.Item>{book.judul}</Breadcrumb.Item>
</Breadcrumb>
*/}


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
                <Rate allowHalf defaultValue={Number(book.rating) || 4} disabled />
                <Text>{book.rating || 4} (100 reviews)</Text>
              </Space>
            </div>

            <div>
              {(book.genre || '').split(',').map(g => (
                <Tag color="blue" key={g}>{g}</Tag>
              ))}
            </div>

            <Paragraph style={{ marginTop: '16px' }}>
              {book.deskripsi}
            </Paragraph>

            <Divider />

            <Title level={4}>Loan Information</Title>
            {isOverdue && (
              <Alert
                message="This book is overdue!"
                description="Please return it as soon as possible."
                type="error"
                showIcon
                style={{ marginBottom: '16px' }}
              />
            )}
            <Descriptions bordered column={1}>
              <Descriptions.Item label={<Space><CalendarOutlined /> Borrow Date</Space>}>
                {borrowing.tanggal_pinjam}
              </Descriptions.Item>
              <Descriptions.Item label={<Space><CalendarOutlined /> Due Date</Space>}>
                {borrowing.tanggal_kembali}
              </Descriptions.Item>
              <Descriptions.Item label={<Space><InfoCircleOutlined /> Status</Space>}>
                <Tag color={isOverdue ? 'volcano' : 'green'}>
                  {borrowing.status?.toUpperCase()}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      </Card>
    </Layout>
  );
};

export default BorrowingDetail;
