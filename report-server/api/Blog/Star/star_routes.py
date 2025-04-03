from api import db
from api.Blog.Star.star_model import Star
from api.Blog.blog_model import Blog
from flask import Blueprint,jsonify,request
from flask_jwt_extended import jwt_required
from sqlalchemy.sql import func


stars= Blueprint('stars',__name__)

@stars.route('/star_rating',methods=["POST"])
@jwt_required
def star_rating(): # 별점 매기기
    data = request.get_json()
    print('star_data',data)

    blog_id = data["blog_id"]
    user_id = data["user_id"]
    star_value = data["star_value"]
    #Blog model star 컬럼 변경

    row = Star.query.filter(Star.user_id == user_id, Star.blog_id ==blog_id).first() # 해당 열이 있는지 확인

    if row ==None: # 추가 
        new_star=Star(star_value=star_value,blog_id=blog_id,user_id=user_id)
        db.session.add(new_star)
    else: # 수정 
        row.star_value = star_value

    db.session.commit()

    dk = get_star_avg(blog_id)
    print('dkdkdk',dk)

    blog = Blog.query.filter_by(id=blog_id).first()
    blog.star = dk
    db.session.commit()
    return jsonify({"message": "별점이 등록되었습니다."})


@stars.route('/get_star_value/<int:blog_id>',methods=["GET"])
def get_star_value(blog_id):
    print('get',blog_id)
    #star = get_star_avg(blog_id)
    star = Blog.query.filter_by(id=blog_id).first().star

    return jsonify({"star_average_value": star})


@stars.route('/has_rated_star',methods=["POST"])
def rate_check():
    data = request.get_json()
    print('data',data)
    user_id = data['user_id']
    blog_id = data['blog_id']

    star_chk = Star.query.filter(
        Star.user_id == user_id,
        Star.blog_id == blog_id
        ).first()

    if star_chk != None:
        star_chk = star_chk.star_value
    print('star_chk',star_chk)

    return jsonify({"star_chk":star_chk})



def get_star_avg(blog_id):
    star = Star.query.with_entities(func.avg(Star.star_value).label('average')).filter_by(blog_id=blog_id).first()[0]
    
    if star !=None:
        star = round(star, 2)
    else:
        star = 0

    return star