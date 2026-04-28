# Ref Monitor — Football Referees, Explained by Data

Ref Monitor is a **sports analytics platform** that evaluates and explains football referees using data-driven insights.

The platform transforms complex referee behaviour into **simple, visual, and actionable metrics** for fans, analysts, and media.

---

## Project Overview

Ref Monitor provides:

- Referee performance scoring  
- Match impact predictions  
- Referee behaviour analysis  
- Data-driven insights & trends  

The goal is to make refereeing **transparent, understandable, and engaging**.

---

##  Key Features

### Home Page
- Quick explanation of the platform  
- Referee of the Week  
- Chaos Fixture Alert  
- Penalty Watch  
- Featured Match Insight  
- Referee profile preview  
- Data-driven insights  
- Methodology preview  
- Newsletter section  

---

###  Referee Rankings
- Leaderboard based on **Ref Monitor Score**  
- Sort & filter by metrics  
- Search referees  

Metrics include:
- Strictness  
- Chaos Index  
- RM Score  

---

###  Referee Profile
- Detailed referee analytics  
- Radar-style "Referee DNA"  
- Metrics:
  - Strictness  
  - Chaos  
  - Game Control  
  - VAR interaction  
- Historical trends  
- Key statistics  

---

### Match Insights
- Fixture-level predictions  
- Referee influence on matches  

Metrics include:
- Ref Impact Score  
- Expected Cards  
- Penalty Probability  

Risk classification:
-  Green  
-  Amber  
-  Red  

---

### Insights Page
- Data-driven insights (not blog-based)  

Examples:
- Most chaotic fixtures  
- Strictest referees  
- Penalty trends  
- VAR-heavy referees  

---

### Methodology Page
- Transparent scoring explanation  
- Metric definitions:
  - Strictness Index  
  - Chaos Index  
  - Pressure Sensitivity  
- Weighted scoring model  
- Data pipeline overview  

---

## Tech Stack

### Frontend
-  React (Vite)  
-  Tailwind CSS  
-  Redux Toolkit  
-  React Router  
-  Lucide Icons  

### Backend (API)
- REST API endpoints:
  - `/ref_profiles`
  - `/fixture_predictions`
  - `/ref_profile`
  - `/fixture_score`

---

##  Project Structure
src/
│
├── app/
│ ├── store/
│ └── slices/
│
├── components/
│ ├── home/
│ ├── rankings/
│ ├── referees/
│ ├── matches/
│ ├── insights/
│ └── methodology/
│
├── pages/
│ ├── HomePage.jsx
│ ├── RankingsPage.jsx
│ ├── RefereesPage.jsx
│ ├── RefereeProfilePage.jsx
│ ├── MatchesPage.jsx
│ ├── MatchInsightPage.jsx
│ ├── InsightsPage.jsx
│ └── MethodologyPage.jsx
│
├── services/
│ ├── apiClient.js
│ ├── refereeApi.js
│ └── fixtureApi.js
│
└── App.jsx



## Data Flow

1. Backend provides processed referee & fixture data
2. Redux manages global state
3. Components render UI based on data
4. Data is displayed using:
   - cards
   - tables
   - metrics
   - visual indicators

---

##  Design Philosophy

- Clean & modern UI
- Sports analytics dashboard feel
- Data-first approach
- Easy to understand within 10–15 seconds
- Responsive (desktop & mobile)
- Minimal clutter, maximum clarity

---

## Newsletter (Current Status)

- Accepts user email input
- Displays: **"Newsletter signup coming soon"**
- No backend integration yet

---

##  Setup Instructions

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Make sure backend is running at:

http://127.0.0.1:8000