from app import db
from datetime import datetime

class Translation(db.Model):
    """Translation history model"""
    __tablename__ = 'translations'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    source_language = db.Column(db.String(50), nullable=False)
    target_language = db.Column(db.String(50), nullable=False)
    source_text = db.Column(db.Text, nullable=False)
    translated_text = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    
    def to_dict(self):
        """Convert translation to dictionary"""
        return {
            'id': self.id,
            'source_language': self.source_language,
            'target_language': self.target_language,
            'source_text': self.source_text,
            'translated_text': self.translated_text,
            'created_at': self.created_at.isoformat()
        }
