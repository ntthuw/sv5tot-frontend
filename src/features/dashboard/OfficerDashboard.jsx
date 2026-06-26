import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ApplicationDetailForOfficer from '../application-review/components/ApplicationDetailForOfficer';

export default function OfficerDashboard() {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // State để lưu trữ hồ sơ đang được cán bộ chọn xem chi tiết
  const [selectedApp, setSelectedApp] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Gọi song song 2 API: Lấy danh sách và Lấy thống kê
      const [appRes, statsRes] = await Promise.all([
        axios.get('http://localhost:8080/api/applications'),
        axios.get('http://localhost:8080/api/dashboard/stats')
      ]);
      
      if (appRes.data.success) setApplications(appRes.data.data);
      if (statsRes.data.success) setStats(statsRes.data.data);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Nếu có hồ sơ đang được chọn, hiển thị Component Chi tiết
  if (selectedApp) {
    return (
      <ApplicationDetailForOfficer 
        app={selectedApp} 
        onBack={() => {
          setSelectedApp(null); // Quay lại bảng
          fetchData(); // Làm mới lại dữ liệu lỡ cán bộ vừa duyệt xong
        }} 
      />
    );
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h3 style={{ color: '#0056b3', marginTop: 0, borderBottom: '2px solid #f0f0f0', paddingBottom: '10px' }}>
        Bảng Điều Khiển Cán Bộ Xét Duyệt
      </h3>
      
      {/* KHU VỰC THỐNG KÊ */}
      {stats && (
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {Object.entries(stats).map(([statusName, count]) => (
            <div key={statusName} style={{ flex: 1, minWidth: '120px', padding: '15px', backgroundColor: '#f8f9fa', borderLeft: '4px solid #0056b3', borderRadius: '4px', textAlign: 'center' }}>
              <div style={{ fontSize: '14px', color: '#666', fontWeight: 'bold' }}>{statusName}</div>
              <div style={{ fontSize: '24px', color: '#0056b3', fontWeight: 'bold', marginTop: '5px' }}>{count}</div>
            </div>
          ))}
        </div>
      )}

      {/* KHU VỰC BẢNG DANH SÁCH */}
      {loading ? (
        <p style={{ fontWeight: 'bold' }}>Đang tải dữ liệu từ Database...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa', textAlign: 'left' }}>
              <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Mã SV</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Họ Tên</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Lớp</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Trạng Thái</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 ? (
              <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>Chưa có hồ sơ nào.</td></tr>
            ) : (
              applications.map((app) => (
                <tr key={app.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px' }}>{app.student_id}</td>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>{app.full_name}</td>
                  <td style={{ padding: '12px' }}>{app.class_name}</td>
                  <td style={{ padding: '12px', fontWeight: 'bold', color: app.status === 'Đã duyệt' ? '#28a745' : '#ff9800' }}>{app.status}</td>
                  <td style={{ padding: '12px' }}>
                    <button 
                      onClick={() => setSelectedApp(app)}
                      style={{ padding: '6px 12px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}