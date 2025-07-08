import React from "react";
import { Layout } from "antd";
import AdminSidenav from "./AdminSidenav";
import { Outlet } from "react-router-dom";

const { Content } = Layout;

const AdminLayout = () => (
  <Layout style={{ minHeight: "100vh" }}>
    <AdminSidenav />
    <Layout>
      <Content style={{ padding: 24, background: "#fff" }}>
        <Outlet />
      </Content>
    </Layout>
  </Layout>
);

export default AdminLayout; 