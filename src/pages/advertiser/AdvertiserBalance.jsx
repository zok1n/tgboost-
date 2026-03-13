import { Wallet, CreditCard } from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function AdvertiserBalance() {
  const currentUser = useStore((s) => s.users[s.currentUserId] || s.users.perf1);
  const advertiser = useStore((s) => s.users.adv1);
  const balance =
    currentUser?.role === 'advertiser'
      ? currentUser?.balance ?? 5200
      : advertiser?.balance ?? 5200;

  return (
    <div className="animate-fade-in">
      <h1 className="font-unbounded font-bold text-2xl mb-6 text-white">
        Баланс рекламодателя
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
          Пополнить баланс
        </button>
      </div>

      <h2 className="font-unbounded font-bold text-lg mb-4 flex items-center gap-2 text-white">
        <Wallet size={20} className="text-telegram" />
        История списаний
      </h2>
      <div className="glass-card rounded-2xl text-gray-400 text-center py-12 font-unbounded font-bold">
        История операций (демо)
      </div>
    </div>
  );
}
