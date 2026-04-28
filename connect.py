import pandas as pd
import nfl_data_py as nfl
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

win_loss_years=[2019, 2020, 2021, 2022, 2023, 2024]

def season_receiving():
    #nfl.import_pbp_data(years, columns, downcast=True, cache=False, alt_path=None)
    #nfl.import_weekly_data(years, columns, downcast)
    years = [2024]

    rec_cols = ["week", "player_id", "player_name", "position", "receptions", "targets", "receiving_yards"]
    rec_yards = pd.DataFrame(nfl.import_weekly_data(years, rec_cols))
    rec_yards = rec_yards[rec_yards['position'] == 'WR']
    wr_rows = rec_yards.groupby(['week', 'player_id'], as_index=False).agg({

        'player_name': 'first',
        'position': 'first',
        'receptions': 'sum',
        'targets': 'sum',
        'receiving_yards': 'sum'
    })

    # Group across all weeks to get season totals per player
    season_totals = wr_rows.groupby(['player_id'], as_index=False).agg({
        'player_name': 'first',
        'position': 'first',
        'receptions': 'sum',
        'targets': 'sum',
        'receiving_yards': 'sum'
    })

    # Optional: Sort by receiving yards
    season_totals = season_totals.sort_values(by='receiving_yards', ascending=False)

    season_totals.to_csv("recieving-yds-2024.csv", index=False)

def raw_data():
    years = [2020, 2021, 2022, 2023, 2024]
    raw = pd.DataFrame(nfl.import_weekly_data(years))
    raw.to_csv("raw-data.csv", index=False)


df = nfl.import_pbp_data(win_loss_years)
df = df[df['play_type'].notna()]

team_stats = df.groupby(['game_id', 'posteam'], as_index=False).agg({
    'yards_gained': 'sum',
    'epa': 'mean',
    'down': 'count',  # proxy for number of plays
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

preds = clf.predict(x_test)
print(f"Accuracy: {accuracy_score(y_test, preds)}")