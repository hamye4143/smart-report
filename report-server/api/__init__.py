from flask import Flask,jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import click
from flask.cli import with_appcontext
from flask_jwt_extended import JWTManager
from werkzeug.security import generate_password_hash
import os 
import datetime
from pytz import timezone

db = SQLAlchemy()

MY_CONSTANT=42



def create_app():
    app = Flask(__name__)
    # error = ErrorHandler(app, dispatcher='urlprefix')

    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///flaskdatabase.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)
    app.config['JWT_SECRET_KEY']='MY_SECRET_KEY'
    jwt=JWTManager(app)

    #email
    app.config['MAIL_SERVER']='smtp.gmail.com'
    app.config['MAIL_PORT'] = 465
    app.config['MAIL_USERNAME'] = 'xxx@gmail.com'
    app.config['MAIL_PASSWORD'] = 'MY Password'
    app.config['MAIL_USE_TLS'] = False
    app.config['MAIL_USE_SSL'] = True


    #korea time 
    KST = datetime.datetime.now(timezone('Asia/Seoul'))
    #print('KST',KST)
    
    # file upload
    app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
    # Get current path
    path = os.getcwd()
    # file Upload
    UPLOAD_FOLDER = os.path.join(path, 'uploads')
    # Make directory if uploads is not exists
    if not os.path.isdir(UPLOAD_FOLDER):
        os.mkdir(UPLOAD_FOLDER)

    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
    # Allowed extension you can set your own
    #ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])

    CORS(app)


    from api.Blog.blog_routes import blogs
    app.register_blueprint(blogs) #분리하기 위해 

    from api.Category_admin.category_admin_model import Category_admin
    from api.Category_admin.category_admin_routes import categories
    app.register_blueprint(categories)

    from api.Blog.Like.like_model import PostLike
    from api.Blog.Like.like_routes import likes
    app.register_blueprint(likes) 
    
    from api.Blog.Star.star_model import Star    
    from api.Blog.Star.star_routes import stars
    app.register_blueprint(stars)

    from api.Email.email_model import Email
    from api.Email.email_model import Email_File
    from api.Email.email_routes import email
    app.register_blueprint(email)

    from api.Blog.Comment.comment_model import Comment

    from api.Blog_File.download_table import DownloadTable
    from api.Blog_File.download_routes import blogFiles
    app.register_blueprint(blogFiles)
    

    from api.User.user_model import User

    from api.User.user_route import myinfo
    app.register_blueprint(myinfo)


    from api.Signup.signup_route import signup
    app.register_blueprint(signup)

    from api.Login.login_route import login
    app.register_blueprint(login)

    from api.Tag.tag_model import Tag

    from api.File.file_model import File
    from api.File.file_routes import files
    app.register_blueprint(files)

    from api.Blog.Category.category_model import Category

    from api.Blog.Category.category_set_model import Category_setting
    
    from api.Blog.Category.sort_model import Sort_model, Sort_model_relation
    
    from api.Blog.Category.sort_routes import sorts 
    app.register_blueprint(sorts)

    from api.Code.code_model import Code_table, Code_detail_table

    from api.Code.code_routes import codes 
    app.register_blueprint(codes)

    from api.User.Visitor.visitor_model import Visitor
    from api.User.Visitor.visitor_route import visitor
    app.register_blueprint(visitor) 


    from api.Search.search_model import SearchKeyword
    from api.Search.search_routes import search
    app.register_blueprint(search)

    from api.Question.question_model import Question
    from api.Question.question_routes import questions
    app.register_blueprint(questions)

    from api.Main_admin.main_admin_model import MainAdmin
    from api.Main_admin.main_admin_routes import main_categories
    app.register_blueprint(main_categories) 

    from api.Answer.answer_model import Answer

    from api.Error.error_routes import errors
    app.register_blueprint(errors)

    @jwt.expired_token_loader
    def jwtExpired(expired_token):
        state = "로그인을 해주세요."
        return state,401



    @click.command(name='create_admin')   
    @with_appcontext
    def create_admin():

        admin=User(email="123@naver.com",password="123", name="제니", is_admin='Y') # admin
        admin.password = generate_password_hash(admin.password,'sha256',salt_length=12)
        db.session.add(admin)
        
        #그 전 카테고리 지우기 
        Code_detail_table.query.delete() 
        Code_table.query.delete()
        db.session.commit()

        db.session.add_all([
            Code_table(code="lv1",code_name="대분류",detail="대분류입니다."), # id = 1 
            Code_table(code="lv2",code_name="중분류",detail="중분류입니다."), # id = 2
            Code_table(code="lv3",code_name="소분류",detail="소분류입니다."), # id = 3
            Code_detail_table(group_code_id=1, code="all",code_name="전체", parent_group_code_id=0,parent_id=0, order=1,detail="전체"), #1
        ])

  
        db.session.commit()
        

    app.cli.add_command(create_admin)

    

    return app 


