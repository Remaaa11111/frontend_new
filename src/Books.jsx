import React, { useEffect, useState } from "react";
import { Layout, Input, Select, Row, Col, Card, Button, Typography, Space } from "antd";
import { Link, useNavigate } from 'react-router-dom';
import { SearchOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const Books = () => {
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    const genreList = [
        'Novel', 'Comic', 'Encyclopedia', 'Biography',
        'Science', 'Education', 'Mystery', 'History', 'Religion', 'Others'
    ];
    const [selectedGenre, setSelectedGenre] = useState('all');

    useEffect(() => {
        console.log("Fetching books...");
        setLoading(true);
        fetch('http://127.0.0.1:5000/api/books/')
            .then(res => res.json())
            .then(data => {
                console.log("Books data from API:", data);
                setBooks(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <Layout style={{ background: '#fff' }}>
            <Header style={{ background: '#fff', padding: '0 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={2} style={{ margin: 0 }}>Books Catalog</Title>
                <Space>
                    <Button type="text" icon={<LogoutOutlined />} onClick={() => navigate('/login')}>Sign Out</Button>
                    <Button
                        shape="circle"
                        icon={<UserOutlined />}
                        onClick={() => navigate('/profile')}
                    />

                </Space>
            </Header>
            <Content style={{ padding: 24 }}>
                <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                    <Col>
                        <Input
                            placeholder="Search books..."
                            prefix={<SearchOutlined />}
                            style={{ width: 300 }}
                        />
                    </Col>
                    <Col>
                        <Select defaultValue="all" style={{ width: 150 }} onChange={setSelectedGenre}>
                            <Option value="all">All Genre</Option>
                            {genreList.map(genre => (
                                <Option key={genre} value={genre}>{genre}</Option>
                            ))}
                        </Select>
                    </Col>
                </Row>
                {loading ? (
                    <Title level={4}>Loading...</Title>
                ) : (
                    <Row gutter={[16, 16]}>
                        {books
                            .filter(book => selectedGenre === 'all' || (book.genre && book.genre.split(',').map(g => g.trim()).includes(selectedGenre)))
                            .map((book) => (
                                <Col xs={24} sm={12} md={8} lg={6} key={book.id_buku}>
                                    <Link to={`/books/${book.id_buku}`}>
                                        <Card
                                            hoverable
                                            cover={<img alt={book.judul} src={book.cover_image} style={{ height: 220, objectFit: 'cover' }} />}
                                        >
                                            <Card.Meta
                                                title={book.judul}
                                                description={book.penulis}
                                            />
                                            <div style={{ marginTop: 16 }}>
                                                <Text strong>{book.status}</Text>
                                            </div>
                                        </Card>
                                    </Link>
                                </Col>
                            ))}
                    </Row>
                )}
            </Content>
        </Layout>
    )
}

export default Books; 