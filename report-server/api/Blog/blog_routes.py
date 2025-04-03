from flask import Blueprint,request,jsonify,make_response
from flask_jwt_extended import jwt_required
from api import db
from api.Blog.blog_model import Blog
from api.Blog.Comment.comment_model import Comment
from api.Blog.Category.category_model import Category
from api.Blog.Star.star_routes import get_star_avg
from api.File.file_model import File
from api.Blog_File.download_table import DownloadTable
from api.Tag.tag_model import Tag
from sqlalchemy import or_
from api.User.user_model import User
import os
from werkzeug.utils import secure_filename
from api import MY_CONSTANT,create_app
import json
from uuid import uuid4
from flask import send_from_directory
from sqlalchemy import and_

blogs= Blueprint('blogs',__name__)



@blogs.route('/search_blogs/<string:contents>', methods=["GET"])




# @jwt_required
def search_blogs(contents):
    
    #contents 와 title
    results = Blog.query.filter(or_(Blog.content.like(f'%{contents}%'),Blog.title.like(f'%{contents}%'))).order_by(Blog.id.desc()).all()
    
    serialized_data = []
    for result in results:
        # user = User.query.filter_by(id=result.author_id).first_or_404() # 해당 user 찾기 
        #serialized_user = user.serialize

        serialized_user = result.new_author.serialize


        serialized_blog = result.serialize
        serialized_blog['author'] = serialized_user
        serialized_data.append(serialized_blog)
        



        
    return jsonify({"search_blogs": serialized_data})


@blogs.route('/blogs',methods=["GET"])
def get_all_blogs():
    blogs= Blog.query.order_by(Blog.id.desc()).all() #내림차순 
    

    serialized_data = []
    for blog in blogs:

        #user = User.query.filter_by(id=blog.author_id).first_or_404() # 해당 user 찾기 
        #serialized_user = user.serialize

        serialized_user = blog.new_author.serialize
        serialized_blog = blog.serialize 
        serialized_blog['author'] = serialized_user
        # serialized_blog['author'] = serialized_user
                

        serialized_data.append(serialized_blog)

    return jsonify({"all_blogs": serialized_data})

@blogs.route('/blog/<int:id>',methods=["GET"])
def get_single_blog(id):


    blog = Blog.query.filter_by(id=id).first_or_404()

    #조회수 =+ 1 / 아이디 당 한번씩 
    blog.view_count += 1 
    blog.star = get_star_avg(blog.id)

    db.session.commit()


    serialized_user = blog.new_author.serialize

    serialized_blog = blog.serialize
    serialized_blog["author"]= serialized_user
    serialized_blog["tags"] = []
    serialized_blog["files"] = []
    serialized_blog["comments"] = []
    serialized_blog["category"] = []
    
    
    for category in blog.category:
        serialized_blog["category"].append(category.serialize)

    for tag in blog.tags:
        serialized_blog["tags"].append(tag.serialize)

    for file in blog.files:
        serialized_blog["files"].append(file.serialize)

    #SELECT * FROM comment order by groupNum desc;
    comments = Comment.query.filter(Comment.blog_id==id).order_by(Comment.groupNum).all()

    for comment in comments:

        new_comment = comment.serialize
        new_comment["author"] = comment.author.serialize
        serialized_blog["comments"].append(new_comment)

    return jsonify({"single_blog": serialized_blog})    

@blogs.route('/delete_blog/<int:id>', methods=["DELETE"])
@jwt_required
def delete_blog(id):
    #file 저장 설정 
    path = os.getcwd()
    UPLOAD_FOLDER = os.path.join(path, 'uploads')

    blog = Blog.query.filter_by(id=id).first()
    
    #파일 삭제 
    removePrevFiles = File.query.filter(File.blog_id == id).all() # 제거될 파일들 

    for file in removePrevFiles:
        os.remove(os.path.join(UPLOAD_FOLDER, file.new_name))
    db.session.delete(blog)
    db.session.commit()

    

    return jsonify("Blog was deleted"),200

@blogs.route('/update_blog/<int:id>', methods=["PUT"])
@jwt_required
def update_blog(id):

    #file 저장 설정 
    path = os.getcwd()
    UPLOAD_FOLDER = os.path.join(path, 'uploads')


    data = request.form.to_dict()
    blog=Blog.query.filter_by(id=id).first_or_404() #해당 블로그 검색 
    blog.title = data['title'] # 제목 
    blog.content = data['content'] #내용
    data['tags'] = json.loads(data['tags']) #태그들
    data["user"] = json.loads(data["user"]) # 유저 (새 파일 업로드)
    #새로운 category 설정 
    category = json.loads(data["category"]) 
    if category: # 새롭게 건들였다면
        #전 삭제
        prevCategories=Category.query.filter(Category.blog_id==id).all()
        for prevcategory in prevCategories:
            db.session.delete(prevcategory)

        # 새 카테고리 추가
        for i in category: 
            category = Category(blog_id=id,code_id=i['Id'],code_name=i['Name'])
            db.session.add(category)




        

    removedPrevFileIdList= json.loads(data['removedPrevFileIdList']) 
    removePrevFiles = File.query.filter(File.id.in_(removedPrevFileIdList)).all() # 제거될 파일들 
    
    #기존에 제거될 파일들 삭제  & 폴더에서도 파일 삭제 
    for file in removePrevFiles:
        os.remove(os.path.join(UPLOAD_FOLDER, file.new_name))
        db.session.delete(file)
    db.session.commit()


    uploaded_files = request.files.getlist("fileUpload")#새로운 파일들
    #새 파일들 추가
    #파일 업로드 
    if len(uploaded_files) !=0 :
        for file in uploaded_files:
            #uuid 로 
            origin_name = file.filename #원래 파일 이름 
            extension = os.path.splitext(file.filename)[1] #확장자 (.jpg)
            f_name = str(uuid4())+ extension #새 이름
            #filename = secure_filename(file.filename) #서버내에서의 다른 경로 접근 제한
            filename =  secure_filename(f_name)       
            file.save(os.path.join(UPLOAD_FOLDER, filename))  
            new_file = File(origin_name= origin_name ,new_name=filename,path= UPLOAD_FOLDER + '/'+ filename ,type=file.content_type,blog_id=id,author_id=data["user"]["id"])        
            db.session.add(new_file)

    #태그 수정
    blog.tags = [] #init
    for tag in data["tags"]:
        present_tag = Tag.query.filter_by(name=tag).first()
        if (present_tag):            
            present_tag.blogs_associated.append(blog)#이 블로그를 추가시켜야함 

        else:
            new_tag = Tag(name=tag)
            new_tag.blogs_associated.append(blog)
            db.session.add(new_tag)


    db.session.commit()
    return jsonify({"blog_id": id})



@blogs.route('/add_blog',methods=["POST"])
@jwt_required
def create_blog():
    data = request.form.to_dict()

    data['tags'] = json.loads(data['tags'])
    uploaded_files = request.files.getlist("fileUpload")


    data["user"] = json.loads(data["user"])
    
    #file 저장 설정 
    path = os.getcwd()
    UPLOAD_FOLDER = os.path.join(path, 'uploads')
    # uploaded_files = request.files.getlist("fileUpload")

    new_blog=Blog(title=data["title"],content=data["content"],feature_image=data["feature_image"], author_id = data["user"]["id"])#author_id=data["user"]['id']

    for tag in data['tags']:

        present_tag=Tag.query.filter_by(name=tag).first()
        if(present_tag):
            present_tag.blogs_associated.append(new_blog) #  프로퍼티에 new_blog 추가한 거
        else:
            new_tag =Tag(name=tag)
            new_tag.blogs_associated.append(new_blog)
            db.session.add(new_tag)


    db.session.add(new_blog)
    db.session.commit()
    new_blog_id = getattr(new_blog, "id")

    #category 설정 
    category = json.loads(data["category"]) 
    for i in category:
        category = Category(blog_id=new_blog_id,code_id=i['Id'],code_name=i['Name'])
        db.session.add(category)


    #file upload 

    #uploaded_files
    if len(uploaded_files) !=0 :
        for file in uploaded_files:

            # #uuid 로 
            origin_name = file.filename #원래 파일 이름 
            extension = os.path.splitext(file.filename)[1] #확장자 (.jpg)
            f_name = str(uuid4())+ extension #새 이름


            #filename = secure_filename(file.filename) #서버내에서의 다른 경로 접근 제한
            filename =  secure_filename(f_name)

            print(file.mimetype)
            print(file.content_type)
            print(file.headers)

            
            file.save(os.path.join(UPLOAD_FOLDER, filename))
            
            new_file = File(origin_name= origin_name ,new_name=filename,path= UPLOAD_FOLDER + '/'+ filename ,type=file.content_type,blog_id=new_blog_id,author_id=data["user"]["id"])
            
            db.session.add(new_file)
            


    
    db.session.commit()

    return jsonify({"id": new_blog_id})
    

# @blogs.route('/downloadfile/<string:filename>',methods=["GET"])
@blogs.route('/downloadfile',methods=["POST"])
def download_single_file():#문제 : 한번 다운로드 받으면 여기 안옴


    data = request.get_json()
    user_id = data["user_id"]
    file_id = data["file_id"]
    filename = data["filename"]

    path = os.getcwd()
    
    UPLOAD_FOLDER = os.path.join(path, 'uploads')

    file_ = File.query.filter_by(new_name = filename).first()
    file_.download_cnt += 1
    file_id = file_.id
    

    row = DownloadTable.query.filter(DownloadTable.user_id ==user_id, DownloadTable.file_id ==file_id).first() # 해당 열이 있는지 확인



    if row == None: # 이 열이 없다면
        new_download_data = DownloadTable(user_id=user_id, file_id=file_id)
        db.session.add(new_download_data)
    else:  
        row.cnt += 1 

    db.session.commit()

    return send_from_directory(directory=UPLOAD_FOLDER, filename=filename, as_attachment=True)


#댓글
@blogs.route('/add_comment',methods=["POST"])
@jwt_required
def create_comment():
    data = request.get_json()
    new_comment=Comment(content=data["content"], blog_id= data["blog_id"], user_id = data["user_id"],class_= 0,order=0) #groupNum: 부모 댓글 인댁스
    db.session.add(new_comment)
    
    db.session.commit()
    new_comment.groupNum = new_comment.id
    db.session.commit()



    return jsonify({"id": new_comment.serialize})


#대댓글
@blogs.route('/add_recomment',methods=["POST"])
@jwt_required
def create_recomment():
    data = request.get_json()

    #대댓글 작성한 댓글의 인덱스 번호를 가져옴(그룹번호로 저장해야함)
    groupNum = data["groupNum"] # 임의 지정

    #저장하려는 대댓글이 첫 대댓글인지 확인하기위한 쿼리. 순서를 정해야하기때문
    row = Comment.query.filter(Comment.blog_id ==data["blog_id"], Comment.groupNum ==groupNum).order_by(Comment.order.desc()).first() # 해당 열이 있는지 확인
    #가장 마지막 대댓글 숫자에 +1을 추가해서 저장
    new_order = row.order+ 1 

    new_comment=Comment(content=data["content"], blog_id= data["blog_id"], user_id = data["user_id"],class_= 1,order=new_order, groupNum=groupNum) #groupNum: 부모 댓글 인댁스
    db.session.add(new_comment)
    db.session.commit()


    # new_comment=Comment(content=data["content"], blog_id= data["blog_id"], user_id = data["user_id"])
    # db.session.add(new_comment)
            
    # db.session.commit()
    return jsonify({"id":"id"})

    

#댓글 가져오기
@blogs.route('/get_all_comments/<int:blogId>',methods=["GET"])
def get_all_comments(blogId):

    comments = Comment.query.filter(Comment.blog_id==blogId).order_by(Comment.groupNum).all()
    
    data = []
    for comment in comments:
        new_comment = comment.serialize
        new_comment["author"] = comment.author.serialize
        data.append(new_comment)

        
    return jsonify({"data":data})

#댓글 수정
@blogs.route('/update_comment/<int:commentId>',methods=["PUT"])
@jwt_required
def update_comment(commentId):
    data = request.get_json()
    comment = Comment.query.filter_by(id=commentId).first_or_404()
    comment.content = data['content']
        
    db.session.commit()
    return jsonify({"data":"data"})

# 댓 삭
@blogs.route('/delete_comment/<int:commentId>',methods=["DELETE"])
@jwt_required
def delete_comment(commentId):

    comment = Comment.query.filter_by(id=commentId).first_or_404()
        
    db.session.delete(comment)
    db.session.commit()
    return jsonify({"data":"data"})
