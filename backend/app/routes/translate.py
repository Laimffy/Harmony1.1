from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.user import User
from app.models.translation import Translation
from app.services.gemini_service import translate_text

translate_bp = Blueprint('translate', __name__)

@translate_bp.route('/text', methods=['POST'])
@jwt_required()
def translate():
    """Translate text and save to history"""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or not data.get('text') or not data.get('source_lang') or not data.get('target_lang'):
        return jsonify({'error': 'Missing required fields: text, source_lang, target_lang'}), 400
    
    try:
        # Call Gemini API
        translated_text = translate_text(
            data['text'],
            data['source_lang'],
            data['target_lang']
        )
        
        # Save to database
        translation = Translation(
            user_id=user_id,
            source_language=data['source_lang'],
            target_language=data['target_lang'],
            source_text=data['text'],
            translated_text=translated_text
        )
        
        db.session.add(translation)
        db.session.commit()
        
        return jsonify({
            'translated_text': translated_text,
            'translation': translation.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@translate_bp.route('/history', methods=['GET'])
@jwt_required()
def get_history():
    """Get translation history for current user"""
    user_id = get_jwt_identity()
    
    limit = request.args.get('limit', 50, type=int)
    translations = Translation.query.filter_by(user_id=user_id).order_by(
        Translation.created_at.desc()
    ).limit(limit).all()
    
    return jsonify({
        'translations': [t.to_dict() for t in translations]
    }), 200
