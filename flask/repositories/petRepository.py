from models.Pet import Pet, Vaccine, Exam
from extensions import db
from datetime import datetime

class PetRepository:
    @staticmethod
    def create_pet(name, species, breed, age, weight, vaccinated, additional_info, user_id):
        try:
            pet = Pet(
                name=name,
                species=species,
                breed=breed,
                age=age,
                weight=weight,
                vaccinated=vaccinated,
                additional_info=additional_info,
                user_id=user_id
            )
            db.session.add(pet)
            db.session.commit()
            return pet
        except Exception as e:
            db.session.rollback()
            raise

    @staticmethod
    def get_pet_by_user_id(user_id):
        try:
            pet = Pet.query.filter_by(user_id=user_id).first()
            return pet
        except Exception as e:
            raise

    @staticmethod
    def update_pet_image(pet_id, image_url):
        try:
            pet = Pet.query.filter_by(id=pet_id).first()
            if not pet:
                raise Exception("Pet não encontrado para atualização da imagem.")

            pet.image_url = image_url
            db.session.commit()
            return pet
        except Exception as e:
            db.session.rollback()
            raise

    @staticmethod
    def update_pet_info(pet_id, data):
        try:
            pet = Pet.query.filter_by(id=pet_id).first()
            if not pet:
                raise Exception("Pet não encontrado para atualização.")

            if 'name' in data:
                pet.name = data['name']
            if 'species' in data:
                pet.species = data['species']
            if 'age' in data:
                pet.age = int(data['age'])
            if 'weight' in data:
                pet.weight = float(data['weight'])
            if 'vaccinated' in data:
                pet.vaccinated = data['vaccinated']
            if 'additional_info' in data:
                pet.additional_info = data['additional_info']

            db.session.commit()
            return pet
        except Exception as e:
            db.session.rollback()
            raise

    @staticmethod
    def get_vaccines_by_pet_id(pet_id):
        try:
            vaccines = Vaccine.query.filter_by(pet_id=pet_id).all()
            return [
                {
                    "name": vaccine.name,
                    "date": vaccine.date.strftime("%d/%m/%Y"),  # Convertendo para o formato DD/MM/YYYY
                    "time": vaccine.time.strftime("%H:%M") if vaccine.time else "Horário não especificado"
                }
                for vaccine in vaccines
            ]
        except Exception as e:
            print(f"Erro ao buscar vacinas: {e}")
            raise

    @staticmethod
    def get_exams_by_pet_id(pet_id):
        try:
            exams = Exam.query.filter_by(pet_id=pet_id).all()
            return [
                {
                    "name": exam.name,
                    "date": exam.date.strftime("%d/%m/%Y"),  # Convertendo para o formato DD/MM/YYYY
                    "time": exam.time.strftime("%H:%M") if exam.time else "Horário não especificado"
                }
                for exam in exams
            ]
        except Exception as e:
            print(f"Erro ao buscar exames: {e}")
            raise

    @staticmethod
    def add_vaccine_to_pet(pet_id, data):
        try:
            # Convertendo os dados recebidos para os tipos adequados
            date_str = data.get('date')
            time_str = data.get('time')

            # Converte a data
            if date_str:
                date_obj = datetime.strptime(date_str, "%Y-%m-%d").date()
            else:
                raise ValueError("Data da vacina é obrigatória.")

            # Converte o horário, se disponível
            if time_str:
                time_obj = datetime.strptime(time_str, "%H:%M").time()
            else:
                time_obj = None

            # Cria a vacina
            vaccine = Vaccine(
                name=data['name'],
                date=date_obj,
                time=time_obj,
                pet_id=pet_id
            )
            db.session.add(vaccine)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            print(f"Erro ao adicionar vacina: {e}")
            raise

    @staticmethod
    def add_exam_to_pet(pet_id, data):
        try:
            # Convertendo os dados recebidos para os tipos adequados
            date_str = data.get('date')
            time_str = data.get('time')

            # Converte a data
            if date_str:
                date_obj = datetime.strptime(date_str, "%Y-%m-%d").date()
            else:
                raise ValueError("Data do exame é obrigatória.")

            # Converte o horário, se disponível
            if time_str:
                time_obj = datetime.strptime(time_str, "%H:%M").time()
            else:
                time_obj = None

            # Cria o exame
            exam = Exam(
                name=data['name'],
                date=date_obj,
                time=time_obj,
                pet_id=pet_id
            )
            db.session.add(exam)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            print(f"Erro ao adicionar exame: {e}")
            raise
