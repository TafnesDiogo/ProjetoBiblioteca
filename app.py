from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy

# Inicialização do aplicativo Flask e configuração do banco de dados SQLite
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///meubanco.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Definição do modelo de dados
class Livro(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(100), nullable=False)
    autor = db.Column(db.String(100), nullable=False)
    ano_publicacao = db.Column(db.Integer, nullable=False)
    genero = db.Column(db.String(100), nullable=False)

    def __repr__(self):
        return f'<Livro {self.titulo}>'

# Rotas CRUD
@app.route('/livro', methods=['POST'])
def adicionar_livro():
    dados = request.json
    novo_livro = Livro(titulo=dados['titulo'], autor=dados['autor'], ano_publicacao=dados['ano_publicacao'], genero=dados['genero'])
    db.session.add(novo_livro)
    db.session.commit()
    return jsonify({'mensagem': 'Livro adicionado com sucesso!'}), 201

@app.route('/livros', methods=['GET'])
def listar_livros():
    livros = Livro.query.all()
    return jsonify([{'id': livro.id, 'titulo': livro.titulo, 'autor': livro.autor, 'ano_publicacao': livro.ano_publicacao, 'genero': livro.genero} for livro in livros])

@app.route('/livro/<int:id>', methods=['GET'])
def pegar_livro(id):
    livro = Livro.query.get_or_404(id)
    return jsonify({'id': livro.id, 'titulo': livro.titulo, 'autor': livro.autor, 'ano_publicacao': livro.ano_publicacao, 'genero': livro.genero})

@app.route('/livro/<int:id>', methods=['PUT'])
def atualizar_livro(id):
    livro = Livro.query.get_or_404(id)
    dados = request.json
    livro.titulo = dados.get('titulo', livro.titulo)
    livro.autor = dados.get('autor', livro.autor)
    livro.ano_publicacao = dados.get('ano_publicacao', livro.ano_publicacao)
    livro.genero = dados.get('genero', livro.genero)
    db.session.commit()
    return jsonify({'mensagem': 'Livro atualizado com sucesso!'})

@app.route('/livro/<int:id>', methods=['DELETE'])
def deletar_livro(id):
    livro = Livro.query.get_or_404(id)
    db.session.delete(livro)
    db.session.commit()
    return jsonify({'mensagem': 'Livro deletado com sucesso!'})

# Executar o aplicativo
if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Cria o banco de dados e as tabelas dentro do contexto da aplicação
    app.run(debug=True)
