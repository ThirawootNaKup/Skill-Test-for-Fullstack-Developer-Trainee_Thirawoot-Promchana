import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://skill-test-for-fullstack-developer.onrender.com/api/auth/signup', { username, password });
      alert('สมัครสมาชิกสำเร็จ! กรุณา Login');
      navigate('/'); // กลับไปหน้า Login
    } catch (error) {
      alert('สมัครไม่ผ่าน! Username อาจซ้ำ');
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '400px', margin: '50px auto', border: '1px solid #ddd', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>สมัครสมาชิกใหม่</h2>
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input type="text" placeholder="ตั้งชื่อ Username" value={username} onChange={(e) => setUsername(e.target.value)} required style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
        <input type="password" placeholder="ตั้งรหัสผ่าน" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
        <button type="submit" style={{ padding: '10px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}>สมัครสมาชิก</button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '20px' }}>
        มีบัญชีแล้ว? <Link to="/">เข้าสู่ระบบที่นี่</Link>
      </p>
    </div>
  );
}

export default Register;