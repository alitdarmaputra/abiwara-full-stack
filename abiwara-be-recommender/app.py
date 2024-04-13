from flask import Flask, request, abort, json
from predict import get_book_recs, get_user_recs 
from response import Response, ErrorResponse
import pandas as pd
import os
import jwt

pass_key = os.environ['PASS_KEY']
secret_key = os.environ['SECRET_KEY']

app = Flask(__name__)

@app.before_request
def authenticate():
    if request.path == '/health-check':
        return

    auth = request.headers.get('Authorization')

    if not auth:
        abort(401)

    try:
        token = auth.split(' ')[1]
        decoded = jwt.decode(token, secret_key, algorithms=['HS256'])

        if decoded['pass_key'] != pass_key:
            abort(401)
        
        pass
    except:
        abort(401)

@app.route('/health-check')
def health_check():
    return {
        'status': 'OK'
    }

@app.route('/book-recommendations/<int:id>')
def show_book_recommendation(id):
    try:
        data_df = get_book_recs(id) 
        data_json = data_df.to_dict(orient='records')
        res = Response(200, 'OK', data_json, None)
        return res.__dict__
    except:
        errRes = ErrorResponse(404, 'Not found', 'Not enough info about book')
        return errRes.__dict__, 404 

@app.route('/user-recommendations/<string:id>', methods=['POST'])
def show_user_recommendation(id):
    data = json.loads(request.data)
    rated_book_ids = data["rated_book_ids"]
    page = request.args.get("page", default=0, type=int)
    try:
        total_recs, data_df = get_user_recs(id, rated_book_ids, page) 
        data_json = data_df.to_dict(orient='records')
        res = Response(200, 'OK', data_json, {
            "page": page, 
            "total": total_recs
        })
        return res.__dict__
    except:
        errRes = ErrorResponse(404, 'Not found', 'Not enough info about user')
        return errRes.__dict__, 404 

@app.errorhandler(404)
def not_found_handler(error):
    errRes = ErrorResponse(404, 'Not found', 'Page not found') 
    return errRes.__dict__, 404 

@app.errorhandler(500)
def internal_server_error_handler(error):
    errRes = ErrorResponse(500, 'Internal server error', 'Internal server error') 
    return errRes.__dict__, 500 

@app.errorhandler(401)
def unauthorized_handler(error):
    errRes = ErrorResponse(401, 'Unauthorized', 'Unauthorized') 
    return errRes.__dict__, 401

if __name__ == '__main__':
    debug = False 
    environment = os.getenv('ENV', 'development')

    if environment == 'development':
        debug = True

    app.run(debug=debug)
