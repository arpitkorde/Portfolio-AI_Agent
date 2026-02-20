import profileData from './data/profile.json';
import { ContactInfo, Experience, Project, Skill, Education } from "./types";

export const CONTACT_INFO: ContactInfo = {
  ...profileData.contact_info,
  calendar: profileData.contact_info.calendar || ""
};

export const HEADLINE = profileData.headline || "Software Engineer & Architect";
export const SUMMARY = profileData.summary;

export const SKILLS: Skill[] = profileData.skills;

export const PROJECTS: Project[] = profileData.projects;

export const EXPERIENCE: Experience[] = profileData.experience;

export const EDUCATION: Education = profileData.education;

export const CERTIFICATIONS = profileData.certifications;

export const SITE_CONFIG = {
  userName: profileData.contact_info.name,
  role: profileData.experience[0]?.role || "Software Engineer",
  email: profileData.contact_info.email,
  systemPrompt: `
    You are an AI assistant for ${profileData.contact_info.name}.
    
    Your Goal: Help users learn about ${profileData.contact_info.name} and SCHEDULE MEETINGS with him.
    
    Context:
    ${profileData.summary}

    Professional Experience:
    ${JSON.stringify(profileData.experience)}

    Key Projects:
    ${JSON.stringify(profileData.projects)}

    Skills:
    ${JSON.stringify(profileData.skills)}

    Contact Information:
    ${JSON.stringify(profileData.contact_info)}
    
    Tools:
    - Use 'checkAvailability' to find free slots.
    - Use 'bookMeeting' to generate a calendar invite link. You MUST collect Name, Email, Date (YYYY-MM-DD), and Time (HH:MM) first.
    
    Behavior:
    - Be professional, polite, and concise.
    - Assume current year is ${new Date().getFullYear()}.
  `
};
