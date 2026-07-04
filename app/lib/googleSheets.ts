// app/lib/googleSheets.ts

export interface DashboardFounder {
  name: string;
  role: string;
  company: string;
  industry: string;
  stage: string;
  location: string;
  tags: string[];
  avatar: string;
  rating: number;
  views: number;
  meetings: number;
  available: boolean;
  verified: boolean;
  bio: string;
  email: string;
  linkedin: string;
  companywebsite: string;
}

/**
 * Parses a CSV string into an array of objects.
 * Handles double quotes, commas within quotes, and escaped quotes.
 */
export function parseCSV(csvText: string): DashboardFounder[] {
  const lines: string[][] = [];
  let currentLine: string[] = [];
  let currentCell = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          currentCell += '"';
          i++; // skip next quote
        } else {
          inQuotes = false;
        }
      } else {
        currentCell += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        currentLine.push(currentCell.trim());
        currentCell = '';
      } else if (char === '\n' || char === '\r') {
        if (char === '\r' && nextChar === '\n') {
          i++; // skip \n
        }
        currentLine.push(currentCell.trim());
        lines.push(currentLine);
        currentLine = [];
        currentCell = '';
      } else {
        currentCell += char;
      }
    }
  }

  if (currentCell || currentLine.length > 0) {
    currentLine.push(currentCell.trim());
    lines.push(currentLine);
  }

  if (lines.length < 2) return [];

  // Normalize headers (lowercase, alphanumeric only)
  const headers = lines[0].map(h => h.toLowerCase().trim().replace(/[^a-z0-9]/g, ''));
  
  return lines.slice(1).map((row, idx) => {
    const obj: any = {};
    headers.forEach((header, index) => {
      const value = row[index] || '';
      obj[header] = value;
    });

    const name = obj.name || '';
    const avatar = name ? name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) : 'FN';
    
    // Map sheet-specific columns
    const company = obj.website || obj.company || 'Stealth Startup';
    const email = obj.email || '';
    
    // Format linkedin link properly if it's just a username
    let linkedin = obj.linkedin || '';
    if (linkedin && !linkedin.startsWith('http') && !linkedin.includes('linkedin.com')) {
      linkedin = `https://linkedin.com/in/${linkedin.replace(/^@/, '')}`;
    } else if (linkedin && !linkedin.startsWith('http')) {
      linkedin = `https://${linkedin}`;
    }

    const companywebsite = obj.companywebsite || '';
    
    // "feild" contains comma separated descriptions. We use the first one or general 'IT & Tech'
    const feildValue = obj.feild || '';
    const industry = feildValue ? feildValue.split(',')[0].trim() : 'IT & Tech';
    
    // "startupstartup" maps to Est. Year
    const stage = obj.startupstartup ? `Est. ${obj.startupstartup}` : 'Est. 2024';
    
    // Extract tags from "feild" description (words between 3 and 20 chars long)
    const rawTags = feildValue ? feildValue.split(',').map((t: string) => t.trim()) : ['IT Services'];
    const tagsVal = rawTags
      .filter((t: string) => t.length > 0 && t.length < 25)
      .slice(0, 3);
    if (tagsVal.length === 0) {
      tagsVal.push(feildValue ? feildValue.slice(0, 15) + '...' : 'Founder');
    }

    const bio = feildValue || 'Entrepreneur & Tech Builder';

    return {
      name: name,
      role: 'Founder',
      company: company,
      industry: industry.length > 25 ? industry.slice(0, 22) + '...' : industry,
      stage: stage,
      location: obj.location || 'Pakistan',
      tags: tagsVal,
      avatar: avatar,
      rating: parseFloat((4.7 + ((idx % 4) * 0.1)).toFixed(1)),
      views: 120 + ((idx * 13) % 180),
      meetings: 8 + ((idx * 5) % 25),
      available: true,
      verified: true,
      bio: bio,
      email: email,
      linkedin: linkedin,
      companywebsite: companywebsite,
    } as DashboardFounder;
  }).filter(f => f.name.trim() !== ''); // only include rows that have a valid name
}

/**
 * Fetches CSV data from a published Google Sheet and parses it.
 */
export async function fetchFoundersFromGoogleSheet(sheetUrl: string): Promise<DashboardFounder[]> {
  try {
    const res = await fetch(sheetUrl, {
      cache: 'no-store', // Always fetch fresh data from Google Sheets
    });
    if (!res.ok) throw new Error(`Failed to fetch Google Sheet data: ${res.statusText}`);
    const csvText = await res.text();
    return parseCSV(csvText);
  } catch (error) {
    console.error('Error fetching/parsing founders from Google Sheet:', error);
    throw error;
  }
}
