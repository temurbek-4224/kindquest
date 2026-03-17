export type Category =
  | 'respect'
  | 'honesty'
  | 'kindness'
  | 'school'
  | 'home'
  | 'discipline';

export interface Question {
  id: number;
  category: Category;
  /** Emoji icon for the category */
  icon: string;
  question: { uz: string; ru: string; en: string };
  options: {
    uz: string[];
    ru: string[];
    en: string[];
  };
  correctAnswerIndex: number;
  explanation: { uz: string; ru: string; en: string };
}

export type CategoryMeta = {
  color:  string;
  bg:     string;
  border: string;
  /** Emoji icon displayed in the category badge */
  icon:   string;
  label:  { uz: string; ru: string; en: string };
};

/**
 * Metadata for every question category.
 * Keyed by category string — includes DB-only categories like 'general'
 * so that questions fetched from Supabase always find a matching entry.
 */
export const CATEGORY_META: Record<string, CategoryMeta> = {
  respect: {
    color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200',
    icon:  '👴',
    label: { uz: 'Hurmat', ru: 'Уважение', en: 'Respect' },
  },
  honesty: {
    color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200',
    icon:  '✅',
    label: { uz: 'Halollik', ru: 'Честность', en: 'Honesty' },
  },
  kindness: {
    color: 'text-pink-700', bg: 'bg-pink-50', border: 'border-pink-200',
    icon:  '💝',
    label: { uz: 'Mehribonlik', ru: 'Доброта', en: 'Kindness' },
  },
  school: {
    color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200',
    icon:  '🏫',
    label: { uz: 'Maktab xulqi', ru: 'Школа', en: 'School' },
  },
  home: {
    color: 'text-violet-700', bg: 'bg-violet-50', border: 'border-violet-200',
    icon:  '🏠',
    label: { uz: 'Uy-oila', ru: 'Дом', en: 'Home' },
  },
  discipline: {
    color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200',
    icon:  '⭐',
    label: { uz: 'Intizom', ru: 'Дисциплина', en: 'Discipline' },
  },
  general: {
    color: 'text-gray-700', bg: 'bg-gray-50', border: 'border-gray-200',
    icon:  '📚',
    label: { uz: 'Umumiy', ru: 'Общее', en: 'General' },
  },
};

export const questions: Question[] = [
  // ── RESPECT ──────────────────────────────────────────────────────────────
  {
    id: 1,
    category: 'respect',
    icon: '👴',
    question: {
      uz: "Avtobus to'xtag'ichida keksa odam keldi, lekin joy yo'q. Sen nima qilasan?",
      ru: 'На остановке подошёл пожилой человек, но мест нет. Что ты сделаешь?',
      en: 'An elderly person arrives at the bus stop but there are no seats. What do you do?',
    },
    options: {
      uz: [
        "O'z o'rnimni berib, turaman",
        'Hech narsa qilmayman',
        "Boshqa tomonga qarayman",
        "Telefonim bilan band bo'laman",
      ],
      ru: [
        'Встану и уступлю своё место',
        'Ничего не сделаю',
        'Отвернусь',
        'Буду занят телефоном',
      ],
      en: [
        'Stand up and offer my seat',
        'Do nothing',
        'Look away',
        'Pretend to be busy with my phone',
      ],
    },
    correctAnswerIndex: 0,
    explanation: {
      uz: "Kattalarni hurmat qilish bizning muhim burchimizdir. Ularga o'rin berish yaxshilik va hurmatning belgisidir.",
      ru: 'Уважать старших — наш важный долг. Уступить место — знак доброты и уважения.',
      en: 'Respecting elders is an important duty. Offering your seat is a sign of kindness and respect.',
    },
  },
  {
    id: 2,
    category: 'respect',
    icon: '👴',
    question: {
      uz: "O'qituvchi dars tushuntirmoqda. Sinfing baqirib gaplashmoqda. Sen nima qilasan?",
      ru: 'Учитель объясняет урок. Класс шумит и разговаривает. Что ты делаешь?',
      en: 'The teacher is explaining a lesson. The class is noisy and talking. What do you do?',
    },
    options: {
      uz: [
        "Men ham gaplashaman, bu qiziqarli emas",
        "Jimib, o'qituvchini tinglayaman va sinfni ham jimlikka chaqiraman",
        'Uxlab qolaman',
        "Derazadan tashqariga qarayman",
      ],
      ru: [
        'Тоже начну разговаривать — урок неинтересный',
        'Буду слушать учителя и попрошу класс замолчать',
        'Засну',
        'Буду смотреть в окно',
      ],
      en: [
        'Also talk — the lesson is boring',
        'Listen quietly and ask the class to be quiet too',
        'Fall asleep',
        'Stare out the window',
      ],
    },
    correctAnswerIndex: 1,
    explanation: {
      uz: "O'qituvchini hurmat qilish — uning darsini diqqat bilan tinglashdir. Bu boshqalarga ham o'rganishga imkon beradi.",
      ru: 'Уважать учителя — значит внимательно слушать урок. Это даёт возможность учиться и другим.',
      en: "Respecting the teacher means listening attentively. It also allows others to learn.",
    },
  },
  {
    id: 3,
    category: 'respect',
    icon: '👴',
    question: {
      uz: "Do'stingning otasi sening oldingdan o'tayotir. Sen nima qilasan?",
      ru: 'Отец твоего друга проходит мимо. Что ты сделаешь?',
      en: "Your friend's father walks past you. What do you do?",
    },
    options: {
      uz: [
        "E'tibor bermayman",
        'Salom berib, tabassum qilaman',
        "Qochib ketaman",
        'Telefonga qarayman',
      ],
      ru: [
        'Проигнорирую',
        'Поздороваюсь и улыбнусь',
        'Убегу',
        'Уставлюсь в телефон',
      ],
      en: [
        'Ignore him',
        'Greet him with a smile',
        'Run away',
        'Look at my phone',
      ],
    },
    correctAnswerIndex: 1,
    explanation: {
      uz: "Kattalar bilan salomlashish — odobli va hurmatli bolaning belgisi. Bu oddiy ammo muhim odob qoidasidir.",
      ru: 'Здороваться со взрослыми — признак воспитанного и уважительного ребёнка.',
      en: 'Greeting adults is a sign of a polite and respectful child. It is a simple but important manner.',
    },
  },

  // ── HONESTY ──────────────────────────────────────────────────────────────
  {
    id: 4,
    category: 'honesty',
    icon: '✅',
    question: {
      uz: "Do'kondan bir narsa sotib olganda, sotuvchi noto'g'ri qaytim berdi — sanga ko'p pul qaytardi. Sen nima qilasan?",
      ru: 'В магазине продавец дал тебе лишнюю сдачу. Что ты сделаешь?',
      en: 'At a shop, the cashier gave you too much change by mistake. What do you do?',
    },
    options: {
      uz: [
        "Indamayman, baxtli kunimdir",
        "Pulni qaytarib, noto'g'ri qaytim berilganini aytaman",
        "Tez chiqib ketaman",
        "Do'stlarimga maqtanaman",
      ],
      ru: [
        'Промолчу — мне повезло',
        'Верну лишние деньги и скажу, что ошиблись',
        'Быстро уйду',
        'Похвастаюсь перед друзьями',
      ],
      en: [
        'Stay quiet — it is my lucky day',
        'Return the extra money and point out the mistake',
        'Leave quickly',
        'Brag about it to friends',
      ],
    },
    correctAnswerIndex: 1,
    explanation: {
      uz: "Halollik — har doim to'g'ri yo'lni tanlash demakdir. Boshqaning pulini olish noto'g'ri, hattoki u bilmasa ham.",
      ru: 'Честность — это всегда выбирать правильный путь. Брать чужие деньги — неправильно, даже если никто не видит.',
      en: 'Honesty means always choosing the right path. Taking someone else\'s money is wrong, even if no one notices.',
    },
  },
  {
    id: 5,
    category: 'honesty',
    icon: '✅',
    question: {
      uz: "Sinfda oyna singan. Hamma jim. Sen sindirding. O'qituvchi kim sindirganini so'raydi. Sen nima qilasan?",
      ru: 'В классе разбилось окно. Все молчат. Ты разбил. Учитель спрашивает — кто виноват. Что ты делаешь?',
      en: 'A window broke in class. Everyone is silent. You broke it. The teacher asks who did it. What do you do?',
    },
    options: {
      uz: [
        "Men sindirmadim deb yolg'on gapirgani",
        "Birortasini ayblayman",
        'Hech narsa demay chiqib ketaman',
        "Men sindirganligimni e'tirof etaman va kechirim so'rayman",
      ],
      ru: [
        'Скажу, что не я — солгу',
        'Обвиню кого-нибудь другого',
        'Молча выйду',
        'Признаюсь и попрошу прощения',
      ],
      en: [
        'Say it was not me — lie',
        'Blame someone else',
        'Quietly leave',
        'Admit it and apologize',
      ],
    },
    correctAnswerIndex: 3,
    explanation: {
      uz: "Xatoni tan olish va kechirim so'rash — kuchli va halol kishining ishidir. Yolg'on aytish muammoni kattalashtiradi.",
      ru: 'Признать ошибку и извиниться — поступок сильного и честного человека. Ложь только усугубляет проблему.',
      en: 'Admitting a mistake and apologizing is the act of a strong and honest person. Lying only makes problems worse.',
    },
  },

  // ── KINDNESS ──────────────────────────────────────────────────────────────
  {
    id: 6,
    category: 'kindness',
    icon: '💝',
    question: {
      uz: "Yangi o'quvchi sinfingizga keldi va u qayg'uli ko'rinadi. Sen nima qilasan?",
      ru: 'В ваш класс пришёл новый ученик, он выглядит грустно. Что ты сделаешь?',
      en: 'A new student joined your class and looks sad. What do you do?',
    },
    options: {
      uz: [
        "E'tibor bermayman",
        'U bilan gaplashaman, do\'stlashaman va qanday yordam bera olishimni so\'rayman',
        "Uni masxara qilaman",
        'Hamma bilan uni muhokama qilaman',
      ],
      ru: [
        'Не обращу внимания',
        'Заговорю с ним, подружусь и спрошу, чем могу помочь',
        'Буду смеяться над ним',
        'Буду обсуждать его со всеми',
      ],
      en: [
        'Ignore him/her',
        'Talk to them, make friends and ask how I can help',
        'Make fun of them',
        'Gossip about them with others',
      ],
    },
    correctAnswerIndex: 1,
    explanation: {
      uz: "Yangi kelganlarni qabul qilish va ularga do'st bo'lish — mehribonlikning eng yaxshi ko'rinishidir.",
      ru: 'Принять новичка и стать его другом — лучшее проявление доброты.',
      en: 'Welcoming newcomers and becoming their friend is the best expression of kindness.',
    },
  },
  {
    id: 7,
    category: 'kindness',
    icon: '💝',
    question: {
      uz: "Ko'chada yiqilib ketgan bolani ko'rdingiz. Nima qilasiz?",
      ru: 'Вы увидели, что ребёнок упал на улице. Что сделаете?',
      en: 'You see a child who has fallen down on the street. What do you do?',
    },
    options: {
      uz: [
        'Kulaman va o\'tib ketaman',
        'Videoga olaman',
        'Yordamlashaman, turishiga yordam beraman va ahvolini so\'rayman',
        "E'tibor bermasdan ketaman",
      ],
      ru: [
        'Засмеюсь и пройду мимо',
        'Сниму на видео',
        'Помогу встать и спрошу, как он себя чувствует',
        'Пройду мимо, не обратив внимания',
      ],
      en: [
        'Laugh and walk past',
        'Record a video',
        'Help them up and ask if they are okay',
        'Walk past without noticing',
      ],
    },
    correctAnswerIndex: 2,
    explanation: {
      uz: "Qiynalgan kishiga yordam berish — mehribonlikning asosiy ko'rinishidir. Har bir yaxshi ish dunyo yaxshiroq bo'lishiga hissa qo'shadi.",
      ru: 'Помочь тому, кто в трудной ситуации — основное проявление доброты. Каждый добрый поступок делает мир лучше.',
      en: 'Helping someone in need is the core of kindness. Every good deed makes the world a better place.',
    },
  },
  {
    id: 8,
    category: 'kindness',
    icon: '💝',
    question: {
      uz: "Do'stingiz imtihonda yaxshi bahoga erishmadi va xafa. Sen nima qilasan?",
      ru: 'Твой друг получил плохую оценку на экзамене и расстроен. Что ты сделаешь?',
      en: 'Your friend got a bad grade on an exam and is upset. What do you do?',
    },
    options: {
      uz: [
        'Kulaman va masxara qilaman',
        'E\'tibor bermayman',
        'Qo\'llab-quvvatlayman, birga o\'rganishni taklif qilaman',
        'Hamma bolalarga aytib beraman',
      ],
      ru: [
        'Засмеюсь и буду дразнить',
        'Не обращу внимания',
        'Поддержу и предложу учиться вместе',
        'Расскажу всем ребятам',
      ],
      en: [
        'Laugh and tease them',
        'Ignore it',
        'Support them and offer to study together',
        'Tell everyone about it',
      ],
    },
    correctAnswerIndex: 2,
    explanation: {
      uz: "Yaxshi do'st — qiyin paytlarda yonida bo'ladigan kishidir. Do'stingizni qo'llab-quvvatlash muhim.",
      ru: 'Хороший друг — тот, кто рядом в трудный момент. Поддержать друга — это важно.',
      en: 'A good friend is someone who stands by you in hard times. Supporting your friend matters.',
    },
  },

  // ── SCHOOL ──────────────────────────────────────────────────────────────
  {
    id: 9,
    category: 'school',
    icon: '🏫',
    question: {
      uz: "Sinfdosh kitobingizni so'radi, lekin siz undan kerak. Nima qilasiz?",
      ru: 'Одноклассник попросил твою книгу, но она нужна тебе. Что делаешь?',
      en: 'A classmate asked for your book, but you need it. What do you do?',
    },
    options: {
      uz: [
        "Yo'q deyman va o'girilaman",
        'Berishdan bosh tortaman va sabab aytaman',
        'Birgalikda foydalanishni taklif qilaman',
        "Uni masxara qilaman",
      ],
      ru: [
        'Скажу «нет» и отвернусь',
        'Откажу и объясню причину',
        'Предложу пользоваться вместе',
        'Буду смеяться над ним',
      ],
      en: [
        'Say no and turn away',
        'Refuse and explain why',
        'Offer to share and use it together',
        'Make fun of them for asking',
      ],
    },
    correctAnswerIndex: 2,
    explanation: {
      uz: "Ulashish — do'stlik va hamkorlikning belgisi. Imkon bo'lganda narsalarni birgalikda ishlatish yaxshi odatdir.",
      ru: 'Делиться — признак дружбы и сотрудничества. По возможности пользоваться вещами вместе — хорошая привычка.',
      en: 'Sharing is a sign of friendship and cooperation. Using things together when possible is a great habit.',
    },
  },
  {
    id: 10,
    category: 'school',
    icon: '🏫',
    question: {
      uz: "Darsga kechikdingiz. Sinfga qanday kirasiz?",
      ru: 'Ты опоздал на урок. Как входишь в класс?',
      en: 'You are late for class. How do you enter?',
    },
    options: {
      uz: [
        "Shovqin bilan kirib, joy qidiraman",
        "Eshikni urib, ruxsat so'rab, sekinlik bilan kiraman",
        "Umuman kirmayman",
        "Kirib, o'qituvchini uyaltiraman",
      ],
      ru: [
        'Войду с шумом и буду искать место',
        'Постучу, попрошу разрешения и тихо войду',
        'Вообще не войду',
        'Войду и смущу учителя',
      ],
      en: [
        'Walk in noisily and look for a seat',
        'Knock, ask permission and enter quietly',
        'Not enter at all',
        'Walk in and embarrass the teacher',
      ],
    },
    correctAnswerIndex: 1,
    explanation: {
      uz: "Darsga kechikib kirganingizda, ruxsat so'rab, sekin kirish — o'qituvchi va sinfdoshlarga nisbatan hurmatning ko'rinishidir.",
      ru: 'Войти тихо, попросив разрешения, если опоздал — знак уважения к учителю и одноклассникам.',
      en: 'Knocking and entering quietly when late shows respect for the teacher and classmates.',
    },
  },

  // ── HOME ──────────────────────────────────────────────────────────────
  {
    id: 11,
    category: 'home',
    icon: '🏠',
    question: {
      uz: "Onangiz ovqat pishirganda, sen nima qilasan?",
      ru: 'Мама готовит еду. Что ты делаешь?',
      en: 'Your mother is cooking. What do you do?',
    },
    options: {
      uz: [
        'O\'yin o\'ynab o\'tiraman',
        'Yordam beraman — sabzavot tozalash yoki stol tayyorlash',
        'Televizor ko\'raman',
        "Uydan chiqib ketaman",
      ],
      ru: [
        'Играю в игры',
        'Помогу — почищу овощи или накрою на стол',
        'Смотрю телевизор',
        'Выйду из дома',
      ],
      en: [
        'Play games',
        'Help — peel vegetables or set the table',
        'Watch TV',
        'Leave the house',
      ],
    },
    correctAnswerIndex: 1,
    explanation: {
      uz: "Uy ishlarida yordam berish — oilaga bo'lgan muhabbat va hurmatning ko'rinishidir. Hamma bir-biriga yordam berishi kerak.",
      ru: 'Помогать по дому — проявление любви и уважения к семье. Все должны помогать друг другу.',
      en: 'Helping with household chores is a sign of love and respect for family. Everyone should help each other.',
    },
  },
  {
    id: 12,
    category: 'home',
    icon: '🏠',
    question: {
      uz: "Akangiz uxlayapti. Siz musiqa eshitmoqchisiz. Nima qilasiz?",
      ru: 'Твой брат спит. Ты хочешь слушать музыку. Что делаешь?',
      en: 'Your brother is sleeping. You want to listen to music. What do you do?',
    },
    options: {
      uz: [
        "Baland qilib qo'yaman, u uyg'onsin",
        'Quloqchin taqib, past ovozda eshitaman',
        "Unga baqiraman",
        'Musiqani o\'chiraman va uydan chiqaman',
      ],
      ru: [
        'Включу громко — пусть просыпается',
        'Надену наушники и буду слушать тихо',
        'Буду кричать на него',
        'Выключу музыку и выйду из дома',
      ],
      en: [
        'Play it loud — let him wake up',
        'Put on headphones and listen quietly',
        'Shout at him',
        'Turn off the music and leave',
      ],
    },
    correctAnswerIndex: 1,
    explanation: {
      uz: "Oila a'zolarini hurmat qilish — ularning dam olishini buzmaslikdir. Quloqchin — eng yaxshi yechim.",
      ru: 'Уважать членов семьи — значит не мешать их отдыху. Наушники — лучшее решение.',
      en: "Respecting family members means not disturbing their rest. Headphones are the best solution.",
    },
  },

  // ── DISCIPLINE ──────────────────────────────────────────────────────────
  {
    id: 13,
    category: 'discipline',
    icon: '⭐',
    question: {
      uz: "Ertasi kuni imtihon bor, lekin do'stingiz sizi o'yinga taklif qildi. Nima qilasiz?",
      ru: 'Завтра экзамен, но друг зовёт тебя играть. Что сделаешь?',
      en: 'You have an exam tomorrow but your friend invites you to play. What do you do?',
    },
    options: {
      uz: [
        "Imtihon muhim emas, o'ynab kelaman",
        'Birinchi o\'qiyman, keyin vaqt bo\'lsa o\'ynayman deb aytaman',
        "Har ikkalasini bir vaqtda qilaman",
        "Imtihonga tayyorlanib o'tiraman",
      ],
      ru: [
        'Экзамен — неважно, пойду играть',
        'Сначала подготовлюсь, и если останется время — тогда играть',
        'Буду делать и то, и другое одновременно',
        'Буду готовиться к экзамену',
      ],
      en: [
        'Exam does not matter — go play',
        'Study first, then play if there is time',
        'Do both at the same time',
        'Stay home and study for the exam',
      ],
    },
    correctAnswerIndex: 1,
    explanation: {
      uz: "Intizom — muhim ishlarni birinchi qilish demakdir. O'qish va o'yin ikkisi ham muhim, lekin tartib kerak.",
      ru: 'Дисциплина — значит делать важные дела в первую очередь. Учёба и игра важны, но нужен порядок.',
      en: 'Discipline means doing important things first. Both studying and playing matter, but order is key.',
    },
  },
  {
    id: 14,
    category: 'discipline',
    icon: '⭐',
    question: {
      uz: "Har kuni ertalab uyg'onganda birinchi navbatda nima qilish to'g'ri?",
      ru: 'Что правильно делать первым делом, просыпаясь каждое утро?',
      en: 'What is the right first thing to do every morning when you wake up?',
    },
    options: {
      uz: [
        'Telefonga qarayman',
        'O\'yinga o\'tiraman',
        "Yotgan joyda yotib qolaman",
        "Yuvinib, nonushta qilib, darsimga tayyorlanaman",
      ],
      ru: [
        'Возьму телефон',
        'Сяду играть',
        'Останусь лежать',
        'Умоюсь, позавтракаю и подготовлюсь к урокам',
      ],
      en: [
        'Check my phone',
        'Start playing games',
        'Keep lying in bed',
        'Wash up, have breakfast and prepare for school',
      ],
    },
    correctAnswerIndex: 3,
    explanation: {
      uz: "Ertalabki tartib — kun davomida samarali bo'lish uchun muhimdir. Yuvnish, nonushta va tayyorgarlik — to'g'ri boshlanish.",
      ru: 'Утренний распорядок важен для продуктивного дня. Умывание, завтрак и подготовка — правильное начало.',
      en: 'A morning routine is key to a productive day. Washing up, eating breakfast and preparing is the right start.',
    },
  },
  {
    id: 15,
    category: 'discipline',
    icon: '⭐',
    question: {
      uz: "Kutubxonada kitob o'qimoqchisiz. Boshqa bolalar shovqin qilmoqda. Siz nima qilasiz?",
      ru: 'Вы читаете книгу в библиотеке. Другие дети шумят. Что вы сделаете?',
      en: 'You are reading in the library. Other children are making noise. What do you do?',
    },
    options: {
      uz: [
        "Men ham shovqin qilaman",
        "Ularga baqiraman",
        "Iltimos bilan jim bo'lishlarini so'rayman yoki kutubxonachiga aytaman",
        "Uyga ketaman",
      ],
      ru: [
        'Тоже начну шуметь',
        'Накричу на них',
        'Вежливо попрошу помолчать или скажу библиотекарю',
        'Уйду домой',
      ],
      en: [
        'Also start making noise',
        'Shout at them',
        'Politely ask them to be quiet or tell the librarian',
        'Go home',
      ],
    },
    correctAnswerIndex: 2,
    explanation: {
      uz: "Ommaviy joyda qoidalarga rioya qilish — intizomning ko'rinishidir. Muammoni tinch yo'l bilan hal qilish ham muhim.",
      ru: 'Соблюдать правила в общественных местах — проявление дисциплины. Решать проблему мирно — тоже важно.',
      en: 'Following rules in public places shows discipline. Resolving issues peacefully is equally important.',
    },
  },
  {
    id: 16,
    category: 'honesty',
    icon: '✅',
    question: {
      uz: "Do'stingizning o'yinchoqini sindirib qo'ydingiz. U bilmaydi. Nima qilasiz?",
      ru: 'Ты сломал игрушку друга. Он не знает. Что сделаешь?',
      en: "You accidentally broke your friend's toy. They don't know. What do you do?",
    },
    options: {
      uz: [
        "Indamayman, u bilmaydi",
        "Yashiraman",
        "Do'stimga sindirib qo'yganimni aytaman va kechirim so'rayman",
        "Boshqa o'yinchoq bilan almashtirib qo'yaman",
      ],
      ru: [
        'Промолчу — он не знает',
        'Спрячу',
        'Признаюсь другу и попрошу прощения',
        'Подменю другой игрушкой',
      ],
      en: [
        'Stay quiet — they do not know',
        'Hide it',
        'Tell my friend and apologize',
        'Replace it with another toy secretly',
      ],
    },
    correctAnswerIndex: 2,
    explanation: {
      uz: "Halollik — noqulay bo'lsa ham haqiqatni aytishdir. Do'st sizni kechirar va bu ishonchni mustahkamlaydi.",
      ru: 'Честность — говорить правду, даже когда это неудобно. Друг простит, и это укрепит доверие.',
      en: 'Honesty is telling the truth even when it is uncomfortable. Your friend will forgive you and trust will grow.',
    },
  },
  {
    id: 17,
    category: 'kindness',
    icon: '💝',
    question: {
      uz: "Maktab bufetida navbat bor. Kichkina bola itarib yuborildi. Nima qilasiz?",
      ru: 'В школьном буфете очередь. Маленького ребёнка толкнули. Что сделаешь?',
      en: 'There is a queue at the school canteen. A small child got pushed. What do you do?',
    },
    options: {
      uz: [
        "Kulaman",
        "E'tibor bermayman",
        "Bolaga yordamlashaman, turishiga va navbatga qaytishiga yordam beraman",
        "Baqiraman",
      ],
      ru: [
        'Засмеюсь',
        'Не обращу внимания',
        'Помогу ребёнку встать и вернуться в очередь',
        'Буду кричать',
      ],
      en: [
        'Laugh',
        'Ignore it',
        'Help the child get up and return to the queue',
        'Shout',
      ],
    },
    correctAnswerIndex: 2,
    explanation: {
      uz: "Kichkintoylarga g'amxo'rlik qilish — katta yurakning belgisidir. Har bir bolaga e'tibor va hurmat zarur.",
      ru: 'Заботиться о малышах — признак большого сердца. Каждый ребёнок заслуживает внимания и уважения.',
      en: 'Caring for younger children shows a big heart. Every child deserves attention and respect.',
    },
  },
  {
    id: 18,
    category: 'respect',
    icon: '👴',
    question: {
      uz: "Otangiz siz bilan gaplashmoqchi, lekin siz o'yindadirsiz. Nima qilasiz?",
      ru: 'Папа хочет поговорить с тобой, но ты играешь. Что делаешь?',
      en: 'Your father wants to talk to you but you are playing a game. What do you do?',
    },
    options: {
      uz: [
        "Otamni e'tiborsiz qoldiraman",
        "Keyinroq deb javob beraman",
        "O'yinni to'xtatib, otamni tinglayaman",
        "Baqiraman",
      ],
      ru: [
        'Проигнорирую папу',
        'Скажу — потом',
        'Остановлю игру и выслушаю папу',
        'Буду кричать',
      ],
      en: [
        'Ignore my father',
        'Say later',
        'Stop the game and listen to my father',
        'Shout',
      ],
    },
    correctAnswerIndex: 2,
    explanation: {
      uz: "Ota-onani hurmat qilish — ularni e'tibor bilan tinglashdir. O'yin kutishi mumkin, lekin oila muloqoti muhimroq.",
      ru: 'Уважать родителей — значит внимательно их слушать. Игра подождёт, общение с семьёй важнее.',
      en: 'Respecting parents means listening to them attentively. The game can wait — family communication is more important.',
    },
  },
  {
    id: 19,
    category: 'school',
    icon: '🏫',
    question: {
      uz: "Sinfdoshingizning daftarida chiroyli rasm bor. Siz ham shunday rasm chizmoqchisiz. Nima qilasiz?",
      ru: 'У одноклассника в тетради красивый рисунок. Ты тоже хочешь такой. Что делаешь?',
      en: 'Your classmate has a beautiful drawing in their notebook. You want something similar. What do you do?',
    },
    options: {
      uz: [
        "Daftarini o'g'irlayman",
        'Ruxsatsiz ko\'chirib olaman',
        "Qanday chizganini so'rayman va o'rganaman",
        "Uning rasmini yirtaman",
      ],
      ru: [
        'Украду тетрадь',
        'Скопирую без разрешения',
        'Спрошу, как нарисовал, и научусь',
        'Порву его рисунок',
      ],
      en: [
        'Steal the notebook',
        'Copy it without asking',
        'Ask how they drew it and learn',
        'Tear their drawing',
      ],
    },
    correctAnswerIndex: 2,
    explanation: {
      uz: "Boshqaning mehnati va ijodini hurmat qilish kerak. Ruxsat so'rab o'rganish — to'g'ri va odobli yo'ldir.",
      ru: "Нужно уважать труд и творчество другого. Спросить разрешения и учиться — правильный и вежливый путь.",
      en: "Respect others' hard work and creativity. Asking permission and learning from them is the right and polite approach.",
    },
  },
  {
    id: 20,
    category: 'home',
    icon: '🏠',
    question: {
      uz: "Kichik singlisi yig'layapti va sababi noma'lum. Siz nima qilasiz?",
      ru: 'Маленькая сестрёнка плачет, причина неизвестна. Что делаешь?',
      en: 'Your little sister is crying and you do not know why. What do you do?',
    },
    options: {
      uz: [
        "E'tibor bermayman",
        "Unga ham baqiraman",
        "Yoniga borib, nima bo'lganini so'rayman va yupataman",
        "Onaga xabar qilmasdan o'ynab o'tiraman",
      ],
      ru: [
        'Не обращу внимания',
        'Буду тоже кричать на неё',
        'Подойду, спрошу, что случилось, и постараюсь утешить',
        'Продолжу играть, не сказав маме',
      ],
      en: [
        'Ignore her',
        'Also shout at her',
        'Go to her, ask what is wrong and comfort her',
        'Keep playing without telling mum',
      ],
    },
    correctAnswerIndex: 2,
    explanation: {
      uz: "Kichik aka-uka va opa-singillarni g'amxo'rlik bilan himoya qilish — oiladagi muhabbatning ko'rinishidir.",
      ru: 'Заботливо защищать младших братьев и сестёр — проявление любви в семье.',
      en: 'Caring for and protecting younger siblings is an expression of love within the family.',
    },
  },
];

/** Returns a shuffled subset of questions (default: all) */
export function getQuestions(count?: number): Question[] {
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return count ? shuffled.slice(0, count) : shuffled;
}
