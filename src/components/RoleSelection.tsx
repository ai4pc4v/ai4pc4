import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Calculator, TrendingUp, FileText } from "lucide-react";

interface RoleSelectionProps {
  onRoleSelect: (role: 'hr' | 'finance' | 'marketing' | 'accounting') => void;
}

export function RoleSelection({ onRoleSelect }: RoleSelectionProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            AI VodaBusiness
          </h1>
          <p className="text-xl text-muted-foreground">
            Внутрішня HR платформа з підтримкою ШІ
          </p>
        </div>

        <Card className="p-8 shadow-lg border-0 bg-card/50 backdrop-blur-sm">
          <div className="text-center space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">
              Яка твоя роль?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="outline"
                size="lg"
                onClick={() => onRoleSelect('hr')}
                className="h-24 flex-col space-y-2 hover:bg-primary/5 hover:border-primary transition-all duration-300"
              >
                <Users className="h-8 w-8 text-primary" />
                <span className="text-lg font-medium">HR</span>
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={() => onRoleSelect('finance')}
                className="h-24 flex-col space-y-2 hover:bg-primary/5 hover:border-primary transition-all duration-300"
              >
                <Calculator className="h-8 w-8 text-primary" />
                <span className="text-lg font-medium">Фінансист</span>
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => onRoleSelect('marketing')}
                className="h-24 flex-col space-y-2 hover:bg-primary/5 hover:border-primary transition-all duration-300"
              >
                <TrendingUp className="h-8 w-8 text-primary" />
                <span className="text-lg font-medium">Маркетолог</span>
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => onRoleSelect('accounting')}
                className="h-24 flex-col space-y-2 hover:bg-primary/5 hover:border-primary transition-all duration-300"
              >
                <FileText className="h-8 w-8 text-primary" />
                <span className="text-lg font-medium">Бухгалтер</span>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}