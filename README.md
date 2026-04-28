# NFL Stats Dashboard

A full-stack NFL statistics dashboard with Flask backend and React frontend.

## Features

- **Receiving Stats**: View season-wide receiving statistics for wide receivers
- **Team Stats**: Analyze team performance metrics (yards, EPA, plays, etc.)
- **Prediction**: Use machine learning to predict game outcomes based on team stats
- **Interactive Charts**: Visual data representations using Recharts
- **Year Filtering**: View stats from multiple seasons (2020-2024)

## Tech Stack

### Backend
- Flask (Python web framework)
- nfl-data-py (NFL data API)
- pandas (Data processing)
- scikit-learn (Machine learning)
- Flask-CORS (Cross-origin support)

### Frontend
- React (UI library)
- TailwindCSS (Styling)
- Recharts (Data visualization)
- Axios (HTTP client)
- Lucide React (Icons)

## Setup

### Backend Setup

1. Navigate to the project directory:
```bash
cd nfl-stats
```

2. Create a virtual environment:
```bash
python -m venv .venv
```

3. Activate the virtual environment:
```bash
# Windows
.venv\Scripts\activate

# Mac/Linux
source .venv/bin/activate
```

4. Install backend dependencies:
```bash
pip install -r requirements.txt
```

5. Run the Flask server:
```bash
python app.py
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install frontend dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/receiving-stats?year=2024` - Get receiving stats by year
- `GET /api/receiving-stats-weekly?year=2024&week=1` - Get weekly receiving stats
- `GET /api/team-stats?year=2024` - Get team performance stats
- `GET /api/weekly-data?year=2024` - Get raw weekly data
- `POST /api/train-model` - Train the prediction model
- `POST /api/predict` - Predict game outcome (send team stats in JSON body)

## Usage

1. Make sure both the Flask backend and React frontend are running
2. Open your browser to `http://localhost:3000`
3. Use the navigation tabs to switch between:
   - **Receiving Stats**: View WR receiving statistics
   - **Team Stats**: View team performance metrics
   - **Prediction**: Enter team stats to predict game outcomes

## Project Structure

```
nfl-stats/
├── app.py                 # Flask backend application
├── requirements.txt       # Python dependencies
├── Procfile              # Render deployment configuration
├── render.yaml           # Render service definitions
├── connect.py            # Original data processing script
├── frontend/             # React frontend
│   ├── package.json      # Node dependencies
│   ├── public/           # Static files
│   ├── src/
│   │   ├── components/   # React components
│   │   │   ├── ReceivingStats.js
│   │   │   ├── TeamStats.js
│   │   │   └── Prediction.js
│   │   ├── App.js        # Main app component
│   │   ├── api.js        # API service
│   │   ├── index.css     # Global styles
│   │   └── index.js      # Entry point
│   └── tailwind.config.js
└── README.md
```

## Deployment on Render

This project is configured for deployment on Render using the `render.yaml` file.

### Prerequisites

1. Push your code to a GitHub repository
2. Create a Render account at [render.com](https://render.com)

### Deploy Steps

1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click "New +" and select "Blueprint"
3. Connect your GitHub repository
4. Render will automatically detect the `render.yaml` file
5. Review the configuration and click "Apply"

The blueprint will create:
- **nfl-stats-backend**: Flask API service (Python)
- **nfl-stats-frontend**: React static site

The frontend will automatically be configured to connect to the backend URL via the `REACT_APP_API_URL` environment variable.

### Manual Deployment

If you prefer to deploy services manually:

#### Backend Service

1. Create a new Web Service in Render
2. Select "Python" as the runtime
3. Connect your repository
4. Build Command: `pip install -r requirements.txt`
5. Start Command: `gunicorn app:app`
6. Add environment variable: `FLASK_ENV=production`

#### Frontend Service

1. Create a new Web Service in Render
2. Select "Static Site" as the runtime
3. Connect your repository
4. Build Command: `cd frontend && npm install && npm run build`
5. Publish Directory: `frontend/build`
6. Add environment variable: `REACT_APP_API_URL=<your-backend-url>`

### Environment Variables

The following environment variables are used:

**Backend:**
- `FLASK_ENV`: Set to `production` for production deployment
- `PORT`: Port number (default: 5000)

**Frontend:**
- `REACT_APP_API_URL`: URL of the backend API (e.g., `https://nfl-stats-backend.onrender.com/api`)
