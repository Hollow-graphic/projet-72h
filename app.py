from flask import Flask, render_template, request, jsonify
import json

app = Flask(__name__, static_folder="")

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/admin')
def admin_page():
    return render_template('admin.html')

@app.route('/api/message', methods=['POST'])
def message():
    with open("data.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    return jsonify(data)

@app.route('/image/<int:item_id>')
def get_image(item_id):
    with open("data.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    for item in data.get('items', []):
        if item.get('id') == item_id:
            return jsonify(image_url=item.get('image_url'))
    return jsonify(error="image not found"), 404

@app.route('/api/status', methods=['POST'])
def status():
    try:
        with open("data.json", "r", encoding="utf-8") as f:
            data = json.load(f)

        payload = request.get_json(silent=True)
        if not payload or 'id' not in payload:
            return jsonify(error="missing id"), 400

        item_id = payload['id']
        for item in data.get('items', []):
            if item.get('id') == item_id:
                item['status'] = not item.get('status', False)
                item['account'] = payload.get('account', "")
                item['date'] = payload.get('date', "")
                break
        else:
            return jsonify(error="item not found"), 404

        with open("data.json", "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=4)

        return jsonify(success=True)
    except Exception as e:
        return jsonify(error=str(e)), 500
    
@app.route('/api/getimage', methods=['POST'])
def getimage():
    try:
        payload = request.get_json(silent=True)
        if not payload or 'id' not in payload:
            return jsonify(error="missing id"), 400
        
        item_id = payload['id']
        with open("data.json", "r", encoding="utf-8") as f:
            data = json.load(f)
        
        for item in data.get('items', []):
            if item.get('id') == item_id:
                return jsonify(image_url=item.get('image_url'))
        return jsonify(error="item not found"), 404
    except Exception as e:
        return jsonify(error=str(e)), 500

@app.route('/api/admin', methods=['POST'])
def get_admin_data():
    with open("data.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
