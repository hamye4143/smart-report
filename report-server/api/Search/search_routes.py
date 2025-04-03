from flask import Blueprint,request,jsonify,make_response
from flask_jwt_extended import jwt_required
from api import db
from datetime import date
from sqlalchemy.sql import func
from datetime import datetime, timedelta
from sqlalchemy import and_
from sqlalchemy import distinct
from api.Search.search_model import SearchKeyword
from api.Blog.blog_model import Blog

search=Blueprint('search', __name__)


@search.route('/searchTopKeyword', methods=["GET"])
def searchTopKeyword():
    result  = db.session.execute("SELECT count(*) as count, sek_keyword FROM search_keyword group by sek_keyword ORDER BY count desc limit 5")
    labelsList =[]
    seriesList = []
    for i in result:
        labelsList.append(i.sek_keyword)
        seriesList.append(i.count)
    
    return jsonify({'labelsList':labelsList, 'seriesList':seriesList})


#서치 바 오토 컴플리트
@search.route('/searchBar/<string:word>', methods=["GET"])
def searchBar(word):

    blogs= Blog.query.filter(Blog.title.like(f'%{word}%')).order_by(Blog.id.desc()).all()
    print('blogs',blogs)
    users = []

    users = [
        { 'id': 1, 'name': 'Windstorm' },
        { 'id': 2, 'name': 'Bombasto' },
        { 'id': 3, 'name': 'Magneta' },
        { 'id': 4, 'name': 'Tornado' },
        { 'id': 5, 'name': 'Agnosto' }
    ]

    data = {
        'total': len(users),
        'results': users
    }
    return jsonify(data)

