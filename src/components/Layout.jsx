import { Link, useLocation, Outlet } from 'react-router-dom';
import { Home, Wallet, User, PlusCircle, List, Shield } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Layout() {
  const location = useLocation();
  const currentUser = useStore((s) => s.users[s.currentUserId] || s.users.perf1);
  const switchRole = useStore((s) => s.switchRole);
  const isAdmin = currentUser?.role === 'admin';

  const navLink = (to, Icon, label) => {
    const active = location.pathname === to || location.pathname.startsWith(to + '/');
    return (
      <Link
        to={to}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-unbounded font-bold text-sm transition-all duration-300 ${
          active
            ? 'bg-gradient-to-r from-telegram/20 to-purple/20 text-telegram border border-telegram/30'
            : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
        }`}
      >
        <Icon size={18} />
        <span className="hidden sm:inline">{label}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/20 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            to="/"
            className="font-unbounded font-bold text-xl bg-gradient-to-r from-telegram to-purple bg-clip-text text-transparent"
          >
            TGBoost
          </Link>
          <span className="text-xs text-gray-400 font-medium">
            Биржа Telegram подписок
          </span>
        </div>
        <nav className="max-w-4xl mx-auto px-4 pb-3 flex flex-wrap gap-2">
          {navLink('/', Home, 'Задания')}
          {navLink('/balance', Wallet, 'Баланс')}
          {navLink('/profile', User, 'Профиль')}
          {navLink('/advertiser/create', PlusCircle, 'Создать')}
          {navLink('/advertiser/tasks', List, 'Мои задания')}
          {navLink('/advertiser/balance', Wallet, 'Баланс рекл.')}
          {isAdmin && navLink('/admin', Shield, 'Админ')}
        </nav>
        <div className="max-w-4xl mx-auto px-4 pb-2">
          <select
            value={currentUser?.role}
            onChange={(e) => switchRole(e.target.value)}
            className="text-xs font-unbounded font-bold bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-gray-400 focus:border-telegram/50 focus:outline-none"
          >
            <option value="performer">Исполнитель</option>
            <option value="advertiser">Рекламодатель</option>
            <option value="admin">Админ</option>
          </select>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 pb-24 sm:pb-8">
        <Outlet />
      </main>
    </div>
  );
}
