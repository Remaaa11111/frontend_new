import React, { useEffect, useState } from "react";
import {
    Layout,
    Row,
    Col,
    Card,
    Typography,
    Avatar,
    Space,
    Button,
    Timeline,
} from "antd";
import {
    BookOutlined,
    UserOutlined,
    CheckCircleOutlined,
    ReadOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
    LogoutOutlined,
} from "@ant-design/icons";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title as ChartTitle,
    Tooltip,
    Legend,
} from "chart.js";
import dayjs from "dayjs";
import { useNavigate } from 'react-router-dom';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ChartTitle,
    Tooltip,
    Legend
);

const { Title, Text } = Typography;

const StatCard = ({ icon, title, value }) => (
    <Card bordered={false} style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '8px' }}>
        <Space align="center" size="large">
            <Avatar size={64} icon={icon} style={{ backgroundColor: '#e6f7ff', color: '#1890ff' }} />
            <div>
                <Text type="secondary" style={{ fontSize: '16px' }}>{title}</Text>
                <Title level={2} style={{ margin: 0 }}>{value}</Title>
            </div>
        </Space>
    </Card>
);

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalBooks: 1,
        booksAvailable: 2,
        booksBorrowed: 3,
        totalMembers: 0,
        recentActivity: [],
        borrowChart: [],
    });

    const userId = 5; // Ganti dengan ID user yang login

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            console.error("No token found.");
            return;
        }

        fetch("http://localhost:5000/api/dashboard/dashboard", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`, // <-- gunakan backtick
            },
        })
            .then(res => res.json())
            .then(data => {
                setStats(prev => ({
                    ...prev,
                    totalBooks: data.total_books || 0, // <-- tambahkan ini jika ada di API
                    booksAvailable: data.books_available || 0,
                    booksBorrowed: data.borrowed || 0,
                    recentActivity: data.recent_activity || [],
                    borrowChart: data.borrow_chart || [],
                }));
            })
            .catch(err => console.error("Error fetching dashboard:", err));
    }, []);

    const barChartData = {
        labels: ['Books Borrowed'],
        datasets: [
            {
                label: 'Books Borrowed',
                data: [stats.booksBorrowed],
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };

    const barChartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'History Statistics' },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                    callback: function(value) {
                        return Number.isInteger(value) ? value : null;
                    }
                }
            }
        }
    };

    return (
        <Layout style={{ background: '#f0f2f5', padding: '24px', marginLeft: 0 }}>
            <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
                <Col>
                    <Title level={2} style={{ margin: 0 }}>Hello, User!</Title>
                    <Text type="secondary">Today is {dayjs().format('dddd, D MMMM YYYY')}</Text>
                </Col>
                <Col>
                    <Space align="center" size="large">
                        <Button
                            type="text"
                            icon={<LogoutOutlined style={{ color: '#8c8c8c' }} />}
                            onClick={() => navigate('/login')}
                            style={{ color: '#8c8c8c', fontWeight: 500 }}
                        >
                            Sign Out
                        </Button>
                        <Avatar
                            size="large"
                            icon={<UserOutlined />}
                            style={{ cursor: 'pointer' }}
                            onClick={() => navigate('/profile')}
                        />
                    </Space>
                </Col>
            </Row>

            <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={12} lg={6}>
                    <StatCard icon={<BookOutlined />} title="Total Books" value={stats.totalBooks} />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <StatCard icon={<CheckCircleOutlined />} title="Books Available" value={stats.booksAvailable} />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <StatCard icon={<ReadOutlined />} title="Books Borrowed" value={stats.booksBorrowed} />
                </Col>
            </Row>

            <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                    <Card bordered={false} style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '8px', height: '100%' }}>
                        <Title level={4}>History Statistics</Title>
                        <Bar options={barChartOptions} data={barChartData} />
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Card bordered={false} style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '8px' }}>
                        <Title level={4}>Recent Activity</Title>
                        <Timeline
                            items={stats.recentActivity.map(item => ({
                                color: item.status === 'returned' ? 'green' : 'blue',
                                children: `You ${item.status} \"${item.judul}\"`,
                            }))}
                        />
                    </Card>
                </Col>
            </Row>
        </Layout>
    );
};

export default Dashboard;
