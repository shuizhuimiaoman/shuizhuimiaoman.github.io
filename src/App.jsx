import React, { useEffect, Suspense } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./ScrollToTop.jsx"
import Home from "./Home";
import HelloWorld from "./blogposts/HelloWorld";
import BlahajCTF2025Writeups from "./blogposts/BlahajCTF-2025";

function App() {
  return (
    <>
    <Router basename={`/${import.meta.env.BASE_URL}`}>
      <ScrollToTop>
	<Routes>
	  <Route path="*" element={<Home />} />
	  <Route path="/hello-world" element={<HelloWorld />} />
	  <Route path="/blahajctf-2025-writeups" element={<BlahajCTF2025Writeups />} />
	  <Route path="/test" element={<Test />} />
	</Routes>
      </ScrollToTop>
    </Router>
    </>
  )
}
export default App
