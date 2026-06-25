import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';

// Import 2 màn hình của chúng ta vào đây
import ApplicationForm from './features/application-form/components/ApplicationForm';
import OfficerDashboard from './features/dashboard/OfficerDashboard';

function App() {
  const [role, setRole] = useState(localStorage.getItem('userRole') || '');

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setRole(selectedRole);
    localStorage.setItem('userRole', selectedRole);
  };

  return (
    <BrowserRouter>
      <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
        
        {/* Header chứa chỗ chọn vai trò */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #ccc', paddingBottom: '15px', marginBottom: '20px' }}>
          <h2 style={{ color: '#0056b3', margin: 0 }}>Hệ Thống Xét SV5T</h2>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontWeight: 'bold' }}>Vai trò hiện tại:</span>
            <select 
              value={role} 
              onChange={handleRoleChange} 
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="">-- Chọn vai trò --</option>
              <option value="student">Đóng vai: Sinh viên</option>
              <option value="officer">Đóng vai: Cán bộ xét duyệt</option>
            </select>
          </div>
        </header>

        {/* Thanh điều hướng */}
        <nav style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
          {role === 'student' && <Link to="/student/dashboard" style={{ marginRight: '15px', textDecoration: 'none', color: '#0056b3', fontWeight: 'bold' }}>Vào khu vực Sinh Viên</Link>}
          {role === 'officer' && <Link to="/officer/dashboard" style={{ textDecoration: 'none', color: '#0056b3', fontWeight: 'bold' }}>Vào khu vực Cán Bộ</Link>}
        </nav>

        {/* Nội dung chính hiển thị theo vai trò */}
        <main>
          <Routes>
            <Route path="/" element={
              <div style={{ textAlign: 'center', marginTop: '50px', color: '#666' }}>
                {role === '' ? (
                  <h3>Vui lòng chọn vai trò ở góc trên bên phải để bắt đầu sử dụng hệ thống.</h3>
                ) : role === 'student' ? (
                  <Navigate to="/student/dashboard" /> 
                ) : (
                  <Navigate to="/officer/dashboard" /> 
                )}
              </div>
            } />
            
            {/* Màn hình Sinh viên điền Form */}
            <Route path="/student/dashboard" element={
              role === 'student' ? (
                <div>
                  <ApplicationForm />
                </div>
              ) : <Navigate to="/" />
            } />
            
            {/* Màn hình Cán bộ xem danh sách */}
            <Route path="/officer/dashboard" element={
              role === 'officer' ? (
                <div>
                  <OfficerDashboard />
                </div>
              ) : <Navigate to="/" />
            } />
          </Routes>
        </main>
        
      </div>
    </BrowserRouter>
  );
}

export default App;