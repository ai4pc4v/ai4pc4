import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Users, Search, Loader2, FileUser, MessageSquare, Eye } from "lucide-react";
import { airtableService, JobDescription, Candidate } from "../services/airtable";
import { aiService } from "../services/ai";
import { useToast } from "@/hooks/use-toast";

interface CandidateAnalysisProps {
  onBack: () => void;
}

export function CandidateAnalysis({ onBack }: CandidateAnalysisProps) {
  const navigate = useNavigate();
  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<string>("");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidates, setSelectedCandidates] = useState<Candidate[]>([]);
  const [candidateData, setCandidateData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'select' | 'candidates'>('select');
  const { toast } = useToast();

  useEffect(() => {
    loadJobDescriptions();
  }, []);

  const loadJobDescriptions = async () => {
    try {
      const jobs = await airtableService.getJobDescriptions();
      setJobDescriptions(jobs);
    } catch (error) {
      toast({
        title: "Помилка",
        description: "Не вдалося завантажити список позицій",
        variant: "destructive",
      });
    }
  };

  const searchCandidates = async () => {
    if (!selectedPosition) {
      toast({
        title: "Помилка",
        description: "Спочатку оберіть вакансію",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const candidatesList = await airtableService.getCandidatesByPosition(selectedPosition);
      
      if (candidatesList.length === 0) {
        toast({
          title: "Інформація",
          description: "Кандидатів для цієї позиції не знайдено",
        });
        setIsLoading(false);
        return;
      }

      // Take first 2 candidates for comparison
      const selectedCands = candidatesList.slice(0, 2);
      setCandidates(candidatesList);
      setSelectedCandidates(selectedCands);
      
      // Load their files - the new service already processes files on the backend
      const candidatesWithData = selectedCands.map(candidate => ({
        ...candidate,
        resume: candidate.resumeText || "Резюме недоступне",
        interview: candidate.interviewText || "Інтерв'ю недоступне",
      }));

      setCandidateData(candidatesWithData);
      setStep('candidates');
      
      toast({
        title: "Успіх",
        description: `Знайдено ${candidatesList.length} кандидатів. Показано перші 2 для аналізу.`,
      });
    } catch (error) {
      toast({
        title: "Помилка",
        description: "Не вдалося завантажити кандидатів",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const compareCandidates = async () => {
    if (candidateData.length < 2) return;

    setIsLoading(true);
    try {
      const comparisonResult = await aiService.compareCandidates(
        selectedPosition,
        candidateData[0],
        candidateData[1]
      );
      
      navigate('/candidate-comparison', {
        state: {
          comparison: comparisonResult,
          selectedPosition,
          candidateData
        }
      });
      
      toast({
        title: "Успіх",
        description: "Аналіз кандидатів завершено",
      });
    } catch (error) {
      toast({
        title: "Помилка",
        description: "Не вдалося виконати аналіз",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderCandidateCard = (candidate: any, index: number) => (
    <Dialog key={candidate.id}>
      <DialogTrigger asChild>
        <Card className="border-l-4 border-l-primary cursor-pointer hover-scale transition-all duration-200 hover:shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <FileUser className="h-5 w-5 mr-2" />
                {candidate.name}
              </div>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium flex items-center mb-2">
                <FileUser className="h-4 w-4 mr-2" />
                Резюме:
              </h4>
              <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded border max-h-32 overflow-y-auto">
                {candidate.resume.substring(0, 200)}...
              </div>
            </div>
            
            <div>
              <h4 className="font-medium flex items-center mb-2">
                <MessageSquare className="h-4 w-4 mr-2" />
                Інтерв'ю:
              </h4>
              <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded border max-h-32 overflow-y-auto">
                {candidate.interview.substring(0, 200)}...
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground flex items-center mt-2">
              <Eye className="h-3 w-3 mr-1" />
              Натисніть для перегляду повної інформації
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <FileUser className="h-6 w-6 mr-2" />
            {candidate.name} - Повна інформація
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          <div>
            <h3 className="text-lg font-semibold flex items-center mb-3">
              <FileUser className="h-5 w-5 mr-2 text-primary" />
              Резюме
            </h3>
            <div className="bg-muted/30 p-4 rounded-lg border max-h-96 overflow-y-auto">
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {candidate.resume}
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold flex items-center mb-3">
              <MessageSquare className="h-5 w-5 mr-2 text-primary" />
              Інтерв'ю
            </h3>
            <div className="bg-muted/30 p-4 rounded-lg border max-h-96 overflow-y-auto">
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {candidate.interview}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Аналіз кандидатів</h1>
            <p className="text-muted-foreground">
              Порівняйте кандидатів та отримайте рекомендації ШІ
            </p>
          </div>
        </div>
        
        {candidateData.length >= 2 && (
          <Button onClick={compareCandidates} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Аналізую...
              </>
            ) : (
              "Порівняй кандидатів"
            )}
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Вибір вакансії
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Обери вакансію</label>
            <Select value={selectedPosition} onValueChange={setSelectedPosition}>
              <SelectTrigger>
                <SelectValue placeholder="Виберіть позицію..." />
              </SelectTrigger>
              <SelectContent>
                {jobDescriptions.map((job) => (
                  <SelectItem key={job.id} value={job.position}>
                    {job.position}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={searchCandidates}
            disabled={!selectedPosition || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Шукаю кандидатів...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Шукати кандидатів
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {step === 'candidates' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Кандидати для позиції: {selectedPosition}</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {candidateData.map((candidate, index) => renderCandidateCard(candidate, index))}
          </div>
        </div>
      )}
    </div>
  );
}