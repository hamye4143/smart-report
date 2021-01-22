from api import db
from datetime import datetime
from pytz import timezone

KST = datetime.now(timezone('Asia/Seoul'))

class DownloadTable(db.Model): 
    user_id = db.Column(db.Integer,db.ForeignKey('user.id'), primary_key=True)
    file_id = db.Column(db.Integer,db.ForeignKey('file.id'),primary_key=True)
    created_at = db.Column(db.DateTime, default=datetime.today())
    cnt = db.Column(db.Integer, default = 1) # 다운로드 횟수 



