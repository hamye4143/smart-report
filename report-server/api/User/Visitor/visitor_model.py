from api import db
from datetime import datetime
from pytz import timezone

KST = datetime.now(timezone('Asia/Seoul'))

class Visitor(db.Model): 
    id=db.Column(db.Integer,primary_key=True, autoincrement = True) 
    user_id=db.Column(db.Integer,db.ForeignKey('user.id'),nullable=True)
    visit_date =db.Column(db.String(20),default=datetime.today().strftime('%Y-%m-%d')) # 년-월-일 까지만 
    ip_addr=db.Column(db.String(50),nullable=True)
    login_date = db.Column(db.DateTime)
    logout_date = db.Column(db.DateTime,nullable=True)
    

    

    @property
    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'visit_date': self.visit_date,
            'login_date': self.login_date,
            'logout_date': self.logout_date,
            'ip_addr': self.ip_addr
        }