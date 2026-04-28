import nfl_data_py as nfl

# Check available years for different data types
print("Checking available data in nfl_data_py...")
print()

# Check weekly data years
try:
    weekly_years = nfl.import_weekly_data([2024], downcast=False)
    if not weekly_years.empty:
        print(f"✓ Weekly data available for 2024")
        print(f"  Shape: {weekly_years.shape}")
        print(f"  Weeks: {weekly_years['week'].unique()}")
    else:
        print(f"✗ No weekly data for 2024")
except Exception as e:
    print(f"✗ Error checking weekly data for 2024: {e}")

print()

# Check play-by-play data years
try:
    pbp_years = nfl.import_pbp_data([2024], downcast=False)
    if not pbp_years.empty:
        print(f"✓ Play-by-play data available for 2024")
        print(f"  Shape: {pbp_years.shape}")
        print(f"  Weeks: {pbp_years['week'].unique()}")
    else:
        print(f"✗ No play-by-play data for 2024")
except Exception as e:
    print(f"✗ Error checking play-by-play data for 2024: {e}")

print()

# Try 2025
try:
    weekly_2025 = nfl.import_weekly_data([2025], downcast=False)
    if not weekly_2025.empty:
        print(f"✓ Weekly data available for 2025")
        print(f"  Shape: {weekly_2025.shape}")
        print(f"  Weeks: {weekly_2025['week'].unique()}")
    else:
        print(f"✗ No weekly data for 2025")
except Exception as e:
    print(f"✗ Error checking weekly data for 2025: {e}")

print()

# Try play-by-play for 2025
try:
    pbp_2025 = nfl.import_pbp_data([2025], downcast=False)
    if not pbp_2025.empty:
        print(f"✓ Play-by-play data available for 2025")
        print(f"  Shape: {pbp_2025.shape}")
        print(f"  Weeks: {pbp_2025['week'].unique()}")
    else:
        print(f"✗ No play-by-play data for 2025")
except Exception as e:
    print(f"✗ Error checking play-by-play data for 2025: {e}")
