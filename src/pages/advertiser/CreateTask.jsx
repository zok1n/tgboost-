import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hash, MessageCircle } from 'lucide-react';
import { useStore } from '../../store/useStore';

const COMMISSION = 0.2;

const BOT_TOKEN = import.meta.env.VITE_BOT_TOKEN;

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

export default function CreateTask() {
  const navigate = useNavigate();
  const addTask = useStore((s) => s.addTask);
  const currentUserId = useStore((s) => s.currentUserId);
  const [type, setType] = useState('channel');
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [price, setPrice] = useState(5);
  const [slots, setSlots] = useState(100);
  const [channelStatus, setChannelStatus] = useState('idle'); // idle | checking | success | warning | error
  const [channelMessage, setChannelMessage] = useState('');

  const subtotal = price * slots;
  const commissionAmount = Math.ceil(subtotal * COMMISSION);
  const total = subtotal + commissionAmount;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (price < 5) {
      alert('Минимальная цена — 5 рублей');
      return;
    }
    if (channelStatus !== 'success') {
      return;
    }

    addTask({
      type,
      title,
      link,
      price,
      totalSlots: slots,
      advertiserId: currentUserId || 'adv1',
    });
    navigate('/advertiser/tasks');
  };

  const handleCheckChannel = async () => {
    if (!link.trim()) {
      setChannelStatus('error');
      setChannelMessage('❌ Введите ссылку на канал или чат');
      return;
    }

    const username = getChannelUsernameFromLink(link.trim());
    if (!username) {
      setChannelStatus('error');
      setChannelMessage('❌ Канал не найден, проверьте ссылку');
      return;
    }

    if (!BOT_TOKEN) {
      setChannelStatus('error');
      setChannelMessage('❌ Токен бота не настроен');
      return;
    }

    setChannelStatus('checking');
    setChannelMessage('Проверяем канал...');

    try {
      const baseUrl = `https://api.telegram.org/bot${BOT_TOKEN}`;
      const chatRes = await fetch(`${baseUrl}/getChat?chat_id=@${username}`);
      const chatData = await chatRes.json();

      if (!chatRes.ok || !chatData?.ok) {
        setChannelStatus('error');
        setChannelMessage('❌ Канал не найден, проверьте ссылку');
        return;
      }

      // Канал найден, проверяем права бота через getMe + getChatMember
      const meRes = await fetch(`${baseUrl}/getMe`);
      const meData = await meRes.json();
      if (!meRes.ok || !meData?.ok || !meData.result?.id) {
        setChannelStatus('warning');
        setChannelMessage('⚠️ Добавьте @tgboost_check_bot в администраторы канала');
        return;
      }

      const botId = meData.result.id;
      const memberRes = await fetch(
        `${baseUrl}/getChatMember?chat_id=@${username}&user_id=${botId}`
      );
      const memberData = await memberRes.json();

      if (memberRes.ok && memberData?.ok && memberData.result?.status) {
        const status = memberData.result.status;
        if (status === 'administrator' || status === 'creator') {
          setChannelStatus('success');
          setChannelMessage('✅ Бот подключён, канал найден');
        } else {
          setChannelStatus('warning');
          setChannelMessage('⚠️ Добавьте @tgboost_check_bot в администраторы канала');
        }
      } else {
        setChannelStatus('warning');
        setChannelMessage('⚠️ Добавьте @tgboost_check_bot в администраторы канала');
      }
    } catch (e) {
      setChannelStatus('error');
      setChannelMessage('❌ Ошибка проверки канала, попробуйте позже');
    }
  };

  const handleLinkChange = (value) => {
    setLink(value);
    setChannelStatus('idle');
    setChannelMessage('');
  };

  return (
    <div className="animate-fade-in">
      <h1 className="font-unbounded font-bold text-2xl mb-6 text-white">
        Создать задание
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
        <div>
          <label className="block text-sm text-gray-400 mb-3 font-unbounded font-bold">
            Тип
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer font-unbounded font-bold">
              <input
                type="radio"
                name="type"
                value="channel"
                checked={type === 'channel'}
                onChange={() => setType('channel')}
                className="accent-telegram"
              />
              <Hash size={18} className="text-telegram" />
              Канал
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-unbounded font-bold">
              <input
                type="radio"
                name="type"
                value="chat"
                checked={type === 'chat'}
                onChange={() => setType('chat')}
                className="accent-telegram"
              />
              <MessageCircle size={18} className="text-telegram" />
              Чат / группа
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2 font-unbounded font-bold">
            Название
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Название канала или чата"
            required
            className="w-full input-glass rounded-xl px-4 py-3 font-medium"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2 font-unbounded font-bold">
            Ссылка
          </label>
          <div className="flex flex-col gap-2">
            <div className="flex gap-3">
              <input
                type="url"
                value={link}
                onChange={(e) => handleLinkChange(e.target.value)}
                placeholder="https://t.me/..."
                required
                className="w-full input-glass rounded-xl px-4 py-3 font-medium"
              />
              <button
                type="button"
                onClick={handleCheckChannel}
                className="btn-glow whitespace-nowrap rounded-xl px-4 py-3 font-unbounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!link || channelStatus === 'checking'}
              >
                {channelStatus === 'checking' ? 'Проверяется...' : 'Проверить канал'}
              </button>
            </div>
            <p className="text-xs text-gray-500">
              Сначала добавьте <span className="font-mono">@tgboost_check_bot</span> в администраторы
              вашего канала
            </p>
            {channelStatus !== 'idle' && channelMessage && (
              <div
                className={
                  channelStatus === 'success'
                    ? 'text-xs text-green-400 rounded-xl bg-green-500/10 border border-green-500/30 px-3 py-2'
                    : channelStatus === 'warning'
                    ? 'text-xs text-yellow-300 rounded-xl bg-yellow-500/10 border border-yellow-500/30 px-3 py-2'
                    : 'text-xs text-red-400 rounded-xl bg-red-500/10 border border-red-500/30 px-3 py-2'
                }
              >
                {channelMessage}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2 font-unbounded font-bold">
              Цена (мин. 5 ₽)
            </label>
            <input
              type="number"
              min={5}
              value={price}
              onChange={(e) => setPrice(Math.max(5, Number(e.target.value)))}
              className="w-full input-glass rounded-xl px-4 py-3 font-medium"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2 font-unbounded font-bold">
              Подписчиков
            </label>
            <input
              type="number"
              min={1}
              value={slots}
              onChange={(e) => setSlots(Math.max(1, Number(e.target.value)))}
              className="w-full input-glass rounded-xl px-4 py-3 font-medium"
            />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <p className="text-sm text-gray-400 mb-1">
            {price} ₽ × {slots} = {subtotal} ₽
          </p>
          <p className="text-sm text-gray-400 mb-2">Комиссия 20%: {commissionAmount} ₽</p>
          <p className="font-unbounded font-bold text-xl text-telegram price-glow">
            Итого: {total} ₽
          </p>
        </div>

        <button
          type="submit"
          className="btn-glow w-full rounded-xl py-4 font-unbounded disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={channelStatus !== 'success'}
        >
          Создать задание
        </button>
      </form>
    </div>
  );
}
