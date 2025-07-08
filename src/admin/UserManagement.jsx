import React, { useState, useEffect } from "react";
import { Table, Input, Button, Popconfirm, notification, Typography, Card, Tag, Space } from "antd";
import { DeleteOutlined, SearchOutlined, EyeOutlined, ReloadOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";

const { Title } = Typography;

const dummyUsers = [
  { id: 1, name: "Budi", email: "budi@mail.com", role: "member", status: "Aktif" },
  { id: 2, name: "Sari", email: "sari@mail.com", role: "admin", status: "Aktif" },
  { id: 3, name: "Andi", email: "andi@mail.com", role: "member", status: "Nonaktif" },
];

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [api, contextHolder] = notification.useNotification();
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Nanti fetch dari API
    setUsers(dummyUsers);
  }, []);

  const handleSearch = (e) => {
    setSearchText(e.target.value.toLowerCase());
  };

  const filteredUsers = users.filter(
    (item) =>
      item.name.toLowerCase().includes(searchText) ||
      item.email.toLowerCase().includes(searchText) ||
      String(item.id).includes(searchText)
  );

  const handleDelete = (record) => {
    // Nanti hapus via API
    api.success({
      message: "Hapus Pengguna Berhasil",
      description: `Pengguna ${record.name} telah dihapus.`,
    });
    setUsers((prev) => prev.filter((item) => item.id !== record.id));
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
      title: "Nama",
      dataIndex: "name",
      key: "name",
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
      render: (status) => <Tag color={status === "Aktif" ? "green" : "red"}>{status}</Tag>,
    },
    {
      title: "Aksi",
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
        <Title level={3}>Manajemen Pengguna</Title>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Cari nama, email, atau ID pengguna"
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