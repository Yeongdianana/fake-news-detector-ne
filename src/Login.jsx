import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    localStorage.setItem('user', JSON.stringify({ email }));
    onLogin({ email });
  };

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#f5f5f5'}}>
      <div style={{background:'white',borderRadius:'12px',padding:'2rem',width:'320px',border:'1px solid #eee'}}>
        <div style={{textAlign:'center',marginBottom:'1.5rem'}}>
          <div style={{fontSize:'36px',marginBottom:'8px'}}>🌏</div>
          <h2 style={{fontSize:'18px',fontWeight:'500',margin:0}}>{isRegister ? 'Create account' : 'Welcome back'}</h2>
          <p style={{color:'#888',fontSize:'13px',marginTop:'4px'}}>NE India Fake News Detector</p>
        </div>

        {error && <div style={{background:'#FCEBEB',color:'#A32D2D',padding:'8px 12px',borderRadius:'8px',fontSize:'13px',marginBottom:'12px'}}>{error}</div>}

        <div style={{marginBottom:'12px'}}>
          <label style={{fontSize:'12px',color:'#888',display:'block',marginBottom:'4px'}}>Email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="you@example.com"
            style={{width:'100%',padding:'8px 12px',border:'1px solid #ddd',borderRadius:'8px',fontSize:'14px',boxSizing:'border-box'}}/>
        </div>

        <div style={{marginBottom:'16px'}}>
          <label style={{fontSize:'12px',color:'#888',display:'block',marginBottom:'4px'}}>Password</label>
          <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="••••••••"
            style={{width:'100%',padding:'8px 12px',border:'1px solid #ddd',borderRadius:'8px',fontSize:'14px',boxSizing:'border-box'}}/>
        </div>

        <button onClick={handleSubmit}
          style={{width:'100%',padding:'10px',background:'#185FA5',color:'white',border:'none',borderRadius:'8px',fontSize:'14px',cursor:'pointer'}}>
          {isRegister ? 'Sign up' : 'Sign in'}
        </button>

        <p style={{textAlign:'center',fontSize:'13px',marginTop:'12px',color:'#888'}}>
          {isRegister ? 'Already have an account?' : "Don't have an account?"}
          <span onClick={()=>setIsRegister(!isRegister)} style={{color:'#185FA5',cursor:'pointer',marginLeft:'4px'}}>
            {isRegister ? 'Sign in' : 'Sign up'}
          </span>
        </p>
      </div>
    </div>
  );
}