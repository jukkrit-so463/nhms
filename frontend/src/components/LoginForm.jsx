import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginForm({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // ล้าง error เก่าทุกครั้งที่พยายาม login

    try {
      // 1. เปลี่ยน URL เป็นแบบ Relative Path
      const res = await axios.post("/api/login", { username, password });

      if (res.data.success && res.data.token) {
        // จัดการข้อมูลหลัง login สำเร็จ
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role_id", res.data.role_id);
        localStorage.setItem("username", res.data.username);
        
        // (ถ้ามี) เรียกฟังก์ชันเพื่ออัปเดตสถานะใน App หลัก
        if (onLogin) {
          onLogin();
        }

        // 2. ใช้ navigate() เพื่อเปลี่ยนหน้า (ดีที่สุดสำหรับ React)
        // navigate("/dashboard");

      } else {
        setError(res.data.error || "Login ล้มเหลว: ไม่ได้รับ Token");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Username หรือ Password ไม่ถูกต้อง");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        minWidth: "100vw",
        background: "#f8fafc",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1000,
      }}
    >
      <div className="card shadow p-4" style={{ width: 400, borderRadius: 20 }}>
        <h2 className="text-center mb-3" style={{ color: "#3b2566", fontWeight: "bold" }}>เข้าสู่ระบบ</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              placeholder="you@example.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="text-danger text-center mb-2">{error}</div>}
          <button type="submit" className="btn w-100" style={{ background: "#a78bfa", color: "#fff", fontWeight: "bold" }}>
            เข้าสู่ระบบ
          </button>
        </form>
      </div>
    </div>
  );
}