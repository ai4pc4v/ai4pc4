import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider } from "@/components/ui/sidebar";
import { Brain, Briefcase, Users, LogOut, Settings } from "lucide-react";
import { JobDescriptionCreator } from "./JobDescriptionCreator";
import { CandidateAnalysis } from "./CandidateAnalysis";
import { AIFeatures } from "./AIFeatures";
import { AISettings } from "./AISettings";
import { SupabaseSetup } from "./SupabaseSetup";

interface HRDashboardProps {
  onLogout: () => void;
}

export function HRDashboard({ onLogout }: HRDashboardProps) {
  const [activeTab, setActiveTab] = useState<'ai' | 'vacancies' | 'candidates'>('ai');
  const [activeAIFeature, setActiveAIFeature] = useState<'overview' | 'job-description' | 'candidate-analysis'>('overview');
  const [showSetup, setShowSetup] = useState(false);
  const [showAISettings, setShowAISettings] = useState(false);

  const sidebarItems = [
    { id: 'ai', label: 'AI рішення', icon: Brain },
    { id: 'vacancies', label: 'Вакансії', icon: Briefcase },
    { id: 'candidates', label: 'Кандидати', icon: Users },
  ];

  const renderContent = () => {
    if (showAISettings) {
      return <AISettings onBack={() => setShowAISettings(false)} />;
    }

    switch (activeTab) {
      case 'ai':
        switch (activeAIFeature) {
          case 'job-description':
            return <JobDescriptionCreator onBack={() => setActiveAIFeature('overview')} />;
          case 'candidate-analysis':
            return <CandidateAnalysis onBack={() => setActiveAIFeature('overview')} />;
          default:
            return <AIFeatures onFeatureSelect={setActiveAIFeature} />;
        }
      case 'vacancies':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Вакансії</h2>
            <p className="text-muted-foreground">Управління вакансіями буде додано в наступних версіях.</p>
          </div>
        );
      case 'candidates':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Кандидати</h2>
            <p className="text-muted-foreground">Управління кандидатами буде додано в наступних версіях.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {showSetup && <SupabaseSetup onDismiss={() => setShowSetup(false)} />}
      <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar className="w-64 border-r bg-card/50">
          <div className="p-4 border-b">
            <h1 className="text-lg font-bold text-primary">AI VodaBusiness</h1>
            <p className="text-sm text-muted-foreground">HR Платформа</p>
          </div>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Навігація</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {sidebarItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => {
                          setActiveTab(item.id as any);
                          if (item.id === 'ai') setActiveAIFeature('overview');
                        }}
                        className={activeTab === item.id ? "bg-primary/10 text-primary" : ""}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <div className="p-4 border-t mt-auto space-y-2">
            <Button
              variant="ghost"
              onClick={() => setShowAISettings(true)}
              className="w-full justify-start"
            >
              <Brain className="h-4 w-4 mr-2" />
              AI Налаштування
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowSetup(true)}
              className="w-full justify-start"
            >
              <Settings className="h-4 w-4 mr-2" />
              Налаштування
            </Button>
            <Button
              variant="ghost"
              onClick={onLogout}
              className="w-full justify-start"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Вийти
            </Button>
          </div>
        </Sidebar>

        <main className="flex-1">
          {renderContent()}
        </main>
      </div>
    </SidebarProvider>
    </>
  );
}