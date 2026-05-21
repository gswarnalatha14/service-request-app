from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import generate_password_hash, check_password_hash

auth_bp = Blueprint('auth', __name__)

# Register API
@auth_bp.route('/register', methods=['POST'])
def register():

    data = request.json

    name = data['name']
    email = data['email']
    password = generate_password_hash(data['password'])

    mysql = current_app.mysql

    cur = mysql.connection.cursor()

    cur.execute(
        "INSERT INTO users(name, email, password) VALUES(%s, %s, %s)",
        (name, email, password)
    )

    mysql.connection.commit()

    cur.close()

    return jsonify({
        'message': 'User Registered Successfully'
    })


# Login API
@auth_bp.route('/login', methods=['POST'])
def login():

    data = request.json

    email = data['email']
    password = data['password']

    mysql = current_app.mysql

    cur = mysql.connection.cursor()

    cur.execute(
        "SELECT * FROM users WHERE email=%s",
        (email,)
    )

    user = cur.fetchone()

    cur.close()

    if user and check_password_hash(user[3], password):

        return jsonify({
            'message': 'Login Successful',
            'user_id': user[0],
            'name': user[1]
        })

    return jsonify({
        'message': 'Invalid Credentials'
    }), 401