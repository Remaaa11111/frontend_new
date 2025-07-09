import React, { useState, useEffect } from "react";
import { Table, Input, Button, Popconfirm, notification, Typography, Card, Tag, Space } from "antd";
import { DeleteOutlined, SearchOutlined, EyeOutlined, ReloadOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { getDataWithToken, deleteDataWithToken } from "../utils/api"; // pastikan sudah ada

const { Title } = Typography;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [api, contextHolder] = notification.useNotification();
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    getDataWithToken("http://localhost:5000/api/users/", token)
      .then((data) => setUsers(data))
      .catch(() => {
        api.error({ message: "Gagal mengambil data user" });
      });
  }, []);

  const handleSearch = (e) => {
    setSearchText(e.target.value.toLowerCase());
  };

  const filteredUsers = users.filter(
    (item) =>
      (item.email && item.email.toLowerCase().includes(searchText)) ||
      (item.role && item.role.toLowerCase().includes(searchText)) ||
      String(item.id).includes(searchText)
  );

  const handleDelete = (record) => {
    const token = localStorage.getItem('token');
    deleteDataWithToken(`http://localhost:5000/api/users/${record.id}`, token)
      .then((res) => {
        if (res.message === "User deleted") {
          api.success({
            message: "Hapus Pengguna Berhasil",
            description: `Pengguna ${record.email} telah dihapus.`,
          });
          setUsers((prev) => prev.filter((item) => item.id !== record.id));
        } else {
          api.error({ message: res.error || "Gagal menghapus user" });
        }
      })
      .catch(() => {
        api.error({ message: "Gagal menghapus user" });
      });
  };

  const handleDetail = (record) => {
    api.info({
      message: `Detail Pengguna: ${record.name}`,
      description: `Email: ${record.email}\nRole: ${record.role}\nStatus: ${record.status}`,
    });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => <Tag color={role === "admin" ? "blue" : "green"}>{role}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color={status === "active" ? "green" : "red"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Tag>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Popconfirm
          title="Hapus Pengguna?"
          onConfirm={() => handleDelete(record)}
          okText="Ya"
          cancelText="Batal"
        >
          <Button danger icon={<DeleteOutlined />}>Hapus</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ background: '#fff', minHeight: '100vh', padding: 8, marginLeft: 220 }}>
      <Space style={{ position: "absolute", right: 32, top: 24, zIndex: 20 }}>
        <Button type="text" icon={<LogoutOutlined />} onClick={() => { logout(); navigate('/login'); }}>
          Sign Out
        </Button>
        <Button
          shape="circle"
          icon={<UserOutlined />}
          onClick={() => navigate('/admin/profile')}
        />
      </Space>
      {contextHolder}
      <Card bordered={false} style={{ marginBottom: 24 }}>
        <Title level={3}>User Management</Title>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search name, email, or user ID"
          allowClear
          size="large"
          style={{ maxWidth: 400, margin: '16px 0' }}
          onChange={handleSearch}
        />
        <Button icon={<ReloadOutlined />} onClick={() => setUsers(dummyUsers)} style={{ marginLeft: 8 }}>
          Reset Data
        </Button>
        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
          pagination={{ pageSize: 6 }}
          style={{ marginTop: 24 }}
        />
      </Card>
    </div>
  );
};

export default UserManagement; 