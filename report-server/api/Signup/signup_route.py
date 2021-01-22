from flask import Blueprint,request,jsonify
from api.User.user_model import User
from flask_jwt_extended import create_access_token
from werkzeug.security import check_password_hash 
from werkzeug.security import generate_password_hash
from api import db

signup=Blueprint('signup', __name__)

@signup.route('/signup', methods=["POST"])
def sign_up():
    data = request.get_json()

    #같은 id를 갖고 있는 사람이있다면 거부
    #If it exists we throw an error to the user,
    check_same_user = User.query.filter_by(email=data["email"]).first()
    check_same_name = User.query.filter_by(name=data["name"]).first()
    err_message = None

    if check_same_user:
        err_message = "같은 이메일을 가진 회원이 이미 있습니다."
        return err_message,400

    if check_same_name:
        err_message = "같은 이름을 가진 회원이 이미 있습니다."
        return err_message,400

    if not check_same_user and not check_same_name: 
        new_user = User(email=data["email"],password=data["password"],name=data["name"])
        new_user.password = generate_password_hash(new_user.password,'sha256',salt_length=12)
        db.session.add(new_user)
        db.session.commit()
        return jsonify("회원가입 성공했습니다."),200 # 요청 성공 

    else: 
        return "오류발생",400


    

