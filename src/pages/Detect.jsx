import React, { useState } from 'react';
import axios from 'axios';

const LANGUAGES = ['English','Assamese','Meitei','Mizo','Bodo'];
const SAMPLES = {
  English:  'Trump claims election was stolen with no evidence provided to courts',
  Assamese: 'ট্ৰাম্প মিছা বাতৰি মিডিয়া নিৰ্বাচন চৰকাৰ',
  Meitei:   'ꯂꯩꯉꯥꯛ ꯈꯪꯕ ꯃꯦꯗꯤꯌꯥ ꯁꯔꯀꯥꯔ',
  Mizo:     'Dik lo thupui sorkar votu media',
  Bodo:     'मिथ्या खबर सरकार मीडिया निर्वाचन'
};

const card = {background:'white',borderRadius:'12px',border:'1px solid #EBEBEB',padding:'20px',marginBottom:'16px'};

export default function Detect() {
  const [lang, setLang]     = useState('English');
  const [text, setText]     = useState(SAMPLES.English);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  const handleLang = l => { setLang(l); setText(SAMPLES[l]); setResult(null); setError(''); };

  const detect = async () => {
    if (!text.trim()) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await axios.post('http://localhost:5000/api/predict', { text });
      setResult(res.data);
      const hist = JSON.parse(localStorage.getItem('history') || '[]');
      hist.unshift({ text: text.slice(0,80), label: res.data.label, conf: res.data.confidence, lang: res.data.language, time: new Date().toLocaleTimeString() });
      localStorage.setItem('history', JSON.stringify(hist.slice(0,50)));
    } catch { setError('⚠️ Backend not connected. Run: python app.py in backend folder.'); }
    setLoading(false);
  };

  return (
    <div style={{maxWidth:'680px'}}>
      <div style={card}>
        <div style={{fontSize:'13px',fontWeight:'500',color:'#555',marginBottom:'12px'}}>Select language</div>
        <div style={{display:'flex',gap:'8px',flexWrap:'wrap',marginBottom:'16px'}}>
          {LANGUAGES.map(l => (
            <button key={l} onClick={()=>handleLang(l)} style={{
              padding:'6px 16px',borderRadius:'20px',border:'1.5px solid',cursor:'pointer',
              fontSize:'13px',fontWeight:'500',transition:'all 0.15s',
              borderColor: lang===l?'#185FA5':'#EBEBEB',
              background: lang===l?'#EBF3FB':'white',
              color: lang===l?'#185FA5':'#888'
            }}>{l}</button>
          ))}
        </div>

        <textarea value={text} onChange={e=>setText(e.target.value)} rows={4}
          style={{width:'100%',border:'1px solid #EBEBEB',borderRadius:'10px',padding:'12px',
            fontSize:'14px',resize:'none',boxSizing:'border-box',fontFamily:'inherit',
            color:'#1A1A1A',outline:'none',lineHeight:'1.6'}}
          placeholder="Paste your news article here..."/>

        <div style={{display:'flex',gap:'10px',marginTop:'12px'}}>
          <button onClick={detect} disabled={loading} style={{
            padding:'10px 22px',background: loading?'#7BAFD4':'#185FA5',color:'white',
            border:'none',borderRadius:'8px',fontSize:'14px',cursor:'pointer',
            fontWeight:'500',display:'flex',alignItems:'center',gap:'8px'
          }}>
            {loading ? '🔍 Analyzing...' : '🔍 Detect'}
          </button>
          <button onClick={()=>{setText('');setResult(null);setError('');}} style={{
            padding:'10px 18px',border:'1px solid #EBEBEB',borderRadius:'8px',
            background:'white',fontSize:'14px',cursor:'pointer',color:'#888'
          }}>Clear</button>
        </div>
      </div>

      {error && (
        <div style={{background:'#FFF3CD',border:'1px solid #FFD369',borderRadius:'10px',padding:'12px 16px',fontSize:'14px',color:'#856404',marginBottom:'16px'}}>
          {error}
        </div>
      )}

      {result && (
        <div style={{...card, background: result.label==='FAKE'?'#FFF5F5':'#F0FAF0',
          border:`1.5px solid ${result.label==='FAKE'?'#FFCCCC':'#AADDAA'}`}}>
          <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'12px'}}>
            <span style={{fontSize:'32px'}}>{result.label==='FAKE'?'🔴':'🟢'}</span>
            <div>
              <div style={{fontSize:'18px',fontWeight:'600',color: result.label==='FAKE'?'#CC0000':'#226622'}}>
                {result.label==='FAKE' ? 'Fake News Detected' : 'Real News Verified'}
              </div>
              <div style={{fontSize:'13px',color:'#888',marginTop:'2px'}}>
                Language: <b style={{color:'#1A1A1A'}}>{result.language}</b> &nbsp;|&nbsp;
                Confidence: <b style={{color:'#1A1A1A'}}>{result.confidence}%</b>
              </div>
            </div>
          </div>
          <div style={{height:'8px',background:'rgba(0,0,0,0.06)',borderRadius:'4px',overflow:'hidden'}}>
            <div style={{height:'100%',width:`${result.confidence}%`,
              background: result.label==='FAKE'?'#E24B4A':'#4CAF50',borderRadius:'4px',
              transition:'width 0.8s ease'}}/>
          </div>
        </div>
      )}
    </div>
  );
}