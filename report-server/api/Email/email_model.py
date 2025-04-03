from api import db
from datetime import datetime
from pytz import timezone

KST = datetime.now(timezone('Asia/Seoul'))

class Email_File(db.Model): 
    id=db.Column(db.Integer,primary_key=True,autoincrement=True)
    email_id = db.Column(db.Integer,db.ForeignKey('email.id'), nullable=False) #   
    origin_name = db.Column(db.String(120)) #파일 원래 이름
    new_name=db.Column(db.String(20)) #파일 새로운 이름
    path = db.Column(db.String(120))#경로
    type = db.Column(db.String(120)) # 타입 
    size = db.Column(db.String(120)) # 사이즈 

    @property
    def serialize(self):
        return {
        'id': self.id,
        'email_id': self.email_id,
        'origin_name': self.origin_name, 
        'new_name': self.new_name,
        'path': self.path,
        'type': self.type, 
        'size': self.size,
        }

class Email(db.Model): 
    id=db.Column(db.Integer,primary_key=True,autoincrement=True)
    title = db.Column(db.String(120)) 
    content= db.Column(db.String(20)) 
    sender = db.Column(db.String(120))
    receivers = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.today())
    author_id = db.Column(db.Integer,db.ForeignKey('user.id'), nullable=False) 
    email_files = db.relationship('Email_File', backref = 'email_associated_files', lazy=True, cascade="all, delete") 


    @property
    def serialize(self):
        return {
        'id': self.id,
        'title': self.title,
        'content': self.content,
        'sender': self.sender,
        'receivers': self.receivers,
        'created_at': self.created_at.strftime('%Y/%m/%d'),
        'author_id': self.author_id
        }

    @staticmethod
    def serialize_list(l):
        print('laaa',l)
        return [m.serialize for m in l]