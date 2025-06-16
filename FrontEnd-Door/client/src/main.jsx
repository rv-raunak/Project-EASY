import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import Navbar from "./Components/Navbar/Navbar.jsx";
import Footer from "./Components/Navbar/Footer/Footer.jsx";
import LiveLocationMap from "./WorkingComponents/LiveLocationMap.jsx";
console.warn(
  "The site is still Under Development, some features may not work as expected."
);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/location" element={<LiveLocationMap />}></Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  </StrictMode>
);
