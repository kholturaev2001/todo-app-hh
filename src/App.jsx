import { Route, Routes } from "react-router";
import Todos from "./pages/Todos";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Todos />} />
      </Routes>
    </>
  );
}

export default App;
