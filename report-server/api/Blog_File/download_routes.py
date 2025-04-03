from api import db
from api.Blog_File.download_table import DownloadTable
from api.File.file_model import File
from flask import Blueprint,jsonify,request
from flask_jwt_extended import jwt_required
from sqlalchemy.sql import func
from datetime import date
from sqlalchemy.sql.expression import bindparam
from sqlalchemy import Interval
from datetime import datetime, timedelta
from api.Blog.blog_model import Blog
import datetime


blogFiles= Blueprint('blogfiles',__name__)


@blogFiles.route('/getTopTenDownloadedFile/<int:type_>',methods=["GET"])
#
def GetTopTenDownloadedFiles(type_):
    today = date.today()
    list_ = []
    if type_ == 1: # 이번주간 다운로드 파일 탑텐 
        #이번주 시작일 : 월요일 : 23일(고정) + 6일까지
        thisWeekMonday = today - timedelta(days = today.weekday())
        print('monday',thisWeekMonday)
        stmt = db.session.query(DownloadTable.file_id).filter(DownloadTable.created_at <= thisWeekMonday + timedelta(days=6) ).subquery()

        
        for b,f in db.session.query(Blog,File).join(stmt, File.id == stmt.c.file_id).order_by(File.download_cnt.desc()).filter(File.blog_id == Blog.id).limit(10):
            data = ["",""]
            data[0]= b.serialize
            data[1]= f.serialize
            list_.append(data)   
            print(list_)         
        


    else: #월간 2020-11월 달 다운로드 파일 탑 텐

        thisYearMonth = str(today.year)+'-'+str(today.month)
        #다운로드
        #11 월 것 리스트 
        row = db.session.query(DownloadTable).filter(func.strftime("%Y-%m", DownloadTable.created_at) == thisYearMonth).all() 
        print('row',row)
        stmt = db.session.query(DownloadTable.file_id).filter(func.strftime("%Y-%m",DownloadTable.created_at) == thisYearMonth ).subquery()
        #월간 
        
        # for f in db.session.query(File).join(stmt, File.id == stmt.c.file_id).order_by(File.download_cnt.desc()).limit(10):
        #     print(f.id) 
        for b,f in db.session.query(Blog,File).join(stmt, File.id == stmt.c.file_id).order_by(File.download_cnt.desc()).filter(File.blog_id == Blog.id).limit(10):
            data = ["",""]
            data[0]= b.serialize
            data[1]= f.serialize
            list_.append(data)   
            print(list_)         
        


        

    return jsonify({"serializedResult":list_})
         




    