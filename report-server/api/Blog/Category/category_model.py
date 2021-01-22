from api import db

class Category(db.Model): 
    cat_id = db.Column(db.Integer,primary_key=True,autoincrement=True)
    blog_id = db.Column(db.Integer, db.ForeignKey('blog.id'), nullable=False) 
    code_id = db.Column(db.Integer, db.ForeignKey('code_table.id'), nullable=False) 
    code_name = db.Column(db.String(50))
    # cat_id=db.Column(db.Integer,primary_key=True)
    # blog_id=db.Column(db.Integer, db.ForeignKey('blog.id'), nullable=False) 
    # type1 = db.Column(db.String(50))#대분류
    # type2 = db.Column(db.String(50))#중분류
    # type3 = db.Column(db.String(50))#소분류
    # type4 = db.Column(db.String(50))#세분류 


    @property
    def serialize(self):
        return {
        'cat_id': self.cat_id,
        'blog_id': self.blog_id, 
        'code_id': self.code_id,
        'code_name': self.code_name
        }

    @property
    def shortSerialize(self):
        return {       
        'code_name': self.code_name
        }        