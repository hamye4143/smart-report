from flask import Blueprint,request,jsonify
from api.User.user_model import User
from api.User.Visitor.visitor_model import Visitor
from flask_jwt_extended import create_access_token
from werkzeug.security import check_password_hash 
from datetime import datetime
from flask_jwt_extended import jwt_required
from api import db

login=Blueprint('login', __name__)

@login.route('/login', methods=["POST"])
def log_in():
    request_data = request.get_json()

    user=User.query.filter_by(email=request_data["email"]).first()
    if user and check_password_hash(user.password,request_data["password"]):
        jwt_token=create_access_token(identity=user.email)
        
        
        user_info = user.serialize

        print('user_info', user_info)

        print('token', jwt_token)
        ip_addr = request.environ.get('HTTP_X_REAL_IP', request.remote_addr)
        # ip_addr = request.environ['REMOTE_ADDR']

        #visitor 등록
        visitorHistory= Visitor(user_id=user.id,ip_addr=ip_addr,login_date=datetime.today())
        db.session.add(visitorHistory)
        db.session.commit()


        return jsonify({"token":jwt_token,"user_info": user_info})
    else:
        return "유효하지 않은 이메일 또는 패스워드입니다.",400




@login.route('/logout', methods=["PUT"])
@jwt_required
def log_out():
        userId = request.data
        print('userId',userId)
        print(type(userId))

        visitor = Visitor.query.filter_by(user_id = int(userId)).order_by(Visitor.id.desc()).first()
        visitor.logout_date = datetime.today()
        db.session.commit()

        return jsonify({"token":'jwt_token'})



