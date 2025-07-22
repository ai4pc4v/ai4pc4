import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, ExternalLink, Database, Key, Zap } from "lucide-react";

interface SupabaseSetupProps {
  onDismiss: () => void;
}

export function SupabaseSetup({ onDismiss }: SupabaseSetupProps) {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <Database className="h-6 w-6 mr-3 text-primary" />
            Налаштування Supabase для повної функціональності
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Зараз працює демо-режим з тестовими даними. Для повної функціональності з реальними даними Airtable та AI, підключіть Supabase.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <Database className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold">Airtable Integration</h3>
              <p className="text-sm text-muted-foreground">Secure API key storage</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Zap className="h-8 w-8 mx-auto mb-2 text-success" />
              <h3 className="font-semibold">AI Processing</h3>
              <p className="text-sm text-muted-foreground">OpenAI integration</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Key className="h-8 w-8 mx-auto mb-2 text-warning" />
              <h3 className="font-semibold">File Processing</h3>
              <p className="text-sm text-muted-foreground">Resume & interview parsing</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Кроки налаштування:</h3>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <p className="font-medium">Підключіть Supabase</p>
                  <p className="text-sm text-muted-foreground">Натисніть зелену кнопку Supabase у верхньому правому куті</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <p className="font-medium">Додайте API ключі в Supabase Secrets</p>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>• <code className="bg-muted px-1 rounded">AIRTABLE_API_KEY</code> - Ваш Airtable API ключ</p>
                    <p>• <code className="bg-muted px-1 rounded">AIRTABLE_BASE_ID</code> - ID вашої Airtable бази</p>
                    <p>• <code className="bg-muted px-1 rounded">OPENAI_API_KEY</code> - OpenAI API ключ</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <p className="font-medium">Оновіть конфігурацію</p>
                  <p className="text-sm text-muted-foreground">Замініть URL в сервісах на ваш Supabase URL</p>
                </div>
              </div>
            </div>
          </div>

          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-lg">Структура Airtable</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h4 className="font-medium">Таблиця: JobDescriptions</h4>
                <p className="text-sm text-muted-foreground">Поля: Position (текст), Description (довгий текст)</p>
              </div>
              <div>
                <h4 className="font-medium">Таблиця: Candidates</h4>
                <p className="text-sm text-muted-foreground">Поля: Name (текст), Position (текст), Resume File (файл), Interview File (файл)</p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between items-center pt-4">
            <Button variant="outline" onClick={onDismiss}>
              Продовжити з демо
            </Button>
            <Button asChild>
              <a href="https://docs.lovable.dev/integrations/supabase/" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Документація Supabase
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}