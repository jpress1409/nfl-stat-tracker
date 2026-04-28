import os
from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import nfl_data_py as nfl
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import numpy as np

app = Flask(__name__)
CORS(app)

# Global model variable
clf = None

def train_model():
    """Train the prediction model on historical data"""
    global clf
    years = [2019, 2020, 2021, 2022, 2023, 2024]
    
    df = nfl.import_pbp_data(years)
    df = df[df['play_type'].notna()]
    
    team_stats = df.groupby(['game_id', 'posteam'], as_index=False).agg({
        'yards_gained': 'sum',
        'epa': 'mean',
        'down': 'count',
        'pass_attempt': 'sum',
        'rush_attempt': 'sum',
        'touchdown': 'sum'
    })
    
    game_outcomes = df.groupby(['game_id', 'posteam'])['posteam_score'].max().reset_index()
    game_outcomes = game_outcomes.merge(
        df.groupby(['game_id'])[['home_team', 'home_score', 'away_team', 'away_score']].first().reset_index(),
        on='game_id'
    )
    
    def get_result(row):
        if row['posteam'] == row['home_team']:
            return 1 if row['home_score'] > row['away_score'] else 0
        else:
            return 1 if row['away_score'] > row['home_score'] else 0
    
    game_outcomes['winner'] = game_outcomes.apply(get_result, axis=1)
    labeled = pd.merge(team_stats, game_outcomes[['game_id', 'posteam', 'winner']], on=['game_id', 'posteam'])
    
    x = labeled.drop(['game_id', 'posteam', 'winner'], axis=1)
    y = labeled['winner']
    
    x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=42)
    
    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    clf.fit(x_train, y_train)
    
    return clf

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'})

@app.route('/api/receiving-stats', methods=['GET'])
def receiving_stats():
    """Get receiving stats for wide receivers by year"""
    year = request.args.get('year', 2024, type=int)
    
    rec_cols = ["week", "player_id", "player_name", "position", "receptions", "targets", "receiving_yards"]
    rec_yards = pd.DataFrame(nfl.import_weekly_data([year], rec_cols))
    rec_yards = rec_yards[rec_yards['position'] == 'WR']
    
    wr_rows = rec_yards.groupby(['week', 'player_id'], as_index=False).agg({
        'player_name': 'first',
        'position': 'first',
        'receptions': 'sum',
        'targets': 'sum',
        'receiving_yards': 'sum'
    })
    
    season_totals = wr_rows.groupby(['player_id'], as_index=False).agg({
        'player_name': 'first',
        'position': 'first',
        'receptions': 'sum',
        'targets': 'sum',
        'receiving_yards': 'sum'
    })
    
    season_totals = season_totals.sort_values(by='receiving_yards', ascending=False)
    
    return jsonify(season_totals.to_dict(orient='records'))

@app.route('/api/receiving-stats-weekly', methods=['GET'])
def receiving_stats_weekly():
    """Get weekly receiving stats for wide receivers"""
    year = request.args.get('year', 2024, type=int)
    week = request.args.get('week', type=int)
    
    rec_cols = ["week", "player_id", "player_name", "position", "receptions", "targets", "receiving_yards"]
    rec_yards = pd.DataFrame(nfl.import_weekly_data([year], rec_cols))
    rec_yards = rec_yards[rec_yards['position'] == 'WR']
    
    if week:
        rec_yards = rec_yards[rec_yards['week'] == week]
    
    wr_rows = rec_yards.groupby(['week', 'player_id'], as_index=False).agg({
        'player_name': 'first',
        'position': 'first',
        'receptions': 'sum',
        'targets': 'sum',
        'receiving_yards': 'sum'
    })
    
    wr_rows = wr_rows.sort_values(by='receiving_yards', ascending=False)
    
    return jsonify(wr_rows.to_dict(orient='records'))

@app.route('/api/team-stats', methods=['GET'])
def team_stats():
    """Get team performance stats by year"""
    year = request.args.get('year', 2024, type=int)
    
    df = nfl.import_pbp_data([year])
    df = df[df['play_type'].notna()]
    
    stats = df.groupby(['posteam'], as_index=False).agg({
        'yards_gained': 'sum',
        'epa': 'mean',
        'down': 'count',
        'pass_attempt': 'sum',
        'rush_attempt': 'sum',
        'touchdown': 'sum'
    })
    
    stats = stats.sort_values(by='yards_gained', ascending=False)
    
    return jsonify(stats.to_dict(orient='records'))

@app.route('/api/weekly-data', methods=['GET'])
def weekly_data():
    """Get raw weekly data by year"""
    years = request.args.getlist('year', type=int)
    if not years:
        years = [2024]
    
    columns = request.args.getlist('columns')
    
    raw = pd.DataFrame(nfl.import_weekly_data(years, columns if columns else None))
    
    return jsonify(raw.to_dict(orient='records'))

@app.route('/api/train-model', methods=['POST'])
def train_model_endpoint():
    """Train the prediction model"""
    try:
        model = train_model()
        return jsonify({'status': 'success', 'message': 'Model trained successfully'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/predict', methods=['POST'])
def predict():
    """Predict game outcome based on team stats"""
    global clf
    
    if clf is None:
        clf = train_model()
    
    data = request.json
    
    # Extract features in the same order as training
    features = np.array([[
        data.get('yards_gained', 0),
        data.get('epa', 0),
        data.get('down', 0),
        data.get('pass_attempt', 0),
        data.get('rush_attempt', 0),
        data.get('touchdown', 0)
    ]])
    
    prediction = clf.predict(features)[0]
    probability = clf.predict_proba(features)[0]
    
    return jsonify({
        'prediction': int(prediction),
        'win_probability': float(probability[1]),
        'lose_probability': float(probability[0])
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') == 'development'
    app.run(debug=debug, host='0.0.0.0', port=port)
