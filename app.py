from flask import Flask, render_template, request, redirect, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///pmodatabase.db'
pmo_db = SQLAlchemy(app)


class PmoScores(pmo_db.Model):
    id = pmo_db.Column(pmo_db.Integer, primary_key=True)
    date_created = pmo_db.Column(pmo_db.DateTime, default=datetime.utcnow)
    score = pmo_db.Column(pmo_db.Integer, default=0)

    def __repr__(self):
        return '<Score %r>' % self.id

@app.route('/')
def index():
    pmo_scores = PmoScores.query.order_by(PmoScores.score.desc()).limit(10).all()
    remove_lower_scores()
    return render_template('index.html', scores=pmo_scores)

@app.route('/game/')
def game():
    return render_template('game.html')

@app.route('/game/update_scores/', methods=['POST'])
def update_scores():
    new_score = request.get_json().get('new_score')
    score_to_add = PmoScores(score=new_score)
    try:
        pmo_db.session.add(score_to_add)
        pmo_db.session.commit()
        print('well fuck')
        return jsonify({'message' : 'scores updated'})
    except:
        return jsonify({'error': 'An error occurred'}, 500)
    

def remove_lower_scores():
    tenth_pmo_score = PmoScores.query.order_by(PmoScores.score.desc()).offset(9).first()
    if tenth_pmo_score is not None:
        # Query for all PmoScores with a score less than the score of the tenth PmoScore
        scores_to_remove = PmoScores.query.filter(PmoScores.score < tenth_pmo_score.score).all()

        for score in scores_to_remove:
            pmo_db.session.delete(score)
        pmo_db.session.commit()



if __name__ == "__main__":
    app.run(debug=True)