import {
  Col, Row, Typography,
  Card, List, Divider,
  Skeleton, FloatButton, Drawer,
  Form, Input, Button,
  notification, Popconfirm, Space, Upload, Select
} from "antd";
import { getData, sendData, deleteData } from "../utils/api";
import { useState, useEffect } from "react";
import {
  PlusCircleOutlined, SearchOutlined,
  EditOutlined, DeleteOutlined,
  LogoutOutlined, UserOutlined,
  InboxOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";

const { Title, Text } = Typography;

const BookManagement = () => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [form] = Form.useForm();
  const [isEdit, setIsEdit] = useState(false);
  const [idSelected, setIdSelected] = useState(null);
  const [api, contextHolder] = notification.useNotification();
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [coverFile, setCoverFile] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState('all');

  // Daftar genre utama
  const genreList = [
    'Novel',
    'Comic',
    'Encyclopedia',
    'Biography',
    'Science',
    'Education',
    'Mystery',
    'History',
    'Religion',
    'Others',
  ];

  useEffect(() => {
    getBooks();
  }, []);

  const openNotificationWithIcon = (type, title, description) => {
    api[type]({
      message: title,
      description: description,
    });
  };

  const getBooks = () => {
    getData("/api/books/")
      .then((resp) => {
        setBooks(resp ?? []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const openDrawer = () => {
    setIsOpenDrawer(true);
  };

  const onClose = () => {
    if (isEdit) {
      form.resetFields();
      setIsEdit(false);
      setIdSelected(null);
    }
    setIsOpenDrawer(false);
  };

  const handleSearch = (value) => {
    setSearchText(value.toLowerCase());
  };

  let booksFiltered = books.filter((item) =>
    item?.title?.toLowerCase().includes(searchText)
  );

  // Filter buku berdasarkan genre
  const booksFilteredByGenre = selectedGenre === 'all'
    ? booksFiltered
    : booksFiltered.filter(book =>
        Array.isArray(book.genres)
          ? book.genres.some(g => g.toLowerCase() === selectedGenre.toLowerCase())
          : false
      );

  const handleUploadChange = (info) => {
    if (info.file.status === 'removed') {
      setCoverFile(null);
    } else if (info.file.originFileObj) {
      setCoverFile(info.file.originFileObj);
    }
  };

  const handleDrawerEdit = (record) => {
    setIsOpenDrawer(true);
    setIsEdit(true);
    setIdSelected(record?.id);
    form.setFieldValue("title", record?.title);
    form.setFieldValue("author", record?.author);
    form.setFieldValue("description", record?.description);
    if (record?.cover) {
      setCoverFile({
        uid: '-1',
        name: record.cover.split('/').pop(),
        status: 'done',
        url: record.cover
      });
    } else {
      setCoverFile(null);
    }
  };

  const handleSubmit = () => {
    let url = isEdit ? `/api/books/update/${idSelected}` : "/api/books/create";
    let msg = isEdit ? "Sukses edit buku" : "Sukses tambah buku";

    let title = form.getFieldValue("title");
    let author = form.getFieldValue("author");
    let description = form.getFieldValue("description");
    let stock = form.getFieldValue("stock");
    let price_per_day = form.getFieldValue("price_per_day");
    let genres = form.getFieldValue("genres") || [];

    let formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("description", description);
    formData.append("stock", stock);
    formData.append("price_per_day", price_per_day);
    genres.forEach(g => formData.append("genres", g));
    let cover = form.getFieldValue("cover");
    if (cover) {
      formData.append("cover", cover);
    }

    sendData(url, formData)
      .then((resp) => {
        if (resp?.success || resp?.id || resp?.status === 200) {
          openNotificationWithIcon("success", msg, "");
          setIsOpenDrawer(false);
          getBooks();
          onClose();
        } else {
          openNotificationWithIcon("error", "Data Buku", "Data gagal dikirim");
        }
      });
  };

  const renderDrawer = () => (
    <Drawer
      title={isEdit ? "Edit Buku" : "Tambah Buku"}
      closable={{ 'aria-label': 'Close Button' }}
      onClose={onClose}
      open={isOpenDrawer}
      extra={<Button type="primary" onClick={handleSubmit}>Submit</Button>}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Judul Buku"
          name="title"
          rules={[{ required: true, message: 'Harus diisi' }]}
        >
          <Input placeholder="Judul Buku" />
        </Form.Item>
        <Form.Item
          label="Penulis"
          name="author"
          rules={[{ required: true, message: 'Harus diisi' }]}
        >
          <Input placeholder="Penulis" />
        </Form.Item>
        <Form.Item
          label="Genre"
          name="genres"
          rules={[{ required: true, message: 'Pilih minimal satu genre' }]}
        >
          <Select mode="multiple" placeholder="Pilih genre">
            {genreList.map((genre) => (
              <Select.Option key={genre} value={genre}>{genre}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Jumlah Buku Tersedia"
          name="stock"
          rules={[{ required: true, message: 'Harus diisi' }]}
        >
          <Input type="number" min={0} placeholder="Jumlah Buku Tersedia" />
        </Form.Item>
        <Form.Item
          label="Harga Peminjaman per Hari (Rp)"
          name="price_per_day"
          rules={[{ required: true, message: 'Masukkan harga peminjaman per hari' }]}
        >
          <Input type="number" min={0} placeholder="Contoh: 5000" />
        </Form.Item>
        <Form.Item
          label="Deskripsi"
          name="description"
        >
          <Input.TextArea rows={3} placeholder="Deskripsi" />
        </Form.Item>
        <Form.Item
          label="Link Cover Buku"
          name="cover"
          rules={[{ required: true, message: 'Masukkan link cover buku' }]}
        >
          <Input type="url" placeholder="https://contoh.com/cover.jpg" />
        </Form.Item>
      </Form>
    </Drawer>
  );

  const confirmDelete = (record) => {
    let url = `/api/books/delete/${record?.id}`;
    deleteData(url)
      .then(resp => {
        if (resp?.success || resp?.status === 200) {
          openNotificationWithIcon("success", "Sukses hapus buku", "Data berhasil dihapus");
          getBooks();
        } else {
          openNotificationWithIcon("error", "Gagal hapus buku", "Data gagal dihapus");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

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
      <FloatButton
        icon={<PlusCircleOutlined />}
        type="primary"
        style={{ insetInlineEnd: 24 }}
        onClick={openDrawer}
      />
      {renderDrawer()}

      <Row gutter={[24, 0]}>
        <Col xs={23} className="mb-24">
          <Card bordered={false} style={{ background: '#fff', borderRadius: 12 }}>
            <Title>Daftar Buku</Title>
            <Text style={{ fontSize: "12pt" }}>Manajemen Koleksi Buku</Text>
            <Divider />

            <div style={{ marginBottom: 16 }}>
              <Select value={selectedGenre} style={{ width: 200 }} onChange={setSelectedGenre}>
                <Select.Option value="all">All Genre</Select.Option>
                {genreList.map((genre) => (
                  <Select.Option key={genre} value={genre}>{genre}</Select.Option>
                ))}
              </Select>
            </div>

            <Input
              prefix={<SearchOutlined />}
              placeholder="Cari judul buku"
              className="header-search"
              allowClear
              size="large"
              onChange={(e) => handleSearch(e.target.value)}
            />

            {isLoading && books.length <= 0 ? (
              <Skeleton active />
            ) : (
              <List
                grid={{ gutter: 16, xl: 4, lg: 3, md: 2, sm: 1, xs: 1 }}
                dataSource={booksFilteredByGenre ?? []}
                renderItem={(item) => (
                  <List.Item>
                    <Card
                      hoverable
                      style={{ background: '#fff', borderRadius: 8 }}
                      actions={[
                        <EditOutlined key={item.id} onClick={() => handleDrawerEdit(item)} />,
                        <Popconfirm
                          key={item?.id}
                          title="Hapus Buku"
                          description="Yakin ingin menghapus buku ini?"
                          onConfirm={() => confirmDelete(item)}
                          okText="Yes"
                          cancelText="No"
                        >
                          <DeleteOutlined key={item?.id} />
                        </Popconfirm>
                      ]}
                    >
                      <Card.Meta
                        title={item?.title}
                        description={
                          <>
                            <div>Penulis: {item?.author}</div>
                            <div>{item?.description}</div>
                          </>
                        }
                      />
                    </Card>
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default BookManagement;