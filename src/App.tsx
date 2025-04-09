import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import CreateTicketPage from "./pages/CreateTicketPage";
import TicketDetailPage from "./pages/TicketDetailPage";

function App() {
    return (
        <div>
            <Routes>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/create-ticket" element={<CreateTicketPage />} />
                <Route path="/tickets/:ticketId" element={<TicketDetailPage />} />
                <Route path="*" element={<LoginPage />} />
            </Routes>
        </div>
    );
}

export default App;