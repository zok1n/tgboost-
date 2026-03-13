import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hash, MessageCircle } from 'lucide-react';
import { useStore } from '../../store/useStore';

const COMMISSION = 0.2;

export default function CreateTask() {
  const navigate = useNavigate();
  const addTask = useStore((s) => s.addTask);
  const currentUserId = useStore((s) => s.currentUserId);
  const [type, setType] = useState('channel');
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [price, setPrice] = useState(5);
  const [slots, setSlots] = useState(100);

  const subtotal = price * slots;
  const commissionAmount = Math.ceil(subtotal * COMMISSION);
  const total = subtotal + commissionAmount;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (price < 5) {
      alert('Минимальная цена — 5 рублей');
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
          <input
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://t.me/..."
            required
            className="w-full input-glass rounded-xl px-4 py-3 font-medium"
          />
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

        <button type="submit" className="btn-glow w-full rounded-xl py-4 font-unbounded">
          Создать задание
        </button>
      </form>
    </div>
  );
}
