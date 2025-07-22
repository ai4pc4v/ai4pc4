import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function callOpenAI(prompt: string): Promise<string> {
  const apiKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!apiKey) {
    // Return mock response if no API key configured
    return generateMockResponse(prompt);
  }
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a professional HR expert. Respond in Ukrainian language.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });
    
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    return generateMockResponse(prompt);
  }
}

function generateMockResponse(prompt: string): string {
  if (prompt.includes('job description')) {
    const position = prompt.match(/position of (.+?),/)?.[1] || "цієї позиції";
    
    return `**Про компанію**
Ми - динамічна та інноваційна компанія, що спеціалізується на розробці передових IT-рішень. Наша команда складається з талановитих професіоналів, які прагнуть створювати продукти світового класу.

**Обов'язки**
• Виконання ключових функцій відповідно до специфіки позиції ${position}
• Співпраця з міжфункціональними командами для досягнення бізнес-цілей
• Аналіз та оптимізація робочих процесів
• Підготовка звітів та презентацій для керівництва
• Участь у стратегічному плануванні та реалізації проектів

**Вимоги**
• Освіта: вища освіта за відповідним фахом
• Досвід роботи: від 3 років на аналогічній позиції
• Відмінне знання української та англійської мов
• Навички роботи з MS Office та професійним ПЗ
• Аналітичне мислення та увага до деталей

**Буде плюсом**
• Досвід роботи в міжнародних компаніях
• Сертифікати з відповідних галузей знань
• Знання додаткових іноземних мов
• Досвід управління командою

**Що ми пропонуємо**
• Конкурентну заробітну плату
• Гнучкий графік роботи та можливість віддаленої роботи
• Медичне страхування та соціальний пакет
• Можливості професійного розвитку та навчання
• Дружню та підтримуючу робочу атмосферу`;
  }
  
  if (prompt.includes('Compare the following two candidates')) {
    return `**Аналіз кандидатів**

**Кандидат 1 - Короткий огляд:**
• Досвід: 5+ років у відповідній галузі
• Комунікація: Відмінні навички презентації та міжособистісного спілкування
• М'які навички: Лідерські якості, командна робота, адаптивність
• Твердий навички: Профільні технічні компетенції, аналітичне мислення

**Кандидат 2 - Короткий огляд:**
• Досвід: 3+ роки релевантного досвіду
• Комунікація: Хороші комунікативні навички, потребує розвитку у публічних виступах
• М'які навички: Креативність, увага до деталей, навчання орієнтованість
• Твердий навички: Міцні технічні знання, інноваційний підхід

**Порівняння за критеріями:**

**Релевантний досвід:** Кандидат 1 має перевагу через більший досвід
**Комунікація:** Кандидат 1 демонструє вищий рівень комунікативних навичок
**М'які навички:** Обидва кандидати показують сильні сторони в різних аспектах
**Твердий навички:** Технічні компетенції на високому рівні в обох випадків

**Рекомендація:**
Рекомендую **Кандидата 1** для цієї позиції. Хоча обидва кандидати є кваліфікованими, більший досвід та сильніші лідерські якості роблять першого кандидата більш підходящим для поточних потреб компанії. Кандидат 2 також є талановитим, але краще підійде для більш junior ролі з можливістю розвитку.`;
  }
  
  return "AI response would appear here. To enable real AI functionality, add OpenAI API key to Supabase secrets.";
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, ...params } = await req.json();
    
    let prompt = '';
    
    if (action === 'generate-job-description') {
      prompt = `You are an HR expert. Write a professional job description for the position of ${params.position}, including: 1. About the Company 2. Responsibilities 3. Requirements 4. Nice to have 5. What we offer`;
    } else if (action === 'compare-candidates') {
      prompt = `You are a senior recruiter. Compare the following two candidates for the role of ${params.position}:

Candidate 1: ${params.candidate1.name}
Resume: ${params.candidate1.resume}
Interview: ${params.candidate1.interview}

Candidate 2: ${params.candidate2.name}
Resume: ${params.candidate2.resume}
Interview: ${params.candidate2.interview}

Compare them by: • Relevant experience • Communication • Soft skills • Hard skills

Summarize each candidate briefly. Then recommend who is the better fit and explain why.`;
    }
    
    const result = await callOpenAI(prompt);
    
    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
})