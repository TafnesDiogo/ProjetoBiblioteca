from flask import Flask, request, jsonify, render_template, session
from flask_sqlalchemy import SQLAlchemy

# Inicialização do aplicativo Flask e configuração do banco de dados SQLite
app = Flask(__name__)
app.secret_key = 'chave_secreta'
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

class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    senha = db.Column(db.String(100), nullable=False)

    def __repr__(self):
        return f'<Usuario {self.nome}>'

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
    return jsonify({'mensagem': 'Livro atualizado com sucesso!'}), 200

@app.route('/livro/<int:id>', methods=['DELETE'])
def deletar_livro(id):
    livro = Livro.query.get_or_404(id)
    db.session.delete(livro)
    db.session.commit()
    return jsonify({'mensagem': 'Livro deletado com sucesso!'}), 200

@app.route('/usuarios', methods=['GET'])
def listar_usuarios():
    usuarios = Usuario.query.all()
    return jsonify([{'id': usuario.id, 'nome':usuario.nome, 'email': usuario.email} for usuario in usuarios])

@app.route('/usuario', methods=['POST'])
def adicionar_usuario():
    dados = request.json
    if request.path == '/login':
        data = request.json
        email = data['email']
        password = data['senha']
        user = db.session.execute(db.select(Usuario).where(Usuario.email == email)).scalar_one()

        if password == user.senha:
            session['logged_in'] = True
            return jsonify({'mensagem': 'Login bem-sucedido!'}), 200
        else:
            return jsonify({'erro': 'Usuário ou senha inválidos.'}), 401
    elif request.path == '/cadastrar':
        user = db.session.execute(db.select(Usuario).where(Usuario.email == email)).scalar_one()
        if user != None:
            novo_usuario = Usuario(nome=dados['nome'], email=dados['email'], senha=dados['senha'])
            db.session.add(novo_usuario)
            db.session.commit()
            return jsonify({'mensagem': 'Usuário cadastrado com sucesso!'})
        else:
            return jsonify({'erro': 'E-mail já cadastrado no sistema.'}), 401

@app.route('/livro/<int:id>', methods=['GET'])
def pegar_usuario(id):
    usuario = Usuario.query.get_or_404(id)
    return jsonify({'id': usuario.id, 'nome': usuario.nome, 'email': usuario.email})

@app.route('/livro/<int:id>', methods=['PUT', 'PATCH'])

@app.route('/login', methods=['GET'])
def login_page():
    return render_template('login.html')

@app.route('/cadastrar', methods=['GET'])
def cadastrar():
    return render_template('cadastrar.html')

@app.route('/', methods=['GET'])
def index():
    if 'logged_in' in session:
        return render_template('index.html')
    else:
        return render_template('allBooks.html')

# Executar o aplicativo
if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Cria o banco de dados e as tabelas dentro do contexto da aplicação
    app.run(debug=True)
