import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home  from "./Home";
import HelloWorld from "./blogposts/HelloWorld";

function App() {

  return (
    <>
      <Router basename={`/${import.meta.env.BASE_URL}`}>
        <Routes>
          <Route path="*" element={<Home />} />
          <Route path="/hello-world" element={<HelloWorld />} />
        </Routes>
      </Router>
    </>
  )
}
export default App
