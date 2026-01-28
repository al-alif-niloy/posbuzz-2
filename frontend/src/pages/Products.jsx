import { Table, Button, Modal, Form, Input, InputNumber, message, Spin, Popconfirm } from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import api from "../api/client";

export default function Products() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  // 1️⃣ Fetch products
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => (await api.get("/products")).data,
    staleTime: 1000 * 60, // 1 minute cache
  });

  // 2️⃣ Add/Edit mutation
  const saveMutation = useMutation({
    mutationFn: async (values) => {
      if (editing) {
        return await api.put(`/products/${editing.id}`, values);
      } else {
        return await api.post("/products", values);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]); // refresh
      setOpen(false);
      setEditing(null);
      form.resetFields();
      message.success("Saved successfully!");
    },
    onError: (err) => {
      console.error(err);
      message.error(err.response?.data?.message || "Failed to save product");
    },
  });

  // 3️⃣ Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
      message.success("Deleted successfully!");
    },
    onError: (err) => {
      console.error(err);
      message.error(err.response?.data?.message || "Failed to delete product");
    },
  });

  // 4️⃣ Columns
  const columns = [
    { title: "Name", dataIndex: "name" },
    { title: "SKU", dataIndex: "sku" },
    { title: "Price", dataIndex: "price" },
    { title: "Stock", dataIndex: "stock_quantity" },
    {
      title: "Actions",
      render: (_, record) => (
        <>
          <Button
            style={{ marginRight: 8 }}
            onClick={() => {
              setEditing(record);
              setOpen(true);
              form.setFieldsValue(record);
            }}
          >
            Edit
          </Button>
          <Popconfirm
  title="Delete Product"
  description="Are you sure you want to delete this product?"
  okText="Yes"
  cancelText="No"
  onConfirm={() => deleteMutation.mutate(record.id)}
>
  <Button danger>Delete</Button>
</Popconfirm>

        </>
      ),
    },
  ];

  // 5️⃣ Loading state
  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: 50 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          setEditing(null);
          setOpen(true);
          form.resetFields();
        }}
      >
        Add Product
      </Button>

      <Table
        columns={columns}
        dataSource={products}
        rowKey="id"
        style={{ marginTop: 20 }}
        loading={saveMutation.isLoading || deleteMutation.isLoading}
      />

      <Modal
        open={open}
        title={editing ? "Edit Product" : "Add Product"}
        onCancel={() => {
          setOpen(false);
          setEditing(null);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => saveMutation.mutate(values)}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter product name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="sku"
            label="SKU"
            rules={[{ required: true, message: "Please enter SKU" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: "Please enter price" }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="stock_quantity"
            label="Stock"
            rules={[{ required: true, message: "Please enter stock quantity" }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            {editing ? "Update" : "Save"}
          </Button>
        </Form>
      </Modal>
    </div>
  );
}
