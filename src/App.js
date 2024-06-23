import "./App.css";
import NavBar from "./nav";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import About from "./about";
import Contact from "./contact";
import Home from "./Home";
import Hooks from "./hooks";
import UseEffect from "./Hooks/UseEffect";
import UseState from "./Hooks/UseState";
import UseRef from "./Hooks/UseRef";
import UseContext from "./Hooks/UseContext";
import UseReducer from "./Hooks/UseReducer";
// import Display from "./tmp"
export default function App() {
  return (
    <Router>
      <NavBar />
      <div className="displayContainer">
        <Routes>
          <Route exact path="/" element={<Home />}></Route>
          <Route exact path="/about" element={<About />}>
            {" "}
          </Route>
          <Route exact path="/contact" element={<Contact />}></Route>
          <Route path="/hooks" element={<Hooks />}>
            <Route exact path="UseEffect" element={<UseEffect />}></Route>
            <Route exact path="UseRef" element={<UseRef />}>
              {" "}
            </Route>
            <Route exact path="UseContext" element={<UseContext />}></Route>
            <Route exact path="UseState" element={<UseState />}></Route>
            <Route exact path="UseReducer" element={<UseReducer />}></Route>
          </Route>
        </Routes>
      </div>
    </Router>
    // <Display />
  );
}
