import React from 'react';

export default function Dashboard() {
  const history = JSON.parse(localStorage.getItem('fakeNewsHistory') || '[]');
  const fake = history.filter(h => h.label === 'FAKE').length;
  const real = history.filter(h => h.label === 'REAL').length;

  const langCount = {};
  history.forEach(h => langCount[h.lang] = (langCount[h.lang]||0)+1);

  return (
    <div style={{padding:'24px',maxWidth:'700px'}}>

      {/* Metrics */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'12px',marginBottom:'20px'}}>
        {[
          {label:'Total Checked', value:history.length, icon:'📊', color:'#2563eb', bg:'#eff6ff'},
          {label:'Fake Detected',  value:fake,           icon:'🔴', color:'#dc2626', bg:'#fef2f2'},
          {label:'Real Verified',  value:real,           icon:'🟢', color:'#16a34a', bg:'#f0fdf4'},
          {label:'Accuracy',       value:'99.87%',       icon:'🎯', color:'#0f766e', bg:'#f0fdfa'},
        ].map((m,i) => (
          <div key={i} style={{background:'white',borderRadius:'12px',border:'1px solid #e5e7eb',padding:'16px'}}>
            <div style={{fontSize:'24px',marginBottom:'8px'}}>{m.icon}</div>
            <div style={{fontSize:'22px',fontWeight:'700',color:m.color}}>{m.value}</div>
            <div style={{fontSize:'12px',color:'#6b7280',marginTop:'2px'}}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Language Stats */}
      <div style={{background:'white',borderRadius:'12px',border:'1px solid #e5e7eb',padding:'20px',marginBottom:'16px'}}>
        <p style={{fontWeight:'600',fontSize:'14px',marginBottom:'16px',color:'#111827'}}>Checks by language</p>
        {Object.keys(langCount).length === 0 ? (
          <p style={{color:'#9ca3af',fontSize:'13px',textAlign:'center',padding:'16px'}}>No data yet. Start detecting news!</p>
        ) : Object.entries(langCount).map(([l,c],i) => (
          <div key={i} style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'10px'}}>
            <span style={{width:'80px',fontSize:'13px',color:'#6b7280'}}>{l}</span>
            <div style={{flex:1,height:'8px',background:'#f3f4f6',borderRadius:'4px'}}>
              <div style={{height:'100%',width:`${(c/history.length)*100}%`,background:'#3b82f6',borderRadius:'4px'}}/>
            </div>
            <span style={{fontSize:'13px',fontWeight:'600',color:'#111827',minWidth:'24px'}}>{c}</span>
          </div>
        ))}
      </div>

      {/* Recent */}
      <div style={{background:'white',borderRadius:'12px',border:'1px solid #e5e7eb',padding:'20px'}}>
        <p style={{fontWeight:'600',fontSize:'14px',marginBottom:'12px',color:'#111827'}}>Recent checks</p>
        {history.length === 0 ? (
          <p style={{color:'#9ca3af',fontSize:'13px',textAlign:'center',padding:'16px'}}>No history yet!</p>
        ) : history.slice(0,5).map((h,i) => (
          <div key={i} style={{display:'flex',alignItems:'center',gap:'12px',padding:'8px 0',borderBottom:i<4?'1px solid #f9fafb':'none'}}>
            <span style={{
              padding:'3px 10px',borderRadius:'20px',fontSize:'11px',fontWeight:'600',
              background: h.label==='FAKE'?'#fef2f2':'#f0fdf4',
              color:       h.label==='FAKE'?'#dc2626':'#16a34a'
            }}>{h.label}</span>
            <span style={{flex:1,fontSize:'13px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',color:'#374151'}}>{h.text}</span>
            <span style={{fontSize:'12px',color:'#9ca3af'}}>{h.conf}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}