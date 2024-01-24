import { Container } from "react-bootstrap";

import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import { Toaster } from "react-hot-toast";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Shipping from "./pages/Shipping";
import Payment from "./pages/Payment";
import PrivateRoute from "./components/PrivateRoute";
import PlaceOrder from "./pages/PlaceOrder";
import Order from "./pages/Order";
import Profile from "./pages/Profile";
import AdminRoute from "./components/AdminRoute";
import OrderList from "./pages/Admin/OrderList";
import ProductsList from "./pages/Admin/ProductsList";
import ProductEdit from "./pages/Admin/ProductEdit";

const App = () => {
  return (
    <>
      <Header />
      <main className="py-3">
        <Container>
          <Routes>
            <Route index={true} path="/" element={<Home />} />
            <Route path="/search/:keyword" element={<Home />} />
            <Route path="/product/:id" element={<Products />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<Cart />} />

            <Route path="" element={<PrivateRoute />}>
              <Route path="/shipping" element={<Shipping />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/placeorder" element={<PlaceOrder />} />
              <Route path="/order/:id" element={<Order />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            <Route path="" element={<AdminRoute />}>
              <Route path="/admin/orderlist" element={<OrderList />} />
              <Route path="/admin/productlist" element={<ProductsList />} />
              <Route path="/admin/product/:id/edit" element={<ProductEdit />} />
            </Route>
          </Routes>
        </Container>
      </main>
      <Toaster />
      <Footer />
    </>
  );
};

export default App;
