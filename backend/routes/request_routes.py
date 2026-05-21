from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
import os

request_bp = Blueprint('request', __name__)

# Create Service Request
@request_bp.route('/create-request', methods=['POST'])
def create_request():

    mysql = current_app.mysql

    title = request.form['title']
    description = request.form['description']
    category = request.form['category']
    address = request.form['address']
    preferred_time = request.form['preferred_time']
    user_id = request.form['user_id']

    image_name = ''

    # Image Upload
    if 'image' in request.files:

        image = request.files['image']

        if image.filename != '':

            image_name = secure_filename(image.filename)

            image.save(
                os.path.join(
                    current_app.config['UPLOAD_FOLDER'],
                    image_name
                )
            )

    cur = mysql.connection.cursor()

    cur.execute(
        """
        INSERT INTO service_requests
        (user_id, title, description, category, address, preferred_time, image)
        VALUES(%s, %s, %s, %s, %s, %s, %s)
        """,
        (
            user_id,
            title,
            description,
            category,
            address,
            preferred_time,
            image_name
        )
    )

    mysql.connection.commit()

    cur.close()

    return jsonify({
        'message': 'Service Request Created Successfully'
    })


# Get User Requests
@request_bp.route('/requests/<int:user_id>', methods=['GET'])
def get_requests(user_id):

    mysql = current_app.mysql

    cur = mysql.connection.cursor()

    cur.execute(
        "SELECT * FROM service_requests WHERE user_id=%s",
        (user_id,)
    )

    requests = cur.fetchall()

    cur.close()

    output = []

    for req in requests:

        output.append({
            'id': req[0],
            'title': req[2],
            'description': req[3],
            'category': req[4],
            'address': req[5],
            'preferred_time': req[6],
            'status': req[7],
            'image': req[8]
        })

    return jsonify(output)


# Update Status
@request_bp.route('/update-status/<int:id>', methods=['PUT'])
def update_status(id):

    data = request.json

    status = data['status']

    mysql = current_app.mysql

    cur = mysql.connection.cursor()

    cur.execute(
        "UPDATE service_requests SET status=%s WHERE id=%s",
        (status, id)
    )

    mysql.connection.commit()

    cur.close()

    return jsonify({
        'message': 'Status Updated Successfully'
    })


# Delete Request
@request_bp.route('/delete-request/<int:id>', methods=['DELETE'])
def delete_request(id):

    mysql = current_app.mysql

    cur = mysql.connection.cursor()

    cur.execute(
        "DELETE FROM service_requests WHERE id=%s",
        (id,)
    )

    mysql.connection.commit()

    cur.close()

    return jsonify({
        'message': 'Request Deleted Successfully'
    })