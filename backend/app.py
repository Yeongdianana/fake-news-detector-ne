from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import re
import os

app = Flask(__name__)
CORS(app)

# Load models
model = joblib.load('multilingual_model.pkl')
tfidf = joblib.load('multilingual_tfidf.pkl')

NE_TO_EN = {
    'মিছা':'fake', 'বাতৰি':'news', 'চৰকাৰ':'government',
    'ꯂꯩꯉꯥꯛ':'fake', 'ꯈꯪꯕ':'news', 'ꯁꯔꯀꯥꯔ':'government',
    'Dik lo':'fake', 'Thupui':'news', 'Sorkar':'government',
    'मिथ्या':'fake', 'खबर':'news', 'सरकार':'government',
}

def detect_language(text):
    if any(char in text for char in 'অআইঈউঊএঐওঔ'):
        return 'Assamese'
    if any(char in text for char in 'ꯀꯁꯂꯃ'):
        return 'Meitei'
    if any(word in text.lower() for word in ['chu','nia','pawh','dik','lo']):
        return 'Mizo'
    return 'English'

def ne_to_english(text):
    for ne, en in NE_TO_EN.items():
        text = text.replace(ne, en)
    return text

@app.route('/api/predict', methods=['POST'])
def predict():
    data = request.json
    text = data.get('text', '')
    
    if not text:
        return jsonify({"error": "No text provided"}), 400
    
    lang = detect_language(text)
    text_en = ne_to_english(text) if lang != 'English' else text
    
    features = tfidf.transform([text_en])
    pred = model.predict(features)[0]
    prob = model.predict_proba(features)[0]
    confidence = float(prob[0] if pred == 0 else prob[1])
    
    result = "FAKE" if pred == 0 else "REAL"
    
    return jsonify({
        "result": result,
        "confidence": round(confidence * 100, 2),
        "language": lang
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)