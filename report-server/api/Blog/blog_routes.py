import json
import os
from uuid import uuid4

from flask import Blueprint, request, jsonify, send_from_directory
from flask_jwt_extended import jwt_required
from sqlalchemy import or_
from werkzeug.utils import secure_filename

from api import db
from api.Blog.Category.category_model import Category
from api.Blog.Comment.comment_model import Comment
from api.Blog.Star.star_routes import get_star_avg
from api.Blog.blog_model import Blog
from api.Blog_File.download_table import DownloadTable
from api.File.file_model import File
from api.Tag.tag_model import Tag

blogs = Blueprint('blogs', __name__)


@blogs.route("/ping", methods=["GET"])
def ping():
    return {"message": "pong"}


@blogs.route('/search_blogs/<string:contents>', methods=["GET"])
def search_blogs(contents):
    results = Blog.query.filter(or_(
        Blog.content.like(f'%{contents}%'),
        Blog.title.like(f'%{contents}%')
    )).order_by(Blog.id.desc()).all()

    serialized_data = []
    for result in results:
        serialized_user = result.new_author.serialize
        serialized_blog = result.serialize
        serialized_blog['author'] = serialized_user
        serialized_data.append(serialized_blog)

    return jsonify({"search_blogs": serialized_data})


@blogs.route('/blogs', methods=["GET"])
def get_all_blogs():
    blogs = Blog.query.order_by(Blog.id.desc()).all()
    serialized_data = []
    for blog in blogs:
        serialized_user = blog.new_author.serialize
        serialized_blog = blog.serialize
        serialized_blog['author'] = serialized_user
        serialized_data.append(serialized_blog)

    return jsonify({"all_blogs": serialized_data})


@blogs.route('/blog/<int:id>', methods=["GET"])
def get_single_blog(id):
    blog = Blog.query.filter_by(id=id).first_or_404()
    blog.view_count += 1
    blog.star = get_star_avg(blog.id)
    db.session.commit()

    serialized_user = blog.new_author.serialize
    serialized_blog = blog.serialize
    serialized_blog["author"] = serialized_user
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
    comments = Comment.query.filter(Comment.blog_id == id).order_by(Comment.groupNum).all()
    for comment in comments:
        new_comment = comment.serialize
        new_comment["author"] = comment.author.serialize
        serialized_blog["comments"].append(new_comment)

    return jsonify({"single_blog": serialized_blog})


@blogs.route('/delete_blog/<int:id>', methods=["DELETE"])
@jwt_required
def delete_blog(id):
    path = os.getcwd()
    UPLOAD_FOLDER = os.path.join(path, 'uploads')

    blog = Blog.query.filter_by(id=id).first()
    removePrevFiles = File.query.filter(File.blog_id == id).all()

    for file in removePrevFiles:
        file_path = os.path.join(UPLOAD_FOLDER, file.new_name)
        if os.path.exists(file_path):
            os.remove(file_path)
        db.session.delete(file)

    db.session.delete(blog)
    db.session.commit()

    return jsonify("Blog was deleted"), 200


@blogs.route('/update_blog/<int:id>', methods=["PUT"])
@jwt_required
def update_blog(id):
    path = os.getcwd()
    UPLOAD_FOLDER = os.path.join(path, 'uploads')

    data = request.form.to_dict()
    blog = Blog.query.filter_by(id=id).first_or_404()
    blog.title = data['title']
    blog.content = data['content']
    data['tags'] = json.loads(data['tags'])
    data["user"] = json.loads(data["user"])

    category = json.loads(data["category"])
    if category:
        prevCategories = Category.query.filter(Category.blog_id == id).all()
        for prevcategory in prevCategories:
            db.session.delete(prevcategory)
        for i in category:
            new_category = Category(blog_id=id, code_id=i['Id'], code_name=i['Name'])
            db.session.add(new_category)

    removedPrevFileIdList = json.loads(data['removedPrevFileIdList'])
    removePrevFiles = File.query.filter(File.id.in_(removedPrevFileIdList)).all()

    for file in removePrevFiles:
        file_path = os.path.join(UPLOAD_FOLDER, file.new_name)
        if os.path.exists(file_path):
            os.remove(file_path)
        db.session.delete(file)
    db.session.commit()

    uploaded_files = request.files.getlist("fileUpload")
    if len(uploaded_files) != 0:
        for file in uploaded_files:
            origin_name = file.filename
            extension = os.path.splitext(file.filename)[1]
            f_name = str(uuid4()) + extension
            filename = secure_filename(f_name)
            file.save(os.path.join(UPLOAD_FOLDER, filename))
            new_file = File(
                origin_name=origin_name,
                new_name=filename,
                path=UPLOAD_FOLDER + '/' + filename,
                type=file.content_type,
                blog_id=id,
                author_id=data["user"]["id"]
            )
            db.session.add(new_file)

    blog.tags = []
    for tag in data["tags"]:
        present_tag = Tag.query.filter_by(name=tag).first()
        if present_tag:
            present_tag.blogs_associated.append(blog)
        else:
            new_tag = Tag(name=tag)
            new_tag.blogs_associated.append(blog)
            db.session.add(new_tag)

    db.session.commit()
    return jsonify({"blog_id": id})


@blogs.route('/add_blog', methods=["POST"])
@jwt_required
def create_blog():
    data = request.form.to_dict()
    data['tags'] = json.loads(data['tags'])
    uploaded_files = request.files.getlist("fileUpload")
    data["user"] = json.loads(data["user"])

    path = os.getcwd()
    UPLOAD_FOLDER = os.path.join(path, 'uploads')

    new_blog = Blog(
        title=data["title"],
        content=data["content"],
        feature_image=data["feature_image"],
        author_id=data["user"]["id"]
    )

    for tag in data['tags']:
        present_tag = Tag.query.filter_by(name=tag).first()
        if present_tag:
            present_tag.blogs_associated.append(new_blog)
        else:
            new_tag = Tag(name=tag)
            new_tag.blogs_associated.append(new_blog)
            db.session.add(new_tag)

    db.session.add(new_blog)
    db.session.commit()
    new_blog_id = new_blog.id

    category = json.loads(data["category"])
    for i in category:
        new_category = Category(blog_id=new_blog_id, code_id=i['Id'], code_name=i['Name'])
        db.session.add(new_category)

    if len(uploaded_files) != 0:
        for file in uploaded_files:
            origin_name = file.filename
            extension = os.path.splitext(file.filename)[1]
            f_name = str(uuid4()) + extension
            filename = secure_filename(f_name)
            file.save(os.path.join(UPLOAD_FOLDER, filename))
            new_file = File(
                origin_name=origin_name,
                new_name=filename,
                path=UPLOAD_FOLDER + '/' + filename,
                type=file.content_type,
                blog_id=new_blog_id,
                author_id=data["user"]["id"]
            )
            db.session.add(new_file)

    db.session.commit()
    return jsonify({"id": new_blog_id})


@blogs.route('/downloadfile', methods=["POST"])
def download_single_file():
    data = request.get_json()
    user_id = data["user_id"]
    file_id = data["file_id"]
    filename = data["filename"]

    path = os.getcwd()
    UPLOAD_FOLDER = os.path.join(path, 'uploads')

    file_ = File.query.filter_by(new_name=filename).first()
    file_.download_cnt += 1
    file_id = file_.id

    row = DownloadTable.query.filter_by(user_id=user_id, file_id=file_id).first()
    if row is None:
        new_download_data = DownloadTable(user_id=user_id, file_id=file_id)
        db.session.add(new_download_data)
    else:
        row.cnt += 1

    db.session.commit()
    return send_from_directory(directory=UPLOAD_FOLDER, filename=filename, as_attachment=True)


@blogs.route('/add_comment', methods=["POST"])
@jwt_required
def create_comment():
    data = request.get_json()
    new_comment = Comment(
        content=data["content"],
        blog_id=data["blog_id"],
        user_id=data["user_id"],
        class_=0,
        order=0
    )
    db.session.add(new_comment)
    db.session.commit()
    new_comment.groupNum = new_comment.id
    db.session.commit()
    return jsonify({"id": new_comment.serialize})


@blogs.route('/add_recomment', methods=["POST"])
@jwt_required
def create_recomment():
    data = request.get_json()
    groupNum = data["groupNum"]
    row = Comment.query.filter(
        Comment.blog_id == data["blog_id"],
        Comment.groupNum == groupNum
    ).order_by(Comment.order.desc()).first()
    new_order = row.order + 1

    new_comment = Comment(
        content=data["content"],
        blog_id=data["blog_id"],
        user_id=data["user_id"],
        class_=1,
        order=new_order,
        groupNum=groupNum
    )
    db.session.add(new_comment)
    db.session.commit()
    return jsonify({"id": "id"})


@blogs.route('/get_all_comments/<int:blogId>', methods=["GET"])
def get_all_comments(blogId):
    comments = Comment.query.filter(Comment.blog_id == blogId).order_by(Comment.groupNum).all()
    data = []
    for comment in comments:
        new_comment = comment.serialize
        new_comment["author"] = comment.author.serialize
        data.append(new_comment)
    return jsonify({"data": data})


@blogs.route('/update_comment/<int:commentId>', methods=["PUT"])
@jwt_required
def update_comment(commentId):
    data = request.get_json()
    comment = Comment.query.filter_by(id=commentId).first_or_404()
    comment.content = data['content']
    db.session.commit()
    return jsonify({"data": "data"})


@blogs.route('/delete_comment/<int:commentId>', methods=["DELETE"])
@jwt_required
def delete_comment(commentId):
    comment = Comment.query.filter_by(id=commentId).first_or_404()
    db.session.delete(comment)
    db.session.commit()
    return jsonify({"data": "data"})
