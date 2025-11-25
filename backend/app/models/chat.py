from app import db
from datetime import datetime

class ChatMessage(db.Model):
    """Chat message history model"""
    __tablename__ = 'chat_messages'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    message = db.Column(db.Text, nullable=False)
    response = db.Column(db.Text, nullable=False)
    language = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    
    def to_dict(self):
        """Convert chat message to dictionary"""
        return {
            'id': self.id,
            'message': self.message,
            'response': self.response,
            'language': self.language,
            'created_at': self.created_at.isoformat()
        }
