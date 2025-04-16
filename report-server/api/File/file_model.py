from api import db
from datetime import datetime
from pytz import timezone

KST = datetime.now(timezone('Asia/Seoul'))

class File(db.Model): 
    id = db.Column(db.Integer, primary_key=True)
    origin_name = db.Column(db.String(255))  # 넉넉하게 경로/이름 대비
    new_name = db.Column(db.String(100))     # UUID + 확장자 충분히 커야 함
    path = db.Column(db.String(500))         # 절대경로 or URL 등
    type = db.Column(db.String(120))         # MIME 타입은 120이면 충분
    size = db.Column(db.String(120))         # 문자열 형태면 길이 유지
    download_cnt = db.Column(db.Integer, default=0)

    blog_id = db.Column(db.Integer, db.ForeignKey('blog.id'), nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)


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