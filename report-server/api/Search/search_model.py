from api import db
from datetime import datetime
from pytz import timezone

KST = datetime.now(timezone('Asia/Seoul'))

class SearchKeyword(db.Model):
    sek_id=db.Column(db.Integer,primary_key=True, autoincrement = True) 
    sek_keyword = db.Column(db.String(50),nullable=True) #  검색 키워드 
    sek_datetime =db.Column(db.String(20),default=datetime.today().strftime('%Y-%m-%d')) # 검색 일시 년-월-일 까지만 
    user_id = db.Column(db.Integer,db.ForeignKey('user.id'),nullable=True) # 회원 번호 

    @property
    def serialize(self):
        return {
            'sek_id': self.sek_id,
            'sek_keyword': self.sek_keyword,
            'sek_datetime': self.sek_datetime,
            'user_id': self.user_id
        }