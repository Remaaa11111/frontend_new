import React, { useEffect, useState } from 'react';
import { Layout, Table, Tag, Button, Typography, Space, Spin, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';

const { Header, Content } = Layout;
const { Title } = Typography;

const MyBorrowings = () => {
  const navigate = useNavigate();
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem('user_id');
  const token = localStorage.getItem('access_token');

  const fetchBorrowings = async () => {
    try {
      if (!token) {
        message.error('User not authenticated');
        navigate('/login');
        return;
      }
      
      if (!userId) {
        message.error('User belum login!');
        navigate('/login');
        return;
      }

      const res = await fetch(`http://localhost:5000/api/loans/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,  // Include the JWT token in the headers
        },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`API error: ${res.status} - ${text}`);
      }

      const data = await res.json();
      setBorrowings(data);
    } catch (err) {
      message.error('Gagal mengambil data peminjaman');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrowings();
  }, []);

  const columns = [
    {
      title: 'Book Title',
      dataIndex: 'judul_buku',
      key: 'judul_buku',
    },
    {
      title: 'Borrower',
      dataIndex: 'email_user',
      key: 'email_user',
    },
    {
      title: 'Borrow Date',
      dataIndex: 'tanggal_pinjam',
      key: 'tanggal_pinjam',
    },
    {
      title: 'Due Date',
      dataIndex: 'tanggal_kembali',
      key: 'tanggal_kembali',
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: (status) => {
        let color = 'default';
        if (status === 'overdue') {
          color = 'volcano';
        } else if (status === 'borrowed') {
          color = 'green';
        } else if (status === 'scheduled') {
          color = 'blue';
        } else if (status === 'returned') {
          color = 'geekblue';
        }
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
  ];

  return (
    <Layout style={{ background: '#fff' }}>
      <Header style={{ background: '#fff', padding: '0 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2} style={{ margin: 0 }}>
          My Borrowings
        </Title>
        <Space>
          <Button type="text" icon={<LogoutOutlined />} onClick={() => navigate('/login')}>
            Sign Out
          </Button>
          <Button shape="circle" icon={<UserOutlined />} onClick={() => navigate('/profile')} />
        </Space>
      </Header>
      <Content style={{ padding: 24 }}>
        {loading ? (
          <Spin size="large" />
        ) : (
          <Table
            columns={columns}
            dataSource={borrowings}
            rowKey="id_peminjaman"
            pagination={false}
            onRow={(record) => ({
              onClick: () => navigate(`/borrowings/${record.id_peminjaman}`),
              style: { cursor: 'pointer' },
            })}
          />
        )}
      </Content>
    </Layout>
  );
};

export default MyBorrowings;
