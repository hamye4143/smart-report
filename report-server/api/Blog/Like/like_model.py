from api import db

class PostLike(db.Model): 
    id=db.Column(db.Integer,primary_key=True) #like id #has_rated_star
    blog_id = db.Column(db.Integer,db.ForeignKey('blog.id'), nullable=False) # 관련된 블로그 아이디 
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False) # 관련된 user
    like_chk  = db.Column(db.Integer, default=0) # 각게시판마다회원이좋아요를했는지안했는지구분자 (좋아요:1또는 좋아요 취소: 0)
    @property
    def serialize(self):
        return {
        'id': self.id,
        'blog_id': self.blog_id, 
        'user_id': self.user_id,   
        'like_check': self.like_chk
        }