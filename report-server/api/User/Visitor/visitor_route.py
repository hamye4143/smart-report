from flask import Blueprint

from api import db
from api.Blog.blog_model import Blog
from api.Blog_File.download_table import DownloadTable
from api.File.file_model import File
from api.User.Visitor.visitor_model import Visitor
from api.User.user_model import User
from pytz import timezone
from flask import jsonify
from datetime import date, datetime, timedelta
from sqlalchemy import func, desc


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

    KST = datetime.now(timezone('Asia/Seoul'))

    # 전체 유저 수 = 활성 유저
    total_users = User.query.count()

    # 오늘 방문자(오늘 생성된 Blog 작성자 수로 임시 계산, 실제 visit table 있다면 그걸 써)
    # created_at이 오늘 날짜인 Blog 개수
    today = KST.strftime('%Y-%m-%d')
    today_visitors = Blog.query.filter(
        func.date(Blog.created_at) == today
    ).count()

    # 평균 이용시간 (임의로 "14분 22초" 추가 예정)
    avg_session_time = "14분 22초"

    # 사용률(퍼센트, 임의값  추가 예정)
    usage_rate = 72

    # 마지막 로그인(가장 최근 유저 가입 or 업데이트 시간)
    last_login_user = User.query.order_by(User.created_at.desc()).first()
    last_login = last_login_user.created_at.strftime('%Y-%m-%d %H:%M') if last_login_user else ""

    # 어제 대비/전주 대비 임시
    today_vs_yesterday = "+4.7%"
    week_vs_lastweek = "-2.3%"

    widgets = {
        "todayVisitors": today_visitors,
        "activeUsers": total_users,
        "avgSessionTime": avg_session_time,
        "usageRate": usage_rate,
        "lastLogin": last_login,
        "todayVsYesterday": today_vs_yesterday,
        "weekVsLastWeek": week_vs_lastweek
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
    # 최신 5개 Blog + 작성자(user)
    recent = (
        db.session.query(Blog, User)
        .join(User, Blog.author_id == User.id)
        .order_by(desc(Blog.created_at))
        .limit(5)
        .all()
    )

    # 데이터 가공
    reports = []
    for blog, user in recent:
        reports.append({
            "title": blog.title,
            "user": user.name,  # 이름으로 표시
            "time": blog.created_at.strftime("%H:%M"),
            "status": "등록완료"
        })

    return jsonify({"recentReports": reports})



@visitor.route('/charts/bar', methods=["GET"])
def getBarChartData():
    # 파일별로 다운로드 횟수 합산 (TOP 10)
    results = (
        db.session.query(
            DownloadTable.file_id,
            func.sum(DownloadTable.cnt).label('download_count'),
            File.origin_name  # 파일 이름
        )
        .join(File, File.id == DownloadTable.file_id)
        .group_by(DownloadTable.file_id, File.origin_name)
        .order_by(func.sum(DownloadTable.cnt).desc())
        .limit(10)
        .all()
    )

    # categories(파일 이름), series_data(다운로드 합)
    categories = [r.origin_name for r in results]
    series_data = [r.download_count for r in results]

    data = {
        "series": [
            {"name": "다운로드 수", "data": series_data}
        ],
        "categories": categories
    }
    return jsonify(data)
@visitor.route('/logoutCounts', methods=["GET"])
def logoutCounts():  # 오늘 등록한 사람 몇명...인지?

    return jsonify({'visit_count_list': 'ㅁㄴㅇㄹㅁㄴㅇㄹ'})
