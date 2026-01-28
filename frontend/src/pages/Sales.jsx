import { Table, Button, Modal, Form, InputNumber, Select, message } from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/client";
import { useState } from "react";

export default function Sales() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  // Fetch all sales
  const { data: sales = [] } = useQuery({
    queryKey: ["sales"],
    queryFn: async () => (await api.get("/sales")).data,
  });

  // Fetch all products (for dropdown in modal)
  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: async () => (await api.get("/products")).data,
  });

  // Create sale mutation
  const mutation = useMutation({
    mutationFn: (values) => api.post("/sales", values),
    onSuccess: () => {
      queryClient.invalidateQueries(["sales"]);
      queryClient.invalidateQueries(["products"]); // update stock in product list
      setOpen(false);
      message.success("Sale created successfully");
    },
    onError: (err) => {
      message.error(err.response?.data?.message || "Error creating sale");
    },
  });

  const columns = [
    { title: "Product", dataIndex: ["product", "name"] },
    { title: "Quantity", dataIndex: "quantity" },
    { title: "Price", dataIndex: ["product", "price"] },
    { title: "Total", render: (_, record) => record.quantity * record.product.price },
    { title: "Created At", dataIndex: "createdAt" },
  ];

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)} style={{ marginBottom: 20 }}>
        Create Sale
      </Button>

      <Table
        columns={columns}
        dataSource={sales}
        rowKey="id"
      />

      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        title="Create Sale"
      >
        <Form
          onFinish={(values) => mutation.mutate(values)}
          layout="vertical"
        >
          <Form.Item
            name="productId"
            label="Product"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select a product">
              {products.map((product) => (
                <Select.Option
                  key={product.id}
                  value={product.id}
                  disabled={product.stock_quantity === 0}
                >
                  {product.name} (Stock: {product.stock_quantity})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[{ required: true, type: "number", min: 1 }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Save Sale
          </Button>
        </Form>
      </Modal>
    </>
  );
}
