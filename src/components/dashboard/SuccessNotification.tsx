import { CheckCircle } from 'lucide-react';

interface SuccessNotificationProps {
  show: boolean;
  title?: string;
  message?: string;
}

export default function SuccessNotification({ 
  show, 
  title = "Bookmark added successfully!",
  message = "Your bookmark has been saved to your collection."
}: SuccessNotificationProps) {
  if (!show) return null;

  return (
    <div className="fixed top-4 right-4 bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg z-50 flex items-center space-x-3">
      <CheckCircle className="w-5 h-5 text-green-600" />
      <div>
        <p className="text-green-800 font-medium">{title}</p>
        <p className="text-green-600 text-sm">{message}</p>
      </div>
    </div>
  );
} 