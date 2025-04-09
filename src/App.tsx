import { Routes, Route } from "react-router-dom";
import CreateTicketPage from "./pages/CreateTicket/CreateTicketPage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import TicketDetailPage from "./pages/TicketDetailPage/TicketDetailPage";
import LoginPage from "./pages/Login/LoginPage";
import NotFoundPage from "./pages/NotFound/NotFoundPage";
import ProtectedRoute from "./components/common/ProtectedRoute";
import './assets/styles/global.css';

function App() {
    return (
        <div className="app">
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <DashboardPage />
                    </ProtectedRoute>
                } />
                <Route path="/create-ticket" element={
                    <ProtectedRoute>
                        <CreateTicketPage />
                    </ProtectedRoute>
                } />
                <Route path="/tickets/:ticketId" element={
                    <ProtectedRoute>
                        <TicketDetailPage />
                    </ProtectedRoute>
                } />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </div>
    );
}

export default App;