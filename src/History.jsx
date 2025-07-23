import React, { useState, useMemo, useEffect } from 'react';
import {
  Layout,
  Table,
  Tag,
  Button,
  Typography,
  Space,
  Input,
  Select,
  message,
  Spin
} from 'antd';
import { UserOutlined, LogoutOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

const { Header, Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

const History = () => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
          message.error('User not logged in');
          setLoading(false);
          return;
        }

        const res = await fetch('/api/history/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });

        const data = await res.json();
        if (Array.isArray(data)) {
          setHistoryData(data);
        } else {
          setHistoryData([]);
          message.error('Data history tidak valid');
        }
      } catch (err) {
        console.error(err);
        message.error('Failed to load history data');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const filteredData = useMemo(() => {
    return historyData
      .map((item, idx) => ({
        ...item,
        key: idx.toString()
      }))
      .filter(item => {
        const search = searchText.trim().toLowerCase();
        if (!search) return true;
        return item.judul_buku && item.judul_buku.toLowerCase().includes(search);
      })
      .filter(item => {
        return statusFilter === 'all' || item.status === statusFilter.toLowerCase();
      });
  }, [historyData, searchText, statusFilter]);

  const columns = [
    {
      title: 'Book Title',
      dataIndex: 'judul_buku',
      key: 'judul_buku'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: status => {
        const upper = status.toUpperCase();
        let color = 'default';

        if (status === 'returned') color = 'green';
        else if (status === 'canceled' || status === 'cancelled') color = 'red';
        else if (status === 'borrowed') color = 'blue';
        else if (status === 'scheduled') color = 'orange';
        else if (status === 'overdue') color = 'volcano';

        return <Tag color={color}>{upper}</Tag>;
      }
    },
    {
      title: 'Date',
      dataIndex: 'waktu',
      key: 'waktu',
      render: waktu => dayjs(waktu).format('YYYY-MM-DD') // hanya tanggal
    },
    {
      title: 'Note',
      dataIndex: 'keterangan',
      key: 'keterangan'
    }
  ];

  return (
    <Layout style={{ background: '#fff' }}>
      <Header
        style={{
          background: '#fff',
          padding: '0 24px',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Title level={2} style={{ margin: 0 }}>
          Borrowed History
        </Title>
        <Space>
          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={() => navigate('/login')}
          >
            Sign Out
          </Button>
          <Button
            shape="circle"
            icon={<UserOutlined />}
            onClick={() => navigate('/profile')}
          />
        </Space>
      </Header>
      <Content style={{ padding: 24 }}>
        <Space style={{ marginBottom: 24 }}>
          <Input
            placeholder="Search Book Title..."
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 300 }}
            allowClear
            prefix={<SearchOutlined />}
          />
          <Select
            defaultValue="all"
            style={{ width: 180 }}
            onChange={setStatusFilter}
          >
            <Option value="all">All Status</Option>
            <Option value="scheduled">Scheduled</Option>
            <Option value="borrowed">Borrowed</Option>
            <Option value="returned">Returned</Option>
            <Option value="overdue">Overdue</Option>
            <Option value="cancelled">Cancelled</Option>
          </Select>
        </Space>
        {loading ? (
          <Spin size="large" />
        ) : (
          <Table columns={columns} dataSource={filteredData} />
        )}
      </Content>
    </Layout>
  );
};

export default History;
