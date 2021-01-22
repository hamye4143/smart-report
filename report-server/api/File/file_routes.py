from flask import Blueprint,request,jsonify,url_for
from api.Blog.blog_model import Blog
from api.Blog.Category.category_model import Category
from api.File.file_model import File
from api.User.user_model import User
from sqlalchemy import or_ 
from sqlalchemy import and_
from sqlalchemy.sql import text
from api import db
import datetime
from api.Search.search_model import SearchKeyword
from sqlalchemy.sql import func
from datetime import datetime
from pytz import timezone
from api.Code.code_model import Code_detail_table
import json
from flask_jwt_extended import jwt_required

KST = datetime.now(timezone('Asia/Seoul'))

files = Blueprint('files',__name__)

def sortByFunc(sortBy):

    orderByValue = ''
    if sortBy == 1 : 
        orderByValue =  getattr(Blog.id, 'desc')()
    elif sortBy == 2 :
        orderByValue = getattr(Blog.view_count, 'desc')()
    elif sortBy == 3:
        orderByValue = getattr(Blog.star, 'desc')()
    elif sortBy == 4:
        orderByValue = getattr(File.download_cnt, 'desc')()

    else:
        orderByValue =  getattr(Blog.id, 'desc')()

    return orderByValue

@jwt_required
@files.route('/search', methods=["GET"])
def searchFiles():
    
    keyword = request.args.get('kw') 
    page = request.args.get('page',type=int) 
    sortBy = request.args.get('sortBy',type=int) 
    row = request.args.get('row',type=int)
    it = request.args.get('i') 
    date = request.args.get('date') #추가하기 
    # op_starValue = request.args.get('op_starValue') 
    # print('dkssud',op_starValue)
    

    count = 0

    searchKeyword= SearchKeyword(sek_keyword=keyword,user_id=1)
    db.session.add(searchKeyword)
    db.session.commit()


    orderByValue = sortByFunc(sortBy)
    print('orderByValue',orderByValue)
    

    results = ""
    results2 = ""
    # 전체 검색일 때 
    if(it == None or it == '' or it =='all'): 

        results_query = db.session.query(File).join(Blog).join(User).\
        filter(or_(User.name.like(f'%{keyword}%'),Blog.content.like(f'%{keyword}%'),Blog.title.like(f'%{keyword}%'),File.origin_name.like(f'%{keyword}%'))).\
        order_by(orderByValue)

        results = results_query.paginate(page, row, False)
        print('results전체검색',results)

        results2 = results_query.all()       
        print('iasdfas',results2) 
        for i in results2:
            print('iasdfas',i)

    #제목만 검색일 때 
    elif (it =='title'):
        results_query = db.session.query(File).join(Blog).\
        filter(Blog.title.like(f'%{keyword}%')).\
        order_by(orderByValue)

        results = results_query.paginate(page, row, False)
        results2 = results_query.all()  

    #본문만 검색일 때
    elif (it =='content'): 
        results_query = db.session.query(File).join(Blog).\
        filter(Blog.content.like(f'%{keyword}%')).\
        order_by(orderByValue)

        results = results_query.paginate(page, row, False)
        results2 = results_query.all()        

    #글쓴이 검색일 때
    elif (it =='writer'): 
        user = User.query.filter(User.name.like(f'%{keyword}%')).all() # 해당 user 찾기 
        userIdList = []
        for u in user:
            userIdList.append(u.id)

        results_query = db.session.query(File).join(Blog).\
        filter(Blog.author_id.in_(userIdList)).\
        order_by(orderByValue)

        results = results_query.paginate(page, row, False)
        results2 = results_query.all()
        

    #파일 이름 검색일 때 
    elif (it =='fileName'):
        results_query = db.session.query(File).join(Blog).\
        filter(File.origin_name.like(f'%{keyword}%')).\
        order_by(orderByValue)

        results = results_query.paginate(page,row,False)
        results2 = results_query.all()

    else:
        results_query = db.session.query(File).join(Blog).\
        filter(Blog.title.like(f'%{keyword}%')).\
        order_by(orderByValue)     

        results = results_query.paginate(page,row,False)
        results2 = results_query.all()


    # next_url = url_for('files.searchFiles', page=results.next_num) \
    #     if results.has_next else None 
    # prev_url = url_for('files.searchFiles', page=results.prev_num) \
    #     if results.has_prev else None
    print(results)
    results_ = results.items
    print('results.items',results.items)
    count = len(results2)
    print('results_',results_)
    if not results_:
        return jsonify({"message": "해당하는 정보가 없습니다."})

    # results2 = db.session.query(File).join(Blog).\
    # filter(or_(Blog.content.like(f'%{keyword}%'),Blog.title.like(f'%{keyword}%'),File.origin_name.like(f'%{keyword}%'))).\
    # order_by(orderByValue).all()
    
    #count = len(results2)
    #total_pages = len(results2) // row if len(results2) % row == 0 else  (len(results2) // row) + 1 
    #total_pages = total_pages


    fileList = []

    for file_ in results_: 
        data = file_.serialize 
        data['authorName'] = file_.blog_associated_files.new_author.serialize['name'] 
        data['blogData'] = file_.blog_associated_files.serialize
        data['comments'] = forLoop(file_.blog_associated_files.comments)
        data['tags'] =  forLoop(file_.blog_associated_files.tags)
        data['categories'] =  forLoop(file_.blog_associated_files.category)
        
        if file_:
            fileList.append(data)         

 
    print('fileList',fileList)
    return jsonify({"searchFiles": fileList,"count": count})
        
    # return jsonify({"searchFiles": fileList, "next_url":next_url, "prev_url":prev_url, "total_pages": total_pages, "count": count})



def forLoop(paramList):
    print('paramList',paramList)
    result = []
    for i in paramList:
        result.append(i.serialize)

    return result


def paginate(query, page, per_page=20, error_out=True):
    if error_out and page < 1:
        abort(404)
    items = query.limit(per_page).offset((page - 1) * per_page).all()
    if not items and page != 1 and error_out:
        abort(404)


    if page == 1 and len(items) < per_page:
        total = len(items)
    else:
        total = query.order_by(None).count()

    return Pagination(query, page, per_page, total, items)


@jwt_required
@files.route('/searchByDate/<string:date2>', methods=["GET"])
def searchFilesByDate(date2):
    print('date',date2)
    page =1 
    row =10

    results = db.session.query(File).join(Blog).\
    filter(func.strftime("%Y-%m-%d", Blog.created_at) == date2).\
    order_by(Blog.id.desc()).paginate(1, 10, False)


    next_url = url_for('files.searchFiles', page=results.next_num) \
        if results.has_next else None 
    prev_url = url_for('files.searchFiles', page=results.prev_num) \
        if results.has_prev else None
    print('next_url',next_url)



   
    results_ = results.items
    print('results',results_)

    if not results_:
        return jsonify({"message": "해당하는 정보가 없습니다."})

    results2 = db.session.query(File).join(Blog).\
    filter(func.strftime("%Y-%m-%d", Blog.created_at) == date2).\
    order_by(Blog.id.desc()).all()
    print('results2',results2)
    count = len(results2)
    total_pages = len(results2) // row if len(results2) % row == 0 else  (len(results2) // row) + 1 
    total_pages = total_pages

        

    fileList = []

    for file_ in results_: 
        data = file_.serialize 
        data['authorName'] = file_.blog_associated_files.new_author.serialize['name'] 
        data['blogData'] = file_.blog_associated_files.serialize
        data['comments'] = forLoop(file_.blog_associated_files.comments)
        data['tags'] =  forLoop(file_.blog_associated_files.tags)
        data['categories'] =  forLoop(file_.blog_associated_files.category)
        
        if file_:
            fileList.append(data)         

 
  
        
    return jsonify({"searchFiles": fileList, "next_url":next_url, "prev_url":prev_url, "total_pages": total_pages, "count": count})



# @files.route('/categorySearch/<string:categoryName>', methods=["GET"])
@jwt_required
@files.route('/categorySearch', methods=["GET"])
def categorySearch():

    categoryName = request.args.get('cn') 
    page = request.args.get('page',type=int) 
    sortBy = request.args.get('sortBy',type=int) 
    row = request.args.get('row',type=int)
    print('pagepage',page)

    # categoryName = "외국소설"
    #ex) 국내도서 > 시 >  한국시 > 한국시의시
    categroySortList = []
    codeDetail = Code_detail_table.query.filter_by(code_name=categoryName).all()
    print('codeDetail',codeDetail)
    codeDetail = Code_detail_table.query.filter_by(code_name=categoryName).one()
    categroySortList.append(codeDetail.code_name)
    parentId = codeDetail.parent_id
    range_value = codeDetail.group_code_id 
    print('roots_list',range_value)
    
    while(range_value>1):
        a = Code_detail_table.query.filter_by(id=parentId).one() 
        categroySortList.append(a.code_name)
        range_value-=1 
        parentId = a.parent_id

    categroySortList= list(reversed(categroySortList))
    print('categroySortList',categroySortList) 
    print('categoryName',categoryName)

    categoryList = Category.query.filter(Category.code_name==categoryName).all()
    print('categoryList',categoryList)
    blogIdList =[] 
    for i in categoryList:
        blogIdList.append(i.blog_id)
        
    
    print('blogIdList',blogIdList) #[2,4]
    

    results = db.session.query(File).join(Blog).\
    filter(Blog.id.in_(blogIdList)).\
    order_by(Blog.id.desc()).paginate(page, row, False)
    print('results',results)

    results_ = results.items
    print('results_',results_)

    fileList = []

    for file_ in results_: 
        data = file_.serialize 
        data['authorName'] = file_.blog_associated_files.new_author.serialize['name'] 
        data['blogData'] = file_.blog_associated_files.serialize
        data['comments'] = forLoop(file_.blog_associated_files.comments)
        data['tags'] =  forLoop(file_.blog_associated_files.tags)
        data['categories'] =  forLoop(file_.blog_associated_files.category)  

        if file_:
            fileList.append(data) 

    print('fileList',fileList)       
              
    # blog=Blog.query.filter(Blog.id.in_(blogIdList)).all()

    # print('blog',blog)
    # for i in blog:
    #     print(i.files)





    



    return jsonify({'categroySortList':categroySortList,"searchFiles":fileList})


def optionFunc(orderByValue):
    print('orderByValue',orderByValue)





@jwt_required
@files.route('/search2', methods=["GET"])
def searchFiles2():
    
    keyword = request.args.get('kw') 
    page = request.args.get('page',type=int) 
    sortBy = request.args.get('sortBy',type=int) 
    row = request.args.get('row',type=int)
    it = request.args.get('i') 
    date = request.args.get('date') #추가하기 
    op_sValue = request.args.get('op_sValue')  # 별점
    # op_hValue = request.args.get('op_hValue')  # 즐겨찾기 수
    op_dValue = request.args.get('op_dValue')  # 다운로드 수
    op_vValue = request.args.get('op_vValue')  # 조회 수
    op_rValue = request.args.get('op_rValue')  # 댓글 수
    date = json.loads(date)
    print('date입니다.',date) # date가 있으면 
    print('date입니다.ㅋㅋ',date['start']) # date가 있으면 
    print('date입니다.ㅋㅋ',date['end']) # date가 있으면 

    startDate = date['start']
    endDate = date['end']

    count = 0

    searchKeyword= SearchKeyword(sek_keyword=keyword,user_id=1)
    db.session.add(searchKeyword)
    db.session.commit()


    orderByValue = sortByFunc(sortBy)
    print('orderByValue',orderByValue)
    

    results = ""
    results2 = ""

    # 전체 검색일 때  
    if(it == None or it == '' or it =='all'): 
        #댓글 수 
        print('op_sValue 무엇일까요?',op_sValue)
        if startDate and endDate: #   둘다 값이 있을때 
            print('date잇음')
            #func.strftime("%Y-%m-%d", Blog.created_at) == date
            results_query = db.session.query(File).join(Blog).join(User).\
            filter(and_(or_(User.name.like(f'%{keyword}%'),Blog.content.like(f'%{keyword}%'),Blog.title.like(f'%{keyword}%'),File.origin_name.like(f'%{keyword}%'))\
            , Blog.star >=op_sValue, File.download_cnt >=op_dValue, Blog.view_count >=op_vValue, Blog.created_at >=startDate, Blog.created_at <= endDate )).\
            order_by(orderByValue)

        else:
            print('date없음')
            results_query = db.session.query(File).join(Blog).join(User).\
            filter(and_(or_(User.name.like(f'%{keyword}%'),Blog.content.like(f'%{keyword}%'),Blog.title.like(f'%{keyword}%'),File.origin_name.like(f'%{keyword}%'))\
            , Blog.star >=op_sValue, File.download_cnt >=op_dValue, Blog.view_count >=op_vValue)).\
            order_by(orderByValue)


        results = results_query.paginate(page, row, False)
        print('results전체검색',results)

        results2 = results_query.all()       


    #제목만 검색일 때 
    elif (it =='title'):
        if datestartDate and endDate: 
            results_query = db.session.query(File).join(Blog).\
            filter(and_(Blog.title.like(f'%{keyword}%'), Blog.star >=op_sValue,File.download_cnt >=op_dValue, Blog.view_count >=op_vValue ,Blog.created_at >=startDate, Blog.created_at <= endDate )).\
            order_by(orderByValue)
        else:
            results_query = db.session.query(File).join(Blog).\
            filter(and_(Blog.title.like(f'%{keyword}%'),Blog.star >=op_sValue, File.download_cnt >=op_dValue, Blog.view_count >=op_vValue )).\
            order_by(orderByValue)            

        results = results_query.paginate(page, row, False)
        results2 = results_query.all()  

    #본문만 검색일 때
    elif (it =='content'): 
        if datestartDate and endDate:

            results_query = db.session.query(File).join(Blog).\
            filter(and_(Blog.content.like(f'%{keyword}%'),Blog.star >=op_sValue,File.download_cnt >=op_dValue, Blog.view_count >=op_vValue ,Blog.created_at >=startDate, Blog.created_at <= endDate  )).\
            order_by(orderByValue)
        else:
            results_query = db.session.query(File).join(Blog).\
            filter(and_(Blog.content.like(f'%{keyword}%'),Blog.star >=op_sValue, File.download_cnt >=op_dValue, Blog.view_count >=op_vValue )).\
            order_by(orderByValue)            

        results = results_query.paginate(page, row, False)
        results2 = results_query.all()        

    #글쓴이 검색일 때
    elif (it =='writer'): 
        user = User.query.filter(User.name.like(f'%{keyword}%')).all() # 해당 user 찾기 
        userIdList = []
        for u in user:
            userIdList.append(u.id)
        if datestartDate and endDate:
            results_query = db.session.query(File).join(Blog).\
            filter(and_(Blog.author_id.in_(userIdList),Blog.star >=op_sValue,File.download_cnt >=op_dValue, Blog.view_count >=op_vValue , Blog.created_at >=startDate, Blog.created_at <= endDate  )).\
            order_by(orderByValue)
        else:
            results_query = db.session.query(File).join(Blog).\
            filter(and_(Blog.author_id.in_(userIdList),Blog.star >=op_sValue,File.download_cnt >=op_dValue, Blog.view_count >=op_vValue  )).\
            order_by(orderByValue)
            
        results = results_query.paginate(page, row, False)
        results2 = results_query.all()
        

    #파일 이름 검색일 때 
    elif (it =='fileName'):
        if datestartDate and endDate:
            results_query = db.session.query(File).join(Blog).\
            filter(and_(File.origin_name.like(f'%{keyword}%'),Blog.star >=op_sValue,File.download_cnt >=op_dValue, Blog.view_count >=op_vValue , Blog.created_at >=startDate, Blog.created_at <= endDate )).\
            order_by(orderByValue)
        else:
            results_query = db.session.query(File).join(Blog).\
            filter(and_(File.origin_name.like(f'%{keyword}%'),Blog.star >=op_sValue,File.download_cnt >=op_dValue, Blog.view_count >=op_vValue )).\
            order_by(orderByValue)            

        results = results_query.paginate(page,row,False)
        results2 = results_query.all()

    else:
        #?
        results_query = db.session.query(File).join(Blog).\
        filter(Blog.title.like(f'%{keyword}%')).\
        order_by(orderByValue)     

        results = results_query.paginate(page,row,False)
        results2 = results_query.all()


    print(results)
    results_ = results.items
    print('results.itemsddd',results.items)
    count = len(results2)
    print('results_',results_)
    if not results_:
        return jsonify({"message": "해당하는 정보가 없습니다."})

    # results2 = db.session.query(File).join(Blog).\
    # filter(or_(Blog.content.like(f'%{keyword}%'),Blog.title.like(f'%{keyword}%'),File.origin_name.like(f'%{keyword}%'))).\
    # order_by(orderByValue).all()
    
    #count = len(results2)
    #total_pages = len(results2) // row if len(results2) % row == 0 else  (len(results2) // row) + 1 
    #total_pages = total_pages


    fileList = []

    for file_ in results_: 
        data = file_.serialize 
        data['authorName'] = file_.blog_associated_files.new_author.serialize['name'] 
        data['blogData'] = file_.blog_associated_files.serialize
        data['comments'] = forLoop(file_.blog_associated_files.comments)
        data['tags'] =  forLoop(file_.blog_associated_files.tags)
        data['categories'] =  forLoop(file_.blog_associated_files.category)
        
        if file_:
            fileList.append(data)         

 
    print('fileList',fileList)
    return jsonify({"searchFiles": fileList,"count": count})
        
    # return jsonify({"searchFiles": fileList, "next_url":next_url, "prev_url":prev_url, "total_pages": total_pages, "count": count})

