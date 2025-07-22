import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Settings, Key, Check, X, ArrowLeft } from "lucide-react";
import { aiService } from "../services/ai";
import { useToast } from "@/hooks/use-toast";

interface AISettingsProps {
  onBack: () => void;
}

export function AISettings({ onBack }: AISettingsProps) {
  const [apiKey, setApiKey] = useState("");
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setHasApiKey(aiService.hasApiKey());
  }, []);

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: "Помилка",
        description: "Введіть ваш OpenAI API ключ",
        variant: "destructive",
      });
      return;
    }

    if (!apiKey.startsWith('sk-')) {
      toast({
        title: "Помилка", 
        description: "API ключ має починатися з 'sk-'",
        variant: "destructive",
      });
      return;
    }

    aiService.setApiKey(apiKey);
    setHasApiKey(true);
    setApiKey("");
    setIsDialogOpen(false);
    
    toast({
      title: "Успіх",
      description: "OpenAI API ключ збережено",
    });
  };

  const handleRemoveApiKey = () => {
    aiService.removeApiKey();
    setHasApiKey(false);
    
    toast({
      title: "Інформація",
      description: "OpenAI API ключ видалено",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Налаштування AI</h1>
          <p className="text-muted-foreground">
            Налаштуйте підключення до OpenAI для розумного аналізу
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Key className="h-5 w-5 mr-2" />
            OpenAI API Ключ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              {hasApiKey ? (
                <>
                  <Check className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium">API ключ налаштовано</p>
                    <p className="text-sm text-muted-foreground">
                      AI аналіз активний і готовий до використання
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <X className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="font-medium">API ключ не налаштовано</p>
                    <p className="text-sm text-muted-foreground">
                      Використовується демо-режим з обмеженим функціоналом
                    </p>
                  </div>
                </>
              )}
            </div>
            
            <div className="flex space-x-2">
              {hasApiKey && (
                <Button variant="outline" onClick={handleRemoveApiKey}>
                  <X className="h-4 w-4 mr-2" />
                  Видалити
                </Button>
              )}
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Key className="h-4 w-4 mr-2" />
                    {hasApiKey ? "Оновити ключ" : "Додати ключ"}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Налаштування OpenAI API</DialogTitle>
                    <DialogDescription>
                      Введіть ваш OpenAI API ключ для активації справжнього AI аналізу.
                      Ключ зберігається локально у вашому браузері і не передається на сервер.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="apiKey">OpenAI API Ключ</Label>
                      <Input
                        id="apiKey"
                        type="password"
                        placeholder="sk-..."
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="mt-1"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Ваш ключ має починатися з "sk-"
                      </p>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Скасувати
                      </Button>
                      <Button onClick={handleSaveApiKey}>
                        Зберегти
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">Як отримати OpenAI API ключ:</h4>
            <ol className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>1. Перейдіть на <a href="https://platform.openai.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">platform.openai.com</a></li>
              <li>2. Зареєструйтесь або увійдіть у ваш акаунт</li>
              <li>3. Перейдіть у розділ "API Keys"</li>
              <li>4. Натисніть "Create new secret key"</li>
              <li>5. Скопіюйте згенерований ключ та вставте його тут</li>
            </ol>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
              Важлива інформація про безпеку:
            </h4>
            <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
              <li>• Ваш API ключ зберігається локально у браузері</li>
              <li>• Ключ не передається на наші сервери</li>
              <li>• Використання AI коштує згідно тарифів OpenAI</li>
              <li>• Не діліться своїм ключем з іншими</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}