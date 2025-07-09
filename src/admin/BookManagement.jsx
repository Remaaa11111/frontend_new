import {
  Col, Row, Typography,
  Card, List, Divider,
  Skeleton, FloatButton, Drawer,
  Form, Input, Button,
  notification, Popconfirm, Space, Select
} from "antd";
import { getData, sendData, updateData, deleteData } from "../utils/api";
import { useState, useEffect, useContext } from "react";
import {
  PlusCircleOutlined, SearchOutlined,
  EditOutlined, DeleteOutlined,
  LogoutOutlined, UserOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
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
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const genreList = [
    'Novel', 'Comic', 'Encyclopedia', 'Biography',
    'Science', 'Education', 'Mystery', 'History', 'Religion', 'Others'
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
        const normalized = Array.isArray(resp)
          ? resp.map((item) => ({
              id: item.id_buku,
              title: item.judul,
              author: item.penulis,
              description: item.deskripsi,
              cover: item.cover_image,
              genres: [item.genre],
              stock: item.stok_buku,
              price_per_day: item.harga,
              status: item.status
            }))
          : [];
        setBooks(normalized);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch books:", err.message);
        openNotificationWithIcon("error", "Failed to load books", "Please check your connection");
        setIsLoading(false);
      });
  };

  const openDrawer = () => {
    setIsOpenDrawer(true);
    setDetailDrawerOpen(false);
    setIsEdit(false); // reset ke mode tambah
    setIdSelected(null);
    form.resetFields(); // pastikan form kosong
  };
  const onClose = () => {
    form.resetFields();
    setIsEdit(false);
    setIdSelected(null);
    setIsOpenDrawer(false);
  };

  const handleSearch = (value) => setSearchText(value.toLowerCase());

  const booksFiltered = books.filter((item) =>
    item?.title?.toLowerCase().includes(searchText)
  );

  const booksFilteredByGenre = selectedGenre === 'all'
    ? booksFiltered
    : booksFiltered.filter(book =>
        Array.isArray(book.genres)
          ? book.genres.some(g => g.toLowerCase() === selectedGenre.toLowerCase())
          : false
      );

  const handleDrawerEdit = (record) => {
    setIsOpenDrawer(true);
    setDetailDrawerOpen(false);
    setIsEdit(true);
    setIdSelected(record.id);
    form.setFieldsValue({
      judul: record.title,
      penulis: record.author,
      deskripsi: record.description,
      stok_buku: record.stock,
      harga: record.price_per_day,
      genre: record.genres,
      cover_image: record.cover,
      status: record.status || 'available'
    });
  };

  const handleSubmit = async () => {
    // Cegah double submit
    if (form.isSubmitting) return;
    form.isSubmitting = true;
    const url = isEdit ? `/api/books/update/${idSelected}` : "/api/books/create";
    const msg = isEdit ? "Book updated successfully" : "Book added successfully";

    try {
      const values = await form.validateFields();
      console.log("Form values:", values); // Debug log
      if (isEdit) {
        // Kirim data sebagai FormData untuk update
        const formData = new FormData();
        formData.append("id_buku", idSelected);
        formData.append("judul", values.judul);
        formData.append("penulis", values.penulis);
        formData.append("genre", Array.isArray(values.genre) ? values.genre.join(",") : values.genre);
        formData.append("cover_image", values.cover_image);
        formData.append("deskripsi", values.deskripsi || "");
        formData.append("stok_buku", values.stok_buku.toString());
        formData.append("status", values.status);
        formData.append("harga", values.harga.toString());
        console.log("Sending to URL:", url); // Debug log
        const response = await updateData(url, formData);
        console.log("API Response:", response); // Debug log
        if (
          response?.success === true ||
          response?.datas ||
          response?.message === "Book created" ||
          response?.message === "Book updated" ||
          response?.status === 200
        ) {
          const idInfo = response?.id_buku ? `Book ID: ${response.id_buku}` : "";
          openNotificationWithIcon("success", response?.message || msg, idInfo);
          await new Promise(resolve => setTimeout(resolve, 400));
          getBooks();
          onClose();
        } else {
          const errorMsg = response?.error || response?.message || "Server rejected data or error occurred";
          openNotificationWithIcon("error", "Failed to submit", errorMsg);
        }
      } else {
        // Tambah: tetap pakai FormData
        const formData = new FormData();
        formData.append("judul", values.judul);
        formData.append("penulis", values.penulis);
        formData.append("genre", Array.isArray(values.genre) ? values.genre.join(",") : values.genre);
        formData.append("cover_image", values.cover_image);
        formData.append("deskripsi", values.deskripsi || "");
        formData.append("stok_buku", values.stok_buku.toString());
        formData.append("status", values.status);
        formData.append("harga", values.harga.toString());


        
        console.log("Sending to URL:", url); // Debug log
        const response = await sendData(url, formData);
        console.log("API Response:", response); // Debug log
        if (response?.success || response?.datas || response?.message === "Book created" || response?.status === 200) {
          const idInfo = response?.id_buku ? `Book ID: ${response.id_buku}` : "";
          openNotificationWithIcon("success", msg, idInfo);
          await new Promise(resolve => setTimeout(resolve, 400));
          getBooks();
          onClose();
        } else {
          const errorMsg = response?.error || response?.message || "Server rejected data or error occurred";
          openNotificationWithIcon("error", "Failed to submit", errorMsg);
        }
      }
    } catch (err) {
      console.error("Submit error:", err);
      openNotificationWithIcon("error", "Form validation failed", "Please check your inputs.");
    } finally {
      form.isSubmitting = false;
    }
  };

  const openDetailDrawer = (book) => {
    setSelectedBook(book);
    setDetailDrawerOpen(true);
    setIsOpenDrawer(false); // pastikan edit drawer tertutup
  };
  const closeDetailDrawer = () => {
    setDetailDrawerOpen(false);
    setSelectedBook(null);
  };

  const renderDrawer = () => (
    <Drawer
      title={isEdit ? "Edit Book" : "Add Book"}
      onClose={onClose}
      open={isOpenDrawer}
      extra={<Button type="primary" onClick={handleSubmit}>Submit</Button>}
    >
      <Form form={form} layout="vertical">
        <Form.Item label="Book Title" name="judul" rules={[{ required: true, message: 'Title is required' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Author" name="penulis" rules={[{ required: true, message: 'Author is required' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Genre" name="genre" rules={[{ required: true, message: 'Please select at least one genre' }]}>
          <Select mode="multiple">
            {genreList.map(g => (
              <Select.Option key={g} value={g}>{g}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Available Stock"
          name="stok_buku"
          rules={[{ required: true, message: 'Stock is required' }]}
          normalize={value => value === '' ? '' : parseInt(value)}
        >
          <Input type="number" min={0} />
        </Form.Item>
        <Form.Item
          label="Rental Price per Day (Rp)"
          name="harga"
          rules={[{ required: true, message: 'Please enter price' }]}
          normalize={value => value === '' ? '' : parseInt(value)}
        >
          <Input type="number" min={0} />
        </Form.Item>
        <Form.Item label="Description" name="deskripsi">
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item label="Cover Image URL" name="cover_image" rules={[{ required: true, message: 'Please enter image URL' }]}>
          <Input type="url" />
        </Form.Item>
        <Form.Item label="Status" name="status" rules={[{ required: true, message: 'Please select status' }]}>
          <Select>
            <Select.Option value="available">Available</Select.Option>
            <Select.Option value="not available">Not Available</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Drawer>
  );

  const renderBookDetailDrawer = () => (
    <Drawer
      title={selectedBook?.title || "Book Detail"}
      open={detailDrawerOpen}
      onClose={closeDetailDrawer}
      width={600}
    >
      {selectedBook && (
        <div style={{ display: 'flex', gap: 32 }}>
          <img
            src={selectedBook.cover}
            alt={selectedBook.title}
            style={{ width: 220, height: 300, objectFit: 'cover', borderRadius: 8 }}
          />
          <div style={{ flex: 1 }}>
            <Title level={3}>{selectedBook.title}</Title>
            <Text strong>Author:</Text> {selectedBook.author}<br />
            <Text strong>Genre:</Text> {selectedBook.genres?.join(', ') || '-'}<br />
            <Text strong>Status:</Text> {selectedBook.status}<br />
            <Text strong>Stock:</Text> {selectedBook.stock}<br />
            <Text strong>Price per day:</Text> Rp {selectedBook.price_per_day}<br />
            <Text strong>Description:</Text>
            <div style={{ marginTop: 8 }}>{selectedBook.description || '-'}</div>
          </div>
        </div>
      )}
    </Drawer>
  );

  const confirmDelete = (record) => {
    const url = `/api/books/delete/${record?.id}`;
    deleteData(url)
      .then(resp => {
        console.log("Delete API response:", resp);
        if (resp?.ok || resp?.status === 200 || resp?.success) {
          openNotificationWithIcon("success", "Book deleted successfully", "Data has been removed");
          const idStr = String(record.id);
          setBooks(prev => prev.filter(book => String(book.id) !== idStr));
        } else {
          openNotificationWithIcon("error", "Failed to delete book", resp?.message || "Data could not be deleted");
        }
      })
      .catch(err => {
        console.error("Delete error:", err);
        openNotificationWithIcon("error", "Failed to delete book", "Network error occurred");
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
      <FloatButton icon={<PlusCircleOutlined />} type="primary" style={{ insetInlineEnd: 24 }} onClick={openDrawer} />
      {renderDrawer()}
      {renderBookDetailDrawer()}

      <Row gutter={[24, 0]}>
        <Col xs={23} className="mb-24">
          <Card variant="outlined" style={{ background: '#fff', borderRadius: 12 }}>
            <Title>Book List</Title>
            <Text>Book Collection Management</Text>
            <Divider />

            <div style={{ marginBottom: 16 }}>
              <Select value={selectedGenre} style={{ width: 200 }} onChange={setSelectedGenre}>
                <Select.Option value="all">All Genres</Select.Option>
                {genreList.map((genre) => (
                  <Select.Option key={genre} value={genre}>{genre}</Select.Option>
                ))}
              </Select>
            </div>

            <Input prefix={<SearchOutlined />} placeholder="Search book title" allowClear size="large" onChange={(e) => handleSearch(e.target.value)} style={{ marginBottom: 24 }} />

            {isLoading && books.length <= 0 ? (
              <Skeleton active />
            ) : (
              <List
                grid={{ gutter: 50, xl: 4, lg: 3, md: 2, sm: 1, xs: 1 }}
                dataSource={booksFilteredByGenre ?? []}
                renderItem={(item) => (
                  <List.Item>
                    <Card
                      hoverable
                      style={{
                        borderRadius: 8,
                        width: 220,
                        minHeight: 370,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                      actions={[
                        <EditOutlined key={item.id} onClick={e => { e.stopPropagation(); handleDrawerEdit(item); }} />,
                        <Popconfirm title="Delete Book" description="Are you sure you want to delete this book?" onConfirm={e => { e.stopPropagation(); confirmDelete(item); }} okText="Yes" cancelText="No">
                          <DeleteOutlined key={item.id} onClick={e => e.stopPropagation()} />
                        </Popconfirm>
                      ]}
                      cover={item.cover && (
                        <img alt={item.title} src={item.cover} style={{ height: 200, width: 220, objectFit: 'cover', borderRadius: 8 }} />
                      )}
                      onClick={() => openDetailDrawer(item)}
                    >
                      <Card.Meta
                        title={item.title}
                        description={
                          <>
                            <div>Author: {item.author}</div>
                            <div>Stock: {item.stock}</div>
                            <div>Price: Rp {item.price_per_day}/day</div>
                            <div
                              style={{
                                maxHeight: 48,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical'
                              }}
                            >
                              {item.description}
                            </div>
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