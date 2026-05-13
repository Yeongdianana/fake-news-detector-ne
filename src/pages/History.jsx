import React, { useState } from 'react';

export default function History() {
  const [history, setHistory] = useState(
    JSON.parse(localStorage.getItem('fakeNewsHistory') || '[]')
  );

  const clear = () => {
    localStorage.removeItem('fakeNewsHistory');
    setHistory([]);
  };

  return (
    <div style={{padding:'24px',maxWidth:'700px'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
        <div>
          <h2 style={{margin:0,fontSize:'16px',fontWeight:'700',color:'#111827'}}>Check history</h2>
          <p style={{margin:'4px 0 0',fontSize:'13px',color:'#6b7280'}}>{history.length} total checks saved</p>
        </div>
        {history.length > 0 && (
          <button onClick={clear} style={{
            padding:'7px 14px',border:'1px solid #e5e7eb',
            borderRadius:'8px',background:'white',
            fontSize:'13px',cursor:'pointer',color:'#6b7280'
          }}>🗑️ Clear all</button>
        )}
      </div>

      <div style={{background:'white',borderRadius:'12px',border:'1px solid #e5e7eb',padding:'20px'}}>
        {history.length === 0 ? (
          <div style={{textAlign:'center',padding:'40px'}}>
            <div style={{fontSize:'40px',marginBottom:'12px'}}>🕐</div>
            <p style={{color:'#9ca3af',fontSize:'14px'}}>No history yet. Start detecting news!</p>
          </div>
        ) : history.map((h,i) => (
          <div key={i} style={{
            display:'flex',alignItems:'center',gap:'12px',
            padding:'12px 0',
            borderBottom: i<history.length-1 ? '1px solid #f9fafb' : 'none'
          }}>
            <span style={{
              padding:'4px 12px',borderRadius:'20px',
              fontSize:'12px',fontWeight:'700',whiteSpace:'nowrap',
              background: h.label==='FAKE'?'#fef2f2':'#f0fdf4',
              color:       h.label==='FAKE'?'#dc2626':'#16a34a'
            }}>{h.label}</span>
            <span style={{flex:1,fontSize:'13px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',color:'#374151'}}>{h.text}</span>
            <span style={{fontSize:'12px',padding:'3px 8px',background:'#f3f4f6',borderRadius:'6px',color:'#6b7280',whiteSpace:'nowrap'}}>{h.lang}</span>
            <span style={{fontSize:'12px',color:'#9ca3af',whiteSpace:'nowrap'}}>{h.conf}%</span>
            <span style={{fontSize:'11px',color:'#d1d5db',whiteSpace:'nowrap'}}>{h.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}