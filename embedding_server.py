from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer

app = Flask(__name__)
model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

@app.route('/embed', methods=['POST'])
def embed():
    text = request.json['text']
    return jsonify(model.encode([text]).tolist()[0])

if __name__ == '__main__':
    app.run(port=3000)
