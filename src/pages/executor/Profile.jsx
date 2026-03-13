import { User, Star, CheckCircle } from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function Profile() {
  const currentUser = useStore((s) => s.users[s.currentUserId] || s.users.perf1);
  const username = currentUser?.telegramUsername || '—';
  const rating = currentUser?.rating ?? 0;
  const completed = currentUser?.completedTasksCount ?? 0;

  return (
    <div className="animate-fade-in">
      <h1 className="font-unbounded font-bold text-2xl mb-6 text-white">
        Профиль
      </h1>

      <div className="glass-card rounded-2xl p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="avatar-gradient w-16 h-16 rounded-full flex items-center justify-center">
            <User size={32} className="text-telegram" />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-unbounded font-bold">
              Telegram
            </p>
            <p className="font-unbounded font-bold text-xl text-white">
              @{username}
            </p>
          </div>
        </div>

        <div className="flex gap-6 pt-6 border-t border-white/10">
          <div className="badge-pill flex items-center gap-2">
            <Star size={18} className="text-yellow-400" />
            <span>{rating}</span>
            <span className="text-gray-400">рейтинг</span>
          </div>
          <div className="badge-pill flex items-center gap-2">
            <CheckCircle size={18} className="text-telegram" />
            <span>{completed}</span>
            <span className="text-gray-400">выполнено</span>
          </div>
        </div>
      </div>
    </div>
  );
}
