import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChatInterface from "@/components/ChatInterface";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ChatInterface />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" />
    </div>
  );
}

export default App;
