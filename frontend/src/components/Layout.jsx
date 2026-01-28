import { Layout, Menu } from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";

const { Header, Sider, Content } = Layout;

export default function MainLayout() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={200}>
        <Menu theme="dark" mode="inline">
          <Menu.Item key="1">
            <Link to="/products">Products</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/sales">Sales</Link>
          </Menu.Item>
          <Menu.Item key="3">
            <span onClick={logout}>Logout</span>
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout>
        <Header style={{ background: "#fff", paddingLeft: "16px" }}>
          Dashboard
        </Header>
        <Content style={{ margin: "16px", overflow: "auto" }}>
          {/* Renders Products or Sales based on route */}
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
