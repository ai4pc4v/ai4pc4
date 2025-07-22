import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Users, ArrowRight } from "lucide-react";

interface AIFeaturesProps {
  onFeatureSelect: (feature: 'job-description' | 'candidate-analysis') => void;
}

export function AIFeatures({ onFeatureSelect }: AIFeaturesProps) {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">AI рішення</h1>
        <p className="text-muted-foreground">
          Використовуйте штучний інтелект для автоматизації HR процесів
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group border-l-4 border-l-primary">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">Створення опису вакансії</CardTitle>
                <CardDescription>
                  Автоматично генеруйте професійні описи вакансій за допомогою ШІ
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Виберіть позицію, та ШІ створить повний опис вакансії включаючи обов'язки, 
              вимоги та умови роботи.
            </p>
            <Button 
              onClick={() => onFeatureSelect('job-description')}
              className="w-full group-hover:bg-primary/90 transition-colors"
            >
              Розпочати
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group border-l-4 border-l-success">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <Users className="h-6 w-6 text-success" />
              </div>
              <div>
                <CardTitle className="text-xl">Аналіз кандидатів</CardTitle>
                <CardDescription>
                  Порівняйте кандидатів та отримайте рекомендації ШІ
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              ШІ проаналізує резюме та інтерв'ю кандидатів, порівняє їх та надасть 
              обґрунтовані рекомендації.
            </p>
            <Button 
              onClick={() => onFeatureSelect('candidate-analysis')}
              variant="outline"
              className="w-full border-success text-success hover:bg-success hover:text-success-foreground transition-colors"
            >
              Розпочати
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}