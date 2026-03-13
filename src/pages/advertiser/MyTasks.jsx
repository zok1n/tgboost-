import { Link } from 'react-router-dom';
import { PlusCircle, Pause, Play, Wallet, Hash, MessageCircle } from 'lucide-react';
import { useStore } from '../../store/useStore';

const statusLabels = {
  moderation: 'На модерации',
  active: 'Активно',
  paused: 'На паузе',
  completed: 'Завершено',
  rejected: 'Отклонено',
};
const statusStyles = {
  moderation: 'from-yellow-500/30 to-amber-500/30 border-yellow-500/40',
  active: 'from-green-500/30 to-emerald-500/30 border-green-500/40',
  paused: 'from-orange-500/30 to-amber-500/30 border-orange-500/40',
  completed: 'from-gray-500/20 to-gray-600/20 border-gray-500/30',
  rejected: 'from-red-500/30 to-rose-500/30 border-red-500/40',
};
const typeIcons = { channel: Hash, chat: MessageCircle };

export default function MyTasks() {
  const tasks = useStore((s) => s.tasks);
  const currentUserId = useStore((s) => s.currentUserId);
  const myTasks = tasks.filter((t) => t.advertiserId === (currentUserId || 'adv1'));
  const sorted = [...myTasks].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-unbounded font-bold text-2xl text-white">
          Мои задания
        </h1>
        <Link
          to="/advertiser/create"
          className="btn-glow flex items-center gap-2 rounded-xl px-5 py-3 font-unbounded"
        >
          <PlusCircle size={20} />
          Создать
        </Link>
      </div>

      <div className="space-y-4">
        {sorted.length === 0 ? (
          <div className="glass-card rounded-2xl text-center py-16">
            <p className="text-gray-400 mb-6 font-unbounded font-bold">
              У вас пока нет заданий
            </p>
            <Link
              to="/advertiser/create"
              className="btn-glow inline-flex items-center gap-2 rounded-xl px-6 py-3 font-unbounded"
            >
              <PlusCircle size={20} />
              Создать задание
            </Link>
          </div>
        ) : (
          sorted.map((task) => {
            const Icon = typeIcons[task.type];
            const progress = task.totalSlots
              ? Math.round((task.completedSlots / task.totalSlots) * 100)
              : 0;
            const statusClass = statusStyles[task.status] || statusStyles.moderation;
            return (
              <div
                key={task.id}
                className="glass-card card-hover rounded-2xl p-5"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="avatar-gradient w-12 h-12 rounded-full flex items-center justify-center shrink-0">
                      <Icon size={24} className="text-telegram" />
                    </div>
                    <div>
                      <span className="font-unbounded font-bold text-white block">
                        {task.title}
                      </span>
                      <span className="font-unbounded font-bold text-lg text-telegram price-glow">
                        {task.price} ₽ / подписка
                      </span>
                    </div>
                  </div>
                  <span
                    className={`badge-pill bg-gradient-to-r ${statusClass} shrink-0`}
                  >
                    {statusLabels[task.status]}
                  </span>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2 font-unbounded font-bold">
                    <span className="text-gray-400">Выполнено</span>
                    <span>
                      {task.completedSlots} / {task.totalSlots}
                    </span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-telegram to-purple rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {task.status === 'active' && (
                    <button className="input-glass px-4 py-2 rounded-xl text-sm font-unbounded font-bold flex items-center gap-2 hover:bg-white/10 transition-colors">
                      <Pause size={16} /> Пауза
                    </button>
                  )}
                  {task.status === 'paused' && (
                    <button className="px-4 py-2 rounded-xl text-sm font-unbounded font-bold flex items-center gap-2 bg-telegram/20 text-telegram hover:bg-telegram/30 transition-colors">
                      <Play size={16} /> Возобновить
                    </button>
                  )}
                  {task.status === 'active' && (
                    <button className="px-4 py-2 rounded-xl text-sm font-unbounded font-bold flex items-center gap-2 bg-purple/20 text-purple hover:bg-purple/30 transition-colors">
                      <Wallet size={16} /> Пополнить
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
