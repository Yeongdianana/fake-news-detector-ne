import React from 'react';

const card = {background:'white',borderRadius:'12px',border:'1px solid #EBEBEB',padding:'20px'};

export default function Dashboard() {
  const history = JSON.parse(localStorage.getItem('history') || '[]');
  const fake = history.filter(h=>h.label==='FAKE').length;
  const real = history.filter(h=>h.label==='REAL').length;

  const metrics = [
    {label:'Total Checked', value: history.length, color:'#185FA5', bg:'#EBF3FB'},
    {label:'Fake Detected',  value: fake,           color:'#A32D2D', bg:'#FFF5F5'},
    {label:'Real Verified',  value: real,           color:'#226622', bg:'#F0FAF0'},
    {label:'Model Accuracy', value: '99.87%',       color:'#0F6E56', bg:'#E1F5EE'},
  ];

  const langs = {};
  history.forEach(h => langs[h.lang] = (langs[h.lang]||0)+1);

  return (
    <div style={{maxWidth:'680px'}}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'12px',marginBottom:'20px'}}>
        {metrics.map((m,i) => (
          <div key={i} style={{...card,padding:'16px'}}>
            <div style={{width:'36px',height:'36px',borderRadius:'8px',background:m.bg,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'10px',fontSize:'16px'}}>
              {['📊','🔴','🟢','🎯'][i]}
            </div>
            <div style={{fontSize:'22px',fontWeight:'600',color:m.color}}>{m.value}</div>
            <div style={{fontSize:'12px',color:'#888',marginTop:'2px'}}>{m.label}</div>
          </div>
        ))}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px',marginBottom:'20px'}}>
        <div style={card}>
          <div style={{fontSize:'13px',fontWeight:'600',marginBottom:'16px',color:'#1A1A1A'}}>By language</div>
          {Object.keys(langs).length === 0 ? (
            <p style={{fontSize:'13px',color:'#aaa'}}>No data yet</p>
          ) : Object.entries(langs).map(([l,c],i) => (
            <div key={i} style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'10px'}}>
              <span style={{width:'70px',fontSize:'12px',color:'#888'}}>{l}</span>
              <div style={{flex:1,height:'8px',background:'#F0F0F0',borderRadius:'4px'}}>
                <div style={{height:'100%',width:`${(c/history.length)*100}%`,background:'#185FA5',borderRadius:'4px'}}/>
              </div>
              <span style={{fontSize:'12px',fontWeight:'500',color:'#1A1A1A',minWidth:'20px'}}>{c}</span>
            </div>
          ))}
        </div>

        <div style={card}>
          <div style={{fontSize:'13px',fontWeight:'600',marginBottom:'16px',color:'#1A1A1A'}}>Fake vs Real</div>
          <div style={{display:'flex',justifyContent:'center',gap:'24px',alignItems:'center',height:'80px'}}>
            <div style={{textAlign:'center'}}>
              <div style={{fontSize:'28px',fontWeight:'700',color:'#E24B4A'}}>{fake}</div>
              <div style={{fontSize:'11px',color:'#888',marginTop:'2px'}}>Fake</div>
            </div>
            <div style={{width:'1px',height:'40px',background:'#EBEBEB'}}/>
            <div style={{textAlign:'center'}}>
              <div style={{fontSize:'28px',fontWeight:'700',color:'#4CAF50'}}>{real}</div>
              <div style={{fontSize:'11px',color:'#888',marginTop:'2px'}}>Real</div>
            </div>
          </div>
          <div style={{height:'6px',background:'#F0F0F0',borderRadius:'3px',overflow:'hidden',marginTop:'8px'}}>
            {history.length > 0 && <div style={{height:'100%',width:`${(fake/history.length)*100}%`,background:'#E24B4A',borderRadius:'3px'}}/>}
          </div>
        </div>
      </div>

      <div style={card}>
        <div style={{fontSize:'13px',fontWeight:'600',marginBottom:'12px',color:'#1A1A1A'}}>Recent checks</div>
        {history.length === 0 ? (
          <p style={{fontSize:'13px',color:'#aaa',textAlign:'center',padding:'20px 0'}}>No checks yet. Go to Detect to start!</p>
        ) : history.slice(0,5).map((h,i) => (
          <div key={i} style={{display:'flex',alignItems:'center',gap:'12px',padding:'8px 0',borderBottom: i<4?'1px solid #F5F5F5':'none'}}>
            <span style={{padding:'3px 10px',borderRadius:'20px',fontSize:'11px',fontWeight:'600',whiteSpace:'nowrap',
              background: h.label==='FAKE'?'#FFF5F5':'#F0FAF0',color: h.label==='FAKE'?'#CC0000':'#226622'}}>
              {h.label}
            </span>
            <span style={{flex:1,fontSize:'13px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',color:'#333'}}>{h.text}</span>
            <span style={{fontSize:'11px',color:'#aaa',whiteSpace:'nowrap'}}>{h.conf}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}