
from flask import Blueprint
from flask import abort, jsonify
# from flask_errors_handler import ErrorHandler
from werkzeug.exceptions import HTTPException


errors = Blueprint('errors', __name__)

@errors.errorhandler(HTTPException)
def handle_exception(e):
    print('hamdle_excpetio')
    """Return JSON instead of HTML for HTTP errors."""
    # start with the correct headers and status code from the error
    response = e.get_response()
    # replace the body with JSON
    response.data = json.dumps({
        "code": e.code,
        "name": e.name,
        "description": e.description,
    })
    response.content_type = "application/json"
    return response,400

# @errors.app_errorhandler(404)
# def handle_404(err):
#     return render_template('404.html'), 404

# @errors.app_errorhandler(500)
# def handle_500(err):
#     return render_template('500.html'), 500


# @errors.errorhandler(401)
# def handel_401(error):
#     #return Response('<Why access is denied string goes here...>', 401, {'WWW-Authenticate':'Basic realm="Login Required"'})
    
#     return jsonify('<Why access is denied string goes here...>', 401, {'WWW-Authenticate':'Basic realm="Login Required"'})