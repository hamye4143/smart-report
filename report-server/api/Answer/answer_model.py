from api import db
from datetime import datetime
from pytz import timezone

KST = datetime.now(timezone('Asia/Seoul'))

class Answer(db.Model):

    id=db.Column(db.Integer,primary_key=True,autoincrement=True )
    title=db.Column(db.String(50),nullable=False)
    content = db.Column(db.Text,nullable=False)
    questionId = db.Column(db.Integer,db.ForeignKey('question.id'), nullable=False) 
    userId = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False) 
    created_at = db.Column(db.DateTime, default=datetime.today())
    updated_at = db.Column(db.DateTime, nullable=True, default=datetime.today())
    selectedAnswer = db.Column(db.String(1), default='N')


    @property
    def serialize(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'questionId': self.questionId, 
            'userId':self.userId,
            'created_at': self.created_at.strftime('%m/%d/%Y'), #M/d/yyyy 
            'selectedAnswer': self.selectedAnswer
        }  