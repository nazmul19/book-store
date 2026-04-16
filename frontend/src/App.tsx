import React from 'react';
import {
  Badge,
  Button,
  Form,
  Input,
  InputNumber,
  Layout,
  Menu,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from 'antd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { api } from './services/api';

type Book = {
  id: string;
  title: string;
  author: string;
  isbn: string;
  publishedYear: number;
  availabilityStatus: 'AVAILABLE' | 'BORROWED';
};
type User = { id: string; name: string };
type NotificationLog = {
  id: string;
  userId: string;
  bookId: string;
  message: string;
  createdAt: string;
};

function BooksPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const books = useQuery({
    queryKey: ['books'],
    queryFn: async () => (await api.get('/api/books')).data.data as Book[],
  });
  const users = useQuery({
    queryKey: ['users'],
    queryFn: async () => (await api.get('/api/users')).data as User[],
  });
  const wishlistMutation = useMutation({
    mutationFn: (payload: { userId: string; bookId: string }) => api.post('/api/wishlist', payload),
    onSuccess: () => messageApi.success('Added to wishlist'),
  });
  const statusMutation = useMutation({
    mutationFn: ({ id, availabilityStatus }: { id: string; availabilityStatus: string }) =>
      api.put(`/api/books/${id}`, { availabilityStatus }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['books'] }),
  });

  return (
    <div className="space-y-4">
      {contextHolder}
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold">Books</h2>
        <Button type="primary" onClick={() => navigate('/book-form')}>
          Add Book
        </Button>
      </div>
      <Form form={form} layout="inline" onFinish={(v) => wishlistMutation.mutate(v)}>
        <Form.Item name="userId" rules={[{ required: true }]}><Select style={{ width: 200 }} placeholder="Select user" options={(users.data ?? []).map((u) => ({ value: u.id, label: u.name }))} /></Form.Item>
        <Form.Item name="bookId" rules={[{ required: true }]}><Select style={{ width: 260 }} placeholder="Select book" options={(books.data ?? []).map((b) => ({ value: b.id, label: b.title }))} /></Form.Item>
        <Button htmlType="submit">Add Wishlist</Button>
      </Form>
      <Table
        rowKey="id"
        dataSource={books.data}
        loading={books.isLoading}
        columns={[
          { title: 'Title', dataIndex: 'title' },
          { title: 'Author', dataIndex: 'author' },
          { title: 'ISBN', dataIndex: 'isbn' },
          { title: 'Year', dataIndex: 'publishedYear' },
          { title: 'Status', dataIndex: 'availabilityStatus' },
          {
            title: 'Actions',
            render: (_, record: Book) => (
              <Space>
                <Button onClick={() => navigate(`/book-form/${record.id}`)}>Edit</Button>
                <Select
                  value={record.availabilityStatus}
                  style={{ width: 130 }}
                  options={[
                    { value: 'AVAILABLE', label: 'AVAILABLE' },
                    { value: 'BORROWED', label: 'BORROWED' },
                  ]}
                  onChange={(v) => statusMutation.mutate({ id: record.id, availabilityStatus: v })}
                />
              </Space>
            ),
          },
        ]}
      />
    </div>
  );
}

function BookFormPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const { id } = useParams();
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: async () => (await api.get('/api/users')).data as User[],
  });
  const bookQuery = useQuery({
    queryKey: ['book', id],
    queryFn: async () => (await api.get('/api/books')).data.data.find((b: Book) => b.id === id) as Book,
    enabled: Boolean(id),
  });
  React.useEffect(() => {
    if (bookQuery.data) {
      form.setFieldsValue(bookQuery.data);
    }
  }, [bookQuery.data, form]);
  const mutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      id ? api.put(`/api/books/${id}`, payload) : api.post('/api/books', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      form.resetFields();
    },
  });
  const userMutation = useMutation({
    mutationFn: (payload: { name: string }) => api.post('/api/users', payload),
    onSuccess: () => {
      messageApi.success('User created');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: () => {
      messageApi.error('Failed to create user');
    },
  });
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {contextHolder}
      <div className="rounded bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-xl font-semibold">Add Book</h2>
        <Form form={form} layout="vertical" onFinish={(v) => mutation.mutate(v)}>
          <Form.Item name="title" label="Title" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="author" label="Author" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="isbn" label="ISBN" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="publishedYear" label="Published Year" rules={[{ required: true }]}><InputNumber style={{ width: '100%' }} /></Form.Item>
          <Button htmlType="submit" type="primary">Save</Button>
        </Form>
      </div>
      <div className="rounded bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-xl font-semibold">Create User</h2>
        <Form layout="vertical" onFinish={(v) => userMutation.mutate(v)}>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}><Input /></Form.Item>
          <Button type="primary" htmlType="submit">Create User</Button>
        </Form>
        <div className="mt-6">
          <h3 className="mb-2 text-lg font-medium">All Users</h3>
          <Table
            rowKey="id"
            size="small"
            loading={usersQuery.isLoading}
            pagination={{ pageSize: 5 }}
            dataSource={usersQuery.data ?? []}
            columns={[
              { title: 'Name', dataIndex: 'name' },
              { title: 'User ID', dataIndex: 'id' },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

function WishlistPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = React.useState<string>();
  const users = useQuery({
    queryKey: ['users'],
    queryFn: async () => (await api.get('/api/users')).data as User[],
  });
  const wishlist = useQuery({
    queryKey: ['wishlist', selectedUser],
    queryFn: async () => (await api.get(`/api/wishlist/${selectedUser}`)).data,
    enabled: Boolean(selectedUser),
  });
  const deleteWishlistMutation = useMutation({
    mutationFn: (wishlistId: string) => api.delete(`/api/wishlist/${wishlistId}`),
    onSuccess: () => {
      messageApi.success('Wishlist item deleted');
      queryClient.invalidateQueries({ queryKey: ['wishlist', selectedUser] });
    },
    onError: () => {
      messageApi.error('Failed to delete wishlist item');
    },
  });
  return (
    <div className="space-y-4">
      {contextHolder}
      <h2 className="text-xl font-semibold">Wishlist By User</h2>
      <Select
        placeholder="Choose a user"
        style={{ width: 260 }}
        options={(users.data ?? []).map((u) => ({ value: u.id, label: u.name }))}
        onChange={setSelectedUser}
      />
      <Table
        rowKey="id"
        dataSource={wishlist.data}
        columns={[
          { title: 'User', render: (_, r: any) => r.user?.name },
          { title: 'Book', render: (_, r: any) => r.book?.title },
          { title: 'Author', render: (_, r: any) => r.book?.author },
          {
            title: 'Action',
            render: (_, r: any) => (
              <Button
                danger
                size="small"
                loading={deleteWishlistMutation.isPending}
                onClick={() => deleteWishlistMutation.mutate(r.id)}
              >
                Delete
              </Button>
            ),
          },
        ]}
      />
    </div>
  );
}

function NotificationsPage() {
  const notifications = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => (await api.get('/api/notifications')).data as NotificationLog[],
    refetchInterval: 5000,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Notification Logs</h2>
        <Tag color="blue">Auto refresh: 5s</Tag>
      </div>
      <Table
        rowKey="id"
        loading={notifications.isLoading}
        dataSource={notifications.data ?? []}
        columns={[
          {
            title: 'Message',
            dataIndex: 'message',
          },
          {
            title: 'Created',
            dataIndex: 'createdAt',
            render: (value: string) => new Date(value).toLocaleString(),
          },
          {
            title: 'User ID',
            dataIndex: 'userId',
          },
          {
            title: 'Book ID',
            dataIndex: 'bookId',
          },
        ]}
      />
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const notifications = useQuery({
    queryKey: ['notifications-count'],
    queryFn: async () => (await api.get('/api/notifications')).data as NotificationLog[],
    refetchInterval: 5000,
  });

  const selectedKey =
    location.pathname === '/'
      ? 'books'
      : location.pathname.startsWith('/book-form')
        ? 'manage'
        : location.pathname.startsWith('/wishlist')
          ? 'wishlist'
          : 'notifications';

  return (
    <Layout className="min-h-screen">
      <Layout.Header className="flex items-center justify-between bg-slate-900 px-6">
        <Typography.Title level={4} style={{ color: '#fff', margin: 0 }}>
          Library Management System
        </Typography.Title>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[selectedKey]}
          items={[
            { key: 'books', label: <Link to="/" style={{ color: 'inherit' }}>Books</Link> },
            { key: 'manage', label: <Link to="/book-form" style={{ color: 'inherit' }}>Manage</Link> },
            { key: 'wishlist', label: <Link to="/wishlist" style={{ color: 'inherit' }}>Wishlist</Link> },
            {
              key: 'notifications',
              label: (
                <Link to="/notifications" style={{ color: 'inherit' }}>
                  <Badge size="small" count={notifications.data?.length ?? 0} offset={[10, -2]}>
                    Notifications
                  </Badge>
                </Link>
              ),
            },
          ]}
          style={{ minWidth: 520, justifyContent: 'flex-end', borderBottom: 'none' }}
        />
      </Layout.Header>
      <Layout.Content className="mx-auto w-full max-w-7xl p-6">
        <Routes>
          <Route path="/" element={<BooksPage />} />
          <Route path="/book-form" element={<BookFormPage />} />
          <Route path="/book-form/:id" element={<BookFormPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
        </Routes>
      </Layout.Content>
    </Layout>
  );
}
