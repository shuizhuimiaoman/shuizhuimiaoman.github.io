import React, { useEffect, Suspense } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./ScrollToTop.jsx"

import Home from "./Home";
import HelloWorld from "./blogposts/HelloWorld";
import BlahajCTF2025Writeups from "./blogposts/BlahajCTF-2025";
import SekaiCTF2025AuthorWriteups from "./blogposts/SekaiCTF-2026";

function App() {
  return (
    <>
    <Router basename={`/${import.meta.env.BASE_URL}`}>
      <ScrollToTop>
	<Routes>
	  <Route path="*" element={<Home />} />
	  <Route path="/hello-world" element={<HelloWorld />} />
	  <Route path="/blahajctf-2025-writeups" element={<BlahajCTF2025Writeups />} />
	  <Route path="/sekaictf-2026-author-writeups" element={<SekaiCTF2025AuthorWriteups />} />
	</Routes>
      </ScrollToTop>
    </Router>
    </>
  )
}
export default App
