from api import db
from datetime import datetime
from pytz import timezone

KST = datetime.now(timezone('Asia/Seoul'))

class Comment(db.Model): 
    id=db.Column(db.Integer,primary_key=True) #autoincrement=True 
    content = db.Column(db.Text,nullable=False)
    blog_id = db.Column(db.Integer,db.ForeignKey('blog.id'), nullable=False) 
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False) 
    created_at = db.Column(db.DateTime, default=datetime.today())
    #대댓글
    class_ = db.Column(db.Integer)
    order = db.Column(db.Integer)
    groupNum = db.Column(db.Integer)

    # the one-to-one relation
    author = db.relationship('User', backref='comment_associated_user', lazy=True) 

    @property
    def serialize(self):
        return {
        'id': self.id,
        'content': self.content,         
        'blog_id': self.blog_id,
        'user_id': self.user_id,
        "created_at": self.created_at,
        "class_": self.class_, 
        "order": self.order,
        "groupNum": self.groupNum
        }