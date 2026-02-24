import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // 1. อย่าลืม import Link

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://skill-test-for-fullstack-developer.onrender.com/api/auth/login', {
        username,
        password,
      });

      localStorage.setItem('token', response.data.access_token);
      alert('Login สำเร็จ!');
      navigate('/todos');
      window.location.reload(); 
    } catch (error) {
      alert('Login ไม่ผ่าน! ชื่อหรือรหัสผิด');
    }
  };

  return (
    <div style={{ 
      padding: '30px', 
      maxWidth: '350px', 
      margin: '60px auto', 
      border: '1px solid #e0e0e0', 
      borderRadius: '12px', 
      boxShadow: '0 4px 12px rgb(161, 151, 250)',
      backgroundColor: '#fff',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <h2 style={{ textAlign: 'center', color: '#7c9df7', marginBottom: '20px' }}>เข้าสู่ระบบ</h2>
      
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{display: 'block', marginBottom: '5px', color: '#666', fontSize: '14px'}}>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            required
          />
        </div>
        
        <div>
          <label style={{display: 'block', marginBottom: '5px', color: '#666', fontSize: '14px'}}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            required
          />
        </div>

        <button type="submit" style={{ 
          padding: '12px', 
          background: '#007bff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '6px', 
          cursor: 'pointer', 
          fontSize: '16px',
          fontWeight: 'bold',
          marginTop: '10px'
        }}>
          เข้าสู่ระบบ
        </button>
      </form>

      {/* 2. ส่วนที่เพิ่มเข้ามา: ปุ่มสมัครสมาชิก */}
      <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: '#666' }}>
        ยังไม่มีบัญชีใช่ไหม? <br />
        <Link to="/register" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}>
          สมัครสมาชิกที่นี่
        </Link>
      </div>
    </div>
  );
}

export default Login;