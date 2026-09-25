import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import { Header } from "./components/Header";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import Candidates from "./pages/Candidates";
import Positions from "./pages/Positions";
import Applications from "./pages/Applications";
import Interviews from "./pages/Interviews";
import Employees from "./pages/Employees";
import Reports from "./pages/Reports";
import MingoGuide from "./pages/MingoGuide";
import Login from "./pages/Login";

function AppContent() {
  const { isAuthenticated, user } = useAuth();
  const [currentTab, setCurrentTab] = useState("dashboard");

  // Navigation Guard theo Role
  const isInterviewer = user?.role === "interviewer";
  const allowedTabsForInterviewer = ["dashboard", "interviews"];
  const safeTab = isInterviewer && !allowedTabsForInterviewer.includes(currentTab) ? "dashboard" : currentTab;

  const tabTitles = {
    dashboard: "Tổng Quan Tuyển Dụng & Thống Kê",
    candidates: "Quản Lý Hồ Sơ Ứng Viên",
    positions: "Quản Lý Vị Trí Tuyển Dụng",
    applications: "Quy Trình Tuyển Dụng Kanban",
    interviews: "Điều Phối & Đánh Giá Phỏng Vấn",
    employees: "Quản Lý Nhân Viên & Phòng Ban",
    reports: "Báo Cáo & Khai Thác Dữ Liệu Aggregation",
    "mingo-guide": "Thực Nghiệm & Khai Thác Công Cụ Mingo"
  };

  if (!isAuthenticated) {
    return <Login />;
  }

  const renderContent = () => {
    switch (safeTab) {
      case "dashboard":
        return <Dashboard onNavigate={setCurrentTab} />;
      case "candidates":
        return <Candidates />;
      case "positions":
        return <Positions />;
      case "applications":
        return <Applications onNavigate={setCurrentTab} />;
      case "interviews":
        return <Interviews />;
      case "employees":
        return <Employees />;
      case "reports":
        return <Reports />;
      case "mingo-guide":
        return <MingoGuide />;
      default:
        return <Dashboard onNavigate={setCurrentTab} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50/70 text-slate-800 font-sans antialiased">
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header currentTabTitle={tabTitles[currentTab]} />
        <main className="p-6 md:p-8 flex-1 w-full max-w-7xl mx-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;