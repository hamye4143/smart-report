from api import db
from datetime import datetime
from api.Tags_Blog.tag_blog_table import tag_blog
from pytz import timezone

KST = datetime.now(timezone('Asia/Seoul'))

class Blog(db.Model):
    id = db.Column(db.Integer,primary_key=True)
    title=db.Column(db.String(50),nullable=False)
    content=db.Column(db.Text,nullable=False)
    feature_image= db.Column(db.String,nullable=True) # False
    created_at = db.Column(db.DateTime, default=datetime.today())
    author_id = db.Column(db.Integer,db.ForeignKey('user.id'), nullable=False) # User table 참조 
    # main_admin_id = db.Column(db.Integer,db.ForeignKey('main_admin.id'), nullable=True) # User table 참조 
    star = db.Column(db.Integer,default=0)
    view_count = db.Column(db.Integer,default=0)
    tags=db.relationship('Tag',cascade="delete",secondary=tag_blog,backref=db.backref('blogs_associated',lazy="dynamic"))
    #backref: 반대의 상황, Tag에서 blogs들을 쉽게 찾기 위해 , Blog에 등록된 컬럼 이름으로 설정하면 안됨
    #blog에서 해당 tag를 확인할 수 도 있음
    #secondary: 연관 테이블인 tag_blog객체를 참조한다. 
    #lazy : 관련된 객체들이 어떻게 로드될지
    # 관련된 tags들만 삭제되게끔


    new_author = db.relationship('User', backref='blog_associated_users', lazy=True) # Blog에서 관련된 user 찾기 위해
    #backref:User에서도 blogs들을 쉽게 찾을 수 있게 --> user.blog_associated_users 접근

    files = db.relationship('File', backref = 'blog_associated_files', lazy=True, cascade="all, delete") # Blog에서 관련된 file
    #blog에서 해당 files들을 확일 할 수 있음

    comments = db.relationship('Comment', backref = 'blog_associated_comments', lazy=True, cascade="all, delete") # Blog에서 관련된 comment
   
    # the one-to-one relation
    category = db.relationship('Category', backref = 'blog_associated_category', lazy=True, cascade="all, delete")


    @property
    def serialize(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'star': self.star,
            'feature_image': self.feature_image, 
            'created_at': self.created_at.strftime('%m/%d/%Y'), #M/d/yyyy 
            'author_id': self.author_id,
            'view_count': self.view_count
        }  


    @property
    def short_serialize(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content
        }          