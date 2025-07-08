import React, { useEffect, useState } from "react";
import { Card, Row, Col, Typography, Statistic, Divider, Button, Space } from "antd";
import { UserOutlined, BookOutlined, BarChartOutlined, CheckCircleOutlined, LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";

const { Title } = Typography;

const AdminDashboard = () => {
  const [borrowedCount, setBorrowedCount] = useState(12); // dummy
  const [userCount, setUserCount] = useState(34); // dummy
  const [recentActivity, setRecentActivity] = useState([
    { id: 1, activity: "Buku 'React Handbook' dipinjam oleh Budi" },
    { id: 2, activity: "Buku 'Python Dasar' dikembalikan oleh Sari" },
    { id: 3, activity: "Buku 'UI/UX Design' dipinjam oleh Andi" },
  ]);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Nanti bisa fetch data statistik dari API di sini
  useEffect(() => {
    // fetch('/api/books/borrowed-count').then(...)
    // fetch('/api/members/count').then(...)
    // fetch('/api/loans/recent').then(...)
  }, []);

  return (
    <div style={{ background: '#fff', minHeight: '100vh', padding: 8, marginLeft: 220 }}>
      <Space style={{ position: "absolute", right: 32, top: 24, zIndex: 20 }}>
        <Button type="text" icon={<LogoutOutlined />} onClick={logout}>
          Sign Out
        </Button>
        <Button
          shape="circle"
          icon={<UserOutlined />}
          onClick={() => navigate('/admin/profile')}
        />
      </Space>
      <Title level={2}>Dashboard Admin</Title>
      <Divider />
      <Row gutter={24}>
        <Col xs={24} sm={12} md={8}>
          <Card bordered={false} style={{ marginBottom: 24 }}>
            <Statistic
              title="Buku Dipinjam"
              value={borrowedCount}
              prefix={<BookOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card bordered={false} style={{ marginBottom: 24 }}>
            <Statistic
              title="Jumlah Pengguna"
              value={userCount}
              prefix={<UserOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={8}>
          <Card bordered={false} style={{ marginBottom: 24 }}>
            <Statistic
              title="Aktivitas Terakhir"
              value={recentActivity.length}
              prefix={<BarChartOutlined style={{ color: '#faad14' }} />}
            />
          </Card>
        </Col>
      </Row>
      <Divider>Aktivitas Terakhir</Divider>
      <Card bordered={false} style={{ marginBottom: 24 }}>
        <ul style={{ paddingLeft: 20 }}>
          {recentActivity.map((item) => (
            <li key={item.id}>{item.activity}</li>
          ))}
        </ul>
      </Card>
      <Divider>Menu Admin</Divider>
      <Row gutter={16}>
        <Col xs={24} sm={12} md={8}>
          <Button
            type="primary"
            icon={<BookOutlined />}
            block
            size="large"
            onClick={() => navigate("/admin/books")}
            style={{ marginBottom: 16 }}
          >
            Manajemen Buku
          </Button>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            block
            size="large"
            onClick={() => navigate("/admin/transactions")}
            style={{ marginBottom: 16 }}
          >
            Verifikasi Transaksi
          </Button>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Button
            type="primary"
            icon={<UserOutlined />}
            block
            size="large"
            onClick={() => navigate("/admin/users")}
            style={{ marginBottom: 16 }}
          >
            Manajemen Pengguna
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard; 