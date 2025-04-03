from api import db

#코드 테이블(1)
class Code_table(db.Model): 
    id=db.Column(db.Integer,primary_key=True,autoincrement=True) 
    code = db.Column(db.String(50)) # 코드번호 :lv1 , lv 2, lv3 
    code_name = db.Column(db.String(50)) # 코드 이름 (한국말): 대분류, 중분류, 소분류 
    detail = db.Column(db.String(50)) # 코드 설명 
    is_use = db.Column(db.String(1), default='Y')  #사용여부

    #기본값 
    def serialize(self):
        return {
        'id': self.id,
        'code': self.code,
        'code_name': self.code_name,
        'detail': self.detail,
        'is_use': self.is_use
        }
        
#코드 상세 테이블들(N) --> recursive 
class Code_detail_table(db.Model): 
    id= db.Column(db.Integer,primary_key=True,autoincrement=True) 
    group_code_id = db.Column(db.Integer) #fk #대분류 .. 
    #group_code_id = db.Column(db.Integer,db.ForeignKey('code_table.id')) #fk #대분류 .. 
    code = db.Column(db.String(50)) #코드번호 : ssk ,, 
    code_name = db.Column(db.String(50)) # 국내도서 
    parent_group_code_id= db.Column(db.Integer) #상위 코드 그룹 id # 0
    parent_id= db.Column(db.Integer) #상위 상세 코드 id 0
    order =  db.Column(db.Integer) # 정렬 순서  (대분류 안에서의)  # 굳이 필요한가 ... 
    detail = db.Column(db.String(50)) # 코드 설명 
    is_use = db.Column(db.String(1), default='Y')  #사용여부  


    @property
    def serialize(self):
        return {
        'Id': self.id,
        'Name': self.code_name,
        'Description':self.detail,
        'group_code_id': self.group_code_id,
        'code': self.code,           
        'parent_group_code_id': self.parent_group_code_id,
        'parent_id': self.parent_id,
        'order': self.order,        
        'is_use':self.is_use,
        }