from api import db

class Category_admin(db.Model): 

    id=db.Column(db.Integer,primary_key=True,autoincrement=True) #autoincrement=True 
    title=db.Column(db.String(50)) 
    description=db.Column(db.String(50)) 
    group_id = db.Column(db.Integer) 
    #안써
    blog_id = db.Column(db.Integer, db.ForeignKey('blog.id'), nullable=False) 
    #1대 1 
    #안써
    blog = db.relationship('Blog', backref='category_associated_blog', lazy=True) 
    #1대 N (선택한 블로그들 )
    blogs = db.relationship('Blog', backref='category_associated_blog1', lazy=True) 


    @property
    def serialize(self):
        return {
        'id': self.id,
        'title': self.title,    
        'description': self.description,   
        'group_id': self.group_id
        # 'blog_id': self.blog_id
        }

    @property
    def short_serialize(self):
        return {
        'id': self.id,
        'title': self.title,    
        'description': self.description   
        }