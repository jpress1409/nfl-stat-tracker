import pandas as pd
import nfl_data_py as nfl

def get_receiving_stats(year=2024, position='WR'):
    """
    Get receiving statistics for a given year and position.
    
    Args:
        year (int): NFL season year (default: 2024)
        position (str): Player position filter (default: 'WR')
    
    Returns:
        pd.DataFrame: Season receiving stats sorted by receiving yards
    """
    rec_cols = ["week", "player_id", "player_name", "position", 
                "receptions", "targets", "receiving_yards"]
    
    rec_yards = nfl.import_weekly_data([year], rec_cols)
    rec_yards = rec_yards[rec_yards['position'] == position]
    
    # Group by week and player to handle multi-game weeks
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
    
    return season_totals.sort_values(by='receiving_yards', ascending=False)

def get_weekly_receiving_stats(year=2024, week=None, position='WR'):
    """
    Get weekly receiving statistics for a given year and optionally a specific week.
    
    Args:
        year (int): NFL season year (default: 2024)
        week (int, optional): Specific week number (default: None for all weeks)
        position (str): Player position filter (default: 'WR')
    
    Returns:
        pd.DataFrame: Weekly receiving stats sorted by receiving yards
    """
    rec_cols = ["week", "player_id", "player_name", "position", 
                "receptions", "targets", "receiving_yards"]
    
    rec_yards = nfl.import_weekly_data([year], rec_cols)
    rec_yards = rec_yards[rec_yards['position'] == position]
    
    if week is not None:
        rec_yards = rec_yards[rec_yards['week'] == week]
    
    wr_rows = rec_yards.groupby(['week', 'player_id'], as_index=False).agg({
        'player_name': 'first',
        'position': 'first',
        'receptions': 'sum',
        'targets': 'sum',
        'receiving_yards': 'sum'
    })
    
    return wr_rows.sort_values(by='receiving_yards', ascending=False)

def get_team_stats(year=2024):
    """
    Get team performance statistics for a given year.
    
    Args:
        year (int): NFL season year (default: 2024)
    
    Returns:
        pd.DataFrame: Team stats sorted by total yards gained
    """
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
    
    return stats.sort_values(by='yards_gained', ascending=False)

def get_weekly_data(years=None, columns=None):
    """
    Get raw weekly data for specified years and columns.
    
    Args:
        years (list, optional): List of years to fetch (default: [2024])
        columns (list, optional): List of columns to fetch (default: all)
    
    Returns:
        pd.DataFrame: Raw weekly data
    """
    if years is None:
        years = [2024]
    
    return nfl.import_weekly_data(years, columns)

def get_pbp_data(years=None, columns=None):
    """
    Get play-by-play data for specified years and columns.
    
    Args:
        years (list, optional): List of years to fetch (default: [2024])
        columns (list, optional): List of columns to fetch (default: all)
    
    Returns:
        pd.DataFrame: Play-by-play data
    """
    if years is None:
        years = [2024]
    
    return nfl.import_pbp_data(years, columns)
