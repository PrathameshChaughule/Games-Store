import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

const Navbar = lazy(() => import("./components/Navbar"));
const Footer = lazy(() => import("./components/Footer"));
const Home = lazy(() => import("./pages/Home"));
const PS5 = lazy(() => import("./pages/PS5"));
const PS4 = lazy(() => import("./pages/PS4"));
const XBOX = lazy(() => import("./pages/XBOX"));

function App() {
  return (
    <div className="bg-[#111315] text-white h-fit w-[99vw]">
      <Router>
        <Suspense
          fallback={
            <div className="w-full h-[100vh] flex items-center justify-center">
              <div className="flex flex-col items-center justify-center w-full h-screen bg-black text-white gap-6">
                <div className="w-16 h-16 border-4 border-orange-500 rounded-lg relative animate-spin">
                  <div className="absolute w-2.5 h-2.5 bg-orange-500 rounded-full top-2 left-2"></div>
                  <div className="absolute w-2.5 h-2.5 bg-orange-500 rounded-full bottom-2 right-2"></div>
                </div>
                <p className="font-mono text-sm tracking-wider">
                  Loading Games...
                </p>
              </div>
            </div>
          }
        >
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ps5" element={<PS5 />} />
            <Route path="/ps4" element={<PS4 />} />
            <Route path="/xbox" element={<XBOX />} />
          </Routes>
          <Footer />
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
