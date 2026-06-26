import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ApplicationDetailForOfficer({ app, onBack }) {
  const [evidenceList, setEvidenceList] = useState([]);
  const [newStatus, setNewStatus] = useState(app.status);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Lấy danh sách minh chứng của hồ sơ này khi vừa mở lên
  useEffect(() => {
    const fetchEvidence = async () => {
      try {
        // Lưu ý: Đảm bảo Backend có API GET /api/evidence/application/:id nhé
        const response = await axios.get(`http://localhost:8080/api/evidence/application/${app.id}`);
        if (response.data.success) {
          setEvidenceList(response.data.data);
        }
      } catch (error) {
        console.error('Chưa tải được minh chứng (hoặc chưa có API GET Evidence):', error);
      }
    };
    fetchEvidence();
  }, [app.id]);

  const handleUpdate = async () => {
    setLoading(true);
    setMessage('');
    try {
      // 1. Cập nhật trạng thái
      if (newStatus !== app.status) {
        await axios.put(`http://localhost:8080/api/applications/${app.id}/status`, { status: newStatus });
      }
      
      // 2. Gửi nhận xét nếu có nhập Textarea
      if (comment.trim() !== '') {
        await axios.post('http://localhost:8080/api/reviews', {
          applicationId: app.id,
          officerName: 'BCH Liên chi Đoàn', // Tên mặc định hoặc lấy từ user login
          comments: comment
        });
      }
      
      setMessage('✅ Đã cập nhật hồ sơ thành công!');
      setTimeout(() => onBack(), 1500); // Tự động quay lại bảng sau 1.5s
    } catch (error) {
      setMessage('❌ Lỗi khi cập nhật: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <button onClick={onBack} style={{ marginBottom: '15px', padding: '6px 12px', cursor: 'pointer', backgroundColor: '#e9ecef', border: '1px solid #ccc', borderRadius: '4px' }}>
        ← Quay lại danh sách
      </button>

      <div style={{ display: 'flex', gap: '20px' }}>
        {/* CỘT TRÁI: Thông tin và Minh chứng */}
        <div style={{ flex: 2 }}>
          <h3 style={{ borderBottom: '2px solid #f0f0f0', paddingBottom: '10px', color: '#0056b3' }}>Chi Tiết Hồ Sơ: {app.full_name} ({app.student_id})</h3>
          <p><strong>Lớp:</strong> {app.class_name} | <strong>Cấp xét:</strong> {app.desired_level}</p>
          
          <h4 style={{ marginTop: '20px' }}>Danh sách minh chứng đã nộp:</h4>
          {evidenceList.length === 0 ? (
            <p style={{ color: '#666', fontStyle: 'italic' }}>Sinh viên chưa nộp minh chứng nào.</p>
          ) : (
            <ul style={{ paddingLeft: '20px' }}>
              {evidenceList.map((ev, idx) => (
                <li key={idx} style={{ marginBottom: '10px' }}>
                  <strong>[{ev.criteria_name}]</strong> {ev.evidence_name} <br/>
                  <a href={ev.link} target="_blank" rel="noreferrer" style={{ color: '#0056b3' }}>Xem minh chứng 🔗</a>
                  {ev.description && <p style={{ fontSize: '13px', color: '#555', margin: '2px 0' }}>Ghi chú: {ev.description}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* CỘT PHẢI: Khu vực Xét duyệt */}
        <div style={{ flex: 1, backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
          <h4 style={{ margin: '0 0 15px 0' }}>Khu vực Xét duyệt</h4>
          
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Trạng thái hồ sơ:</label>
          <select 
            value={newStatus} 
            onChange={(e) => setNewStatus(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '15px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="Đang soạn">Đang soạn</option>
            <option value="Đã gửi">Đã gửi</option>
            <option value="Cần bổ sung">Cần bổ sung</option>
            <option value="Đã duyệt">Đã duyệt</option>
            <option value="Từ chối">Từ chối</option>
          </select>

          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Nhận xét / Yêu cầu bổ sung:</label>
          <textarea 
            rows="4" 
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Ví dụ: Cần bổ sung lại giấy chứng nhận rèn luyện..."
            style={{ width: '100%', padding: '8px', marginBottom: '15px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />

          {message && <p style={{ fontWeight: 'bold', color: message.includes('✅') ? '#28a745' : '#dc3545', fontSize: '14px' }}>{message}</p>}

          <button 
            onClick={handleUpdate} 
            disabled={loading}
            style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
          >
            {loading ? 'Đang lưu...' : 'Lưu Kết Quả Duyệt'}
          </button>
        </div>
      </div>
    </div>
  );
}