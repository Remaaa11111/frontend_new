import React from "react";
import { Card, Avatar, Typography, Row, Col, Descriptions, Divider } from 'antd';
import {
    UserOutlined,
    MailOutlined,
    CalendarOutlined,
    EditOutlined,
    PhoneOutlined,
    HomeOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

// Mock data admin
const adminProfile = {
    name: 'Admin',
    username: 'admin',
    email: 'admin@mail.com',
    phone: '081234567890',
    role: 'Admin',
    address: 'jalan Pulau Nila, Lingkungan Bhuanasari ',
    avatarUrl: 'https://i.pravatar.cc/150?u=admin',
};

const AdminProfile = () => {
    const iconStyle = { marginRight: '8px' };
    return (
        <div style={{ padding: '40px 0', background: '#fff', minHeight: '100vh', marginLeft: 220 }}>
            <div style={{ maxWidth: 900, margin: '0 auto' }}>
                <Row gutter={[32, 32]} align="middle">
                    {/* Profile Card */}
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
                            <Avatar size={128} src={adminProfile.avatarUrl} icon={<UserOutlined />} />
                            <Title level={3} style={{ marginTop: 16 }}>{adminProfile.name}</Title>
                            <Text type="secondary">{adminProfile.role}</Text>
                            <Divider />
                        </Card>
                    </Col>
                    {/* Profile Details */}
                    <Col xs={24} lg={16}>
                        <Card bordered={false} style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '12px', padding: '24px 0', border: '2px solid #d9d9d9' }}>
                            <Title level={4} style={{ textAlign: 'center', marginTop: 0, marginBottom: '24px' }}>Admin Details</Title>
                            <Descriptions column={1} bordered>
                                <Descriptions.Item label={<><UserOutlined style={iconStyle} /> Username</>}>{adminProfile.username}</Descriptions.Item>
                                <Descriptions.Item label={<><MailOutlined style={iconStyle} /> Email</>}>{adminProfile.email}</Descriptions.Item>
                                <Descriptions.Item label={<><PhoneOutlined style={iconStyle} /> Phone</>}>{adminProfile.phone}</Descriptions.Item>
                                <Descriptions.Item label={<><HomeOutlined style={iconStyle} /> Address</>}>{adminProfile.address}</Descriptions.Item>
                            </Descriptions>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default AdminProfile;