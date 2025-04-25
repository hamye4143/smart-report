from datetime import date
from datetime import timedelta

from flask import Blueprint, jsonify
from sqlalchemy.sql import func

from api import db
from api.Blog.blog_model import Blog
from api.Blog_File.download_table import DownloadTable
from api.File.file_model import File

blogFiles= Blueprint('blogfiles',__name__)


@blogFiles.route('/getTopTenDownloadedFile/<int:type_>', methods=["GET"])
def GetTopTenDownloadedFiles(type_):
    today = date.today()
    list_ = []

    # ---- (1) 기간 조건 ----
    if type_ == 1:  # 주간
        # 이번주 월요일~오늘까지 (또는 일요일까지, 현재는 오늘까지)
        week_start = today - timedelta(days=today.weekday())  # 이번주 월요일
        week_end = week_start + timedelta(days=6)  # 이번주 일요일
        period_filter = (DownloadTable.created_at >= week_start) & (DownloadTable.created_at <= week_end)
    else:  # 월간
        year_month = today.strftime('%Y-%m')
        period_filter = func.strftime("%Y-%m", DownloadTable.created_at) == year_month

    # ---- (2) 파일별 다운로드 수 집계 (TOP 10) ----
    download_stats = (
        db.session.query(
            DownloadTable.file_id,
            func.sum(DownloadTable.cnt).label('total_downloads')
        )
        .filter(period_filter)
        .group_by(DownloadTable.file_id)
        .order_by(func.sum(DownloadTable.cnt).desc())
        .limit(10)
        .all()
    )
    file_ids = [row.file_id for row in download_stats]

    # ---- (3) Blog & File join하여 데이터 가공 ----
    files = File.query.filter(File.id.in_(file_ids)).all()
    files_dict = {f.id: f for f in files}

    for file_id in file_ids:
        f = files_dict[file_id]
        # 파일이 어떤 블로그에 속하는지 (1:1 또는 1:N, 보통 blog_id 있음)
        blog = Blog.query.filter_by(id=f.blog_id).first() if hasattr(f, 'blog_id') else None
        if blog:
            list_.append([blog.serialize, f.serialize])

    return jsonify({"serializedResult": list_})
