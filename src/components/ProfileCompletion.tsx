
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface ProfileCompletionProps {
  score: number;
  className?: string;
}

const ProfileCompletion: React.FC<ProfileCompletionProps> = ({ score, className = "" }) => {
  const getCompletionStatus = (score: number) => {
    if (score >= 80) return { color: 'text-green-600', icon: CheckCircle, message: 'Excellent profile!' };
    if (score >= 60) return { color: 'text-yellow-600', icon: AlertCircle, message: 'Good progress' };
    return { color: 'text-red-600', icon: AlertCircle, message: 'Needs improvement' };
  };

  const status = getCompletionStatus(score);
  const Icon = status.icon;

  return (
    <div className={`bg-white p-4 rounded-lg border ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-900">Profile Completion</h3>
        <div className="flex items-center gap-1">
          <Icon className={`h-4 w-4 ${status.color}`} />
          <span className={`text-sm font-medium ${status.color}`}>{score}%</span>
        </div>
      </div>
      <Progress value={score} className="mb-2" />
      <p className={`text-xs ${status.color}`}>{status.message}</p>
    </div>
  );
};

export default ProfileCompletion;
