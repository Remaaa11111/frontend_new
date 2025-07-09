import React, { useEffect, useState } from "react";
import { Card, Row, Col, Typography, Statistic, Divider, Button, Space } from "antd";
import { UserOutlined, BookOutlined, BarChartOutlined, CheckCircleOutlined, LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { getDataWithToken } from "../utils/api";

const { Title } = Typography;

const AdminDashboard = () => {
  const [jumlahBukuDipinjam, setJumlahBukuDipinjam] = useState(0);
  const [jumlahPengguna, setJumlahPengguna] = useState(0);
  const [aktivitasTerakhir, setAktivitasTerakhir] = useState([]);
  const token = localStorage.getItem('token');
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    // Buku dipinjam
    getDataWithToken("http://localhost:5000/api/loans/", token)
      .then(data => {
        setJumlahBukuDipinjam(data.filter(item => item.status === "borrowed").length);
        setAktivitasTerakhir(data.slice(0, 3));
      });

    // Jumlah pengguna
    getDataWithToken("http://localhost:5000/api/users/", token)
      .then(data => setJumlahPengguna(data.length));
  }, [token]);

  return (
    <div style={{ background: '#fff', minHeight: '100vh', padding: 8, marginLeft: 220 }}>
      <Space style={{ position: "absolute", right: 32, top: 24, zIndex: 20 }}>
        <Button type="text" icon={<LogoutOutlined />} onClick={handleLogout}>
          Sign Out
        </Button>
        <Button
          shape="circle"
          icon={<UserOutlined />}
          onClick={() => navigate('/admin/profile')}
        />
      </Space>
      <Title level={2}>Dashboard</Title>
      <Divider />
      <Row gutter={24}>
        <Col xs={24} sm={12} md={8}>
          <Card bordered={false} style={{ marginBottom: 24 }}>
            <Statistic
              title="Books Borrowed"
              value={jumlahBukuDipinjam}
              prefix={<BookOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card bordered={false} style={{ marginBottom: 24 }}>
            <Statistic
              title="Total Users"
              value={jumlahPengguna}
              prefix={<UserOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={8}>
          <Card bordered={false} style={{ marginBottom: 24 }}>
            <Statistic
              title="Recent Activities"
              value={aktivitasTerakhir.length}
              prefix={<BarChartOutlined style={{ color: '#faad14' }} />}
            />
          </Card>
        </Col>
      </Row>
      <Divider>Recent Activities</Divider>
      <Card bordered={false} style={{ marginBottom: 24 }}>
        <ul style={{ paddingLeft: 20 }}>
          {aktivitasTerakhir.map((item) => (
            <li key={item.id_peminjaman}>
              {item.status === "borrowed"
                ? `Book '${item.judul_buku}' borrowed by ${item.email_user}`
                : item.status === "returned"
                ? `Book '${item.judul_buku}' returned by ${item.email_user}`
                : null}
            </li>
          ))}
        </ul>
      </Card>
      <Divider>Admin Menu</Divider>
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
            Book Management
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
            Loan Verification
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
            User Management
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard; 