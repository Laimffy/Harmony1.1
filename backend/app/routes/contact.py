from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.contact import ContactMessage, ContactReply

contact_bp = Blueprint('contact', __name__)

@contact_bp.route('/send', methods=['POST'])
def send_message():
    """Receive contact message from user"""
    data = request.get_json()
    
    if not data or not data.get('name') or not data.get('email') or not data.get('message'):
        return jsonify({'error': 'Missing required fields: name, email, message'}), 400
    
    try:
        contact_msg = ContactMessage(
            name=data['name'],
            email=data['email'],
            category=data.get('category', 'general'),
            subject=data.get('subject', 'No subject'),
            message=data['message'],
            priority=data.get('priority', 'medium')
        )
        
        db.session.add(contact_msg)
        db.session.commit()
        
        return jsonify({
            'message': 'Your message has been received. We will contact you soon!',
            'contact': contact_msg.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@contact_bp.route('/messages', methods=['GET'])
@jwt_required()
def get_messages():
    """Get all contact messages (admin only)"""
    user_id = get_jwt_identity()
    
    limit = request.args.get('limit', 100, type=int)
    status = request.args.get('status', None)
    category = request.args.get('category', None)
    priority = request.args.get('priority', None)
    search = request.args.get('search', None)
    
    query = ContactMessage.query.order_by(ContactMessage.created_at.desc())
    
    if status:
        query = query.filter_by(status=status)
    if category:
        query = query.filter_by(category=category)
    if priority:
        query = query.filter_by(priority=priority)
    if search:
        query = query.filter(
            (ContactMessage.subject.ilike(f'%{search}%')) |
            (ContactMessage.message.ilike(f'%{search}%')) |
            (ContactMessage.name.ilike(f'%{search}%')) |
            (ContactMessage.email.ilike(f'%{search}%'))
        )
    
    messages = query.limit(limit).all()
    
    return jsonify({
        'messages': [m.to_dict() for m in messages]
    }), 200

@contact_bp.route('/messages/<int:message_id>', methods=['GET'])
@jwt_required()
def get_message(message_id):
    """Get a specific contact message"""
    message = ContactMessage.query.get(message_id)
    
    if not message:
        return jsonify({'error': 'Message not found'}), 404
    
    return jsonify({'contact': message.to_dict()}), 200

@contact_bp.route('/messages/<int:message_id>/status', methods=['PUT'])
@jwt_required()
def update_message_status(message_id):
    """Update contact message status"""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or not data.get('status'):
        return jsonify({'error': 'Status is required'}), 400
    
    message = ContactMessage.query.get(message_id)
    
    if not message:
        return jsonify({'error': 'Message not found'}), 404
    
    message.status = data['status']
    if data.get('priority'):
        message.priority = data['priority']
    
    try:
        db.session.commit()
        return jsonify({
            'message': 'Message updated',
            'contact': message.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@contact_bp.route('/messages/<int:message_id>/reply', methods=['POST'])
@jwt_required()
def add_reply(message_id):
    """Add admin reply to contact message"""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or not data.get('reply_text') or not data.get('admin_name'):
        return jsonify({'error': 'Missing required fields: reply_text, admin_name'}), 400
    
    message = ContactMessage.query.get(message_id)
    
    if not message:
        return jsonify({'error': 'Message not found'}), 404
    
    try:
        reply = ContactReply(
            message_id=message_id,
            admin_name=data['admin_name'],
            reply_text=data['reply_text']
        )
        
        # Auto-update status to in-progress if replying
        if message.status == 'new' or message.status == 'read':
            message.status = 'in-progress'
        
        db.session.add(reply)
        db.session.commit()
        
        return jsonify({
            'message': 'Reply added successfully',
            'reply': reply.to_dict(),
            'contact': message.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@contact_bp.route('/messages/<int:message_id>/replies', methods=['GET'])
@jwt_required()
def get_replies(message_id):
    """Get all replies for a message"""
    message = ContactMessage.query.get(message_id)
    
    if not message:
        return jsonify({'error': 'Message not found'}), 404
    
    replies = ContactReply.query.filter_by(message_id=message_id).order_by(ContactReply.created_at.asc()).all()
    
    return jsonify({
        'replies': [r.to_dict() for r in replies]
    }), 200
