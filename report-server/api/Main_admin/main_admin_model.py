from api import db
from api.Main_admin_blog.main_admin_blog_table import main_blogs

class MainAdmin(db.Model): 

    id=db.Column(db.Integer,primary_key=True,autoincrement=True) #autoincrement=True 
    title=db.Column(db.String(50)) 
    description=db.Column(db.String(50)) 
    # 다 대 다 
    blogs = db.relationship("Blog", cascade="all, delete", secondary=main_blogs, backref=db.backref('mains_associated',lazy="dynamic"))


    @property
    def serialize(self):
        return {
        'id': self.id,
        'title': self.title,    
        'description': self.description   
        }