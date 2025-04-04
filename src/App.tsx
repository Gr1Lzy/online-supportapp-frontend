import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";

function App() {
    return (
        <div>
            <Routes>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="*" element={<LoginPage />} />
            </Routes>
        </div>
    );
}

export default App;