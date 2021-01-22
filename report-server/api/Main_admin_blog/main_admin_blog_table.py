#N:M관계 테이블
from api import db

main_blogs = db.Table('main_blogs',

    db.Column('id', db.Integer, primary_key=True),
    db.Column('main_id',db.Integer,db.ForeignKey('main_admin.id')),
    db.Column('blog_id', db.Integer,db.ForeignKey('blog.id'))
)   