from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.chat import ChatMessage
from app.services.gemini_service import get_chat_response

chat_bp = Blueprint('chat', __name__)

@chat_bp.route('/send', methods=['POST'])
@jwt_required()
def send_message():
    """Send chat message and get response"""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or not data.get('message'):
        return jsonify({'error': 'Message is required'}), 400
    
    language = data.get('language', 'en')
    
    try:
        # Get response from Gemini
        response_text = get_chat_response(data['message'], language)
        
        # Save to database
        chat_message = ChatMessage(
            user_id=user_id,
            message=data['message'],
            response=response_text,
            language=language
        )
        
        db.session.add(chat_message)
        db.session.commit()
        
        return jsonify({
            'response': response_text,
            'chat': chat_message.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@chat_bp.route('/history', methods=['GET'])
@jwt_required()
def get_history():
    """Get chat history for current user"""
    user_id = get_jwt_identity()
    
    limit = request.args.get('limit', 50, type=int)
    messages = ChatMessage.query.filter_by(user_id=user_id).order_by(
        ChatMessage.created_at.desc()
    ).limit(limit).all()
    
    return jsonify({
        'messages': [m.to_dict() for m in messages]
    }), 200
