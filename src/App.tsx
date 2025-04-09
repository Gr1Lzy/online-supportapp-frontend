import { Routes, Route } from "react-router-dom";
import CreateTicketPage from "./pages/CreateTicket/CreateTicketPage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import TicketDetailPage from "./pages/TicketDetailPage/TicketDetailPage.tsx";
import LoginPage from "./pages/Login/LoginPage.tsx";
import NotFoundPage from "./pages/NotFound/NotFoundPage.tsx";

function App() {
    return (
        <div>
            <Routes>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/create-ticket" element={<CreateTicketPage />} />
                <Route path="/tickets/:ticketId" element={<TicketDetailPage />} />
                <Route path="/" element={<LoginPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </div>
    );
}

export default App;