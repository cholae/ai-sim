import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AgentList from "./components/AgentList";
import AgentDetails from "./components/AgentDetails";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AgentList />} />
        <Route path="/agent/:id" element={<AgentDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
