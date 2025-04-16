from api import db
from datetime import datetime
from api.Tags_Blog.tag_blog_table import tag_blog
from pytz import timezone

KST = datetime.now(timezone('Asia/Seoul'))


class Blog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)  # 50 → 100으로 넉넉하게
    content = db.Column(db.Text, nullable=False)

    feature_image = db.Column(db.String(255), nullable=True)  # 경로일 수 있으므로 길이 확장
    created_at = db.Column(db.DateTime, default=datetime.today())
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    star = db.Column(db.Integer, default=0)
    view_count = db.Column(db.Integer, default=0)

    # Many-to-many: Tags
    tags = db.relationship(
        'Tag',
        cascade="delete",
        secondary=tag_blog,
        backref=db.backref('blogs_associated', lazy="dynamic")
    )

    # One-to-many: Blog → User
    new_author = db.relationship('User', backref='blog_associated_users', lazy=True)

    # One-to-many: Blog → File
    files = db.relationship('File', backref='blog_associated_files', lazy=True, cascade="all, delete")

    # One-to-many: Blog → Comment
    comments = db.relationship('Comment', backref='blog_associated_comments', lazy=True, cascade="all, delete")

    # One-to-many (혹은 one-to-one?): Blog → Category
    category = db.relationship('Category', backref='blog_associated_category', lazy=True, cascade="all, delete")

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