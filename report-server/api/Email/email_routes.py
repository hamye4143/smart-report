from flask_mail import Mail, Message
from flask import Flask
from flask import Blueprint,request,jsonify,make_response,current_app
from flask_jwt_extended import jwt_required
from api.Email.email_model import Email
from api.Email.email_model import Email_File
import json
from api import db
import smtplib

from smtplib import SMTPException


email=Blueprint('email', __name__)

@email.route('/getAllEmails', methods=["POST"])
@jwt_required
def getAllEmails():
    # 사용자 인지 확인
    data = request.get_json()
    print('userdata',data)
    emails = Email.query.filter(data['id'] == Email.author_id).all()
    print('emails',emails)
    ab = json.dumps(Email.serialize_list(emails))
    print('ab',ab)
    return ab

@email.route('/sendEmail', methods=["POST"])
@jwt_required
def sendEmail():
    data = request.form.to_dict()
    print('data',data)
    uploaded_files = request.files.getlist("fileUpload")
    data["user"] = json.loads(data["user"]) # 보낸사람
    receiverString = data["receivers"] 
    data["receivers"] = json.loads(data["receivers"]) # 받는 사람 리스트  

    #msg = Message('Hello', sender = 'hamye4143@gmail.com', recipients = ['hamye4143@gmail.com','hamye4143@naver.com'])
    msg = Message(data["title"], sender = data['sender'], recipients = data["receivers"])
    msg.body = data["content"]
    
    newEmail=Email(title=data["title"],content=data["content"],sender=data["sender"],receivers = receiverString, author_id = data["user"]["id"])
    db.session.add(newEmail)
    db.session.commit()
    newEmailId = getattr(newEmail, "id")

    state= ""
    #uploaded_files
    if len(uploaded_files) !=0 :
        for file in uploaded_files:
            print(file)
            new_email_file = Email_File(email_id=newEmailId,origin_name= file.filename ,new_name=file.filename,path= '' ,type=file.content_type,size = '')        
            db.session.add(new_email_file)

            msg.attach(
                file.filename,
                'application/octect-stream',
                file.read()
            )
        db.session.commit()
    try:
        mail = Mail(current_app)
        mail.send(msg)
        state = "이메일이 보내졌습니다."

    except smtplib.SMTPAuthenticationError as e:
        state="SMTP 연결 인증이 잘못되었습니다."
        print('SMTP 연결 인증이 잘못되었습니다.',str(e))

        return state,400
    except smtplib.SMTPServerDisconnected as e:
        state="문제가 발생했습니다."
        print('SMTP 서버 연결이 끊겼습니다.',str(e))
        return state,400
    except smtplib.SMTPException as e:
        state="문제가 발생했습니다."
        print('문제발생3',str(e))
        return state,400
    
    

    return jsonify(state),200



