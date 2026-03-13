import { useState } from 'react';
import { Check, X, Shield, Users, TrendingUp, FileText } from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function Admin() {
  const tasks = useStore((s) => s.tasks);
  const moderateTask = useStore((s) => s.moderateTask);
  const blockUser = useStore((s) => s.blockUser);
  const [tab, setTab] = useState('moderation');

  const moderationTasks = tasks.filter((t) => t.status === 'moderation');
  const activeTasks = tasks.filter((t) => t.status === 'active').length;
  const totalRevenue = tasks.reduce((s, t) => s + t.price * t.completedSlots, 0);
  const demoUsers = [
    { id: 'perf1', username: 'demo_performer', role: 'Исполнитель' },
    { id: 'adv1', username: 'demo_advertiser', role: 'Рекламодатель' },
  ];

  return (
    <div className="animate-fade-in">
      <h1 className="font-unbounded font-bold text-2xl mb-6 text-white flex items-center gap-3">
        <Shield size={28} className="text-telegram" />
        Панель администратора
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="glass-card rounded-2xl p-5 card-hover">
          <div className="flex items-center gap-2 text-gray-400 mb-2 font-unbounded font-bold">
            <TrendingUp size={20} className="text-telegram" />
            Оборот
          </div>
          <p className="font-unbounded font-bold text-2xl text-telegram price-glow">
            {totalRevenue} ₽
          </p>
        </div>
        <div className="glass-card rounded-2xl p-5 card-hover">
          <div className="flex items-center gap-2 text-gray-400 mb-2 font-unbounded font-bold">
            <FileText size={20} className="text-purple" />
            Активные задания
          </div>
          <p className="font-unbounded font-bold text-2xl text-white">
            {activeTasks}
          </p>
        </div>
        <div className="glass-card rounded-2xl p-5 card-hover">
          <div className="flex items-center gap-2 text-gray-400 mb-2 font-unbounded font-bold">
            <Users size={20} />
            Пользователи
          </div>
          <p className="font-unbounded font-bold text-2xl text-white">
            {demoUsers.length}
          </p>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab('moderation')}
          className={`font-unbounded font-bold px-5 py-2.5 rounded-xl transition-all ${
            tab === 'moderation'
              ? 'btn-glow'
              : 'input-glass text-gray-400 hover:text-white'
          }`}
        >
          Модерация
        </button>
        <button
          onClick={() => setTab('users')}
          className={`font-unbounded font-bold px-5 py-2.5 rounded-xl transition-all ${
            tab === 'users'
              ? 'btn-glow'
              : 'input-glass text-gray-400 hover:text-white'
          }`}
        >
          Пользователи
        </button>
      </div>

      {tab === 'moderation' && (
        <div className="space-y-4">
          {moderationTasks.length === 0 ? (
            <div className="glass-card rounded-2xl text-center py-12 text-gray-400 font-unbounded font-bold">
              Нет заданий на модерации
            </div>
          ) : (
            moderationTasks.map((task) => (
              <div
                key={task.id}
                className="glass-card rounded-2xl p-5 flex items-center justify-between flex-wrap gap-4 card-hover"
              >
                <div>
                  <p className="font-unbounded font-bold text-white">
                    {task.title}
                  </p>
                  <p className="text-sm text-gray-500">{task.link}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => moderateTask(task.id, true)}
                    className="p-3 rounded-xl bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30 transition-colors"
                  >
                    <Check size={20} />
                  </button>
                  <button
                    onClick={() => moderateTask(task.id, false)}
                    className="p-3 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'users' && (
        <div className="space-y-3">
          {demoUsers.map((user) => (
            <div
              key={user.id}
              className="glass-card rounded-2xl p-5 flex items-center justify-between card-hover"
            >
              <div>
                <p className="font-unbounded font-bold text-white">
                  @{user.username}
                </p>
                <p className="text-sm text-gray-500">{user.role}</p>
              </div>
              <button
                onClick={() => blockUser(user.id)}
                className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 font-unbounded font-bold text-sm hover:bg-red-500/30 border border-red-500/30 transition-colors"
              >
                Заблокировать
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
