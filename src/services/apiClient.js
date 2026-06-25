import axios from 'axios';

const apiClient = axios.create({
    // Ép cứng địa chỉ backend tại đây để test cho chắc chắn
    baseURL: 'http://localhost:5000/api', 
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiClient;