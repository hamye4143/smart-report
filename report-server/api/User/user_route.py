from flask import Blueprint,request,jsonify
from api.User.user_model import User
from api.File.file_model import File
from api.Blog.blog_model import Blog
from flask_jwt_extended import create_access_token
from werkzeug.security import check_password_hash 
from api.Blog_File.download_table import DownloadTable
from api.Blog.Like.like_model import PostLike
from flask_jwt_extended import jwt_required
from api import db
from werkzeug.security import generate_password_hash


myinfo=Blueprint('myinfo', __name__)

@myinfo.route('/myinfo/<int:id>', methods=["GET"])
@jwt_required
def get_user(id):
    user = User.query.filter_by(id=id).first_or_404() # 글쓴이 찾기 
    serialized_user = user.serialize 
    print('serialized_user',serialized_user)

    return jsonify({"serialized_user": serialized_user}) 


@myinfo.route('/myinfo_list/<int:id>', methods=["GET"])
@jwt_required
def get_list(id):
    user = User.query.filter_by(id=id).first_or_404() # 글쓴이 찾기 
    print(user.blog_associated_users)

    serialized_data = []
    for user in user.blog_associated_users:
        
        serialized_data.append(user.serialize)
        

    return jsonify({"serialized_data":serialized_data})

    
@myinfo.route('/myinfo/downloads/<int:user_id>', methods=["GET"])
@jwt_required
def get_downloads(user_id):
    all_downloads = DownloadTable.query.filter_by(user_id= user_id).order_by(DownloadTable.created_at.desc()).all()
    print('all_downloads',all_downloads)
    serialized_data = []
    for i in all_downloads:

        file = File.query.filter_by(id= i.file_id).first()
        file_serialized = file.serialize
        file_serialized['download_time'] = i.created_at
        file_serialized['cnt'] = i.cnt
        
        serialized_data.append(file_serialized)

    return jsonify({"download_files":serialized_data})


@myinfo.route('/myinfo/likelist/<int:user_id>', methods=["GET"])
def get_my_likelist(user_id):
    likes_post = PostLike.query.filter_by(user_id= user_id).order_by(PostLike.id.desc()).all()
    print('likes_post',likes_post)
    blog_id_list = []
    for post in likes_post:
        # likes_post = PostLike.query.filter_by(user_id= user_id).order_by(PostLike.id.desc()).all()
        print(post.blog_id)
        blog_id_list.append(post.blog_id)

    results= Blog.query.filter(Blog.id.in_(blog_id_list)).all()
    result_list = []
    for result in results:
        # print(i.serialize)
        result_list.append(result.serialize)


    return jsonify({"likes_blog":result_list})


@myinfo.route('/change_info/<int:id>', methods=["PUT"])
@jwt_required
def change_info(id):
    data = request.get_json()
    user=User.query.filter_by(id=id).first_or_404() 
    if check_password_hash(user.password,data["currentPassword"]):
        user.password = generate_password_hash(data["newPassword"],'sha256',salt_length=12)
        db.session.commit()
        return jsonify("비번 변경함")
    else: # 비밀번호가 틀렸습니다.
        return "현재 비밀번호가 맞지않습니다.",400
        



    


@myinfo.route('/change_name/<int:id>', methods=["PUT"])
@jwt_required
def change_name(id):

    data = request.get_json()
    user=User.query.filter_by(id=id).first_or_404() 
    user.name = data['newName']
    db.session.commit()
    return jsonify("아이디 변경함")
        