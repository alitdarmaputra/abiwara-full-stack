from flask import Flask, abort
from predict import get_recs
from response import Response, ErrorResponse
import pandas as pd

app = Flask(__name__)

@app.route('/health-check')
def health_check():
    return {
        'status': 'OK'
    }

@app.route('/recommendations/<int:id>')
def show_recommendation(id):
    try:
        data_df = get_recs(id) 
        data_json = data_df.to_dict(orient='records')
        res = Response(200, 'OK', data_json)
        return res.__dict__
    except:
        errRes = ErrorResponse(404, 'Not found', 'Not enough info about book') 
        return errRes.__dict__, 404 

@app.errorhandler(404)
def not_found_handler(error):
    errRes = ErrorResponse(404, 'Not found', 'Page not found') 
    return errRes.__dict__, 404 

@app.errorhandler(500)
def not_found_handler(error):
    errRes = ErrorResponse(500, 'Internal server error', 'Internal server error') 
    return errRes.__dict__, 500 
