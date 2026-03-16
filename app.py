from flask import Flask, render_template, request, jsonify
import json

app = Flask(__name__, static_folder="")

def logprint(message):
    open("log.txt", "a", encoding="utf-8").write(f"{message}\n")

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/index')
def index_home():
    return render_template('index.html')

@app.route('/admin')
def admin_page():
    return render_template('admin.html')

@app.route('/login')
def login_page():
    return render_template('login.html')

@app.route('/api/check-admin', methods=['POST'])
def check_admin():
    payload = request.get_json(silent=True)
    userip = request.remote_addr
    logprint(f"Admin check from {userip} with payload: {payload}")
    name = payload.get('name', 'unknown') if payload else 'unknown'
    with open("login.json", "r", encoding="utf-8") as f:
        users = json.load(f)
    user = next((u for u in users if u.get('name') == name), None)

    is_admin = user.get('is_admin', False) if user else False
    return jsonify(is_admin=is_admin)

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
    from datetime import datetime

    try:
        with open("data.json", "r", encoding="utf-8") as f:
            data = json.load(f)

        payload = request.get_json(silent=True)
        logprint(f"/api/status | {payload}")
        if not payload or 'id' not in payload or 'account' not in payload:
            return jsonify(error="missing required fields"), 400

        item_id = payload['id']
        for item in data.get('items', []):
            if item.get('id') == item_id:
                # toggle availability/borrowed state
                new_status = not item.get('status', False)
                item['status'] = new_status

                # when an item is borrowed (status becomes False) save account & date
                if not new_status:
                    item['account'] = payload.get('account', "") or ""
                    # if caller didn't send a date use today
                    item['date'] = payload.get('date', datetime.now().strftime("%Y-%m-%d"))
                else:
                    # return: clear account and optionally record return date if provided
                    item['account'] = ""
                    item['date'] = payload.get('date', "") or ""
                break
        else:
            return jsonify(error="item not found"), 404

        if (item['account']):
            item['lastAccount'] = item['account']

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

@app.route('/api/login', methods=['POST'])
def login():
    payload = request.get_json(silent=True)
    logprint(f"/api/login | {payload}")
    #ogprint(payload)
    if not payload or 'name' not in payload or 'password' not in payload:
        return jsonify(error="missing credentials"), 400

    name = payload['name']
    password = payload['password']
    password = str(hash(password))
    logprint(f"{password} | {name}")

    # Placeholder for actual authentication logic
    with open("login.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    for user in data:
        if user.get('name') == name and user.get('password') == password:
            return jsonify(success=True, user={"name": name, "is_admin": user.get('is_admin', False)})
    return jsonify(error="invalid credentials"), 401

@app.route('/api/register', methods=['POST'])
def register():
    payload = request.get_json(silent=True)
    if not payload or 'name' not in payload or 'password' not in payload:
        return jsonify(error="missing credentials"), 400

    name = payload['name']
    password = payload['password']

    password = str(hash(password))
    logprint(f"/api/register | {name} | {password}")
    with open("login.json", "r", encoding="utf-8") as f:
        data = json.load(f)

    if any(user.get('name') == name for user in data):
        return jsonify(error="username already exists"), 409

    new_user = {"name": name, "password": password, "is_admin": False}
    data.append(new_user)

    with open("login.json", "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

    return jsonify(success=True, user={"name": name, "is_admin": False})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
