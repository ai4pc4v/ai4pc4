const AIRTABLE_API_KEY = 'patM04rhUWe1qOOgY.ee040692d361bfd89bd5a2c3a9fc63788989a109ed03bf37c30ced0dd9c04937';
const BASE_ID = 'appJrBo98yKvPNKBh';

export interface JobDescription {
  id: string;
  position: string;
  description?: string;
}

export interface Candidate {
  id: string;
  name: string;
  position: string;
  resumeFile?: string;
  interviewFile?: string;
  resumeText?: string;
  interviewText?: string;
}

class AirtableService {
  private baseUrl = `/api/airtable/${BASE_ID}`;
  
  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Airtable API error:', response.status, errorText);
      throw new Error(`Airtable API error: ${response.status} ${errorText}`);
    }
    
    return response.json();
  }


  async downloadFileAsText(url: string): Promise<string> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.status}`);
    }
    
    // Check if it's a PDF file
    const contentType = response.headers.get('content-type') || '';
    const isPDF = contentType.includes('application/pdf') || url.toLowerCase().includes('.pdf');
    
    if (isPDF) {
      // For PDFs, we'll get a simplified representation since we can't parse them client-side
      return `[PDF Document - Content needs to be extracted server-side. URL: ${url}]`;
    }
    
    return response.text();
  }

  async getJobDescriptions(): Promise<JobDescription[]> {
    try {
      console.log('Attempting to fetch job descriptions...');
      const data = await this.makeRequest('/JobDescriptions');
      console.log('Airtable response:', data);
      return data.records.map((record: any) => ({
        id: record.id,
        position: record.fields.Position,
        description: record.fields.Description,
      }));
    } catch (error) {
      console.error('Failed to fetch job descriptions:', error);
      // Try alternative table names
      try {
        console.log('Trying alternative table name: Job Descriptions');
        const data = await this.makeRequest('/Job%20Descriptions');
        console.log('Alternative table response:', data);
        return data.records.map((record: any) => ({
          id: record.id,
          position: record.fields.Position,
          description: record.fields.Description,
        }));
      } catch (altError) {
        console.error('Alternative table name also failed:', altError);
        throw error;
      }
    }
  }

  async updateJobDescription(id: string, description: string): Promise<void> {
    await this.makeRequest(`/JobDescriptions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        fields: {
          Description: description,
        },
      }),
    });
  }

  async getCandidatesByPosition(position: string): Promise<Candidate[]> {
    const filter = `{Position} = "${position}"`;
    const data = await this.makeRequest(`/Candidates?filterByFormula=${encodeURIComponent(filter)}`);
    
    const candidates = data.records.map((record: any) => ({
      id: record.id,
      name: record.fields.Name,
      position: record.fields.Position,
      resumeFile: record.fields['Resume File']?.[0]?.url,
      interviewFile: record.fields['Interview File']?.[0]?.url,
    }));

    // Download file content for each candidate
    for (const candidate of candidates) {
      if (candidate.resumeFile) {
        candidate.resumeText = await this.downloadFileAsText(candidate.resumeFile);
      }
      if (candidate.interviewFile) {
        candidate.interviewText = await this.downloadFileAsText(candidate.interviewFile);
      }
    }

    return candidates;
  }
}

export const airtableService = new AirtableService();