from flask import Blueprint

from api import db
from api.User.Visitor.visitor_model import Visitor
from api.User.user_model import User

visitor = Blueprint('visitor', __name__)


@visitor.route('/initTodayVisitor', methods=["GET"])
def initTodayVisitor():
    yesterday = datetime.today() - timedelta(days=1)
    dfyesterday = datetime.today() - timedelta(days=2)
    ddfyesterday = datetime.today() - timedelta(days=3)
    dddfyesterday = datetime.today() - timedelta(days=4)
    ddddfyesterday = datetime.today() - timedelta(days=5)

    dddddfyesterday = datetime.today() - timedelta(days=6)
    db.session.add_all([
        Visitor(user_id=1, ip_addr='ip_addr', login_date=dddddfyesterday,
                visit_date=dddddfyesterday.strftime('%Y-%m-%d')),

        Visitor(user_id=1, ip_addr='ip_addr', login_date=ddddfyesterday,
                visit_date=ddddfyesterday.strftime('%Y-%m-%d')),

        Visitor(user_id=1, ip_addr='ip_addr', login_date=dddfyesterday, visit_date=dddfyesterday.strftime('%Y-%m-%d')),
        Visitor(user_id=1, ip_addr='ip_addr', login_date=ddfyesterday, visit_date=ddfyesterday.strftime('%Y-%m-%d')),
        Visitor(user_id=1, ip_addr='ip_addr', login_date=dfyesterday, visit_date=dfyesterday.strftime('%Y-%m-%d')),
        Visitor(user_id=2, ip_addr='ip_addr', login_date=dfyesterday, visit_date=dfyesterday.strftime('%Y-%m-%d')),
        Visitor(user_id=2, ip_addr='ip_addr', login_date=yesterday, visit_date=yesterday.strftime('%Y-%m-%d')),
        Visitor(user_id=1, ip_addr='ip_addr', login_date=yesterday, visit_date=yesterday.strftime('%Y-%m-%d'))
    ])
    db.session.commit()
    return jsonify({"message": "serialized_data"})


from flask import jsonify
from datetime import date, datetime, timedelta
from sqlalchemy import func


@visitor.route('/todayVisitor', methods=["GET"])
def todayVisitor():
    today = date.today()
    thisWeekMonday = today - timedelta(days=today.weekday())
    print('monday', thisWeekMonday)

    # 최근 7일 기준 (오늘 포함)
    startDay = (datetime.today() - timedelta(days=6)).strftime("%Y-%m-%d")
    endDay = (datetime.today() + timedelta(days=1)).strftime("%Y-%m-%d")
    print('startDay', startDay)
    print('endDay', endDay)

    # (1) 7일간 일별 유저수 (user_id 중복 제외)
    result = db.session.execute("""
        SELECT COUNT(*) as count, visit_date FROM (
            SELECT visit_date, user_id 
            FROM visitor 
            WHERE login_date < :val AND login_date >= :val2 
            GROUP BY visit_date, user_id
        ) AS t
        GROUP BY visit_date
        ORDER BY visit_date
    """, {'val': endDay, 'val2': startDay})

    visit_count_list = []
    visit_date_list = []
    for i in result:
        visit_count_list.append(i.count)
        visit_date_list.append(i.visit_date)

    # (2) 오늘 방문자 (user_id 기준)
    today_str = today.strftime("%Y-%m-%d")
    today_visitor_count = Visitor.query \
        .filter(func.strftime("%Y-%m-%d", Visitor.login_date) == today_str) \
        .group_by(Visitor.user_id).count()

    # (3) 방어 코드
    todayVisitors = visit_count_list[-1] if visit_count_list else 0

    print('visit_count_list', visit_count_list)
    print('today_visitor_count', today_visitor_count)

    return jsonify({
        'visit_count_list': visit_count_list,
        'visit_date_list': visit_date_list,
        'todayVisitors': todayVisitors,
        'today_visitor_count': today_visitor_count  # 필요하면 프론트에 따로 보냄
    })


@visitor.route('/registerCounts', methods=["GET"])
def registerCounts():  # 오늘 등록한 사람 , 로그아웃한 인간 몇명...인지?

    today = date.today()
    TotalregisterCounts = db.session.query(User.id).count()

    registerations = User.query.filter(today == func.DATE(User.created_at)).all()
    NewregisterCounts = len(registerations)

    logouts = Visitor.query.filter(today == func.DATE(Visitor.logout_date)).group_by(Visitor.user_id).all()
    print('visitor', logouts)
    logoutCounts = len(logouts)
    return jsonify({'NewregisterCounts': NewregisterCounts, 'logoutCounts': logoutCounts,
                    'TotalregisterCounts': TotalregisterCounts})


@visitor.route('/widgets', methods=["GET"])
def getWidgets():  #

    widgets = {
          "todayVisitors": 167,
          "activeUsers": 114,
          "avgSessionTime": "14분 22초",
          "usageRate": 72,
          "lastLogin": "2025-04-24 13:50",
          "todayVsYesterday": "+4.7%",
          "weekVsLastWeek": "-2.3%"
        }

    return jsonify(widgets)


@visitor.route('/alerts', methods=["GET"])  # 실시간 이슈 알림
def getAlerts():  #
    alerts = [
        {"type": "info", "time": "13:20", "text": "서버 정기점검(14:00~14:20) 예정"},
        {"type": "success", "time": "12:05", "text": "신규 피드백 등록: 박*준"},
        {"type": "warning", "time": "10:42", "text": "다운로드 트래픽 급증 감지"},
        {"type": "error", "time": "09:50", "text": "일부 사용자 로그인 오류(복구완료)"}
    ]
    return jsonify({'alerts': alerts})


@visitor.route('/recent-reports', methods=["GET"])
def getRecentReports():  #
    print("???")
    reports = [
        { "title": "기술로드맵", "user": "김**", "time": "14:10", "status": "등록완료" },
        { "title": "피드백 정리", "user": "이**", "time": "12:45", "status": "승인대기" },
        { "title": "시장예측", "user": "최**", "time": "11:40", "status": "등록완료" },
        { "title": "신제품 분석", "user": "정**", "time": "10:55", "status": "반려" }
    ]
    return jsonify({"recentReports": reports})


@visitor.route('/charts/bar', methods=["GET"])
def getBarChartData():
    data = {
        "series": [
            { "name": "다운로드 수", "data": [18, 24, 12, 30, 20, 25, 22, 28, 13, 16] }
        ],
        "categories": [
            "ai_report", "market2025", "patents", "survey", "risk_report",
            "sales_data", "proposal", "whitepaper", "feedback", "research"
        ]
    }
    return jsonify(data)

@visitor.route('/logoutCounts', methods=["GET"])
def logoutCounts():  # 오늘 등록한 사람 몇명...인지?

    return jsonify({'visit_count_list': 'ㅁㄴㅇㄹㅁㄴㅇㄹ'})
