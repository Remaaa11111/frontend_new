import { useState } from "react";
import { Menu } from "antd";
import { NavLink } from "react-router-dom";
import {
    HomeOutlined,
    BookOutlined,
    ShoppingOutlined,
    HistoryOutlined,
} from "@ant-design/icons";

function Sidenav() {
    const [selectedKey, setSelectedKey] = useState("/dashboard");

    const menuItems = [
        {
            key: "/dashboard",
            icon: <HomeOutlined />,
            label: <NavLink to="/dashboard">Dashboard</NavLink>,
        },
        {
            key: "/books",
            icon: <BookOutlined />,
            label: <NavLink to="/books">Books</NavLink>,
        },
        {
            key: "/my-borrowings",
            icon: <ShoppingOutlined />,
            label: <NavLink to="/my-borrowings">My Borrowings</NavLink>,
        },
        {
            key: "/history",
            icon: <HistoryOutlined />,
            label: <NavLink to="/history">History</NavLink>,
        },
    ];

    const handleMenuKey = ({ key }) => {
        setSelectedKey(key);
    };

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
                onSelect={handleMenuKey}
                style={{ background: 'transparent', borderRight: 0 }}
            />
        </div>
    );
}

export default Sidenav; 