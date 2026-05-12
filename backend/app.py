from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import os

app = Flask(__name__)
CORS(app)

# Load models
model = joblib.load('multilingual_model.pkl')
tfidf  = joblib.load('multilingual_tfidf.pkl')

# NE Language detection
LANGUAGE_SCRIPTS = {
    'Assamese': (0x0980, 0x09FF),
    'Meitei':   (0xABC0, 0xABFF),
    'Bodo':     (0x0900, 0x097F),
}
MIZO_WORDS = ['chu','nia','kan','ang','pawh','dik','lo','thupui']
NE_TO_EN = {
    'মিছা':'fake',    'বাতৰি':'news',
    'চৰকাৰ':'government', 'ট্ৰাম্প':'trump',
    'ꯂꯩꯉꯥꯛ':'fake',  'ꯈꯪꯕ':'news',
    'ꯁꯔꯀꯥꯔ':'government',
    'Dik lo':'fake', 'Thupui':'news',
    'मिथ्या':'fake', 'खबर':'news',
}

def detect_language(text):
    for char in text:
        cp = ord(char)
        for lang, (s,e) in LANGUAGE_SCRIPTS.items():
            if s <= cp <= e:
                return lang
    if any(w in text.lower() for w in MIZO_WORDS):
        return 'Mizo'
    return 'English'

def ne_to_english(text):
    for ne, en in NE_TO_EN.items():
        text = text.replace(ne, en)
    return text

@app.route('/api/predict', methods=['POST'])
def predict():
    data     = request.json
    text     = data.get('text', '')
    lang     = detect_language(text)
    text_en  = ne_to_english(text) if lang != 'English' else text
    features = tfidf.transform([text_en])
    pred     = model.predict(features)[0]
    prob     = model.predict_proba(features)[0]
    conf     = float(prob[0] if pred == 0 else prob[1])

    return jsonify({
        'prediction': int(pred),
        'label':      'FAKE' if pred == 0 else 'REAL',
        'confidence': round(conf * 100, 2),
        'language':   lang
    })

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app) # CRITICAL: Allows React to talk to Flask

@app.route('/api/predict', methods=['POST'])
def predict():
    data = request.json
    text = data.get('text')
    
    # 1. Vectorize the text using your tfidf.pkl
    # 2. Predict using your model.pkl
    
    # Mock response for testing:
    return jsonify({
        "prediction": "Fake", # or "Real"
        "confidence": 0.945,
        "language": "Assamese"
    })

if __name__ == "__main__":
    app.run(port=5000, debug=True)