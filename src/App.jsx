import React, { useState, useEffect } from 'react';
import Login from './Login';
import Dashboard from './pages/Dashboard';
import Detect from './pages/Detect';
import History from './pages/History';

const NAV = [
  { id:'detect',    icon:'🔍', label:'Detect'    },
  { id:'dashboard', icon:'📊', label:'Dashboard' },
  { id:'history',   icon:'🕐', label:'History'   },
];

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('detect');

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const logout = () => { localStorage.removeItem('user'); setUser(null); };

  if (!user) return <Login onLogin={setUser} />;

  return (
    <div style={{display:'flex',height:'100vh',fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',background:'#F8F9FA'}}>
      
      {/* Sidebar */}
      <div style={{width:'240px',background:'white',borderRight:'1px solid #EBEBEB',padding:'20px 12px',display:'flex',flexDirection:'column',gap:'4px',flexShrink:0}}>
        <div style={{display:'flex',alignItems:'center',gap:'8px',padding:'8px 12px',marginBottom:'16px'}}>
          <div style={{width:'28px',height:'28px',background:'#EBF3FB',borderRadius:'8px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'14px'}}>🌏</div>
          <span style={{fontSize:'14px',fontWeight:'600',color:'#1A1A1A'}}>NE FakeNews</span>
        </div>

        {NAV.map(n => (
          <button key={n.id} onClick={()=>setPage(n.id)} style={{
            display:'flex',alignItems:'center',gap:'10px',padding:'9px 12px',
            borderRadius:'8px',border:'none',cursor:'pointer',fontSize:'13px',
            fontWeight: page===n.id?'500':'400',
            background: page===n.id?'#EBF3FB':'transparent',
            color: page===n.id?'#185FA5':'#555',
            textAlign:'left',width:'100%'
          }}>
            <span style={{fontSize:'15px'}}>{n.icon}</span> {n.label}
          </button>
        ))}

        <div style={{marginTop:'auto',padding:'12px',borderTop:'1px solid #EBEBEB'}}>
          <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'10px'}}>
            <div style={{width:'32px',height:'32px',borderRadius:'50%',background:'#EBF3FB',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',fontWeight:'600',color:'#185FA5'}}>
              {user.email[0].toUpperCase()}
            </div>
            <div>
              <div style={{fontSize:'12px',fontWeight:'500',color:'#1A1A1A'}}>{user.email.split('@')[0]}</div>
              <div style={{fontSize:'11px',color:'#888'}}>{user.email}</div>
            </div>
          </div>
          <button onClick={logout} style={{
            width:'100%',padding:'7px 12px',border:'1px solid #EBEBEB',
            borderRadius:'8px',background:'white',fontSize:'12px',
            cursor:'pointer',color:'#888',display:'flex',alignItems:'center',gap:'6px'
          }}>🚪 Logout</button>
        </div>
      </div>

      {/* Main */}
      <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
        {/* Topbar */}
        <div style={{background:'white',borderBottom:'1px solid #EBEBEB',padding:'0 24px',height:'56px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <span style={{fontSize:'15px',fontWeight:'600',color:'#1A1A1A'}}>
            {NAV.find(n=>n.id===page)?.label === 'Detect' ? 'Detect Fake News' :
             NAV.find(n=>n.id===page)?.label === 'Dashboard' ? 'Dashboard' : 'History'}
          </span>
          <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
            <span style={{fontSize:'13px',color:'#888'}}>{user.email.split('@')[0]}</span>
            <div style={{width:'34px',height:'34px',borderRadius:'50%',background:'#185FA5',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'13px',fontWeight:'600',color:'white'}}>
              {user.email[0].toUpperCase()}
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{flex:1,overflowY:'auto',padding:'24px'}}>
          {page==='detect'    && <Detect />}
          {page==='dashboard' && <Dashboard />}
          {page==='history'   && <History />}
        </div>
      </div>
    </div>
  );
}