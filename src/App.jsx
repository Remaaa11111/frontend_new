import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './landingpage';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import Books from './Books';
import BookDetail from './BookDetail';
import MyBorrowings from './MyBorrowings';
import BorrowingDetail from './BorrowingDetail';
import History from './History';
import Profile from './Profile';
import MainLayout from './MainLayout';
import BookManagement from './admin/BookManagement';
import AdminDashboard from './admin/AdminDashboard';
import TransactionVerification from './admin/TransactionVerification';
import UserManagement from './admin/UserManagement';
import AdminLayout from './admin/AdminLayout';
import AdminProfile from './admin/AdminProfile';
import ContactUs from './ContactUs';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/books" element={<Books />} />
        <Route path="/books/:id" element={<BookDetail />} />
        <Route path="/my-borrowings" element={<MyBorrowings />} />
        <Route path="/borrowings/:id" element={<BorrowingDetail />} />
        <Route path="/history" element={<History />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
      <Route element={<AdminLayout />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/books" element={<BookManagement />} />
        <Route path="/admin/transactions" element={<TransactionVerification />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;