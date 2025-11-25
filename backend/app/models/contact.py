from app import db
from datetime import datetime

class ContactMessage(db.Model):
    """Contact message from users"""
    __tablename__ = 'contact_messages'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), nullable=False, index=True)
    category = db.Column(db.String(50), nullable=False, default='general')  # bug, feature, general, urgent
    subject = db.Column(db.String(255), nullable=False)
    message = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(50), default='new')  # new, read, in-progress, resolved
    priority = db.Column(db.String(20), default='medium')  # low, medium, high, urgent
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Replies relationship
    replies = db.relationship('ContactReply', backref='message', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        """Convert contact message to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'category': self.category,
            'subject': self.subject,
            'message': self.message,
            'status': self.status,
            'priority': self.priority,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'replies': [r.to_dict() for r in self.replies]
        }


class ContactReply(db.Model):
    """Admin reply to contact messages"""
    __tablename__ = 'contact_replies'
    
    id = db.Column(db.Integer, primary_key=True)
    message_id = db.Column(db.Integer, db.ForeignKey('contact_messages.id'), nullable=False, index=True)
    admin_name = db.Column(db.String(120), nullable=False)
    reply_text = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    
    def to_dict(self):
        """Convert reply to dictionary"""
        return {
            'id': self.id,
            'message_id': self.message_id,
            'admin_name': self.admin_name,
            'reply_text': self.reply_text,
            'created_at': self.created_at.isoformat()
        }
