from flask import Blueprint, request, jsonify, render_template
from flask_jwt_extended import jwt_required, get_jwt_identity, decode_token
from controllers.petController import PetController
from werkzeug.utils import secure_filename  # Para assegurar nomes de arquivos válidos
import os  # Para manipular caminhos de arquivos
from models.Pet import Pet, Vaccine, Exam
from extensions import db 
from datetime import datetime

pet_routes = Blueprint('pet_routes', __name__)

# Renderiza a página de cadastro de pets
@pet_routes.route('/cadastrar_pet', methods=['GET'])
def exibir_formulario_pet():
    try:
        return render_template('form.html')
    except Exception as e:
        print(f"Erro ao renderizar a página: {e}")
        return jsonify({"error": "Erro ao carregar a página"}), 500

# Processa o cadastro de um novo pet
@pet_routes.route('/cadastrar_pet', methods=['POST'])
@jwt_required()
def cadastrar_pet():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        pet = PetController.register_pet(data, user_id)
        return jsonify({"message": "Pet cadastrado com sucesso!", "pet": pet.to_dict()}), 201
    except Exception as e:
        print(f"Erro ao cadastrar o pet: {e}")
        return jsonify({"error": str(e)}), 400

# Renderiza a página do pet
@pet_routes.route('/meu_pet', methods=['GET'])
def exibir_pet():
    try:
        token = request.args.get('token')
        if not token:
            return jsonify({"msg": "Missing Authorization Header"}), 401

        try:
            decode_token(token)
        except Exception as e:
            print(f"Erro ao decodificar o token: {e}")
            return jsonify({"msg": "Invalid Token"}), 401

        return render_template('pet.html')
    except Exception as e:
        print(f"Erro ao renderizar a página do pet: {e}")
        return jsonify({"error": "Erro ao carregar a página do pet."}), 500

# API para buscar informações do pet
@pet_routes.route('/api/meu_pet', methods=['GET'])
@jwt_required()
def obter_pet():
    try:
        user_id = get_jwt_identity()
        pet = PetController.get_pet_by_user_id(user_id)
        if not pet:
            return jsonify({"error": "Nenhum pet encontrado."}), 404
        return jsonify({"pet": pet.to_dict()}), 200
    except Exception as e:
        print(f"Erro ao buscar informações do pet: {e}")
        return jsonify({"error": "Erro ao buscar informações do pet."}), 500
 
@pet_routes.route('/upload_image', methods=['POST'])
@jwt_required()
def upload_image():
    try:
        user_id = get_jwt_identity()
        pet = PetController.get_pet_by_user_id(user_id)
        if not pet:
            return jsonify({"error": "Nenhum pet encontrado."}), 404

        if 'petImage' not in request.files:
            return jsonify({"error": "Nenhuma imagem enviada."}), 400

        image = request.files['petImage']
        filename = f"{pet.id}.jpg"
        filepath = os.path.join("static/images", filename)
        image.save(filepath)

        pet.image_url = f"/static/images/{filename}"
        PetController.update_pet_image(pet.id, pet.image_url)

        return jsonify({"message": "Imagem atualizada com sucesso.", "image_url": pet.image_url}), 200
    except Exception as e:
        print(f"Erro ao fazer upload da imagem: {e}")
        return jsonify({"error": f"Erro ao fazer upload da imagem: {str(e)}"}), 500

@pet_routes.route('/editar_pet', methods=['PUT'])
@jwt_required()
def editar_pet():
    try:
        user_id = get_jwt_identity()
        pet = PetController.get_pet_by_user_id(user_id)
        if not pet:
            return jsonify({"error": "Nenhum pet encontrado."}), 404

        data = request.get_json()
        updated_pet = PetController.update_pet_info(pet.id, data)
        return jsonify({"message": "Informações do pet atualizadas com sucesso.", "pet": updated_pet.to_dict()}), 200
    except Exception as e:
        print(f"Erro ao editar informações do pet: {e}")
        return jsonify({"error": f"Erro ao editar informações do pet: {str(e)}"}), 500

@pet_routes.route('/api/pet/<int:pet_id>/vacinas', methods=['GET'])
@jwt_required()
def obter_vacinas(pet_id):
    try:
        # Filtra vacinas pelo pet_id
        vacinas = Vaccine.query.filter_by(pet_id=pet_id).all()
        return jsonify([vaccine.to_dict() for vaccine in vacinas]), 200
    except Exception as e:
        print(f"Erro ao buscar vacinas: {e}")
        return jsonify({"error": "Erro ao buscar vacinas."}), 500


@pet_routes.route('/api/pet/<int:pet_id>/exames', methods=['GET'])
@jwt_required()
def obter_exames(pet_id):
    try:
        # Filtra exames pelo pet_id
        exames = Exam.query.filter_by(pet_id=pet_id).all()
        return jsonify([exam.to_dict() for exam in exames]), 200
    except Exception as e:
        print(f"Erro ao buscar exames: {e}")
        return jsonify({"error": "Erro ao buscar exames."}), 500


@pet_routes.route('/api/pet/<int:pet_id>/vacinas', methods=['POST'])
@jwt_required()
def adicionar_vacina(pet_id):
    try:
        data = request.get_json()
        vacina = Vaccine(
            name=data['name'],
            date=datetime.strptime(data['date'], '%Y-%m-%d').date(),
            time=datetime.strptime(data['time'], '%H:%M').time(),
            pet_id=pet_id
        )
        db.session.add(vacina)
        db.session.commit()
        return jsonify({"message": "Vacina adicionada com sucesso."}), 201
    except Exception as e:
        print(f"Erro ao adicionar vacina: {e}")
        return jsonify({"error": "Erro ao adicionar vacina."}), 500


@pet_routes.route('/api/pet/<int:pet_id>/exames', methods=['POST'])
@jwt_required()
def adicionar_exame(pet_id):
    try:
        data = request.get_json()
        exame = Exam(
            name=data['name'],
            date=datetime.strptime(data['date'], '%Y-%m-%d').date(),
            time=datetime.strptime(data['time'], '%H:%M').time(),
            pet_id=pet_id
        )
        db.session.add(exame)
        db.session.commit()
        return jsonify({"message": "Exame adicionado com sucesso."}), 201
    except Exception as e:
        print(f"Erro ao adicionar exame: {e}")
        return jsonify({"error": "Erro ao adicionar exame."}), 500



@pet_routes.route('/pets', methods=['GET'])
def listar_pets_page():
    try:
        return render_template('pets.html')  # Certifique-se de que o arquivo pets.html existe
    except Exception as e:
        print(f"Erro ao renderizar a página de pets: {e}")
        return jsonify({"error": "Erro ao carregar a página de pets."}), 500




@pet_routes.route('/api/pets', methods=['GET'])
def listar_pets():
    try:
        pets = Pet.query.all()  # Recupera todos os pets do banco de dados
        return jsonify({"pets": [pet.to_dict() for pet in pets]}), 200
    except Exception as e:
        print(f"Erro ao listar os pets: {e}")
        return jsonify({"error": "Erro ao listar os pets."}), 500

@pet_routes.route('/api/pet/<int:pet_id>', methods=['GET'])
@jwt_required()  # Exige o token JWT no cabeçalho Authorization
def obter_pet_por_id(pet_id):
    try:
        # Busca o pet pelo ID no banco de dados
        pet = Pet.query.filter_by(id=pet_id).first()
        if not pet:
            return jsonify({"error": "Pet não encontrado."}), 404
        return jsonify({"pet": pet.to_dict()}), 200
    except Exception as e:
        print(f"Erro ao obter informações do pet: {e}")
        return jsonify({"error": "Erro ao obter informações do pet."}), 500

