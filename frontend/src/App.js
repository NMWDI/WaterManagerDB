import logo from './logo.svg';
import './App.css';

import Sidebar from "./sidebar";
import {Route, BrowserRouter as Router, Routes} from "react-router-dom";

import WellView from "./WellsView";
import ReadingsView from "./ReadingsView";
import MetersView from "./MetersView";
import Home from "./Home";
import Topbar from "./Topbar";


function App() {

      return (
    <Router>
      <Topbar />
      <div className="container">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/readings" element={<ReadingsView />} />
          <Route path="/meters" element={<MetersView />} />
          <Route path="/wells" element={<WellView />} />
          {/*<Route path="/user/:userId" element={<User />} />*/}
          {/*<Route path="/newUser" element={<NewUser />} />*/}
          {/*<Route path="/products" element={<ProductList />} />*/}
          {/*<Route path="/product/:productId" element={<Product />} />*/}
          {/*<Route path="/newproduct" element={<NewProduct />} />*/}
        </Routes>
      </div>
    </Router>
  );

}

export default App;
