import React, { useEffect, Suspense } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home  from "./Home";
import HelloWorld from "./blogposts/HelloWorld";
// import blahajwriteups from "./blogposts/BlahajCTF-2025";

// blahajwriteups = import("./blogposts/BlahajCTF-2025")
const blahajwriteups = () => import("./blogposts/BlahajCTF-2025");
const BlahajCTF2025Writeups = React.lazy(() => blahajwriteups());
BlahajCTF2025Writeups.preload = blahajwriteups;



function App() {
  useEffect(() => {BlahajCTF2025Writeups.preload()}, []);

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Router basename={`/${import.meta.env.BASE_URL}`}>
          <Routes>
            <Route path="*" element={<Home />} />
            <Route path="/hello-world" element={<HelloWorld />} />
            <Route path="/blahajctf-2025-writeups" element={<BlahajCTF2025Writeups />} />
          </Routes>
        </Router>
      </Suspense>
    </>
  )
}
export default App
