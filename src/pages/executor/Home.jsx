import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Hash, MessageCircle, ExternalLink } from 'lucide-react';
import { useStore } from '../../store/useStore';

const typeLabels = { channel: 'Канал', chat: 'Чат' };
const typeIcons = { channel: Hash, chat: MessageCircle };

export default function Home() {
  const tasks = useStore((s) => s.tasks);
  const [filterType, setFilterType] = useState('all');
  const [filterPrice, setFilterPrice] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const filteredTasks = useMemo(() => {
    let result = tasks.filter((t) => t.status === 'active');
    if (filterType !== 'all') result = result.filter((t) => t.type === filterType);
    if (filterPrice === 'high') result = result.filter((t) => t.price >= 10);
    if (filterPrice === 'low') result = result.filter((t) => t.price < 7);
    if (sortBy === 'price_high') result.sort((a, b) => b.price - a.price);
    if (sortBy === 'price_low') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'newest') result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return result;
  }, [tasks, filterType, filterPrice, sortBy]);

  return (
    <div className="animate-fade-in">
      <h1 className="font-unbounded font-bold text-2xl mb-6 text-white">
        Активные задания
      </h1>

      <div className="flex flex-wrap gap-2 mb-6">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="font-unbounded font-bold text-sm input-glass rounded-xl px-4 py-2.5 text-gray-300"
        >
          <option value="all">Все типы</option>
          <option value="channel">Каналы</option>
          <option value="chat">Чаты</option>
        </select>
        <select
          value={filterPrice}
          onChange={(e) => setFilterPrice(e.target.value)}
          className="font-unbounded font-bold text-sm input-glass rounded-xl px-4 py-2.5 text-gray-300"
        >
          <option value="all">Любая цена</option>
          <option value="high">От 10 ₽</option>
          <option value="low">До 7 ₽</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="font-unbounded font-bold text-sm input-glass rounded-xl px-4 py-2.5 text-gray-300"
        >
          <option value="newest">Сначала новые</option>
          <option value="price_high">Дороже</option>
          <option value="price_low">Дешевле</option>
        </select>
      </div>

      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="glass-card rounded-2xl text-center py-16 text-gray-400 font-medium">
            Нет заданий по выбранным фильтрам
          </div>
        ) : (
          filteredTasks.map((task) => {
            const Icon = typeIcons[task.type];
            const left = task.totalSlots - task.completedSlots;
            return (
              <Link
                key={task.id}
                to={`/task/${task.id}`}
                className="glass-card card-hover rounded-2xl p-5 block"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="avatar-gradient w-12 h-12 rounded-full flex items-center justify-center shrink-0">
                      <Icon size={24} className="text-telegram" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-unbounded font-bold text-white truncate">
                          {task.title}
                        </span>
                        <span className="badge-pill shrink-0">
                          {typeLabels[task.type]}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                        {task.description}
                      </p>
                      <div className="flex items-center gap-4">
                        <span className="font-unbounded font-bold text-xl text-telegram price-glow">
                          {task.price} ₽
                        </span>
                        <span className="text-sm text-gray-500">
                          осталось {left} мест
                        </span>
                      </div>
                    </div>
                  </div>
                  <ExternalLink
                    size={20}
                    className="text-gray-500 shrink-0 mt-1"
                  />
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
