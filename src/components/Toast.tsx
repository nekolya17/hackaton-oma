import { useApp } from '../context/AppContext';
import { X, CheckCircle, Info, AlertTriangle } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  const icons = {
    success: <CheckCircle size={18} className="text-emerald-500 shrink-0" />,
    info: <Info size={18} className="text-[#00B4D8] shrink-0" />,
    warning: <AlertTriangle size={18} className="text-amber-500 shrink-0" />,
  };

  const bgColors = {
    success: 'bg-emerald-50 border-emerald-200',
    info: 'bg-blue-50 border-[#00B4D8]/20',
    warning: 'bg-amber-50 border-amber-200',
  };

  return (
    <div className="fixed top-20 right-4 z-[9999] flex flex-col gap-2 max-w-sm">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`toast-enter flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-sm ${bgColors[toast.type]}`}
        >
          {icons[toast.type]}
          <p className="text-sm text-gray-800 font-medium leading-snug flex-1">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-gray-400 hover:text-gray-600 transition-colors shrink-0 cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
