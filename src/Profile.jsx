import React from 'react';
import { Card, Avatar, Typography, Row, Col, Descriptions, Button, Divider } from 'antd';
import {
    UserOutlined,
    MailOutlined,
    CalendarOutlined,
    BookOutlined,
    EditOutlined,
    PhoneOutlined,
    HomeOutlined,
    CheckCircleOutlined,
    WarningOutlined,
} from '@ant-design/icons';
import { Bar as BarChart } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title as ChartTitle,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ChartTitle,
    Tooltip,
    Legend
);

const { Title, Text } = Typography;

// Mock data for the profile page
const userProfile = {
    name: 'John Doe',
    username: 'johndoe99',
    email: 'john.doe@example.com',
    phone: '081234567890',
    address: '123 Main Street, Anytown, USA',
    memberSince: '2023-01-15',
    avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', // Placeholder avatar
    stats: {
        borrowed: 42,
        returned: 38,
        overdue: 4,
    },
};

// Mock data for borrowing history chart
const borrowingHistoryData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [{
        label: 'Books Borrowed per Month',
        data: [5, 8, 12, 7, 9, 11],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
    }]
};

const Profile = () => {
    const iconStyle = { marginRight: '8px' };

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
                            height: '100%'  // Menambahkan tinggi 100% agar sejajar
                        }}
                    >
                        <Avatar size={128} src={userProfile.avatarUrl} icon={<UserOutlined />} />
                        <Title level={3} style={{ marginTop: 16 }}>{userProfile.name}</Title>
                        <Text type="secondary">Premium Member</Text>
                        <Divider />
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            style={{ marginTop: 8 }}
                            onClick={() => console.log('Edit Profile clicked!')}
                        >
                            Edit Profile
                        </Button>
                    </Card>
                </Col>

                {/* Profile Details */}
                <Col xs={24} lg={16}>
                    <Card bordered={false} style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '8px' }}>
                        <Title level={4} style={{ textAlign: 'center', marginTop: 0, marginBottom: '24px' }}>Profile Details</Title>
                        <Descriptions column={1} bordered>
                            <Descriptions.Item label={<><UserOutlined style={iconStyle} /> Username</>}>{userProfile.username}</Descriptions.Item>
                            <Descriptions.Item label={<><MailOutlined style={iconStyle} /> Email</>}>{userProfile.email}</Descriptions.Item>
                            <Descriptions.Item label={<><PhoneOutlined style={iconStyle} /> Phone</>}>{userProfile.phone}</Descriptions.Item>
                            <Descriptions.Item label={<><HomeOutlined style={iconStyle} /> Address</>}>{userProfile.address}</Descriptions.Item>
                            <Descriptions.Item label={<><BookOutlined style={iconStyle} /> Total Books Borrowed</>}>{userProfile.stats.borrowed}</Descriptions.Item>
                            <Descriptions.Item label={<><CheckCircleOutlined style={iconStyle} /> Books Returned</>}>{userProfile.stats.returned}</Descriptions.Item>
                            <Descriptions.Item label={<><WarningOutlined style={iconStyle} /> Books Overdue</>}>{userProfile.stats.overdue}</Descriptions.Item>
                        </Descriptions>
                    </Card>
                </Col>

                {/* Borrowing History Chart */}
                <Col xs={24}>
                    <Card bordered={false} style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '8px', marginTop: '24px' }}>
                        <Title level={4}>Borrowing Activity</Title>
                        <BarChart data={borrowingHistoryData} options={{ responsive: true }} />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Profile; 