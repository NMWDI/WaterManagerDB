import logo from './logo.svg';
import './App.css';

import Sidebar from "./sidebar";
import {Route, BrowserRouter as Router, Routes} from "react-router-dom";

import WellView from "./WellsView";
import MetersView from "./MetersView";
import Home from "./Home";
import Topbar from "./Topbar";
import WorkersView from "./WorkersView";
import RepairsView from "./RepairsView";
import StatusBar from "./statusBar";


function App() {

      return (
    <Router>
      <Topbar />
      <div className="container">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/meters" element={<MetersView />} />
          <Route path="/wells" element={<WellView />} />
          <Route path="/workers" element={<WorkersView />} />
          <Route path="/repairs" element={<RepairsView />} />
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
