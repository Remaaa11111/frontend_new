import React, { useState, useMemo, useEffect } from 'react';
import {
  Layout,
  Table,
  Tag,
  Button,
  Typography,
  Space,
  DatePicker,
  Select,
  message,
  Spin
} from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

const { Header, Content } = Layout;
const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const History = () => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(null);
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
        const date = dayjs(item.waktu);
        const inRange =
          !dateRange || (date.isAfter(dateRange[0]) && date.isBefore(dateRange[1]));
        const statusMatch =
          statusFilter === 'all' || item.status === statusFilter.toLowerCase();
        return inRange && statusMatch;
      });
  }, [historyData, dateRange, statusFilter]);

  const columns = [
    {
      title: 'Judul Buku',
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
        else if (status === 'cancelled') color = 'red';
        else if (status === 'dipinjam') color = 'blue';

        return <Tag color={color}>{upper}</Tag>;
      }
    },
    {
      title: 'Waktu',
      dataIndex: 'waktu',
      key: 'waktu',
      render: waktu => dayjs(waktu).format('YYYY-MM-DD HH:mm')
    },
    {
      title: 'Catatan',
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
          History Peminjaman
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
          <RangePicker onChange={setDateRange} />
          <Select
            defaultValue="all"
            style={{ width: 180 }}
            onChange={setStatusFilter}
          >
            <Option value="all">Semua Status</Option>
            <Option value="returned">Returned</Option>
            <Option value="cancelled">Cancelled</Option>
            <Option value="dipinjam">Dipinjam</Option>
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
