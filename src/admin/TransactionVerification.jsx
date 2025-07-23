import React, { useState, useEffect, useContext } from "react";
import {
  Table,
  Input,
  Button,
  Tag,
  Space,
  Popconfirm,
  notification,
  Typography,
  Card,
} from "antd";
import {
  CheckCircleOutlined,
  SearchOutlined,
  ReloadOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";
import dayjs from "dayjs";

const { Title } = Typography;

const TransactionVerification = () => {
  const [transactions, setTransactions] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [api, contextHolder] = notification.useNotification();
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    getTransactions();
  }, []);

  const getTransactions = () => {
    const accessToken = localStorage.getItem("access_token");
    fetch("/api/loans/", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => res.json())
      .then(setTransactions)
      .catch((err) => console.error("Error fetching transactions:", err));
  };

  const handleSearch = (e) => setSearchText(e.target.value.toLowerCase());

  const filteredTransactions = transactions.filter(
    (item) =>
      item.email_user.toLowerCase().includes(searchText) ||
      item.judul_buku.toLowerCase().includes(searchText) ||
      String(item.id_peminjaman).includes(searchText)
  );

  const handleVerify = (record, type) => {
    let newStatus = record.status;
    let notifMsg = "";
    let notifDesc = "";

    if (type === "Pickup" || type === "Pengambilan") {
      newStatus = "borrowed";
      notifMsg = `Pickup Verification Successful`;
      notifDesc = `Transaction for ${record.email_user} - ${record.judul_buku} has been verified as Borrowed.`;
    } else if (type === "Return" || type === "Kembalikan") {
      newStatus = "returned";
      notifMsg = `Book Returned`;
      notifDesc = `Transaction for ${record.email_user} - ${record.judul_buku} has been completed (returned).`;
    }

    const payload = {
      tanggal_kembali: new Date().toISOString().slice(0, 10),
      status: newStatus,
    };

    fetch(`/api/loans/update/${record.id_peminjaman}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Gagal update");
        }
        return res.json();
      })
      .then(() => {
        api.success({
          message: notifMsg,
          description: notifDesc,
        });
        setTransactions((prev) =>
          prev.map((item) =>
            item.id_peminjaman === record.id_peminjaman
              ? { ...item, status: newStatus }
              : item
          )
        );
      })
      .catch((err) => {
        api.error({
          message: "Error Occurred",
          description: err.message || "Failed to update transaction status.",
        });
      });
  };

  const handleCancel = (record) => {
    api.info({
      message: "Pickup Cancelled",
      description: `Transaction for ${record.email_user} - ${record.judul_buku} has been cancelled.`,
    });

    const payload = {
      tanggal_kembali: new Date().toISOString().slice(0, 10),
      status: "cancelled",
    };

    fetch(`/api/loans/update/${record.id_peminjaman}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Gagal cancel");
        }
        return res.json();
      })
      .then(() => {
        setTransactions((prev) =>
          prev.map((item) =>
            item.id_peminjaman === record.id_peminjaman
              ? { ...item, status: "cancelled" }
              : item
          )
        );
      })
      .catch((err) => {
        api.error({
          message: "Error Occurred",
          description: err.message || "Failed to cancel transaction.",
        });
      });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id_peminjaman",
      key: "id",
      width: 60,
    },
    {
      title: "User Email",
      dataIndex: "email_user",
      key: "user",
    },
    {
      title: "Book Title",
      dataIndex: "judul_buku",
      key: "book",
    },
    {
      title: "Borrow Date",
      dataIndex: "tanggal_pinjam",
      key: "tanggal_pinjam",
      render: (val) => dayjs(val).format("DD MMM YYYY"), // tampilkan tanggal tanpa jam
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "default";
        if (status === "scheduled") color = "orange";
        else if (status === "borrowed") color = "blue";
        else if (status === "returned") color = "green";
        else if (status === "cancelled") color = "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          {record.status === "scheduled" && (
            <>
              <Popconfirm
                title="Verify Pickup?"
                onConfirm={() => handleVerify(record, "Pickup")}
                okText="Yes"
                cancelText="No"
              >
                <Button type="primary" icon={<CheckCircleOutlined />}>
                  Verify Pickup
                </Button>
              </Popconfirm>
              <Popconfirm
                title="Cancel Pickup?"
                onConfirm={() => handleCancel(record)}
                okText="Yes"
                cancelText="No"
              >
                <Button danger style={{ marginLeft: 8 }}>
                  Cancel
                </Button>
              </Popconfirm>
            </>
          )}
          {record.status === "borrowed" && (
            <Popconfirm
              title="Return Book?"
              onConfirm={() => handleVerify(record, "Return")}
              okText="Yes"
              cancelText="No"
            >
              <Button type="primary">Return Book</Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ background: "#fff", minHeight: "100vh", padding: 8, marginLeft: 220 }}>
      <Space style={{ position: "absolute", right: 32, top: 24, zIndex: 20 }}>
        <Button
          type="text"
          icon={<LogoutOutlined />}
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          Sign Out
        </Button>
        <Button
          shape="circle"
          icon={<UserOutlined />}
          onClick={() => navigate("/admin/profile")}
        />
      </Space>
      {contextHolder}
      <Card bordered={false} style={{ marginBottom: 24 }}>
        <Title level={3}>Book Pickup / Return Verification</Title>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search user name/ID or book title"
          allowClear
          size="large"
          style={{ maxWidth: 400, margin: "16px 0" }}
          onChange={handleSearch}
        />
        <Button icon={<ReloadOutlined />} onClick={() => getTransactions()} style={{ marginLeft: 8 }}>
          Reset Data
        </Button>
        <Table
          columns={columns}
          dataSource={filteredTransactions}
          rowKey="id_peminjaman"
          pagination={{ pageSize: 6 }}
          style={{ marginTop: 24 }}
        />
      </Card>
    </div>
  );
};

export default TransactionVerification;
