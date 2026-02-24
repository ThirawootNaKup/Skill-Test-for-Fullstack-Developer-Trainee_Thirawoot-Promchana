import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // 1. นำเข้าตัวแกะ Token
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [filters, setFilters] = useState({ search: '', status: '', category: '' });
  const [username, setUsername] = useState(''); // 2. สร้างตัวแปรเก็บชื่อ User

  // State สำหรับฟอร์มเพิ่มงานใหม่
  const [newTodo, setNewTodo] = useState({
    title: '',
    category: 'Work',
    dueDate: '',
    assignees: '' 
  });

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // ตรวจสอบ Token และแกะชื่อ User
  useEffect(() => {
    if (!token) {
      navigate('/');
    } else {
      // 3. แกะ Token เพื่อเอาชื่อ User
      try {
        const decoded = jwtDecode(token);
        setUsername(decoded.username); // เก็บชื่อ User ไว้แสดงผล
      } catch (error) {
        console.error("Invalid token", error);
        localStorage.removeItem('token');
        navigate('/');
      }
    }
  }, [token, navigate]);

  const fetchTodos = async () => {
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.status) params.status = filters.status;
      if (filters.category) params.category = filters.category;

      const response = await axios.get('/api/todos', {
        headers: { Authorization: `Bearer ${token}` },
        params: params 
      });
      setTodos(response.data);
    } catch (error) {
      if (error.response?.status === 401) handleLogout();
    }
  };

  useEffect(() => {
    if (token) fetchTodos();
  }, [token, filters]);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    try {
      const assigneeArray = newTodo.assignees.split(',').map(name => name.trim()).filter(n => n);
      await axios.post('/api/todos', 
        { ...newTodo, assignees: assigneeArray }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewTodo({ title: '', category: 'Work', dueDate: '', assignees: '' }); 
      fetchTodos();
    } catch (error) {
      alert('เพิ่มงานไม่สำเร็จ');
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.patch(`/api/todos/${id}`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTodos();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if(!confirm("ยืนยันการลบ?")) return;
    try {
      await axios.delete(`/api/todos/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTodos();
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  // Stats
  const stats = {
    total: todos.length,
    pending: todos.filter(t => t.status === 'PENDING').length,
    inProgress: todos.filter(t => t.status === 'IN_PROGRESS').length,
    completed: todos.filter(t => t.status === 'COMPLETED').length,
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      
      {/* 4. ปรับ Header ให้แสดงชื่อ User ทางขวาบน */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px',
        borderBottom: '1px solid #eee',
        paddingBottom: '15px'
      }}>
        <h1 style={{ margin: 0 }}>📊 Project Dashboard</h1>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {/* แสดงชื่อ User ตรงนี้ */}
          <div style={{ textAlign: 'right' }}>
            <span style={{ display: 'block', fontSize: '12px', color: '#666' }}>Welcome,</span>
            <span style={{ fontWeight: 'bold', color: '#007bff', fontSize: '16px' }}>👤 {username}</span>
          </div>
          
          <button onClick={handleLogout} style={{ 
            background: '#dc3545', 
            color: 'white', 
            border: 'none', 
            padding: '8px 15px', 
            borderRadius: '5px', 
            cursor: 'pointer',
            height: 'fit-content'
          }}>
            Logout
          </button>
        </div>
      </div>

      {/* ... (ส่วนอื่นๆ เหมือนเดิมเป๊ะ) ... */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '30px' }}>
        <StatCard title="Total Tasks" count={stats.total} color="#6c757d" />
        <StatCard title="Pending" count={stats.pending} color="#ffc107" />
        <StatCard title="In Progress" count={stats.inProgress} color="#17a2b8" />
        <StatCard title="Completed" count={stats.completed} color="#28a745" />
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', background: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
        <input 
          type="text" 
          placeholder="🔍 ค้นหางาน..." 
          value={filters.search}
          onChange={(e) => setFilters({...filters, search: e.target.value})}
          style={{ flex: 1, padding: '8px' }}
        />
        <select onChange={(e) => setFilters({...filters, category: e.target.value})} style={{ padding: '8px' }}>
          <option value="">ทุกหมวดหมู่</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Urgent">Urgent</option>
        </select>
        <select onChange={(e) => setFilters({...filters, status: e.target.value})} style={{ padding: '8px' }}>
          <option value="">ทุกสถานะ</option>
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      <form onSubmit={handleAddTodo} style={{ marginBottom: '30px', border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
        <h3>➕ เพิ่มงานใหม่</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <input type="text" placeholder="ชื่องาน" required value={newTodo.title} onChange={(e) => setNewTodo({...newTodo, title: e.target.value})} style={{ padding: '8px' }} />
          <select value={newTodo.category} onChange={(e) => setNewTodo({...newTodo, category: e.target.value})} style={{ padding: '8px' }}>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Urgent">Urgent</option>
          </select>
          <input type="date" value={newTodo.dueDate} onChange={(e) => setNewTodo({...newTodo, dueDate: e.target.value})} style={{ padding: '8px' }} />
          <input type="text" placeholder="ผู้รับผิดชอบ (เช่น Somchai, John)" value={newTodo.assignees} onChange={(e) => setNewTodo({...newTodo, assignees: e.target.value})} style={{ padding: '8px' }} />
        </div>
        <button type="submit" style={{ marginTop: '10px', width: '100%', padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>บันทึกงาน</button>
      </form>

      <div>
        {todos.map((todo) => (
          <div key={todo._id} style={{ 
            border: '1px solid #eee', padding: '15px', marginBottom: '10px', borderRadius: '8px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
            <div>
              <h3 style={{ margin: '0 0 5px 0', color: todo.status === 'COMPLETED' ? '#28a745' : '#333' }}>
                {todo.title}
              </h3>
              <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
                📅 ครบกำหนด: {todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : 'ไม่ระบุ'} | 
                📂 {todo.category} | 
                👤 {todo.assignees.length > 0 ? todo.assignees.join(', ') : '-'}
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
              <select 
                value={todo.status} 
                onChange={(e) => updateStatus(todo._id, e.target.value)}
                style={{ 
                  padding: '5px', borderRadius: '4px', border: '1px solid #ccc',
                  background: todo.status === 'COMPLETED' ? '#d4edda' : todo.status === 'IN_PROGRESS' ? '#cce5ff' : '#fff3cd'
                }}
              >
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">Doing</option>
                <option value="COMPLETED">Done</option>
              </select>
              <button onClick={() => handleDelete(todo._id)} style={{ background: '#ff4d4d', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>ลบ</button>
            </div>
          </div>
        ))}
        {todos.length === 0 && <p style={{ textAlign: 'center', color: '#999' }}>ไม่พบรายการงาน</p>}
      </div>
    </div>
  );
}

function StatCard({ title, count, color }) {
  return (
    <div style={{ background: color, color: 'white', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
      <h2 style={{ margin: 0, fontSize: '24px' }}>{count}</h2>
      <p style={{ margin: 0, fontSize: '12px', opacity: 0.9 }}>{title}</p>
    </div>
  );
}

export default App;