
import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { isAuthenticated, logout } from "./auth";

// Layout Component
import MainPage from "./pages/mainpage/Index.jsx";

// Page Components
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Lobby from "./pages/lobby/lobby.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Addhome from "./components/Addhome";
import Edithome from "./components/Edithome";
import HomePage from "./pages/HomePage";
import Addguest from "./components/guest/Addguest/Addguest.jsx";
import ViewGuest from "./components/guest/viewguest.jsx";
import EditGuest from "./components/guest/Editguest/editguest.jsx";
import GuestHistory from "./components/guest/guesthistory.jsx";
import TypePage from "./pages/typepage/typepage.jsx";
import FlatListPage from "./pages/typepage/page/page.jsx";
import TwinHomeListPage from "./pages/typepage/twinhome/page.jsx";
import TwinHomeListPage2 from "./pages/typepage/twinhome2/page.jsx";
import TownhomeListPage from "./pages/typepage/townhome/page.jsx";
import EmployeeHomeListPage from "./pages/typepage/employee_home/page.jsx";
import ViewScore from "./components/form/viewscore.jsx";
import ViewHome from "./components/viewhome/viewhome.jsx";
import Search from "./components/Search/Search.jsx";
import AuditLog from "./components/Auditlog/auditlog.jsx";
import ScoreForm from "./components/form/scoreform.jsx";
import RetirementPage from "./components/retirement/retirement.jsx";
import Addtype from "./pages/Addtype/Addtype";
import TwinHomeAllPage from "./pages/typepage/twinhome/all";
import GenericHomePage from './pages/GenericHomePage';
import HomeTypeSelectPage from "./pages/typepage/HomeTypeSelectPage.jsx";
import ManageUser from "./components/manageuser.jsx";


function App() {
  const [loggedIn, setLoggedIn] = useState(isAuthenticated());

  const handleLogin = () => setLoggedIn(true);

  const handleLogout = () => {
    logout();
    setLoggedIn(false);
  };

  return (
    <BrowserRouter>
      <Routes>
        {loggedIn ? (
          /* --- ส่วนของผู้ใช้ที่ Login แล้ว --- */
          <Route path="/" element={<MainPage onLogout={handleLogout} />}>
            {/* หน้าแรกเริ่มต้นหลัง Login */}
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            
            {/* หน้าอื่นๆ ทั้งหมดที่ต้อง Login ก่อน */}
            <Route path="addhome" element={<Addhome />} />
            <Route path="edithome/:id" element={<Edithome />} />
            <Route path="homedetail" element={<HomePage />} />
            <Route path="addguest/:home_id" element={<Addguest />} />
            <Route path="guestview/:home_id" element={<ViewGuest />} />
            <Route path="editguest/:id" element={<EditGuest />} />
            <Route path="guesthistory/:home_id" element={<GuestHistory />} />
            <Route path="type" element={<TypePage />} />
            <Route path="flat" element={<FlatListPage />} />
            <Route path="twin1" element={<TwinHomeListPage />} />
            <Route path="twin2" element={<TwinHomeListPage2 />} />
            <Route path="townhome" element={<TownhomeListPage />} />
            <Route path="emphome" element={<EmployeeHomeListPage />} />
            <Route path="viewhome/:home_id" element={<ViewHome />} />
            <Route path="search" element={<Search />} />
            <Route path="auditlog" element={<AuditLog />} />
            <Route path="score" element={<ScoreForm />} />
            <Route path="retirement" element={<RetirementPage />} />
            <Route path="addtype" element={<Addtype />} />
            <Route path="twinhome" element={<TwinHomeAllPage />} />
            <Route path="homes" element={<GenericHomePage />} />
            <Route path="viewscore" element={<ViewScore />} />
            <Route path="select-filter" element={<HomeTypeSelectPage />} />
            <Route path="hometype" element={<HomeTypeSelectPage />} />
            <Route path="manageuser" element={<ManageUser />} />

            {/* ถ้าคน Login แล้วไปหน้า /login จะถูกส่งไป /dashboard */}
            <Route path="/login" element={<Navigate to="/dashboard" />} />
            {/* ถ้าเข้า URL ที่ไม่มีอยู่จริง จะถูกส่งไป /dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Route>
        ) : (
          /* --- ส่วนของผู้ใช้ที่ยังไม่ได้ Login --- */
          <>
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<Lobby />} />
            
            {/* ถ้ายังไม่ Login แล้วพยายามเข้าหน้าอื่น จะถูกส่งกลับมาที่ /login */}
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;