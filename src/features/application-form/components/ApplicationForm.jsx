import React, { useState } from 'react';
import axios from 'axios';
// Import mảnh ghép thứ 2 vào đây (Lưu ý đường dẫn tương đối)
import CriteriaChecklist from '../../evidence/components/CriteriaChecklist';

export default function ApplicationForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    studentCode: '',
    className: '25T_Nhat1',
    faculty: 'Công nghệ Thông tin',
    email: '',
    phone: '',
    desiredLevel: 'Cấp Trường',
    academicYear: '2025-2026'
  });
  
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // State mới: Dùng để lưu ID của hồ sơ sau khi tạo thành công
  const [createdAppId, setCreatedAppId] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.studentCode || !formData.className || !formData.faculty || !formData.email) {
      setMessage('Vui lòng điền đầy đủ các trường bắt buộc (*)');
      return;
    }
    
    setIsLoading(true);
    setMessage('Đang xử lý...');

    try {
      const response = await axios.post('http://localhost:8080/api/applications', formData);
      if (response.data.success) {
        setMessage('✅ Lưu thông tin cá nhân thành công! Vui lòng bổ sung minh chứng bên dưới.');
        // Bắt lấy cái ID mà Backend vừa trả về và lưu vào state
        setCreatedAppId(response.data.data.id);
      }
    } catch (error) {
        console.error(error);
        setMessage('❌ Lỗi chi tiết: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3 style={{ color: '#0056b3', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px', marginTop: 0 }}>
          Tạo Hồ Sơ Sinh Viên 5 Tốt
        </h3>
        
        {message && (
          <div style={{ padding: '10px', marginBottom: '15px', backgroundColor: message.includes('Vui') ? '#ffeeba' : message.includes('❌') ? '#f8d7da' : '#d4edda', color: message.includes('Vui') ? '#856404' : message.includes('❌') ? '#721c24' : '#155724', borderRadius: '4px', fontWeight: 'bold' }}>
            {message}
          </div>
        )}
        
        {/* Nếu chưa có ID (chưa tạo hồ sơ) thì hiện Form này */}
        {!createdAppId ? (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ flex: 2 }}>
                <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Họ và tên (*):</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Mã sinh viên (*):</label>
                <input type="text" name="studentCode" value={formData.studentCode} onChange={handleChange} style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Lớp (*):</label>
                <input type="text" name="className" value={formData.className} onChange={handleChange} style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Khoa (*):</label>
                <input type="text" name="faculty" value={formData.faculty} onChange={handleChange} style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Email (*):</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Số điện thoại:</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Cấp xét mong muốn:</label>
                <select name="desiredLevel" value={formData.desiredLevel} onChange={handleChange} style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }}>
                  <option value="Cấp Trường">Cấp Trường</option>
                  <option value="Cấp Thành phố">Cấp Thành phố</option>
                  <option value="Cấp Trung ương">Cấp Trung ương</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Năm học:</label>
                <input type="text" name="academicYear" value={formData.academicYear} onChange={handleChange} style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }} />
              </div>
            </div>

            <button type="submit" disabled={isLoading} style={{ padding: '12px', backgroundColor: isLoading ? '#ccc' : '#0056b3', color: 'white', border: 'none', borderRadius: '4px', cursor: isLoading ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '16px', marginTop: '10px' }}>
              {isLoading ? 'Đang lưu...' : 'Lưu Hồ Sơ'}
            </button>
          </form>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
            <p>✅ Thông tin hồ sơ của bạn đã được ghi nhận.</p>
            <p>Bạn có thể bổ sung minh chứng ở khung bên dưới.</p>
          </div>
        )}
      </div>

      {/* CHÍNH LÀ CHỖ NÀY: NẾU CÓ ID RỒI THÌ HIỂN THỊ COMPONENT MINH CHỨNG VÀ TRUYỀN ID VÀO */}
      {createdAppId && (
        <CriteriaChecklist applicationId={createdAppId} />
      )}
    </div>
  );
}