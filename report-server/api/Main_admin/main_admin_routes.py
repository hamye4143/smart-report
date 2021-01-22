
from api import db
from api.Main_admin.main_admin_model import MainAdmin
from api.Main_admin_blog.main_admin_blog_table import main_blogs

from api.Blog.blog_model import Blog

from flask import Blueprint,request,jsonify,make_response
from flask_jwt_extended import jwt_required

main_categories= Blueprint('main_categories',__name__)


@main_categories.route('/createMainCategory', methods=["POST"])
@jwt_required
def createMainCategory(): # 전체 저장 

    post = db.session.query(MainAdmin).all()
    for i in post:
        i.blogs= []
    db.session.commit()


    

    # 전 내용 삭제
    MainAdmin.query.delete() 

    db.session.commit()

    data = request.get_json()
    for i in data:
        maindmin = MainAdmin(title=i['title'],description= i['description'])
        db.session.add(maindmin)
        db.session.commit()
        
        for k in i['blogs']:
            print(k) 
            presentBlog=Blog.query.filter_by(id=k['id']).first()
            presentBlog.mains_associated.append(maindmin)
            print('presentBlog',presentBlog)

    db.session.commit()

    return jsonify({"id": 'new_blog_id'})



@main_categories.route('/loadAllMain',methods=["GET"])
def loadAllMain():

    maindamins = MainAdmin.query.all()
    print(maindamins)

    serializedData=[]
    for i in maindamins:
        data = i.serialize
        data['blogs']=[]
        for j in i.blogs:
            print(j.content)
            data['blogs'].append(j.short_serialize)
            
        serializedData.append(data)

        

    return jsonify({"all_categories":serializedData})
    




