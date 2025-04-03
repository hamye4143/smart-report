from flask import Blueprint,request,jsonify,make_response
from flask_jwt_extended import jwt_required
from api import db
from datetime import date
from sqlalchemy.sql import func
from api.User.Visitor.visitor_model import Visitor
from api.User.user_model import User
from datetime import datetime, timedelta
from sqlalchemy import and_
from sqlalchemy import distinct

visitor=Blueprint('visitbr', __name__)


@visitor.route('/initTodayVisitor', methods=["GET"])
def initTodayVisitor():
    yesterday = datetime.today() - timedelta(days=1)
    dfyesterday = datetime.today() - timedelta(days=2)
    ddfyesterday = datetime.today() - timedelta(days=3)
    dddfyesterday = datetime.today() - timedelta(days=4)
    ddddfyesterday = datetime.today() - timedelta(days=5)
    
    dddddfyesterday = datetime.today() - timedelta(days=6)
    db.session.add_all([
        Visitor(user_id=1,ip_addr='ip_addr',login_date=dddddfyesterday,visit_date =dddddfyesterday.strftime('%Y-%m-%d')),                

        Visitor(user_id=1,ip_addr='ip_addr',login_date=ddddfyesterday,visit_date =ddddfyesterday.strftime('%Y-%m-%d')),                

        Visitor(user_id=1,ip_addr='ip_addr',login_date=dddfyesterday,visit_date =dddfyesterday.strftime('%Y-%m-%d')),                
        Visitor(user_id=1,ip_addr='ip_addr',login_date=ddfyesterday,visit_date =ddfyesterday.strftime('%Y-%m-%d')),        
        Visitor(user_id=1,ip_addr='ip_addr',login_date=dfyesterday,visit_date =dfyesterday.strftime('%Y-%m-%d')),
        Visitor(user_id=2,ip_addr='ip_addr',login_date=dfyesterday,visit_date=dfyesterday.strftime('%Y-%m-%d')),
        Visitor(user_id=2,ip_addr='ip_addr',login_date=yesterday,visit_date = yesterday.strftime('%Y-%m-%d')),
        Visitor(user_id=1,ip_addr='ip_addr',login_date=yesterday,visit_date = yesterday.strftime('%Y-%m-%d')) 
    ])
    db.session.commit()
    return jsonify({"message": "serialized_data"})

@visitor.route('/todayVisitor', methods=["GET"])
def todayVisitor():
    today = date.today()
    thisWeekMonday = today - timedelta(days = today.weekday())
    print('monday',thisWeekMonday)

    date_list = []
    startDay = datetime.today() - timedelta(days=6)
    startDay = startDay.strftime("%Y-%m-%d")#2020-11-21  #21 부터 오늘날짜

    endDay = datetime.today() + timedelta(days=1) # 사실상 endday+1
    endDay = endDay.strftime("%Y-%m-%d")
    print('startDay',startDay) 
    print('endDay',endDay) 

    #SELECT COUNT(*) as count, visit_date FROM (SELECT * FROM visitor WHERE login_date < '2020-11-29' AND login_date >='2020-11-21' GROUP BY visit_date,user_id) GROUP BY visit_date;

    result = db.session.execute("SELECT COUNT(*) as count, visit_date FROM (SELECT * FROM visitor WHERE login_date < :val AND login_date >=:val2 GROUP BY visit_date,user_id) GROUP BY visit_date",{'val':endDay,'val2':startDay})
    visit_count_list= []
    visit_date_list = []
    for i in result:
        visit_count_list.append(i.count)
        visit_date_list.append(i.visit_date)
        
    todayVisitors = visit_count_list[len(visit_count_list)-1]
    print('visit_count_list',visit_count_list)


    # subquery = db.session.query(distinct(Visitor.user_id), Visitor.visit_date).\
    # filter(and_(Visitor.login_date < endDay, Visitor.login_date >= startDay)).group_by(Visitor.visit_date).\
    # group_by(Visitor.user_id).subquery() 

    # totalquery = db.session.query(subquery.c.visit_date,subquery.count()).all()


    
    
    #print('query-query',query)

    



    visitor = Visitor.query.filter(func.strftime("%Y-%m-%d", Visitor.login_date) == str(today)).group_by(Visitor.user_id).all()
    print('visitor',visitor) 
    #[날짜,1 , ]

    # visitor_list = Visitor.query.filter(func.strftime("%Y-%m-%d", Visitor.login_date) <= yesterday).group_by(Visitor.user_id).all()
    #이번주 ( 월- 일 까지 접속자 수 리스트로)
    #
    visitor_this_week =  []

    today_visitors = len(visitor)
    print('today_visitors',today_visitors)
    for i in visitor:
        print(i.serialize)

    #SELECT COUNT(user_id), visit_date FROM (SELECT DISTINCT user_id, visit_date FROM visitor WHERE login_date < '2020-11-28' AND login_date >='2020-11-21' GROUP BY visit_date, user_id);
    subquery = Visitor.query.filter()


    #select * from where 오늘날짜 group by  user_id 
    

    


    # return jsonify({'today_visitors':today_visitors})
    return jsonify({'visit_count_list':visit_count_list,'visit_date_list':visit_date_list,'todayVisitors':todayVisitors})




@visitor.route('/registerCounts', methods=["GET"])
def registerCounts(): # 오늘 등록한 사람 , 로그아웃한 인간 몇명...인지? 

    today = date.today()
    TotalregisterCounts = db.session.query(User.id).count()
    
    registerations = User.query.filter(today == func.DATE(User.created_at)).all()
    NewregisterCounts = len(registerations)

    logouts = Visitor.query.filter( today == func.DATE(Visitor.logout_date)).group_by(Visitor.user_id).all()
    print('visitor',logouts)
    logoutCounts = len(logouts)
    return jsonify({'NewregisterCounts':NewregisterCounts, 'logoutCounts':logoutCounts, 'TotalregisterCounts': TotalregisterCounts})


@visitor.route('/logoutCounts', methods=["GET"])
def logoutCounts(): # 오늘 등록한 사람 몇명...인지? 



    return jsonify({'visit_count_list':'ㅁㄴㅇㄹㅁㄴㅇㄹ'})
