import React, { useEffect, Suspense } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./ScrollToTop.jsx"
import Home  from "./Home";
import HelloWorld from "./blogposts/HelloWorld";

const blahaj25writeups = () => import("./blogposts/BlahajCTF-2025.jsx");
const BlahajCTF2025Writeups = React.lazy(() => blahaj25writeups());
BlahajCTF2025Writeups.preload = blahaj25writeups;



function App() {
  useEffect(() => {BlahajCTF2025Writeups.preload()}, []);

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Router basename={`/${import.meta.env.BASE_URL}`}>
          <ScrollToTop>
            <Routes>
              <Route path="*" element={<Home />} />
              <Route path="/hello-world" element={<HelloWorld />} />
              <Route path="/blahajctf-2025-writeups" element={<BlahajCTF2025Writeups />} />
            </Routes>
          </ScrollToTop>
        </Router>
      </Suspense>
    </>
  )
}
export default App
