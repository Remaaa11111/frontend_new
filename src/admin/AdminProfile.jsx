import React from "react";
import { Card, Typography } from "antd";

const { Title, Text } = Typography;

const AdminProfile = () => (
  <div style={{ background: '#fff', minHeight: '100vh', padding: 8 }}>
    <Card bordered={false} style={{ maxWidth: 500, margin: "40px auto" }}>
      <Title level={3}>Profil Admin</Title>
      <Text>Nama: Admin</Text>
      <br />
      <Text>Email: admin@mail.com</Text>
      <br />
      <Text>Role: Admin</Text>
      {/* Tambahkan info lain sesuai kebutuhan */}
    </Card>
  </div>
);

export default AdminProfile; 