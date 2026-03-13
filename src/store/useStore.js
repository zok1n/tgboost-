import { create } from 'zustand';

const DEMO_TASKS = [
  { id: '1', type: 'channel', title: 'Крипто сигналы', description: 'Торговые сигналы и аналитика криптовалют. Ежедневные обновления.', link: 'https://t.me/crypto_signals_demo', price: 10, totalSlots: 500, completedSlots: 127, status: 'active', advertiserId: 'adv1', createdAt: '2025-03-10T10:00:00Z' },
  { id: '2', type: 'chat', title: 'Инвесторы России', description: 'Обсуждение инвестиций, акций и облигаций.', link: 'https://t.me/investors_russia_demo', price: 8, totalSlots: 200, completedSlots: 45, status: 'active', advertiserId: 'adv1', createdAt: '2025-03-11T12:00:00Z' },
  { id: '3', type: 'channel', title: 'Мемы дня', description: 'Лучшие мемы и смешные картинки каждый день.', link: 'https://t.me/memes_day_demo', price: 5, totalSlots: 1000, completedSlots: 623, status: 'active', advertiserId: 'adv2', createdAt: '2025-03-08T08:00:00Z' },
  { id: '4', type: 'chat', title: 'Фрилансеры', description: 'Биржа заказов и обсуждение фриланса.', link: 'https://t.me/freelancers_demo', price: 12, totalSlots: 150, completedSlots: 89, status: 'active', advertiserId: 'adv2', createdAt: '2025-03-12T09:00:00Z' },
  { id: '5', type: 'channel', title: 'Новости IT', description: 'Свежие новости из мира технологий и программирования.', link: 'https://t.me/it_news_demo', price: 7, totalSlots: 300, completedSlots: 12, status: 'active', advertiserId: 'adv3', createdAt: '2025-03-13T07:00:00Z' },
  { id: '6', type: 'chat', title: 'Геймеры', description: 'Игровое сообщество. Обсуждение игр и поиск сокомандников.', link: 'https://t.me/gamers_demo', price: 6, totalSlots: 400, completedSlots: 201, status: 'active', advertiserId: 'adv3', createdAt: '2025-03-09T14:00:00Z' },
  { id: '7', type: 'channel', title: 'Канал на модерации', description: 'Тестовый канал для модерации.', link: 'https://t.me/moderation_test', price: 10, totalSlots: 100, completedSlots: 0, status: 'moderation', advertiserId: 'adv1', createdAt: '2025-03-13T11:00:00Z' },
];

export const useStore = create((set, get) => ({
  tasks: DEMO_TASKS,
  completedTasks: [],
  users: {
    perf1: { id: 'perf1', role: 'performer', telegramUsername: 'demo_performer', balance: 450, rating: 4.8, completedTasksCount: 42 },
    adv1: { id: 'adv1', role: 'advertiser', telegramUsername: 'demo_advertiser', balance: 5200 },
    admin1: { id: 'admin1', role: 'admin', telegramUsername: 'admin' },
  },
  currentUserId: 'perf1',
  lastTaskTime: null,
  blockedUsers: [],
  transactions: [],

  setCurrentUser: (user) => set({ currentUserId: user?.id }),
  switchRole: (role) => {
    const id = role === 'performer' ? 'perf1' : role === 'advertiser' ? 'adv1' : 'admin1';
    set({ currentUserId: id });
  },

  getActiveTasks: () => {
    return get().tasks.filter((t) => t.status === 'active');
  },

  getTaskById: (id) => get().tasks.find((t) => t.id === id),

  completeTask: (taskId, performerId, username, amount) => {
    const now = Date.now();
    const { lastTaskTime, tasks, users, currentUserId } = get();
    const currentUser = users[currentUserId] || users.perf1;

    if (lastTaskTime && now - lastTaskTime < 30000) {
      return { success: false, error: 'Подождите 30 секунд между заданиями' };
    }

    const task = tasks.find((t) => t.id === taskId);
    if (!task) return { success: false, error: 'Задание не найдено' };
    if (task.advertiserId === performerId) {
      return { success: false, error: 'Нельзя подписаться на свой канал' };
    }

    const alreadyCompleted = get().completedTasks.some(
      (c) => c.taskId === taskId && c.performerId === performerId
    );
    if (alreadyCompleted) {
      return { success: false, error: 'Вы уже выполняли это задание' };
    }

    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId
          ? { ...t, completedSlots: t.completedSlots + 1 }
          : t
      ),
      completedTasks: [
        ...state.completedTasks,
        { taskId, performerId, username, amount, date: new Date().toISOString() },
      ],
      lastTaskTime: now,
      users: state.users[state.currentUserId]?.role === 'performer'
        ? {
            ...state.users,
            [state.currentUserId]: {
              ...state.users[state.currentUserId],
              balance: (state.users[state.currentUserId]?.balance || 0) + amount,
              completedTasksCount: (state.users[state.currentUserId]?.completedTasksCount || 0) + 1,
            },
          }
        : state.users,
    }));
    return { success: true };
  },

  simulateCheckSubscription: (taskId, username) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const { tasks, users, currentUserId, completedTasks } = get();
        const currentUser = users[currentUserId] || users.perf1;
        const task = tasks.find((t) => t.id === taskId);
        if (!task) return resolve({ success: false, error: 'Задание не найдено' });

        const alreadyDone = completedTasks.some(
          (c) => c.taskId === taskId && c.performerId === currentUser.id
        );
        if (alreadyDone) {
          return resolve({ success: false, error: 'Вы уже выполняли это задание' });
        }

        const isOwn = task.advertiserId === currentUser.id;
        if (isOwn) return resolve({ success: false, error: 'Нельзя подписаться на свой канал' });

        const lastTaskTime = get().lastTaskTime;
        if (lastTaskTime && Date.now() - lastTaskTime < 30000) {
          return resolve({ success: false, error: 'Подождите 30 секунд между заданиями' });
        }

        const mockSuccess = Math.random() > 0.2;
        if (mockSuccess) {
          get().completeTask(taskId, currentUser.id, username, task.price);
          resolve({ success: true });
        } else {
          resolve({ success: false, error: 'Подписка не обнаружена, попробуйте снова' });
        }
      }, 1500);
    });
  },

  addTask: (task) => {
    const { currentUserId } = get();
    const newTask = {
      ...task,
      id: String(Date.now()),
      completedSlots: 0,
      status: 'moderation',
      createdAt: new Date().toISOString(),
      advertiserId: task.advertiserId || currentUserId,
    };
    set((state) => ({ tasks: [...state.tasks, newTask] }));
    return newTask.id;
  },

  updateTaskStatus: (taskId, status) => {
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, status } : t)),
    }));
  },

  moderateTask: (taskId, approved) => {
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, status: approved ? 'active' : 'rejected' } : t
      ),
    }));
  },

  blockUser: (userId) => {
    set((state) => ({
      blockedUsers: state.blockedUsers.includes(userId)
        ? state.blockedUsers
        : [...state.blockedUsers, userId],
    }));
  },

  unblockUser: (userId) => {
    set((state) => ({
      blockedUsers: state.blockedUsers.filter((id) => id !== userId),
    }));
  },

  addTransaction: (tx) => {
    set((state) => ({ transactions: [...state.transactions, tx] }));
  },
}));
