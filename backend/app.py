from flask import Flask
from flask_cors import CORS
from flask_mysqldb import MySQL
from routes.auth_routes import auth_bp
from routes.request_routes import request_bp
import config

app = Flask(__name__)

CORS(app)

# MySQL Configuration
app.config['MYSQL_HOST'] = config.MYSQL_HOST
app.config['MYSQL_USER'] = config.MYSQL_USER
app.config['MYSQL_PASSWORD'] = config.MYSQL_PASSWORD
app.config['MYSQL_DB'] = config.MYSQL_DB
app.config['MYSQL_PORT'] = config.MYSQL_PORT

# Upload Folder
app.config['UPLOAD_FOLDER'] = config.UPLOAD_FOLDER

# Initialize MySQL
mysql = MySQL(app)

# Store mysql object in app
app.mysql = mysql

# Register Routes
app.register_blueprint(auth_bp)
app.register_blueprint(request_bp)

# Home Route
@app.route('/')
def home():
    return "Flask Backend Running Successfully"

# Run Server
if __name__ == '__main__':
    app.run(debug=True)
