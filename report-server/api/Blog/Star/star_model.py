from api import db

class Star(db.Model): 
    id=db.Column(db.Integer,primary_key=True,autoincrement=True) 
    star_value = db.Column(db.Integer, default = 0)
    blog_id = db.Column(db.Integer,db.ForeignKey('blog.id'), nullable=False) # 관련된 블로그 아이디 
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False) # 관련된 user

    @property
    def serialize(self):
        return {
        'id': self.id,
        'star_value': self.star_value,         
        'blog_id': self.blog_id, 
        'user_id': self.user_id   
        }