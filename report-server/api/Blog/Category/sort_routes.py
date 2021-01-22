from api import db
from flask import Blueprint,jsonify,request
from flask_jwt_extended import jwt_required
from api.Blog.Category.sort_model import Sort_model, Sort_model_relation


sorts= Blueprint('sorts',__name__)

@sorts.route('/get_all_sorts',methods=["GET"])#/<action>
def getAllSorts():
    
    sorts = Sort_model.query.all()

    sorts_relation = Sort_model_relation.query.all()
    #print('sorts_relation', sorts_relation)
    serialized_data = []
    for sort in sorts_relation:
        a = sort.serialize
        serialized_data.append(a)

    return jsonify({"serialized_data": serialized_data})


@sorts.route('/insert_action',methods=["GET"])#/<action>
def insertAction():
    #모든 데이터 삭제 
    Sort_model_relation.query.delete()
    Sort_model.query.delete()
    
    db.session.commit()
    
    # 예제 카테고리 분류 

    # 국내도서 - 소설 - 한국소설

    #        ㄴ 시  - 한국시

    #              ㄴ해외시  - 영미시

    #보여주는 식 
 
    db.session.add_all([
        Sort_model(cat_name="국내도서" ,cat_content="국내 도서입니다." ,parent_id=0,rank=0), # id = 1 
        Sort_model(cat_name="소설" ,cat_content="국내 도서의 소설입니다." ,parent_id=1,rank=1), # id =2
        Sort_model(cat_name="한국 소설" ,cat_content="소설의 한국소설입니다." ,parent_id=2,rank=2), # id =3

        Sort_model(cat_name="시" ,cat_content="국내 도서의 시 입니다." ,parent_id=1,rank=1), # id =4
        Sort_model(cat_name="한국 시" ,cat_content="시의 한국시입니다." ,parent_id=4,rank=2), # id =5
        Sort_model(cat_name="해외 시" ,cat_content="시의 해외시입니다." ,parent_id=4,rank=2),# id =6
        Sort_model(cat_name="영미 시" ,cat_content="해외시의 영미시입니다." ,parent_id=6,rank=3) # id =7
    ])

    #insert all 
    db.session.add_all([
        #부모 - 자식 
        Sort_model_relation(ancestor_id=1, descendant_id=1,depth=0),
        Sort_model_relation(ancestor_id=1, descendant_id=2,depth=1),
        Sort_model_relation(ancestor_id=1, descendant_id=3,depth=2),
        Sort_model_relation(ancestor_id=1, descendant_id=4,depth=1),
        Sort_model_relation(ancestor_id=1, descendant_id=5,depth=2),
        Sort_model_relation(ancestor_id=1, descendant_id=6,depth=2),
        Sort_model_relation(ancestor_id=1, descendant_id=7,depth=3),

        #자식 - 손자 
        Sort_model_relation(ancestor_id=2, descendant_id=2,depth=0),
        Sort_model_relation(ancestor_id=2, descendant_id=3,depth=1),
        
        #손자 - 손자의 자식
        Sort_model_relation(ancestor_id=3, descendant_id=3,depth=0),

        #자식 - 손자
        Sort_model_relation(ancestor_id=4, descendant_id=4,depth=0),
        Sort_model_relation(ancestor_id=4, descendant_id=5,depth=1),
        Sort_model_relation(ancestor_id=4, descendant_id=7,depth=2),
        Sort_model_relation(ancestor_id=5, descendant_id=5,depth=0),
        Sort_model_relation(ancestor_id=6, descendant_id=6,depth=0),
        Sort_model_relation(ancestor_id=6, descendant_id=7,depth=1),
        Sort_model_relation(ancestor_id=7, descendant_id=7,depth=0)
    ])

    # 저장확정
    db.session.commit()

    return jsonify({"message": "완료했습니다."})
