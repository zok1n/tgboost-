import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Hash, MessageCircle, ExternalLink, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useStore } from '../../store/useStore';

const typeLabels = { channel: 'Канал', chat: 'Чат' };
const typeIcons = { channel: Hash, chat: MessageCircle };

const getChannelUsernameFromLink = (link) => {
  if (!link) return null;
  try {
    const url = new URL(link);
    if (url.hostname !== 't.me') return null;
    const path = url.pathname.replace(/^\/+/, '');
    if (!path) return null;
    const [username] = path.split('/');
    return username || null;
  } catch {
    if (link.startsWith('https://t.me/')) {
      const rest = link.replace('https://t.me/', '');
      const [username] = rest.split('/');
      return username || null;
    }
    if (link.startsWith('@')) {
      return link.slice(1) || null;
    }
    return null;
  }
};

export default function TaskPage() {
  const { id } = useParams();
  const getTaskById = useStore((s) => s.getTaskById);
  const currentUser = useStore((s) => s.users[s.currentUserId] || s.users.perf1);
  const completedTasks = useStore((s) => s.completedTasks);
  const completeTask = useStore((s) => s.completeTask);
  const task = getTaskById(id);

  const [username, setUsername] = useState(currentUser?.telegramUsername || '');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const alreadyCompleted = completedTasks?.some(
    (c) => c.taskId === id && c.performerId === currentUser?.id
  );

  const handleCheck = async () => {
    if (!username.trim()) {
      setError('Введите ваш Telegram username');
      return;
    }
    setStatus('loading');
    setError('');
    const channelUsername = getChannelUsernameFromLink(task.link);
    if (!channelUsername) {
      setStatus('error');
      setError('Канал не найден, проверьте ссылку');
      return;
    }

    const token = import.meta.env.VITE_BOT_TOKEN;
    if (!token) {
      setStatus('error');
      setError('Токен бота не настроен');
      return;
    }

    try {
      const url = `https://api.telegram.org/bot${token}/getChat?chat_id=@${channelUsername}`;
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok && data?.ok) {
        const result = completeTask(id, currentUser.id, username.trim(), task.price);
        setStatus(result.success ? 'success' : 'error');
        setError(result.error || '');
      } else {
        setStatus('error');
        setError('Канал не найден, проверьте ссылку');
      }
    } catch (e) {
      setStatus('error');
      setError('Ошибка проверки подписки, попробуйте позже');
    }
  };

  if (!task) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <p className="text-gray-400 mb-6 font-medium">Задание не найдено</p>
        <Link to="/" className="btn-glow inline-flex items-center gap-2 rounded-xl px-6 py-3">
          На главную
        </Link>
      </div>
    );
  }

  const Icon = typeIcons[task.type];
  const left = task.totalSlots - task.completedSlots;

  return (
    <div className="max-w-lg mx-auto animate-fade-in">
      <div className="glass-card rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="avatar-gradient w-14 h-14 rounded-full flex items-center justify-center shrink-0">
            <Icon size={28} className="text-telegram" />
          </div>
          <div>
            <h1 className="font-unbounded font-bold text-xl text-white">
              {task.title}
            </h1>
            <span className="badge-pill">{typeLabels[task.type]}</span>
          </div>
        </div>
        <p className="text-gray-400 mb-6">{task.description}</p>
        <div className="flex justify-between items-center mb-6">
          <span className="font-unbounded font-bold text-2xl text-telegram price-glow">
            {task.price} ₽
          </span>
          <span className="text-sm text-gray-500">осталось {left} мест</span>
        </div>

        <a
          href={task.link}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-glow w-full flex items-center justify-center gap-2 rounded-xl py-4 mb-6 font-unbounded"
        >
          Открыть в Telegram
          <ExternalLink size={18} />
        </a>

        <div className="space-y-4">
          <label className="block text-sm text-gray-400 font-unbounded font-bold">
            Ваш Telegram username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value.replace(/@/g, ''))}
            placeholder="username"
            className="w-full input-glass rounded-xl px-4 py-3 font-medium"
          />
          {status === 'idle' && !alreadyCompleted && (
            <button
              onClick={handleCheck}
              className="btn-glow w-full rounded-xl py-4 font-unbounded"
            >
              Я подписался — проверить
            </button>
          )}
          {status === 'loading' && (
            <div className="flex items-center justify-center gap-2 py-4 text-telegram">
              <Loader2 size={24} className="animate-spin" />
              <span className="font-unbounded font-bold">
                Проверяем подписку...
              </span>
            </div>
          )}
          {status === 'success' && (
            <div className="flex items-center gap-2 py-4 text-green-400 rounded-xl bg-green-500/10 border border-green-500/30">
              <CheckCircle size={24} />
              <span className="font-unbounded font-bold">
                Подписка подтверждена! +{task.price} ₽ на баланс
              </span>
            </div>
          )}
          {status === 'error' && !alreadyCompleted && (
            <>
              <div className="flex items-center gap-2 py-4 text-red-400 rounded-xl bg-red-500/10 border border-red-500/30">
                <XCircle size={24} />
                <span className="font-medium">{error}</span>
              </div>
              <button
                onClick={handleCheck}
                className="btn-glow w-full rounded-xl py-4 font-unbounded"
              >
                Попробовать снова
              </button>
            </>
          )}
          {alreadyCompleted && (
            <div className="flex items-center gap-2 py-4 text-gray-400 rounded-xl bg-white/5">
              <CheckCircle size={24} />
              <span className="font-medium">Вы уже выполнили это задание</span>
            </div>
          )}
        </div>
      </div>
      <Link
        to="/"
        className="text-telegram hover:text-purple transition-colors text-sm font-unbounded font-bold"
      >
        ← К списку заданий
      </Link>
    </div>
  );
}
