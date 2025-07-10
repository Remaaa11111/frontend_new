import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Avatar, Typography, Row, Col, Descriptions, Divider, Spin, message } from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const AdminProfile = () => {
  const [adminProfile, setAdminProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const iconStyle = { marginRight: '8px' };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get("http://localhost:5000/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAdminProfile(response.data);
      } catch (error) {
        console.error("Gagal mengambil data admin:", error);
        message.error("Gagal memuat profil admin.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <Spin tip="Loading..." style={{ display: "flex", justifyContent: "center", marginTop: "20%" }} />;
  }

  if (!adminProfile) {
    return <div>Profile not found.</div>;
  }

  return (
    <div style={{ padding: '40px 0', background: '#fff', minHeight: '100vh', marginLeft: 220 }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <Row gutter={[32, 32]} align="middle">
          <Col xs={24} lg={8}>
            <Card
              bordered={false}
              style={{
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                borderRadius: '12px',
                height: '100%',
                padding: '24px 0',
                border: '2px solid #d9d9d9',
              }}
            >
              <Avatar size={128} src={adminProfile.avatar_url || "https://i.pravatar.cc/150?u=admin"} icon={<UserOutlined />} />
              <Title level={3} style={{ marginTop: 16 }}>{adminProfile.nama || 'Admin'}</Title>
              <Text type="secondary">{adminProfile.role}</Text>
              <div style={{ margin: '16px 0' }}>
                <button
                  style={{
                    background: '#4B7CA8',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    padding: '8px 24px',
                    fontWeight: 500,
                    fontSize: 16,
                    cursor: 'pointer',
                    marginTop: 8
                  }}
                  onClick={() => {
                    localStorage.removeItem('access_token');
                    navigate('/login');
                  }}
                >
                  Sign Out
                </button>
              </div>
              <Divider />
            </Card>
          </Col>

          <Col xs={24} lg={16}>
            <Card bordered={false} style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '12px', padding: '24px 0', border: '2px solid #d9d9d9' }}>
              <Title level={4} style={{ textAlign: 'center', marginTop: 0, marginBottom: '24px' }}>Admin Details</Title>
              <Descriptions column={1} bordered>
                <Descriptions.Item label={<><UserOutlined style={iconStyle} /> Username</>}>{adminProfile.nama}</Descriptions.Item>
                <Descriptions.Item label={<><MailOutlined style={iconStyle} /> Email</>}>{adminProfile.email}</Descriptions.Item>
                <Descriptions.Item label={<><PhoneOutlined style={iconStyle} /> Phone</>}>{adminProfile.phone}</Descriptions.Item>
                <Descriptions.Item label={<><HomeOutlined style={iconStyle} /> Address</>}>{adminProfile.alamat}</Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AdminProfile;
