import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Login from './Login.jsx'
import Register from './Register.jsx' // 1. เพิ่ม import
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} /> {/* 2. เพิ่ม Route */}
        <Route path="/todos" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)