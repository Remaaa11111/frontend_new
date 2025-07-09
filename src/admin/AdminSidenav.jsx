import { Menu } from "antd";
import { NavLink, useLocation } from "react-router-dom";
import {
  DashboardOutlined,
  BookOutlined,
  CheckCircleOutlined,
  UserOutlined
} from "@ant-design/icons";

function AdminSidenav() {
  const location = useLocation();
  const selectedKey = location.pathname;

  const menuItems = [
    {
      key: "/admin/dashboard",
      icon: <DashboardOutlined />,
      label: <NavLink to="/admin/dashboard">Dashboard</NavLink>,
    },
    {
      key: "/admin/books",
      icon: <BookOutlined />,
      label: <NavLink to="/admin/books">Book Management</NavLink>,
    },
    {
      key: "/admin/transactions",
      icon: <CheckCircleOutlined />,
      label: <NavLink to="/admin/transactions">Loan Verification</NavLink>,
    },
    {
      key: "/admin/users",
      icon: <UserOutlined />,
      label: <NavLink to="/admin/users">User Management</NavLink>,
    },
  ];

  return (
    <div style={{ width: 220, minHeight: "100vh", background: "#d6e4f0", position: 'fixed', left: 0, top: 0, zIndex: 10 }}>
      <div className="brand" style={{ padding: '24px 16px', fontWeight: "bold", fontSize: 20, textAlign: "center", color: '#333' }}>
      Tales to GO!
      </div>
      <Menu
        theme="light"
        mode="inline"
        items={menuItems}
        selectedKeys={[selectedKey]}
        style={{ background: 'transparent', borderRight: 0 }}
      />
    </div>
  );
}

export default AdminSidenav; 