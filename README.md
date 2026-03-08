# SEG3125 Lab 6 - Group 12

## How to run locally
In project root:
1. Install dependencies:
   - `npm i`
2. Start the server:
   - `node server.js`
3. Open:
   - Survey participant view: `http://localhost:3000/niceSurvey`
   - Analyst view: `http://localhost:3000/analysis`

## REST APIs

- `POST /api/survey`
  - Saves a survey response to `data/responses.json`
- `GET /api/results`
  - Returns all stored responses andthe aggregated counts for the analyst charts
- `DELETE /api/results`
  - Clears all saved survey responses from `data/responses.json`

## Project structure

- `app.js` - Express app setup and middleware
- `server.js` - server startup (port 3000)
- `surveyController.js` - route and data update logic
- `data/` - JSON storage for incoming responses and aggregates. One file.
- `views/niceSurvey.html` and `script.js` and `styles/` - participant survey UI 
- `views/showResults.ejs` - analyst dashboard with updating charts

## Notes

- The analyst page refreshes data every 1 second to show incoming responses
