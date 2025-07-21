import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AirtableConfig {
  apiKey: string;
  baseId: string;
}

async function getAirtableConfig(): Promise<AirtableConfig> {
  const apiKey = Deno.env.get('AIRTABLE_API_KEY');
  const baseId = Deno.env.get('AIRTABLE_BASE_ID');
  
  if (!apiKey || !baseId) {
    throw new Error('Airtable credentials not configured');
  }
  
  return { apiKey, baseId };
}

async function makeAirtableRequest(endpoint: string, options: RequestInit = {}) {
  const { apiKey, baseId } = await getAirtableConfig();
  
  const response = await fetch(`https://api.airtable.com/v0/${baseId}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Airtable API error: ${response.status} ${error}`);
  }
  
  return response.json();
}

async function processFile(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const text = new TextDecoder().decode(arrayBuffer);
    
    // Basic text extraction - in production, you'd use proper PDF parsing
    // For PDF files, you'd use a library like pdf-parse
    return text;
  } catch (error) {
    console.error('Error processing file:', error);
    return 'Could not process file';
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname.replace('/airtable-proxy', '');
    
    if (path === '/job-descriptions') {
      const data = await makeAirtableRequest('/JobDescriptions');
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    if (path === '/candidates') {
      const position = url.searchParams.get('position');
      const filterFormula = position ? `{Position} = "${position}"` : '';
      const endpoint = filterFormula 
        ? `/Candidates?filterByFormula=${encodeURIComponent(filterFormula)}`
        : '/Candidates';
      
      const data = await makeAirtableRequest(endpoint);
      
      // Process files for candidates
      const processedRecords = await Promise.all(
        data.records.map(async (record: any) => {
          const resumeUrl = record.fields['Resume File']?.[0]?.url;
          const interviewUrl = record.fields['Interview File']?.[0]?.url;
          
          const resumeText = resumeUrl ? await processFile(resumeUrl) : '';
          const interviewText = interviewUrl ? await processFile(interviewUrl) : '';
          
          return {
            ...record,
            fields: {
              ...record.fields,
              ResumeText: resumeText,
              InterviewText: interviewText,
            }
          };
        })
      );
      
      return new Response(JSON.stringify({ ...data, records: processedRecords }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    if (path.startsWith('/update-job/')) {
      const recordId = path.split('/')[2];
      const body = await req.json();
      
      const data = await makeAirtableRequest(`/JobDescriptions/${recordId}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      });
      
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    return new Response('Not found', { status: 404, headers: corsHeaders });
    
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
})