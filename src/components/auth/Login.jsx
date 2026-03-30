import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Box } from '@mui/material';

function Login() {
  const [formData, setFormData] = useState({
    memId: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);  // ← 이 부분이 없어서 오류 발생
  const [error, setError] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 필수 입력값 확인
    if (!formData.memId || !formData.password) {
      setError('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // 1. API 호출
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          memId: formData.memId,
          password: formData.password
        })
      });

      const data = await response.json();

      // 2. 응답 확인
      if (response.ok) {
        console.log('✅ 로그인 성공:', data);
        
        // 3. 토큰 저장 (선택사항)
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        
        // 4. 사용자 정보 저장 (선택사항)
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        
        // 5. 페이지 이동 - 다양한 방법
        
        // 방법 1: 기본 이동
        navigate('/board');
        
        // 방법 2: replace 옵션으로 이동 (뒤로가기 불가)
        // navigate('/board', { replace: true });
        
        // 방법 3: 상태와 함께 이동
        // navigate('/board', { 
        //   state: { 
        //     message: '환영합니다!',
        //     userId: data.user?.id 
        //   } 
        // });
        
        // 방법 4: 사용자 권한에 따라 다른 페이지로 이동
        // if (data.user?.role === 'ADMIN') {
        //   navigate('/admin');
        // } else {
        //   navigate('/board');
        // }
        
      } else {
        // 로그인 실패
        console.log('❌ 로그인 실패:', data);
        setError(data.message || '아이디 또는 비밀번호가 일치하지 않습니다.');
      }
      
    } catch (error) {
      // 네트워크 오류 등
      console.error('🚨 API 호출 오류:', error);
      setError('서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          로그인
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="memId"
            label="아이디"
            name="memId"
            autoComplete="username"
            autoFocus
            value={formData.memId}
            onChange={handleChange}
            size="medium"
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="비밀번호"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            size="medium"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.5 }}
          >
            로그인
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default Login;