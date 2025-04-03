from api import db
from api.Code.code_model import Code_table, Code_detail_table
from flask import Blueprint,request,jsonify,make_response
from flask_jwt_extended import jwt_required

codes= Blueprint('codes',__name__)

@codes.route('/get_all_codes',methods=["GET"])
def getAllCodes():
    # getRoots()
    # getChildList(1,[])
    

    # codes = Code_table.query.all()
    # code_details = Code_detail_table.query.order_by(Code_detail_table.parent_id.asc()).all()


    
    # serialized_codes = []
    # serialized_code_details = [] 
    # serialized_data = []
    # for code in codes:
    #     serialized_codes.append(code.serialize())

    # serialized_data.append(serialized_codes)
    # for detail in code_details:
    #     serialized_code_details.append(detail.serialize)
        
    # serialized_data.append(serialized_code_details)

    
    return jsonify({"serialized_data":getList()})

@codes.route('/init_datas',methods=["GET"])
def initDatas():
    Code_detail_table.query.delete() 
    Code_table.query.delete()
    db.session.commit()

    #있으면 추가 x 
    db.session.add_all([
        Code_table(code="lv1",code_name="대분류",detail="대분류입니다."), # id = 1 
        Code_table(code="lv2",code_name="중분류",detail="중분류입니다."), # id = 2
        Code_table(code="lv3",code_name="소분류",detail="소분류입니다.") # id = 3
    ])

    db.session.add_all([
        # Code_detail_table(group_code_id=0, code="all",code_name="전체", parent_group_code_id=-1,parent_id=0, order=1,detail="전체"), #
        Code_detail_table(group_code_id=1, code="knds",code_name="국내도서", parent_group_code_id=0,parent_id=0, order=1,detail="대분류인 국내도서"), #
        Code_detail_table(group_code_id=2, code="ss",code_name="소설", parent_group_code_id=1, parent_id=1 , order=1, detail="중분류인 소설"),  # 중분류 fk
        Code_detail_table(group_code_id=3, code="hs",code_name="한국소설", parent_group_code_id=2 , parent_id=2, order=1, detail="소분류인 한국소설"),
        Code_detail_table(group_code_id=3, code="ykss",code_name="외국소설", parent_group_code_id=2, parent_id=2, order=2, detail="소분류인 외국소설"),
        Code_detail_table(group_code_id=2, code="si",code_name="시", parent_group_code_id=1, parent_id=1, order=2, detail="중분류인 시"),
        Code_detail_table(group_code_id=3, code="hsi",code_name="한국시", parent_group_code_id=2, parent_id=5, order=2, detail="소분류인 한국시"),
        Code_detail_table(group_code_id=3, code="yksi",code_name="외국시", parent_group_code_id=2, parent_id=5, order=4, detail="소분류인 외국시"),
        Code_detail_table(group_code_id=3, code="jkss",code_name="중국소설", parent_group_code_id=2, parent_id=2, order=5, detail="소분류인 중국소설"),
        Code_detail_table(group_code_id=1, code="ykds",code_name="외국도서", parent_group_code_id=0, parent_id=0, order=2, detail="대분류인 외국도서"),
    ])

    db.session.commit()
    
    return jsonify({"message": "serialized_data"})


@codes.route('/init_datas3',methods=["GET"])
def initDatas3():

    Code_detail_table.query.delete() 
    Code_table.query.delete()
    db.session.commit()

    #있으면 추가 x 
    db.session.add_all([
        Code_table(code="lv1",code_name="대분류",detail="대분류입니다."), # id = 1 
        Code_table(code="lv2",code_name="중분류",detail="중분류입니다."), # id = 2
        Code_table(code="lv3",code_name="소분류",detail="소분류입니다.") # id = 3
    ])

    db.session.add_all([
        Code_detail_table(group_code_id=1, code="all",code_name="전체", parent_group_code_id=0,parent_id=0, order=1,detail="전체"), #1
    ])

    db.session.commit()
    return jsonify({"message": "serialized_data"})
@codes.route('/init_datas2',methods=["GET"])
def initDatas2():
    Code_detail_table.query.delete() 
    Code_table.query.delete()
    db.session.commit()

    #있으면 추가 x 
    db.session.add_all([
        Code_table(code="lv1",code_name="대분류",detail="대분류입니다."), # id = 1 
        Code_table(code="lv2",code_name="중분류",detail="중분류입니다."), # id = 2
        Code_table(code="lv3",code_name="소분류",detail="소분류입니다.") # id = 3
    ])

    db.session.add_all([
        Code_detail_table(group_code_id=1, code="all",code_name="전체", parent_group_code_id=0,parent_id=0, order=1,detail="전체"), #1
        Code_detail_table(group_code_id=2, code="knds",code_name="국내도서", parent_group_code_id=1,parent_id=1, order=1,detail="대분류인 국내도서"), #2
        Code_detail_table(group_code_id=3, code="ss",code_name="소설", parent_group_code_id=2, parent_id=2 , order=1, detail="중분류인 소설"),  # 중분류 fk
        Code_detail_table(group_code_id=4, code="hs",code_name="한국소설", parent_group_code_id=3 , parent_id=3, order=1, detail="소분류인 한국소설"),
        Code_detail_table(group_code_id=4, code="ykss",code_name="외국소설", parent_group_code_id=3, parent_id=3, order=2, detail="소분류인 외국소설"),
        Code_detail_table(group_code_id=3, code="si",code_name="시", parent_group_code_id=2, parent_id=2, order=2, detail="중분류인 시"),
        Code_detail_table(group_code_id=4, code="hsi",code_name="한국시", parent_group_code_id=3, parent_id=6, order=2, detail="소분류인 한국시"),
        Code_detail_table(group_code_id=4, code="yksi",code_name="외국시", parent_group_code_id=3, parent_id=6, order=4, detail="소분류인 외국시"),
        Code_detail_table(group_code_id=4, code="jkss",code_name="중국소설", parent_group_code_id=3, parent_id=3, order=5, detail="소분류인 중국소설"),


        Code_detail_table(group_code_id=2, code="ykds",code_name="외국도서", parent_group_code_id=0, parent_id=1, order=2, detail="대분류인 외국도서"),
    ])

    db.session.commit()
    
    return jsonify({"message": "serialized_data"})




@codes.route('/insert_codes',methods=["POST"])
def insertCodes():
    #초기화
    
    Code_detail_table.query.delete() 

    data = request.get_json()
    data_list = []

    for i in data:
        data_list.append(Code_detail_table(id=i['Id'],group_code_id=i['group_code_id'],code = i['code'], code_name=i['Name'], parent_group_code_id=i['parent_group_code_id'],parent_id=i['parent_id'],order=i['order'],detail=i['Description'], is_use=i['is_use']))
    print('data_list',data_list)
    #data_list order by 
    # db.session.add_all(data_list)
    for i in data_list:
        db.session.add(i)
    db.session.commit()

    return jsonify({"message": "serialized_data"})

#루트 카테고리를 검색하는 메소드 
def getRoots():    
    # group_code_id = 1
    #루트 카테고리만 리스트로 
    roots_list = Code_detail_table.query.filter_by(group_code_id=1).all() #1 = 전체
    print(roots_list)
    return roots_list

#루트 카테고리를 기준으로 자식 카테고리 리스트를 백트래킹 알고리즘을 사용하여 저장하기  
def getChildList(root_id,list_): # 루트 아이디 입력 root_id (국내도서의 id)

    #루트의 데이터 저장
    root_data = Code_detail_table.query.filter_by(id=root_id).first()    
    print('root_data',root_data)
    list_.append(root_data.serialize)

    children_list = Code_detail_table.query.filter_by(parent_id=root_id).all()    
    print(children_list)

    for i in children_list:# <>, <>
        parent_id = i.id
        getChildList(parent_id, list_) #재귀


#루트기준으로 모든 카테고리를 검색하여 list 객체로 반환하는 메소드 
def getList():
    childList = []
    check = 0
    rootList = getRoots()
    print('rootList',rootList)
    print('childList',childList)
    #가져온 루트 리스트만큼 반복실행 
    for i in rootList:
        check+=1
        id_ = i.id
        print('id_',id_)
        getChildList(id_,childList) # 루트의 자식을 가져옴 
    return childList

