import { useState } from "react";
import { RoleSelection } from "../components/RoleSelection";
import { HRDashboard } from "../components/HRDashboard";

const Index = () => {
  const [selectedRole, setSelectedRole] = useState<'hr' | 'finance' | 'marketing' | 'accounting' | null>(null);

  const handleRoleSelect = (role: 'hr' | 'finance' | 'marketing' | 'accounting') => {
    setSelectedRole(role);
  };

  const handleLogout = () => {
    setSelectedRole(null);
  };

  if (selectedRole === 'hr') {
    return <HRDashboard onLogout={handleLogout} />;
  }

  if (selectedRole === 'finance') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Фінансова платформа</h1>
          <p className="text-xl text-muted-foreground">
            Фінансовий модуль буде додано в наступних версіях
          </p>
          <button 
            onClick={handleLogout}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg"
          >
            Повернутися до вибору ролі
          </button>
        </div>
      </div>
    );
  }

  if (selectedRole === 'marketing') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Маркетингова платформа</h1>
          <p className="text-xl text-muted-foreground">
            Маркетинговий модуль буде додано в наступних версіях
          </p>
          <button 
            onClick={handleLogout}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg"
          >
            Повернутися до вибору ролі
          </button>
        </div>
      </div>
    );
  }

  if (selectedRole === 'accounting') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Бухгалтерська платформа</h1>
          <p className="text-xl text-muted-foreground">
            Бухгалтерський модуль буде додано в наступних версіях
          </p>
          <button 
            onClick={handleLogout}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg"
          >
            Повернутися до вибору ролі
          </button>
        </div>
      </div>
    );
  }

  return <RoleSelection onRoleSelect={handleRoleSelect} />;
};

export default Index;
