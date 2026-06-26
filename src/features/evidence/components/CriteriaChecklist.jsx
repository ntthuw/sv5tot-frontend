import React, { useState } from 'react';
import axios from 'axios';

export default function CriteriaChecklist({ applicationId }) {
  // Danh sách 5 tiêu chí cố định theo yêu cầu
  const CRITERIA_LIST = [
    'Đạo đức tốt',
    'Học tập tốt',
    'Thể lực tốt',
    'Tình nguyện tốt',
    'Hội nhập tốt'
  ];

  const [selectedCriteria, setSelectedCriteria] = useState(null);
  const [formData, setFormData] = useState({
    evidenceName: '',
    description: '',
    link: ''
  });
  const [status, setStatus] = useState({ isLoading: false, message: '', isSuccess: false });

  // Xử lý khi chọn tiêu chí
  const handleSelectCriteria = (criteria) => {
    setSelectedCriteria(criteria);
    // Reset form và thông báo khi chuyển tiêu chí khác
    setFormData({ evidenceName: '', description: '', link: '' });
    setStatus({ isLoading: false, message: '', isSuccess: false });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.evidenceName || !formData.link) {
      setStatus({ isLoading: false, message: 'Vui lòng nhập Tên minh chứng và Link URL', isSuccess: false });
      return;
    }

    setStatus({ isLoading: true, message: 'Đang lưu minh chứng...', isSuccess: false });

    try {
      // Đóng gói dữ liệu khớp với Database của Backend
      const payload = {
        applicationId: applicationId || 1, // Tạm dùng ID 1 nếu chưa truyền prop từ màn hình trước
        criteriaName: selectedCriteria,
        evidenceName: formData.evidenceName,
        description: formData.description,
        evidenceType: 'Link', // Mặc định là Link theo yêu cầu
        link: formData.link
      };

      // Gọi API Backend (Nhớ dùng đúng cổng 8080 đang chạy)
      const response = await axios.post('http://localhost:8080/api/evidence', payload);
      
      if (response.data.success) {
        setStatus({ isLoading: false, message: '✅ Đã lưu minh chứng thành công!', isSuccess: true });
        setFormData({ evidenceName: '', description: '', link: '' }); // Xóa trắng form
      }
    } catch (error) {
      console.error(error);
      setStatus({ isLoading: false, message: '❌ Lỗi chi tiết: ' + error.message, isSuccess: false });
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '20px auto', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h3 style={{ color: '#0056b3', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px', marginTop: 0 }}>
        Bổ Sung Minh Chứng 5 Tiêu Chí
      </h3>

      {/* Danh sách các tiêu chí */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        {CRITERIA_LIST.map((criteria, index) => (
          <button
            key={index}
            onClick={() => handleSelectCriteria(criteria)}
            style={{
              padding: '12px',
              textAlign: 'left',
              backgroundColor: selectedCriteria === criteria ? '#e6f2ff' : '#f8f9fa',
              border: selectedCriteria === criteria ? '1px solid #0056b3' : '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: selectedCriteria === criteria ? 'bold' : 'normal',
              color: selectedCriteria === criteria ? '#0056b3' : '#333',
              transition: 'all 0.2s'
            }}
          >
            {index + 1}. {criteria}
          </button>
        ))}
      </div>

      {/* Form nhập minh chứng chỉ hiện ra khi đã chọn 1 tiêu chí */}
      {selectedCriteria && (
        <div style={{ padding: '15px', border: '1px dashed #ccc', borderRadius: '4px', backgroundColor: '#fafafa' }}>
          <h4 style={{ marginTop: 0, color: '#333' }}>Thêm minh chứng cho: <span style={{ color: '#0056b3' }}>{selectedCriteria}</span></h4>
          
          {status.message && (
            <div style={{ padding: '10px', marginBottom: '15px', backgroundColor: status.isSuccess ? '#d4edda' : '#f8d7da', color: status.isSuccess ? '#155724' : '#721c24', borderRadius: '4px', fontWeight: 'bold' }}>
              {status.message}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Tên minh chứng (*):</label>
              <input 
                type="text" 
                name="evidenceName" 
                value={formData.evidenceName} 
                onChange={handleChange} 
                placeholder="VD: Giấy khen Sinh viên Giỏi..."
                style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }} 
              />
            </div>

            <div>
              <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Link URL minh chứng (*):</label>
              <input 
                type="url" 
                name="link" 
                value={formData.link} 
                onChange={handleChange} 
                placeholder="https://drive.google.com/..."
                style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }} 
              />
            </div>

            <div>
              <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Mô tả thêm (Không bắt buộc):</label>
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                rows="3"
                placeholder="Ghi chú thêm về minh chứng này..."
                style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }} 
              />
            </div>

            <button 
              type="submit" 
              disabled={status.isLoading} 
              style={{ padding: '10px', backgroundColor: status.isLoading ? '#ccc' : '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: status.isLoading ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '15px', marginTop: '5px' }}
            >
              {status.isLoading ? 'Đang lưu...' : 'Lưu Minh Chứng'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}