import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function CandidateComparison() {
  const location = useLocation();
  const navigate = useNavigate();
  const { comparison, selectedPosition, candidateData } = location.state || {};

  if (!comparison) {
    navigate("/");
    return null;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Результати порівняння</h1>
          <p className="text-muted-foreground">
            Позиція: {selectedPosition}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI аналіз кандидатів</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <div className="bg-gradient-to-br from-primary/5 to-blue-50 dark:from-primary/10 dark:to-blue-950/20 p-6 rounded-lg border border-primary/20">
              <div 
                className="whitespace-pre-wrap text-foreground leading-relaxed"
                style={{ fontFamily: 'system-ui, sans-serif' }}
              >
                {comparison.split('\n').map((line, index) => {
                  if (line.startsWith('**') && line.endsWith('**')) {
                    return (
                      <h3 key={index} className="font-bold text-lg text-primary mt-4 mb-2 first:mt-0">
                        {line.replace(/\*\*/g, '')}
                      </h3>
                    );
                  }
                  if (line.startsWith('• ')) {
                    return (
                      <div key={index} className="ml-4 mb-1 flex items-start">
                        <span className="text-primary mr-2 mt-1">•</span>
                        <span>{line.substring(2)}</span>
                      </div>
                    );
                  }
                  if (line.trim()) {
                    return <p key={index} className="mb-2">{line}</p>;
                  }
                  return <br key={index} />;
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {candidateData && candidateData.length >= 2 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Порівнювані кандидати</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {candidateData.map((candidate, index) => (
              <Card key={candidate.id} className="border-l-4 border-l-primary">
                <CardHeader>
                  <CardTitle>{candidate.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Резюме (скорочено):</h4>
                    <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded border max-h-32 overflow-y-auto">
                      {candidate.resume.substring(0, 300)}...
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Інтерв'ю (скорочено):</h4>
                    <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded border max-h-32 overflow-y-auto">
                      {candidate.interview.substring(0, 300)}...
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}