import React, { useEffect, useState } from 'react';
import { Card, Avatar, Typography, Row, Col, Descriptions, Divider, Spin, Button } from 'antd';
import {
  UserOutlined,
  MailOutlined,
  BookOutlined,
  PhoneOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const iconStyle = { marginRight: '8px' };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setProfile(res.data);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <Spin tip="Loading profile..." fullscreen />;
  }

  if (!profile) {
    return <div>Error loading profile</div>;
  }

  return (
    <div style={{ padding: '24px', background: '#f0f2f5' }}>
      <Row gutter={[24, 24]}>
        {/* Profile Card */}
        <Col xs={24} lg={8}>
          <Card
            bordered={false}
            style={{
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              borderRadius: '8px',
              height: '100%'
            }}
          >
            <Avatar size={128} src={profile.avatar_url || ''} icon={<UserOutlined />} />
            <Title level={3} style={{ marginTop: 16 }}>{profile.nama || 'No Name'}</Title>
            <Text type="secondary">{profile.role || 'Member'}</Text>
            <div style={{ margin: '16px 0' }}>
              <button
                style={{
                  background: '#4B7CA8',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '8px 20px',
                  fontWeight: 500,
                  fontSize: 16,
                  cursor: 'pointer',
                  marginTop: 8,
                  width: 'auto',
                  transition: 'background 0.2s',
                }}
                onMouseOver={e => e.currentTarget.style.background = '#3a628a'}
                onMouseOut={e => e.currentTarget.style.background = '#4B7CA8'}
                onClick={() => {
                  localStorage.removeItem('access_token');
                  localStorage.removeItem('token');
                  navigate('/login');
                }}
              >
                Sign Out
              </button>
            </div>
            <Divider />
          </Card>
        </Col>

        {/* Profile Details */}
        <Col xs={24} lg={16}>
          <Card bordered={false} style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '8px' }}>
            <Title level={4} style={{ textAlign: 'center', marginTop: 0, marginBottom: '24px' }}>Profile Details</Title>
            <Descriptions column={1} bordered>
              <Descriptions.Item label={<><UserOutlined style={iconStyle} /> Username</>}>{profile.nama}</Descriptions.Item>
              <Descriptions.Item label={<><MailOutlined style={iconStyle} /> Email</>}>{profile.email}</Descriptions.Item>
              <Descriptions.Item label={<><PhoneOutlined style={iconStyle} /> Phone</>}>{profile.phone || '-'}</Descriptions.Item>
              <Descriptions.Item label={<><BookOutlined style={iconStyle} /> Total Books Borrowed</>}>{profile.borrowed}</Descriptions.Item>
              <Descriptions.Item label={<><CheckCircleOutlined style={iconStyle} /> Books Returned</>}>{profile.returned}</Descriptions.Item>
              <Descriptions.Item label={<><WarningOutlined style={iconStyle} /> Books Overdue</>}>{profile.overdue}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Profile;
