import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./MasterExcel/ItemMasterHome";
import BatchExcelTable from "./BatchExcel/BatchExcelTable";
import CustomerArticleTable from "./OrderFile/CustomerOrderTable";
import Navabr from "./header/Navabr";
import OutOfStocksCustomerorder from "./OrderFile/OutOfStocksCustomerorder";
import OrderPendingTable from "./OrderFile/pendingTable";
import Layout from "./Layout";
import ArticleMasterIndex from "./Articlemastercomponent/ArticleMasterIndex";
import MismatchTable from "./OrderFile/MismatchTable";
import QuotationIndex from "./Quotation/QuotationIndex";
import { Login } from "./Auth/Login";
import ProtectedRoute from "./protected/ProtectedRoute";
function App() {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <Router>
      {!user ?  null:<Navabr /> }
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              {/* <Layout /> */}
            </ProtectedRoute>
          }
        >
          <Route path="home" element={<ArticleMasterIndex />} />
          <Route path="item-master" element={<Home />} />
          <Route path="batch" element={<BatchExcelTable />} />
          <Route path="qutation" element={<QuotationIndex />} />
          <Route path="customer-order" element={<CustomerArticleTable />} />
          <Route path="/customer-order" element={<Layout />}>
          <Route path="" index="1" element={<CustomerArticleTable />} />
          <Route path="out-of-stocks" element={<OutOfStocksCustomerorder />} />
          <Route path="pending-order" element={<OrderPendingTable />} />
          <Route path="mis-match" element={<MismatchTable />} />
        </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
