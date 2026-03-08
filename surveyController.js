const fs = require('fs/promises');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const RESPONSES_FILE = path.join(DATA_DIR, 'responses.json');
const SECTION_KEYS = ['Academic', 'CampusLife', 'Research', 'Faculties', 'AboutUs', 'Library'];

async function ensureDataFiles() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(RESPONSES_FILE);
  } catch {
    await fs.writeFile(RESPONSES_FILE, JSON.stringify([], null, 2));
  }
}

async function writeJson(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

async function readResponses() {
  const content = await fs.readFile(RESPONSES_FILE, 'utf8');
  try {
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    await writeJson(RESPONSES_FILE, []);
    return [];
  }
}

function countBy(responses, sourceKey, outKey) {
  const map = new Map();
  responses.forEach((response) => {
    const value = response[sourceKey];
    if (!value || typeof value !== 'string') return;
    const clean = value.trim();
    if (!clean) return;
    map.set(clean, (map.get(clean) || 0) + 1);
  });

  return Array.from(map.entries()).map(([value, count]) => ({
    [outKey]: value,
    count
  }));
}

function countSections(responses) {
  const map = new Map();
  responses.forEach((response) => {
    const sections = Array.isArray(response.sections_visited) ? response.sections_visited : [];
    sections.forEach((section) => {
      if (!section || typeof section !== 'string') return;
      const clean = section.trim();
      if (!clean) return;
      map.set(clean, (map.get(clean) || 0) + 1);
    });
  });

  return Array.from(map.entries()).map(([section, count]) => ({ section, count }));
}

async function buildResults() {
  const responses = await readResponses();

  return {
    responses,
    totals: {
      layout: countBy(responses, 'layout_rating', 'layout_rating'),
      portal: countBy(responses, 'q3_portal', 'portal_usage'),
      navigation: countBy(responses, 'navigation_rating', 'navigation_rating'),
      news: countBy(responses, 'news_clarity', 'news_clarity'),
      campusFocus: countBy(responses, 'q8_campus_focus', 'campus_focus'),
      sections: countSections(responses)
    }
  };
}

async function clearAllSurveyData() {
  await writeJson(RESPONSES_FILE, []);
}

function makeResponsePayload(body) {
  const sectionsVisited = SECTION_KEYS.filter((key) => body[key]).map((key) => body[key]);

  return {
    submittedAt: new Date().toISOString(),
    participant: {
      firstname: body.firstname || '',
      lastname: body.lastname || ''
    },
    q1_goal: body.q1_goal || '',
    layout_rating: body.layout_rating || '',
    q2_comments: body.q2_comments || '',
    q3_portal: body.q3_portal || '',
    q3_comments: body.q3_comments || '',
    sections_visited: sectionsVisited,
    q4_comments: body.q4_comments || '',
    navigation_rating: body.navigation_rating || '',
    q5_comments: body.q5_comments || '',
    q6_feedback: body.q6_feedback || '',
    news_clarity: body.news_clarity || '',
    q7_comments: body.q7_comments || '',
    q8_campus_focus: body.q8_campus_focus || '',
    q8_comments: body.q8_comments || ''
  };
}

module.exports = (app) => {
  ensureDataFiles().catch((err) => {
    console.error('Failed to initialize data file:', err);
  });

  app.get('/', (req, res) => {
    res.redirect('/niceSurvey');
  });

  app.get('/niceSurvey', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'niceSurvey.html'));
  });

  app.get('/analysis', async (req, res) => {
    const results = await buildResults();
    res.render('showResults', {
      initialData: JSON.stringify(results)
    });
  });

  app.get('/api/results', async (req, res) => {
    const results = await buildResults();
    res.json(results);
  });

  app.delete('/api/results', async (req, res) => {
    await clearAllSurveyData();
    res.json({ ok: true, message: 'All survey responses cleared.' });
  });

  app.post('/api/survey', async (req, res) => {
    const payload = makeResponsePayload(req.body);
    const responses = await readResponses();
    responses.push(payload);
    await writeJson(RESPONSES_FILE, responses);

    res.status(201).json({ ok: true, message: 'Survey response saved!' });
  });
};
