from flask import Blueprint,request,jsonify,make_response
from flask_jwt_extended import jwt_required
from api import db
from api.Question.question_model import Question
from api.Answer.answer_model import Answer
from sqlalchemy import or_
from api.User.user_model import User
import json
import os
from uuid import uuid4
from werkzeug.utils import secure_filename
from flask import send_file
from datetime import datetime

questions= Blueprint('questions',__name__)


# @blogs.route('/blogs',methods=["GET"])
# def get_all_blogs():
#     blogs= Blog.query.order_by(Blog.id.desc()).all() #내림차순 
    

#     serialized_data = []
#     for blog in blogs:

#         #user = User.query.filter_by(id=blog.author_id).first_or_404() # 해당 user 찾기 
#         #serialized_user = user.serialize

#         serialized_user = blog.new_author.serialize
#         serialized_blog = blog.serialize 
#         print('serialized_user',serialized_user)
#         serialized_blog['author'] = serialized_user
#         # serialized_blog['author'] = serialized_user
                

#         serialized_data.append(serialized_blog)
#         print('serialized_blog',serialized_blog)

#     return jsonify({"all_blogs": serialized_data})

# @blogs.route('/blog/<int:id>',methods=["GET"])
# def get_single_blog(id):
#     blog = Blog.query.filter_by(id=id).first_or_404()

#     #굳이 이렇게 x 
#     # user = User.query.filter_by(id=blog.author_id).first_or_404() # 글쓴이 찾기 
#     # serialized_user = user.serialize

#     print('이 blog와 관련된 user 테이블 정보 보여줌: ', blog.new_author)
#     serialized_user = blog.new_author.serialize


#     serialized_blog = blog.serialize
#     serialized_blog["author"]= serialized_user
#     serialized_blog["tags"] = []

#     for tag in blog.tags:
#         serialized_blog["tags"].append(tag.serialize)


    
#     return jsonify({"single_blog": serialized_blog})    

# @blogs.route('/delete_blog/<int:id>', methods=["DELETE"])
# @jwt_required
# def delete_blog(id):
#     blog = Blog.query.filter_by(id=id).first()
#     db.session.delete(blog)
#     db.session.commit()

#     return jsonify("Blog was deleted"),200

# @blogs.route('/update_blog/<int:id>', methods=["PUT"])
# @jwt_required
# def update_blog(id):
#     data = request.get_json()
#     blog=Blog.query.filter_by(id=id).first_or_404() # 그 블로그 검색 
#     print('tags', data["tags"])
#     #내용 수정 
#     blog.title = data["title"]
#     blog.content=data["content"]
#     blog.feature_image=data["feature_image"]
#     print(blog.tags) # <Tag1>,<Tag2>,..잘 나옴

#     blog.tags = [] #init

#     for tag in data["tags"]:
#         present_tag = Tag.query.filter_by(name=tag).first()
#         if (present_tag):            
#             present_tag.blogs_associated.append(blog)#이 블로그를 추가시켜야함 

#         else:
#             new_tag = Tag(name=tag)
#             new_tag.blogs_associated.append(blog)
#             db.session.add(new_tag)
    
#     print(data)
    

#     updated_blog = blog.serialize

#     db.session.commit()
#     return jsonify({"blog_id": blog.id})

@questions.route('/getSingleQuestion/<int:id>',methods=["GET"])
def getSingleQuestion(id):
    question = Question.query.filter_by(id=id).first_or_404()
    print('question',question)
    #조회수 +1 
    question.viewCount +=1 
    db.session.commit()

    serializedQuestion = question.serialize
    serialized_user = question.author.serialize
    serializedQuestion["author"]= serialized_user
    serializedQuestion['answerCount'] = len(question.answers)

    return jsonify({"questionData": serializedQuestion})

@questions.route('/getAllQuestions',methods=["GET"])
def getAllQuestions():
    
    questions= Question.query.order_by(Question.id.desc()).all() #내림차순 

    serialized_data = []
    for question in questions:

        serialized_question = question.serialize 
        serialized_user = question.author.serialize

        serialized_question['author'] = serialized_user
        print('answers',question.answers)
        serialized_question['answerCounts'] = len(question.answers)
                

        serialized_data.append(serialized_question)

    return jsonify({"allQuestionData": serialized_data})


@questions.route('/addQuestion',methods=["POST"])
@jwt_required
def createQuestion():
    #file 저장 설정 
    path = os.getcwd()
    UPLOAD_FOLDER = os.path.join(path, 'uploads_q&a')

    data = request.form.to_dict()


    data["user"] = json.loads(data["user"])
    uploaded_file = request.files.get("fileUpload")
    
    origin_name = ""
    filename = ""
    path = ""
    type = ""

    print('uploaded_file',uploaded_file)
    if uploaded_file != None: 
        extension = os.path.splitext(uploaded_file.filename)[1] #확장자 (.jpg)
        f_name = str(uuid4())+ extension #새 이름
        origin_name = uploaded_file.filename #원래 파일 이름 
        filename =  secure_filename(f_name)

        uploaded_file.save(os.path.join(UPLOAD_FOLDER, filename))
    
    
        #path= UPLOAD_FOLDER + '/'+ filename 
        # path = 'http://localhost:5000/showImage/'+filename
        path = request.host_url.rstrip('/') + '/showImage/' + filename

        type=uploaded_file.content_type
    newQuestion=Question(title=data["title"],content=data["content"],author_id = data["user"]["id"], feature_image=origin_name,origin_name=origin_name ,new_name=filename,path=path ,type=type)
    print(newQuestion)

    db.session.add(newQuestion)
    db.session.commit()

    questionId = getattr(newQuestion, "id")
    return jsonify({"id": questionId})
    
    

######ANSWER

@questions.route('/addAnswer',methods=["POST"])
@jwt_required
def addAnswer():
    data = request.get_json()


    newAnswer=Answer(title=data["title"],content=data["content"], questionId = data['questionId'], userId = data["userId"])
    print(newAnswer)

    # if state ==1 : 상태를 2 로 변화 
    question = Question.query.filter_by(id=data['questionId']).first_or_404()
    if question.state == 1 : 
        question.state = 2

    db.session.add(newAnswer)
    db.session.commit()

    return jsonify({"id": "questionId"})

@questions.route('/getAllAnswers/<int:questionId>',methods=["GET"])
def getAllAnswers(questionId):
    
    # results = db.session.query(File).join(Blog).\
    # filter(func.strftime("%Y-%m-%d", Blog.created_at) == date2).\
    # order_by(Blog.id.desc()).paginate(1, 10, False)

    # answers= Answer.query.filter_by(questionId=questionId).order_by(Answer.id.desc()).all() #내림차순 
    
    #채택 된 답변 한개 제일 위, 후에 내림차순 
    answers = db.session.query(Answer,User).filter(Answer.userId == User.id).filter(Answer.questionId == questionId).order_by(Answer.selectedAnswer =='N').order_by(Answer.id.desc()).all()

    print('/answers',answers)
    serializedData = []
    for a,u in answers:
        answer = a.serialize
        answer['userName'] = u.name

        serializedData.append(answer)



    
    return jsonify({"serializedData": serializedData})


#채택
@questions.route('/checkAnswerSelected/<int:answerId>',methods=["GET"])
def checkAnswerSelected(answerId):
    #Answer
    answer= Answer.query.filter_by(id=answerId).first_or_404() 
    print(answer.selectedAnswer)
    answer.selectedAnswer = 'Y'

    #Question 
    question= Question.query.filter_by(id=answer.questionId).first_or_404() 

    question.state = 3 # 답변 완료 

    db.session.commit()

    
    return jsonify({"serializedData": "serializedData"})


@questions.route('/updateSingleAnswer/<int:answerId>',methods=["PUT"])
def updateSingleAnswer(answerId):
    #글, 내용 수정 
    data = request.get_json()
    print('data',data)
    
    answer=Answer.query.filter_by(id=answerId).first_or_404() 
    answer.title = data['title']
    answer.content = data['content']

    db.session.commit()
    return jsonify("수정했습니다.")


@questions.route('/deleteSingleAnswer/<int:answerId>',methods=["DELETE"])
def deleteSingleAnswer(answerId):

    answer=Answer.query.filter_by(id=answerId).first_or_404() 
    db.session.delete(answer)
    db.session.commit()


    return jsonify("삭제되었습니다."),200

@questions.route('/updateSingleQuestion/<int:id>',methods=["PUT"])
def updateSingleQuestion(id):
    #file 저장 설정 
    path = os.getcwd()
    UPLOAD_FOLDER = os.path.join(path, 'uploads_q&a')

    data = request.form.to_dict()
    print('data',data)

    uploaded_file = request.files.get("fileUpload")
    origin_name = ""
    filename = ""
    path = ""
    type = ""

    if uploaded_file != None:
        extension = os.path.splitext(uploaded_file.filename)[1] #확장자 (.jpg)
        f_name = str(uuid4())+ extension #새 이름
        origin_name = uploaded_file.filename #원래 파일 이름 
        filename =  secure_filename(f_name)
        uploaded_file.save(os.path.join(UPLOAD_FOLDER, filename))
        # path = 'http://localhost:5000/showImage/'+filename
        path = request.host_url.rstrip('/') + '/showImage/' + filename
        type= uploaded_file.content_type




    question=Question.query.filter_by(id=id).first_or_404() 
    question.title = data['title']
    question.content = data['content']
    question.feature_image = origin_name
    question.origin_name = origin_name
    question.new_name = filename
    question.path = path
    question.type = type
    question.updated_at = datetime.today()

    db.session.commit()








    return jsonify({"serializedData": "serializedData"})


@questions.route('/deleteSingleQuestion/<int:questionId>',methods=["DELETE"])
def deleteSingleQuestion(questionId):

    question = Question.query.filter_by(id=questionId).first()
    db.session.delete(question)
    db.session.commit()

    #파일 삭제 
    

    return jsonify("삭제되었습니다."),200

#이미지 localhost:5000 상에서 보여주기 
@questions.route('/showImage/<string:fileName>',methods=["GET"])
def showImage(fileName):
    path = os.getcwd()
    print(path)
    UPLOAD_FOLDER = os.path.join(path, 'uploads_q&a') # uploads or uploads_q&a

    return send_file(UPLOAD_FOLDER+'/'+fileName, mimetype='image/gif')




