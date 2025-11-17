import React, { useEffect, useState } from 'react';
import { CheckCircle2, Clock } from 'lucide-react';

interface TaskProgressBarProps {
  totalTasks: number;
  completedTasks: number;
}

export default function TaskProgressBar({ totalTasks, completedTasks }: TaskProgressBarProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [prevPercentage, setPrevPercentage] = useState(0);

  const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  useEffect(() => {
    // Animar el cambio de porcentaje
    if (percentage !== prevPercentage) {
      const duration = 800; // ms
      const steps = 30;
      const increment = (percentage - prevPercentage) / steps;
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        setAnimatedProgress(prev => {
          const newValue = prevPercentage + (increment * currentStep);
          return Math.min(Math.max(newValue, 0), 100);
        });

        if (currentStep >= steps) {
          clearInterval(timer);
          setAnimatedProgress(percentage);
          setPrevPercentage(percentage);
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [percentage, prevPercentage]);

  const getProgressColor = () => {
    if (percentage >= 100) return 'bg-emerald-500';
    if (percentage >= 75) return 'bg-green-500';
    if (percentage >= 50) return 'bg-blue-500';
    if (percentage >= 25) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  const getTextColor = () => {
    if (percentage >= 100) return 'text-emerald-600';
    if (percentage >= 75) return 'text-green-600';
    if (percentage >= 50) return 'text-blue-600';
    if (percentage >= 25) return 'text-yellow-600';
    return 'text-orange-600';
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <CheckCircle2 className={`h-4 w-4 ${getTextColor()}`} />
          <span className="font-medium text-foreground">Progreso del tablero</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground">
            <Clock className="inline h-3 w-3 mr-1" />
            {totalTasks - completedTasks} pendientes
          </span>
          <span className={`font-bold ${getTextColor()}`}>
            {Math.round(animatedProgress)}%
          </span>
        </div>
      </div>

      <div className="relative w-full h-3 bg-muted rounded-full overflow-hidden shadow-inner">
        <div
          className={`absolute top-0 left-0 h-full ${getProgressColor()} transition-all duration-500 ease-out rounded-full`}
          style={{ width: `${animatedProgress}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{completedTasks} completadas</span>
        <span>{totalTasks} totales</span>
      </div>
    </div>
  );
}