import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, FileText, Wand2, Save, Edit3, Loader2 } from "lucide-react";
import { airtableService, JobDescription } from "../services/airtable";
import { aiService } from "../services/ai";
import { useToast } from "@/hooks/use-toast";

interface JobDescriptionCreatorProps {
  onBack: () => void;
}

export function JobDescriptionCreator({ onBack }: JobDescriptionCreatorProps) {
  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
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

  const handlePositionSelect = (jobId: string) => {
    setSelectedJobId(jobId);
    const job = jobDescriptions.find(j => j.id === jobId);
    if (job?.description) {
      setDescription(job.description);
      setIsEditing(false);
    } else {
      setDescription("");
      setIsEditing(false);
    }
  };

  const generateDescription = async () => {
    if (!selectedJobId) {
      toast({
        title: "Помилка",
        description: "Спочатку оберіть позицію",
        variant: "destructive",
      });
      return;
    }

    const job = jobDescriptions.find(j => j.id === selectedJobId);
    if (!job) return;

    setIsLoading(true);
    try {
      const generatedDescription = await aiService.generateJobDescription(job.position);
      setDescription(generatedDescription);
      setIsEditing(true);
      toast({
        title: "Успіх",
        description: "Опис вакансії згенеровано",
      });
    } catch (error) {
      toast({
        title: "Помилка",
        description: "Не вдалося згенерувати опис",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveDescription = async () => {
    if (!selectedJobId || !description.trim()) return;

    setIsSaving(true);
    try {
      await airtableService.updateJobDescription(selectedJobId, description);
      toast({
        title: "Успіх",
        description: "Опис вакансії збережено в Airtable",
      });
      setIsEditing(false);
      await loadJobDescriptions(); // Reload to get updated data
    } catch (error) {
      toast({
        title: "Помилка",
        description: "Не вдалося зберегти опис",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const selectedJob = jobDescriptions.find(j => j.id === selectedJobId);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Створення опису вакансії</h1>
          <p className="text-muted-foreground">
            Використовуйте ШІ для створення професійних описів вакансій
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Налаштування
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Обери позицію</label>
              <Select value={selectedJobId} onValueChange={handlePositionSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Виберіть позицію..." />
                </SelectTrigger>
                <SelectContent>
                  {jobDescriptions.map((job) => (
                    <SelectItem key={job.id} value={job.id}>
                      {job.position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={generateDescription}
              disabled={!selectedJobId || isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Генерую...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Згенерувати опис
                </>
              )}
            </Button>

            {selectedJob && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium">Позиція:</p>
                <p className="text-sm text-muted-foreground">{selectedJob.position}</p>
                {selectedJob.description && (
                  <p className="text-xs text-success mt-1">✓ Опис існує в базі</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Опис вакансії</CardTitle>
              {description && (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    {isEditing ? "Переглянути" : "Редагувати"}
                  </Button>
                  <Button
                    size="sm"
                    onClick={saveDescription}
                    disabled={!description.trim() || isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Зберігаю...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Зберегти
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {description ? (
              isEditing ? (
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Редагуйте опис вакансії..."
                  className="min-h-[500px] resize-none"
                />
              ) : (
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap bg-muted/30 p-4 rounded-lg border">
                    {description}
                  </div>
                </div>
              )
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                <div className="text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Оберіть позицію та згенеруйте опис вакансії</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}