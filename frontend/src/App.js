import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import Search from "./components/search/Search";
import { UserProvider } from "./context/UserContext";
import ProfilePage from "./components/User/ProfilePage";
import Cart from "./components/cart/cart";
import Shipping from "./components/cart/shipping";
import ConfirmOrder from "./components/cart/confirmorder";
import Dashboard from "./components/admin/Dashboard";
import NewProduct from "./components/admin/newproduct";
import UpdateProduct from "./components/admin/updateproduct";
import OrderList from "./components/admin/orderlist";
import UpdateOrder from "./components/admin/updateorder";
import UserList from "./components/admin/userlist";

import ReviewList from "./components/admin/reviewlist";

// Layouts
import Header from "./components/layouts/Header";
import Footer from "./components/layouts/Footer";

// Pages
import Home from "./components/home/Home";
import ProductDetails from "./components/product/ProductDetails";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Payment from "./components/cart/payment";
import PaymentSuccess from "./components/cart/PaymentSuccess";

// Optional: future pages
// import Order from "./components/Checkout/Order";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Header />
         <UserProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/search" element={<Search />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/cart" element={<Cart />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/confirmorder" element={<ConfirmOrder />} />
         <Route path="/payment" element={<Payment />} />
          <Route path="/paymentsuccess" element={<PaymentSuccess />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/products/new" element={<NewProduct />} />
<Route path="/admin/product/:id/edit" element={<UpdateProduct />} />
<Route path="/admin/orders" element={<OrderList />} />
<Route path="/admin/order/:id" element={<UpdateOrder />} />
<Route path="/admin/users" element={<UserList />} />

<Route path="/admin/reviews" element={<ReviewList />} />

          {/* Uncomment when Order page is a ""ready */}
          {/* <Route path="/order" element={<Order />} /> */}
        </Routes>
        </UserProvider>
        <Footer />
      </Router>
    </Provider>
  );
}

export default App;