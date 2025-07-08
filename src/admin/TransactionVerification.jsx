import React, { useState, useEffect } from "react";
import { Table, Input, Button, Tag, Space, Popconfirm, notification, Typography, Card } from "antd";
import { CheckCircleOutlined, SearchOutlined, ReloadOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";

const { Title } = Typography;

const dummyTransactions = [
  {
    id: 1,
    user: "Budi",
    book: "React Handbook",
    status: "Menunggu Pengambilan",
    date: "2024-07-08",
  },
  {
    id: 2,
    user: "Sari",
    book: "Python Dasar",
    status: "Dipinjam",
    date: "2024-07-07",
  },
  {
    id: 3,
    user: "Andi",
    book: "UI/UX Design",
    status: "Menunggu Pengambilan",
    date: "2024-07-06",
  },
];

const TransactionVerification = () => {
  const [transactions, setTransactions] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [api, contextHolder] = notification.useNotification();
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Nanti fetch dari API
    setTransactions(dummyTransactions);
  }, []);

  const handleSearch = (e) => {
    setSearchText(e.target.value.toLowerCase());
  };

  const filteredTransactions = transactions.filter(
    (item) =>
      item.user.toLowerCase().includes(searchText) ||
      item.book.toLowerCase().includes(searchText) ||
      String(item.id).includes(searchText)
  );

  const handleVerify = (record, type) => {
    // Nanti update status via API
    let newStatus = record.status;
    let notifMsg = '';
    let notifDesc = '';
    if (type === "Pengambilan") {
      newStatus = "Dipinjam";
      notifMsg = `Verifikasi Pengambilan Berhasil`;
      notifDesc = `Transaksi untuk ${record.user} - ${record.book} sudah diverifikasi sebagai Dipinjam.`;
    } else if (type === "Pengembalian" || type === "Kembalikan") {
      newStatus = "Selesai";
      notifMsg = `Buku Sudah Dikembalikan`;
      notifDesc = `Transaksi untuk ${record.user} - ${record.book} sudah selesai (dikembalikan).`;
    }
    api.success({
      message: notifMsg,
      description: notifDesc,
    });
    setTransactions((prev) =>
      prev.map((item) =>
        item.id === record.id
          ? { ...item, status: newStatus }
          : item
      )
    );
  };

  const handleCancel = (record) => {
    api.info({
      message: "Pengambilan Dibatalkan",
      description: `Transaksi untuk ${record.user} - ${record.book} telah dibatalkan.`,
    });
    setTransactions((prev) =>
      prev.map((item) =>
        item.id === record.id
          ? { ...item, status: "Dibatalkan" }
          : item
      )
    );
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
    },
    {
      title: "Nama Pengguna",
      dataIndex: "user",
      key: "user",
    },
    {
      title: "Judul Buku",
      dataIndex: "book",
      key: "book",
    },
    {
      title: "Tanggal",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "default";
        if (status === "Menunggu Pengambilan") color = "orange";
        else if (status === "Dipinjam") color = "blue";
        else if (status === "Selesai") color = "green";
        else if (status === "Dibatalkan") color = "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Aksi",
      key: "action",
      render: (_, record) => (
        <Space>
          {record.status === "Menunggu Pengambilan" && (
            <>
              <Popconfirm
                title="Verifikasi Pengambilan?"
                onConfirm={() => handleVerify(record, "Pengambilan")}
                okText="Ya"
                cancelText="Batal"
              >
                <Button type="primary" icon={<CheckCircleOutlined />}>Verifikasi Pengambilan</Button>
              </Popconfirm>
              <Popconfirm
                title="Batalkan Pengambilan?"
                onConfirm={() => handleCancel(record)}
                okText="Ya"
                cancelText="Batal"
              >
                <Button danger style={{ marginLeft: 8 }}>Batalkan Pengambilan</Button>
              </Popconfirm>
            </>
          )}
          {record.status === "Dipinjam" && (
            <Popconfirm
              title="Kembalikan Buku?"
              onConfirm={() => handleVerify(record, "Kembalikan")}
              okText="Ya"
              cancelText="Tidak"
            >
              <Button type="primary">Kembalikan Buku</Button>
            </Popconfirm>
          )}
        </Space>
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
        <Title level={3}>Verifikasi Pengambilan / Pengembalian Buku</Title>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Cari nama/ID pengguna atau judul buku"
          allowClear
          size="large"
          style={{ maxWidth: 400, margin: '16px 0' }}
          onChange={handleSearch}
        />
        <Button icon={<ReloadOutlined />} onClick={() => setTransactions(dummyTransactions)} style={{ marginLeft: 8 }}>
          Reset Data
        </Button>
        <Table
          columns={columns}
          dataSource={filteredTransactions}
          rowKey="id"
          pagination={{ pageSize: 6 }}
          style={{ marginTop: 24 }}
        />
      </Card>
    </div>
  );
};

export default TransactionVerification; 