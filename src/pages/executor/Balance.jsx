import { CreditCard, History } from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function Balance() {
  const currentUser = useStore((s) => s.users[s.currentUserId] || s.users.perf1);
  const completedTasks = useStore((s) => s.completedTasks);
  const balance = currentUser?.balance ?? 0;
  const history = completedTasks?.filter((c) => c.performerId === currentUser?.id) || [];
  const sortedHistory = [...history].reverse().slice(0, 20);

  return (
    <div className="animate-fade-in">
      <h1 className="font-unbounded font-bold text-2xl mb-6 text-white">
        Баланс
      </h1>

      <div className="glass-card rounded-2xl p-8 mb-8 text-center">
        <p className="text-gray-400 mb-2 font-unbounded font-bold">
          Текущий баланс
        </p>
        <p className="font-unbounded font-bold text-5xl text-telegram price-glow mb-6">
          {balance} ₽
        </p>
        <button className="btn-glow inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 font-unbounded">
          <CreditCard size={20} />
          Вывести на карту
        </button>
      </div>

      <h2 className="font-unbounded font-bold text-lg mb-4 flex items-center gap-2 text-white">
        <History size={20} className="text-telegram" />
        История выполненных заданий
      </h2>
      <div className="space-y-3">
        {sortedHistory.length === 0 ? (
          <div className="glass-card rounded-2xl text-gray-400 text-center py-12 font-medium">
            Пока нет выполненных заданий
          </div>
        ) : (
          sortedHistory.map((item, i) => (
            <div
              key={i}
              className="glass-card rounded-xl flex items-center justify-between py-4 px-5 card-hover"
            >
              <p className="text-sm text-gray-500">
                {new Date(item.date).toLocaleString('ru-RU')}
              </p>
              <span className="font-unbounded font-bold text-telegram price-glow">
                +{item.amount} ₽
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
