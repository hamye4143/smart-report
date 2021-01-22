from api import db
from datetime import datetime
from pytz import timezone

KST = datetime.now(timezone('Asia/Seoul'))

class Question(db.Model):
    id = db.Column(db.Integer,primary_key=True,autoincrement=True)
    title=db.Column(db.String(50),nullable=False)
    content=db.Column(db.Text,nullable=False)
    feature_image= db.Column(db.String,nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.today())
    updated_at = db.Column(db.DateTime, nullable=True, default=datetime.today())
    author_id = db.Column(db.Integer,db.ForeignKey('user.id'), nullable=False)
    origin_name = db.Column(db.String(120)) #파일 원래 이름
    new_name=db.Column(db.String(20)) #파일 새로운 이름
    path = db.Column(db.String(120))#경로
    type = db.Column(db.String(120)) # 타입 
    state = db.Column(db.Integer,default=1) # 답변대기  (1) / 답변 2 (2)/ 답변완료 (3)
    viewCount = db.Column(db.Integer,default=0) # 조회수
    author = db.relationship('User', backref='question_associated_users', lazy=True) 
    answers = db.relationship('Answer', backref='question_associated_answers', lazy=True,cascade="all, delete") 



    @property
    def serialize(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'origin_name': self.origin_name, 
            'path':self.path,
            'created_at': self.created_at.strftime('%m/%d/%Y'), #M/d/yyyy 
            'updated_at': self.updated_at.strftime('%m/%d/%Y'),
            'author_id': self.author_id,
            'state': self.state ,
            'viewCount': self.viewCount   
        }  