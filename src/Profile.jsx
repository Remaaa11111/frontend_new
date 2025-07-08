import React, { useEffect, useState } from 'react';
import { Card, Avatar, Typography, Row, Col, Descriptions, Divider, Spin } from 'antd';
import {
  UserOutlined,
  MailOutlined,
  BookOutlined,
  PhoneOutlined,
  CheckCircleOutlined,
  WarningOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

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
