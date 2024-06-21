import { Route, Routes } from "react-router-dom";
import "./App.css";
import Graph from "./pages/Graph";
import Sort from "./pages/Sort";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Graph />} />
        <Route path="/sorting" element={<Sort />} />
      </Routes>
    </div>
  );
}

export default App;
