from api import db
from api.Blog.blog_model import Blog
from datetime import datetime
from pytz import timezone

KST = datetime.now(timezone('Asia/Seoul'))

class User(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    email=db.Column(db.String(120),nullable=False)
    password=db.Column(db.String(120),nullable=False)
    name = db.Column(db.String(120), nullable=False) # 추가 
    created_at = db.Column(db.DateTime, default=datetime.today())
    is_admin = db.Column(db.String(1), default='N') # 관리자면 : char : y, n -> enum 



    @property
    def serialize(self):
        return {
            'id': self.id,
            'email': self.email,
            # 'password': self.password,
            'name': self.name,
            'created_at': self.created_at,
            'is_admin': self.is_admin
        }  