import React, { useState } from 'react';

const card = {background:'white',borderRadius:'12px',border:'1px solid #EBEBEB',padding:'20px'};

export default function History() {
  const [history, setHistory] = useState(JSON.parse(localStorage.getItem('history')||'[]'));

  const clear = () => { localStorage.removeItem('history'); setHistory([]); };

  return (
    <div style={{maxWidth:'680px'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
        <div>
          <h2 style={{margin:0,fontSize:'16px',fontWeight:'600',color:'#1A1A1A'}}>Check history</h2>
          <p style={{margin:'4px 0 0',fontSize:'13px',color:'#888'}}>{history.length} total checks</p>
        </div>
        {history.length > 0 && (
          <button onClick={clear} style={{padding:'7px 14px',border:'1px solid #EBEBEB',borderRadius:'8px',background:'white',fontSize:'13px',cursor:'pointer',color:'#888'}}>
            Clear all
          </button>
        )}
      </div>

      <div style={card}>
        {history.length === 0 ? (
          <div style={{textAlign:'center',padding:'40px 0'}}>
            <div style={{fontSize:'32px',marginBottom:'12px'}}>🕐</div>
            <p style={{fontSize:'14px',color:'#888',margin:0}}>No history yet. Start detecting news!</p>
          </div>
        ) : history.map((h,i) => (
          <div key={i} style={{display:'flex',alignItems:'center',gap:'12px',padding:'12px 0',borderBottom: i<history.length-1?'1px solid #F5F5F5':'none'}}>
            <span style={{padding:'4px 12px',borderRadius:'20px',fontSize:'12px',fontWeight:'600',whiteSpace:'nowrap',
              background: h.label==='FAKE'?'#FFF5F5':'#F0FAF0',color: h.label==='FAKE'?'#CC0000':'#226622'}}>
              {h.label}
            </span>
            <span style={{flex:1,fontSize:'13px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',color:'#333'}}>{h.text}</span>
            <span style={{fontSize:'12px',padding:'3px 8px',background:'#F5F5F5',borderRadius:'6px',color:'#555',whiteSpace:'nowrap'}}>{h.lang}</span>
            <span style={{fontSize:'12px',color:'#aaa',whiteSpace:'nowrap'}}>{h.conf}%</span>
            <span style={{fontSize:'11px',color:'#ccc',whiteSpace:'nowrap'}}>{h.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}