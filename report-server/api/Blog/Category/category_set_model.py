from api import db

#카테고리는 다중 카테고리로 무한히 생성
class Category_setting(db.Model): 
    cat_id=db.Column(db.Integer,primary_key=True) #autoincrement=True 
#    blog_id=db.Column(db.Integer, db.ForeignKey('blog.id'), nullable=False) 
    cat_key=db.Column(db.String(50)) # category 테이블의 키값, like 검색을 쉽게 하기 위한 키값
    cat_name = db.Column(db.String(50),nullable=False) # 카테고리명
    cat_parent = db.Column(db.String(50),nullable=False) # 부모 카테고리의 cat_key가 저장됨
    cat_order = db.Column(db.Integer) # 카테고리 순서
    cat_class = db.Column(db.Integer) # 부모 : 0, 자식: 1

    @property
    def serialize(self):
        return {
        'cat_id': self.cat_id,
        'cat_key': self.cat_key,         
        'cat_name': self.cat_name,
        'cat_parent': self.cat_parent,
        "cat_order": self.cat_order,
        "cat_class": self.cat_class
        }