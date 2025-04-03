from api import db

#카테고리 테이블 
class Sort_model(db.Model): 
    id=db.Column(db.Integer,primary_key=True,autoincrement=True) 
    cat_name = db.Column(db.String(50),nullable=False)
    cat_content = db.Column(db.String(50))
    parent_id = db.Column(db.Integer,nullable=False) 
    rank = db.Column(db.Integer)

    @property
    def serialize(self):
        return {
        'id': self.id,
        'cat_name': self.cat_name,         
        'cat_content': self.cat_content,
        'parent_id': self.parent_id,
        'rank': self.rank
        }

class Sort_model_relation(db.Model): 
    ancestor_id= db.Column(db.Integer,primary_key=True)
    descendant_id= db.Column(db.Integer,primary_key=True)
    depth = db.Column(db.Integer)

    @property
    def serialize(self):
        return {
        'ancestor_id': self.ancestor_id,
        'descendant_id': self.descendant_id,         
        'depth': self.depth
        }