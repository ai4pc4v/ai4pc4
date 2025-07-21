export class AIService {
  private getApiKey(): string | null {
    // Replace with your actual OpenAI API key
    return '';
  }

  private async callOpenAI(prompt: string): Promise<string> {
    const apiKey = this.getApiKey();
    
    if (!apiKey) {
      throw new Error('OpenAI API key not found. Please enter your API key in settings.');
    }

    console.log('🚀 Starting OpenAI API call...');
    console.log('📝 Using model: gpt-4o-mini');
    console.log('🔑 API key exists:', !!apiKey);

    try {
      const requestBody = {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Ви - експерт з підбору персоналу. Ваша відповідь має бути на українській мові, структурованою та професійною.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.2,
      };

      console.log('📤 Request body:', JSON.stringify(requestBody, null, 2));

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      console.log('📥 Response status:', response.status);
      console.log('📥 Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Response error text:', errorText);
        let error;
        try {
          error = JSON.parse(errorText);
        } catch {
          error = { error: { message: errorText } };
        }
        
        // Handle specific error types
        
        if (response.status === 429 && error.error?.code === 'insufficient_quota') {
          throw new Error('❌ QUOTA EXCEEDED: Your OpenAI API key has no remaining credits. Please add funds at https://platform.openai.com/usage or upgrade your plan.');
        }
        
        throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Response data:', data);
      return data.choices[0]?.message?.content || 'Не вдалося отримати відповідь від AI';
    } catch (error) {
      console.error('❌ OpenAI API error:', error);
      throw error;
    }
  }

  async generateJobDescription(position: string): Promise<string> {
    if (!this.getApiKey()) {
      return this.generateMockJobDescription(position);
    }

    const prompt = `Створіть детальний опис вакансії українською мовою для позиції "${position}". 

Включіть наступні розділи:
- Про компанію (загальний опис)
- Основні обов'язки (5-7 пунктів)
- Обов'язкові вимоги (освіта, досвід, навички)
- Буде плюсом (додаткові переваги)
- Що ми пропонуємо (умови роботи, бенефіти)

Зробіть опис привабливим та професійним.`;

    return this.callOpenAI(prompt);
  }

  async compareCandidates(position: string, candidate1: any, candidate2: any): Promise<string> {
    if (!this.getApiKey()) {
      return this.generateMockCandidateComparison();
    }

    const prompt = `Проаналізуйте двох кандидатів на позицію "${position}" та надайте детальне порівняння:

**КАНДИДАТ 1: ${candidate1.name}**
Резюме: ${candidate1.resume || candidate1.resumeText || 'Резюме недоступне'}

Інтерв'ю: ${candidate1.interview || candidate1.interviewText || 'Інтерв\'ю недоступне'}

**КАНДИДАТ 2: ${candidate2.name}**
Резюме: ${candidate2.resume || candidate2.resumeText || 'Резюме недоступне'}

Інтерв'ю: ${candidate2.interview || candidate2.interviewText || 'Інтерв\'ю недоступне'}

Надайте структурований аналіз включаючи:

1. **Короткий огляд кожного кандидата** (досвід, ключові навички, сильні сторони)

2. **Детальне порівняння за критеріями:**
   - Релевантний досвід роботи
   - Технічні навички
   - М'які навички (комунікація, лідерство, адаптивність)
   - Мотивація та культурна відповідність
   - Потенціал для зростання

3. **SWOT-аналіз для кожного кандидата**

4. **Фінальна рекомендація** з обґрунтуванням вибору

5. **Ризики та міtigації** для обраного кандидата

Будьте об'єктивними та професійними у своєму аналізі.`;

    return this.callOpenAI(prompt);
  }

  private generateMockJobDescription(position: string): string {
    return `**ДЕМО-РЕЖИМ** (Введіть OpenAI API ключ для реального AI аналізу)

**Про компанію**
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

  private generateMockCandidateComparison(): string {
    return `**ДЕМО-РЕЖИМ** (Введіть OpenAI API ключ для реального AI аналізу)

**Аналіз кандидатів**

**Кандидат 1 - Короткий огляд:**
• Досвід: Достатній релевантний досвід
• Комунікація: Хороші навички презентації
• М'які навички: Лідерські якості, командна робота
• Технічні навички: Профільні компетенції

**Кандидат 2 - Короткий огляд:**
• Досвід: Молодший спеціаліст з потенціалом
• Комунікація: Розвивається в публічних виступах  
• М'які навички: Креативність, навчання орієнтованість
• Технічні навички: Сучасні технічні знання

**Рекомендація:**
Для отримання детального AI-аналізу кандидатів з реальними даними, будь ласка, введіть ваш OpenAI API ключ у налаштуваннях.`;
  }

  hasApiKey(): boolean {
    return !!this.getApiKey();
  }

  setApiKey(apiKey: string): void {
    localStorage.setItem('openai_api_key', apiKey);
  }

  removeApiKey(): void {
    localStorage.removeItem('openai_api_key');
  }
}

export const aiService = new AIService();