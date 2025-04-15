from api import db
from api.Blog.Like.like_model import PostLike
from api.Blog.blog_model import Blog
from flask import Blueprint,jsonify,request
from flask_jwt_extended import jwt_required


likes= Blueprint('likes',__name__)


@likes.route('/like', methods=["POST"])#/<action>
@jwt_required
def like_action(): #post_id, user_id
    data = request.get_json()
    print('data   ',data)

    # username = request.args.get('user_id') #None

    user_id = data['user_id']
    post_id = data['post_id']
    action = data['action']
   
    
    post = Blog.query.filter_by(id=post_id).first_or_404()

    print('post',post)
    if action == 'like':
        like_post(post,user_id)
        message = '좋아요'
        db.session.commit()
    elif action == 'unlike':
        unlike_post(post,user_id)
        message = '좋아요 취소'
        db.session.commit()

    return  jsonify({"message": message})



def like_post(post,user_id):
    if not has_liked_post(post,user_id): # 그 전에 좋아요하지 않았다면  --> 좋아요 
        like = PostLike(user_id=user_id, blog_id=post.id)
        db.session.add(like) 



def unlike_post(post,user_id):
    if has_liked_post(post, user_id): # 그 전에 좋아요 했다면 --> 이제 좋아요 취소 
        PostLike.query.filter_by(
            user_id=user_id,
            blog_id=post.id).delete()  
        #update 0 


def has_liked_post(post,user_id):
    return PostLike.query.filter(
        PostLike.user_id == user_id,
        PostLike.blog_id == post.id
        ).count() > 0  #  PostLike.like_chk == 1

        #0

@likes.route('/has_liked_post',methods=["POST"])
def like_check():
    data = request.get_json()
    print('data',data)
    user_id = data['user_id']
    post_id = data['post_id']

    like_chk = PostLike.query.filter(
        PostLike.user_id == user_id,
        PostLike.blog_id == post_id
        ).count() > 0

    print('like_chk',like_chk)

    return jsonify({"like_chk":like_chk})

@likes.route('/count_like/<int:post_id>',methods=["GET"])
def count_like(post_id):
    # post_id = request.args.get("blog_id")
    print('blog_id    ',post_id)
    like_counts = PostLike.query.filter(
        PostLike.blog_id == post_id
    ).count()

    return jsonify({"like_counts":like_counts})
