
from api import db
from api.Category_admin.category_admin_model import Category_admin
from flask import Blueprint,request,jsonify,make_response
from flask_jwt_extended import jwt_required
categories= Blueprint('categories',__name__)


@categories.route('/add_category2', methods=["POST"])
@jwt_required
def create_category2():
    data = request.get_json()  
    for i in data['blog_id']:
        category_admin = Category_admin(title=data['title'],description= data['description'], group_id=0,blog_id=i)
        db.session.add(category_admin)
    db.session.commit()

    category_admin2 = Category_admin.query.filter_by(group_id=0).all()
    new_category_id = getattr(category_admin2[0], "id")

    for i in category_admin2:
        i.group_id = new_category_id
    db.session.commit()
    return jsonify({"id": 'new_blog_id'})



@categories.route('/add_category', methods=["POST"])
@jwt_required
def create_category():
    data = request.get_json()  
    print('data',data)
    print('data_list',data['blog_id'][0])
    #group_id: pk_id  
    for i in data['blog_id']:
        # category_admin = Category_admin(title=data['title'],group_id=data['group_id'],blog_id=i)
        category_admin = Category_admin(title=data['title'],description= data['description'], group_id=0,blog_id=i)
        db.session.add(category_admin)
    db.session.commit()

    category_admin2 = Category_admin.query.filter_by(group_id=0).all()
    new_category_id = getattr(category_admin2[0], "id")

    for i in category_admin2:
        i.group_id = new_category_id
    db.session.commit()
    return jsonify({"id": 'new_blog_id'})

@categories.route('/modify_category/<int:groupId>', methods=["PUT"])
@jwt_required
def modify_category(groupId):
    print('groupId',groupId)  
    data = request.get_json()
    print('data',data)

    # 그 전 group_id 삭제
    category_admin=Category_admin.query.filter_by(group_id=groupId).all() #1 
    print('category_admin',category_admin)
    for i in category_admin:
        db.session.delete(i)
    db.session.commit()

    # 새로운 데이터 
    for i in data['blog_id']:
        category_admin = Category_admin(title=data['title'],description=data['description'], group_id=data['group_id'],blog_id=i)
        db.session.add(category_admin)

    db.session.commit()



    #내용 수정 


    

    return jsonify({"id": 'new_blog_id'})

@categories.route('/load_all_category',methods=["GET"])
def load_all_category():
    #[{category:{id, title,description}, blog:[{},{}]}, ]
    # group_ids =  Category_admin.query.group_by(Category_admin.group_id).all()
    # print('group_ids',group_ids)

    # final_data = []
    # for i in group_ids:
    #     serialized_data = i.short_serialize
    #     blogData=[]
    #     print(i.blog)


    #     serialized_data['blog'] = blogData
    #     final_data.append(serialized_data)


    # for i in group_ids:
    #     serialized_data = i.short_serialize
    #     blogData=[]
    #     for j in i

    #     serialized_data['blog'] = blogData
    #     final_data.append(serialized_data)

    group_ids =  Category_admin.query.group_by(Category_admin.group_id).all()
    print('group_ids',group_ids)
    group_ids_list= [] # [1,2,3]
    for i in group_ids: # list 
        group_ids_list.append(i.serialize['group_id'])

    final_data = []
    for i in group_ids_list:
        category_admins= Category_admin.query.filter_by(group_id = i) #list 
        send_data = []
        for i in category_admins:#[]
            serialized_category = i.serialize
            serialized_category['blog'] = i.blog.serialize
            i.serialize['new'] = []
            send_data.append(serialized_category) 
        final_data.append(send_data)



    return jsonify({"all_categories":final_data})
    
