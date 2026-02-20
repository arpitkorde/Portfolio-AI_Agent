const fs = require('fs');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error("Error: GEMINI_API_KEY environment variable not set.");
  process.exit(1);
}

const genAI = new GoogleGenAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

async function parseResume(filePath) {
  console.log(`Parsing resume from: ${filePath}`);

  const resumeContent = fs.readFileSync(filePath).toString('base64');

  const prompt = `
    You are an expert resume parser. Your goal is to extract structured data from the provided resume to populate a developer portfolio.
    
    Please extract the following information in JSON format:
    {
      "contact_info": {
        "name": "Full Name",
        "email": "Email Address",
        "phone": "Phone Number",
        "location": "City, Country",
        "linkedin": "LinkedIn URL",
        "github": "GitHub URL"
      },
      "headline": "A short 1-sentence professional headline (e.g. 'Senior AI Engineer building agentic workflows')",
      "summary": "A professional summary of the candidate (max 3-4 sentences).",
      "skills": [
        {
          "category": "Category Name (e.g., Frontend, Backend, AI)",
          "items": ["Skill 1", "Skill 2"]
        }
      ],
      "projects": [
        {
          "title": "Project Title",
          "role": "Role in project",
          "period": "Time period",
          "description": "Brief description",
          "techStack": ["Tech 1", "Tech 2"],
          "features": ["Feature 1", "Feature 2"],
          "impact": ["Impact 1", "Impact 2"],
          "link": "Project URL"
        }
      ],
      "experience": [
        {
          "company": "Company Name",
          "role": "Job Title",
          "location": "Location",
          "period": "Time Period",
          "highlights": ["Key achievement 1", "Key achievement 2"]
        }
      ],
       "education": {
        "degree": "Degree Name",
        "university": "University Name",
        "year": "Graduation Year"
      },
       "certifications": ["Cert 1", "Cert 2"]
    }

    Return ONLY the JSON. Do not include markdown formatting.
  `;

  const result = await model.generateContent([
    prompt,
    {
      inlineData: {
        data: resumeContent,
        mimeType: "application/pdf"
      }
    }
  ]);

  const response = await result.response;
  const text = response.text();

  try {
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '');
    return JSON.parse(cleanedText);
  } catch (e) {
    console.error("Failed to parse Gemini response:", e);
    return null;
  }
}

async function main() {
  const resumePath = process.argv[2];
  if (!resumePath) {
    console.error("Usage: node scripts/generate-profile.js <path-to-resume.pdf>");
    process.exit(1);
  }

  const profileData = await parseResume(resumePath);

  if (profileData) {
    const outputPath = path.join(__dirname, '../data/profile.json');
    if (!fs.existsSync(path.dirname(outputPath))) {
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    }
    fs.writeFileSync(outputPath, JSON.stringify(profileData, null, 2));
    console.log(`Profile data successfully written to ${outputPath}`);
  }
}

main();
