from api import db
from datetime import datetime
from pytz import timezone

KST = datetime.now(timezone('Asia/Seoul'))

class File(db.Model): 
    id=db.Column(db.Integer,primary_key=True)
    origin_name = db.Column(db.String(120)) #파일 원래 이름
    new_name=db.Column(db.String(20)) #파일 새로운 이름
    path = db.Column(db.String(120))#경로
    type = db.Column(db.String(120)) # 타입 
    size = db.Column(db.String(120)) # 사이즈 
    download_cnt = db.Column(db.Integer, default=0) # 다운로드 수 
    # blog_title = db.Column(db.String(50),nullable=False)
    # blog_content = db.Column(db.Text,nullable=False)
    # created_at = db.Column(db.DateTime, default=datetime.today())
    #file_category = 


    blog_id = db.Column(db.Integer,db.ForeignKey('blog.id'), nullable=False) #    
    author_id = db.Column(db.Integer,db.ForeignKey('user.id'), nullable=False) # 누가 올린파일인지

    # download_users=db.relationship('User',backref=db.backref('fils_associated_downloadusers',lazy=True))# N:M
    # new_author = db.relationship('User', backref='blog_associated_users', lazy=True) # Blog에서 관련된 user 찾기 위해
    # download_user=db.relationship('User',backref=db.backref('fils_associated_downloadusers',lazy=True))# N:M
    
    #file --> a , b, c, d 
    # file 1 --> a, b, c, d (1:N)
    # board --> a,b,c,d, (1:N)
    


    @property
    def serialize(self):
        return {
        'id': self.id,
        'origin_name': self.origin_name, 
        'new_name': self.new_name,
        'path': self.path,
        'type': self.type, 
        'size': self.size,
        'blog_id': self.blog_id,
        'download_cnt': self.download_cnt
        }