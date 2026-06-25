import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function OfficerDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Vừa vào trang là tự động gọi API lấy dữ liệu ngay
  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      // Gọi đúng cổng 8080 nhé
      const response = await axios.post('https://abcd-123-45.loca.lt/api/applications', formData);
      if (response.data.success) {
        setApplications(response.data.data);
      }
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h3 style={{ color: '#0056b3', marginTop: 0, borderBottom: '2px solid #f0f0f0', paddingBottom: '10px' }}>
        Danh Sách Hồ Sơ Sinh Viên (Dành Cho Cán Bộ)
      </h3>
      
      {loading ? (
        <p style={{ fontWeight: 'bold' }}>Đang tải dữ liệu từ Database...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa', textAlign: 'left' }}>
              <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Mã SV</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Họ Tên</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Lớp</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Cấp Xét</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Trạng Thái</th>
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#666' }}>Chưa có hồ sơ nào được nộp.</td>
              </tr>
            ) : (
              applications.map((app) => (
                <tr key={app.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px' }}>{app.student_id}</td>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>{app.full_name}</td>
                  <td style={{ padding: '12px' }}>{app.class_name}</td>
                  <td style={{ padding: '12px' }}>{app.desired_level}</td>
                  <td style={{ padding: '12px', color: '#ff9800', fontWeight: 'bold' }}>{app.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}