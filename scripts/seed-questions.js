// scripts/seed-questions.js
// Run with: node --env-file=.env.local scripts/seed-questions.js
// Uses SUPABASE_SERVICE_ROLE_KEY — never put this key in NEXT_PUBLIC_ variables.

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL      = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('\n❌  Missing environment variables.\n');
  console.error('   Make sure .env.local contains:');
  console.error('     NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co');
  console.error('     SUPABASE_SERVICE_ROLE_KEY=<secret key from Supabase Dashboard>');
  console.error('\n   Get the service_role key from:');
  console.error('   Supabase Dashboard → Project Settings → API → service_role\n');
  console.error('   ⚠️  Never commit this key or add it to Vercel as NEXT_PUBLIC_*\n');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// ─────────────────────────────────────────────────────────────────────────────
//  12 new questions — topics not already covered by the existing seed data:
//  cleanliness, public behaviour, environmental care, responsibility,
//  gratitude, self-care, helping parents, community respect.
// ─────────────────────────────────────────────────────────────────────────────
const NEW_QUESTIONS = [
  // ── DISCIPLINE: cleanliness ───────────────────────────────────────────────
  {
    category:       'discipline',
    question_uz:    "Ovqat yegandan keyin stol ustini kim yig'ishtirishi kerak?",
    question_ru:    'Кто должен убирать со стола после еды?',
    question_en:    'Who should clean up the table after eating?',
    option_a_uz:    'Faqat onaginam',
    option_a_ru:    'Только мама',
    option_a_en:    'Only my mum',
    option_b_uz:    "Faqat dadaginam",
    option_b_ru:    'Только папа',
    option_b_en:    'Only my dad',
    option_c_uz:    "Hech kim — o'zi tozalanib ketadi",
    option_c_ru:    'Никто — само очистится',
    option_c_en:    'Nobody — it cleans itself',
    option_d_uz:    "Ovqat yeyishda qatnashgan hamma birga",
    option_d_ru:    'Все, кто ел, вместе',
    option_d_en:    'Everyone who ate, together',
    correct_answer: 'D',
    explanation_uz: "Stol yig'ishtirish — oiladagi umumiy mas'uliyat. Hamma o'z ulushini qo'shganda uy doim tartibli bo'ladi.",
    explanation_ru: 'Убирать со стола — общая ответственность в семье. Когда каждый вносит свой вклад, дом всегда в порядке.',
    explanation_en: 'Cleaning the table is a shared family responsibility. When everyone contributes, the home stays tidy.',
  },
  {
    category:       'discipline',
    question_uz:    "Kiyimlarni kiyib bo'lgach, qayerda saqlash kerak?",
    question_ru:    'Где нужно хранить одежду после того, как её сняли?',
    question_en:    'Where should you keep your clothes after taking them off?',
    option_a_uz:    "Erga tashlash kerak",
    option_a_ru:    'Бросить на пол',
    option_a_en:    'Drop them on the floor',
    option_b_uz:    "Karavot ustiga tashlab ketish",
    option_b_ru:    'Бросить на кровать',
    option_b_en:    'Throw them on the bed',
    option_c_uz:    "O'z joyiga — shkaf yoki ilgichga ilib qo'yish",
    option_c_ru:    'На своё место — повесить в шкаф или на крючок',
    option_c_en:    'In their place — hang in the wardrobe or on a hook',
    option_d_uz:    "Singlimga berish",
    option_d_ru:    'Отдать сестре',
    option_d_en:    'Give them to my sister',
    correct_answer: 'C',
    explanation_uz: "Buyumlarni o'z joyiga qo'yish — tartiblilik va intizomning belgisidir. Bu kelajakda vaqtni ham tejaydi.",
    explanation_ru: 'Класть вещи на своё место — признак порядка и дисциплины. Это также экономит время в будущем.',
    explanation_en: 'Putting things in their place shows tidiness and discipline. It also saves time later.',
  },

  // ── DISCIPLINE: public behaviour ──────────────────────────────────────────
  {
    category:       'discipline',
    question_uz:    "Avtobusda boshqalar bilan suhbatlashayotganda ovozingiz qanday bo'lishi kerak?",
    question_ru:    'Каким должен быть ваш голос при разговоре в автобусе?',
    question_en:    'How loud should your voice be when talking on a bus?',
    option_a_uz:    "Juda baland — hamma eshitsin",
    option_a_ru:    'Очень громко — пусть все слышат',
    option_a_en:    'Very loud — let everyone hear',
    option_b_uz:    "Baqiriq bilan",
    option_b_ru:    'С криком',
    option_b_en:    'With shouting',
    option_c_uz:    "Past va boshqalarga xalal bermaydigan darajada",
    option_c_ru:    'Тихо и не мешая другим',
    option_c_en:    'Quietly, without disturbing others',
    option_d_uz:    "Umuman gaplashmaslik kerak",
    option_d_ru:    'Вообще не разговаривать',
    option_d_en:    'Not talk at all',
    correct_answer: 'C',
    explanation_uz: "Jamoat transportida past ovozda gaplashish — atrofdagi odamlarga hurmatning ko'rinishidir.",
    explanation_ru: 'Говорить тихо в общественном транспорте — проявление уважения к окружающим.',
    explanation_en: 'Speaking quietly on public transport is a sign of respect for those around you.',
  },
  {
    category:       'discipline',
    question_uz:    "Kinozalda film ko'rayotganda telefoningiz jiringladi. Siz nima qilasiz?",
    question_ru:    'В кинотеатре во время фильма зазвонил телефон. Что вы сделаете?',
    question_en:    'Your phone rings in a cinema during a film. What do you do?',
    option_a_uz:    "Darhol javob beraman va baland ovozda gaplashaman",
    option_a_ru:    'Сразу отвечу и буду говорить громко',
    option_a_en:    'Answer immediately and speak loudly',
    option_b_uz:    "Zalda qolgan holda baland ovozda gaplashaman",
    option_b_ru:    'Остаюсь в зале и говорю громко',
    option_b_en:    'Stay in the hall and speak loudly',
    option_c_uz:    "Telefonni o'chirib qo'yaman yoki jimlik rejimiga o'tkazaman",
    option_c_ru:    'Отключу телефон или переведу в беззвучный режим',
    option_c_en:    'Turn off or silence the phone',
    option_d_uz:    "Qo'ng'iroqni qaytaraman va hamma diqqatini jalb qilaman",
    option_d_ru:    'Перезвоню и привлеку всеобщее внимание',
    option_d_en:    'Call back and draw everyone\'s attention',
    correct_answer: 'C',
    explanation_uz: "Jamoat joylarida boshqalarga xalal bermaslik — muhim qoidadir. Kinoda telefon o'chirilgan bo'lishi kerak.",
    explanation_ru: 'Не мешать другим в общественных местах — важное правило. В кинотеатре телефон должен быть отключён.',
    explanation_en: 'Not disturbing others in public places is an important rule. Phones should be silent in cinemas.',
  },

  // ── KINDNESS: helping friends ─────────────────────────────────────────────
  {
    category:       'kindness',
    question_uz:    "Do'stingiz uy vazifasini tushunmadi. Siz nima qilasiz?",
    question_ru:    'Друг не понял домашнее задание. Что вы сделаете?',
    question_en:    'Your friend did not understand the homework. What do you do?',
    option_a_uz:    "E'tibor bermayman",
    option_a_ru:    'Не обращу внимания',
    option_a_en:    'Ignore it',
    option_b_uz:    "Javoblarni ko'chirib berib ketaman",
    option_b_ru:    'Дам списать ответы',
    option_b_en:    'Let them copy my answers',
    option_c_uz:    "Unga tushuntirib beraman va birgalikda bajaramiz",
    option_c_ru:    'Объясню и выполним вместе',
    option_c_en:    'Explain it and work through it together',
    option_d_uz:    "Qiyin ekanini aytib kuldiraman",
    option_d_ru:    'Засмеюсь, что это сложно',
    option_d_en:    'Laugh and say it is too hard',
    correct_answer: 'C',
    explanation_uz: "Tushuntirish orqali yordam berish — do'stlikning eng yaxshi ko'rinishidir. Javobni ko'chirish esa o'rganishga yordam bermaydi.",
    explanation_ru: 'Помочь объяснением — лучшее проявление дружбы. Списать ответы не поможет научиться.',
    explanation_en: 'Helping by explaining is the best form of friendship. Copying answers does not help learning.',
  },
  {
    category:       'kindness',
    question_uz:    "Sinfdoshingiz kasalligi sababli maktabga kelmadi. Siz nima qilasiz?",
    question_ru:    'Одноклассник заболел и не пришёл в школу. Что вы сделаете?',
    question_en:    'Your classmate is sick and absent from school. What do you do?',
    option_a_uz:    "E'tibor bermayman",
    option_a_ru:    'Не обращу внимания',
    option_a_en:    'Pay no attention',
    option_b_uz:    "Uning yo'qligidan xursand bo'laman",
    option_b_ru:    'Обрадуюсь, что его нет',
    option_b_en:    'Be glad they are absent',
    option_c_uz:    "Qo'ng'iroq qilib yoki xabar yozib ahvolini so'rayman",
    option_c_ru:    'Позвоню или напишу и спрошу, как он',
    option_c_en:    'Call or message to ask how they are',
    option_d_uz:    "Uning skameykasiga o'tirib olaman",
    option_d_ru:    'Займу его место за партой',
    option_d_en:    'Take their seat at the desk',
    correct_answer: 'C',
    explanation_uz: "Kasal do'stning ahvolini so'rash — g'amxo'rlik va mehribonlikning belgisidir.",
    explanation_ru: 'Спросить о здоровье больного друга — признак заботы и доброты.',
    explanation_en: 'Checking on a sick friend shows care and kindness.',
  },

  // ── RESPECT: responsibility ───────────────────────────────────────────────
  {
    category:       'respect',
    question_uz:    "O'qituvchi bergan uy vazifasini bajarmadiez. U sizdan so'raganda nima deyasiz?",
    question_ru:    'Вы не выполнили домашнее задание. Учитель спрашивает. Что скажете?',
    question_en:    'You did not complete your homework. The teacher asks about it. What do you say?',
    option_a_uz:    "Yo'qotib qo'ydim deb yolg'on gapirgani",
    option_a_ru:    'Солгу, что потерял',
    option_a_en:    'Lie and say I lost it',
    option_b_uz:    "Boshqa o'quvchini ayblayman",
    option_b_ru:    'Обвиню другого ученика',
    option_b_en:    'Blame another student',
    option_c_uz:    "Bajarmаganimni tan olib, keyingi safar albatta bajarishga va'da beraman",
    option_c_ru:    'Признаюсь и пообещаю выполнить в следующий раз',
    option_c_en:    'Admit it and promise to do it next time',
    option_d_uz:    "Darsdan chiqib ketaman",
    option_d_ru:    'Выйду из класса',
    option_d_en:    'Walk out of class',
    correct_answer: 'C',
    explanation_uz: "O'z xatolarini tan olish — mas'uliyatli va halol bolaning belgisidir. Yolg'on muammoni yanada kattalashtiradi.",
    explanation_ru: 'Признавать свои ошибки — признак ответственного и честного ребёнка. Ложь только усугубляет проблему.',
    explanation_en: 'Admitting your mistakes is the mark of a responsible and honest child. Lying only makes problems worse.',
  },
  {
    category:       'respect',
    question_uz:    "Uyda gul idishini sindirib qo'ydingiz. Ota-onangiz hali bilmaydi. Nima qilasiz?",
    question_ru:    'Вы разбили вазу дома. Родители ещё не знают. Что делаете?',
    question_en:    'You broke a vase at home. Your parents do not know yet. What do you do?',
    option_a_uz:    "Parchalalarini berkitaman",
    option_a_ru:    'Спрячу осколки',
    option_a_en:    'Hide the pieces',
    option_b_uz:    "Singilni ayblаyman",
    option_b_ru:    'Обвиню сестру',
    option_b_en:    'Blame my sister',
    option_c_uz:    "Hech kim ko'rmaydi deb o'ylayman",
    option_c_ru:    'Подумаю, что никто не заметит',
    option_c_en:    'Think nobody will notice',
    option_d_uz:    "Ota-onamga haqiqatni aytib, kechirim so'rayman",
    option_d_ru:    'Скажу родителям правду и попрошу прощения',
    option_d_en:    'Tell my parents the truth and apologise',
    correct_answer: 'D',
    explanation_uz: "Haqiqatni aytish — qiyin bo'lsa ham — ishonch va hurmatni mustahkamlaydi. Yashirish muammoni kattalashtiradi.",
    explanation_ru: 'Говорить правду — даже когда трудно — укрепляет доверие и уважение. Скрывать только усугубляет ситуацию.',
    explanation_en: 'Telling the truth — even when hard — builds trust and respect. Hiding it only makes things worse.',
  },

  // ── HOME: helping parents ─────────────────────────────────────────────────
  {
    category:       'home',
    question_uz:    "Dadangiz ishdan charchab qaytdi. Siz nima qilasiz?",
    question_ru:    'Папа вернулся домой уставшим с работы. Что вы сделаете?',
    question_en:    'Your father comes home tired from work. What do you do?',
    option_a_uz:    "O'yin haqida ko'p gapirib charchataman",
    option_a_ru:    'Буду много говорить об играх и утомлю его',
    option_a_en:    'Talk a lot about games and tire him out',
    option_b_uz:    "Ko'proq pul so'rayman",
    option_b_ru:    'Попрошу больше денег',
    option_b_en:    'Ask for more money',
    option_c_uz:    "Suvini olib kelaman, dam olishiga yordam beraman",
    option_c_ru:    'Принесу воду и помогу ему отдохнуть',
    option_c_en:    'Bring him water and help him rest',
    option_d_uz:    "Televizorni baland qo'yaman",
    option_d_ru:    'Включу телевизор на полную громкость',
    option_d_en:    'Turn the TV up loud',
    correct_answer: 'C',
    explanation_uz: "Charchagan ota-onaga g'amxo'rlik ko'rsatish — mehr va hurmatning eng chiroyli belgisidir.",
    explanation_ru: 'Проявлять заботу о уставших родителях — самое красивое выражение любви и уважения.',
    explanation_en: 'Showing care for tired parents is the most beautiful sign of love and respect.',
  },

  // ── KINDNESS: environment & community ────────────────────────────────────
  {
    category:       'kindness',
    question_uz:    "Ko'chada yurganingizda qo'lingizda konfet qog'ozi qoldi. Nima qilasiz?",
    question_ru:    'Вы идёте по улице и у вас в руке осталась обёртка от конфеты. Что сделаете?',
    question_en:    'You are walking on the street and have a sweet wrapper in your hand. What do you do?',
    option_a_uz:    "Erga tashlayman — hammam shunday qiladi",
    option_a_ru:    'Брошу на землю — все так делают',
    option_a_en:    'Drop it on the ground — everyone does it',
    option_b_uz:    "Shamolga uchiraman",
    option_b_ru:    'Пущу по ветру',
    option_b_en:    'Let the wind take it',
    option_c_uz:    "Axlat qutisi topilguncha cho'ntagimda saqlayman",
    option_c_ru:    'Положу в карман до ближайшей урны',
    option_c_en:    'Keep it in my pocket until I find a bin',
    option_d_uz:    "Boshqaning uyiga tashlayman",
    option_d_ru:    'Брошу во двор к кому-нибудь',
    option_d_en:    'Throw it into someone else\'s yard',
    correct_answer: 'C',
    explanation_uz: "Atrof-muhitni asrash — hammaning burchi. Axlat qutisi topilguncha qog'ozni saqlash — mas'uliyatli xulqdir.",
    explanation_ru: 'Беречь окружающую среду — долг каждого. Хранить мусор до урны — ответственное поведение.',
    explanation_en: 'Protecting the environment is everyone\'s duty. Keeping litter until you find a bin is responsible behaviour.',
  },
  {
    category:       'kindness',
    question_uz:    "Maktab bog'chasidagi gullarni kim sindirganini ko'rdingiz. Siz nima qilasiz?",
    question_ru:    'Вы видели, кто сломал цветы в школьном саду. Что вы сделаете?',
    question_en:    'You saw who broke the flowers in the school garden. What do you do?',
    option_a_uz:    "Indamayman — menga tegishli emas",
    option_a_ru:    'Промолчу — не моё дело',
    option_a_en:    'Stay quiet — it is not my business',
    option_b_uz:    "Men ham sindiraman",
    option_b_ru:    'Тоже сломаю',
    option_b_en:    'Break some too',
    option_c_uz:    "Kuldiraman",
    option_c_ru:    'Буду смеяться',
    option_c_en:    'Laugh about it',
    option_d_uz:    "O'qituvchiga yoki maktab xodimiga xabar beraman",
    option_d_ru:    'Сообщу учителю или работнику школы',
    option_d_en:    'Tell a teacher or school staff member',
    correct_answer: 'D',
    explanation_uz: "Umumiy mulkni himoya qilish — har bir o'quvchining mas'uliyati. Xabar berish — to'g'ri va jasur ishdir.",
    explanation_ru: 'Защищать общее имущество — ответственность каждого ученика. Сообщить — правильный и смелый поступок.',
    explanation_en: 'Protecting shared property is every student\'s responsibility. Reporting it is the right and brave thing to do.',
  },

  // ── HONESTY: gratitude & manners ─────────────────────────────────────────
  {
    category:       'honesty',
    question_uz:    "Birov sizga sovg'a berdi, lekin u sizga yoqmadi. Siz nima deyasiz?",
    question_ru:    'Вам подарили подарок, но он вам не понравился. Что вы скажете?',
    question_en:    'Someone gave you a gift but you do not like it. What do you say?',
    option_a_uz:    "Bu menga yoqmadi deb yuзiga aytaman",
    option_a_ru:    'Скажу прямо, что не понравилось',
    option_a_en:    'Say directly that I do not like it',
    option_b_uz:    "Sovg'ani orqasidan tashlab ketaman",
    option_b_ru:    'Брошу подарок позади',
    option_b_en:    'Throw the gift away behind their back',
    option_c_uz:    "Rahmat aytaman va mehr bilan qabul qilaman",
    option_c_ru:    'Скажу спасибо и приму с теплотой',
    option_c_en:    'Say thank you and accept it warmly',
    option_d_uz:    "Indamayman va yuзimni burishtiraman",
    option_d_ru:    'Промолчу и скорчу недовольное лицо',
    option_d_en:    'Stay silent and make a displeased face',
    correct_answer: 'C',
    explanation_uz: "Har qanday sovg'ani minnatdorlik bilan qabul qilish — odobli va mehribonlikning ko'rinishidir. Muhimi narxda emas, niyatdadir.",
    explanation_ru: 'Принять любой подарок с благодарностью — признак воспитанности и доброты. Важна не цена, а намерение.',
    explanation_en: 'Accepting any gift with gratitude is a sign of good manners and kindness. What matters is the thought, not the price.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🌱  KindQuest — seeding questions...\n');

  // 1. Fetch existing question_uz values to avoid duplicates
  const { data: existing, error: fetchErr } = await supabase
    .from('questions')
    .select('question_uz');

  if (fetchErr) {
    console.error('❌  Failed to fetch existing questions:', fetchErr.message);
    process.exit(1);
  }

  const existingSet  = new Set((existing || []).map((q) => q.question_uz));
  const countBefore  = existing?.length ?? 0;

  console.log(`   Questions in DB before seed: ${countBefore}`);

  // 2. Filter out duplicates
  const toInsert = NEW_QUESTIONS.filter((q) => !existingSet.has(q.question_uz));

  if (toInsert.length === 0) {
    console.log('\n✅  All questions already exist — nothing to insert.\n');
    process.exit(0);
  }

  console.log(`   New questions to insert:     ${toInsert.length}`);

  // 3. Insert
  const { error: insertErr } = await supabase.from('questions').insert(toInsert);

  if (insertErr) {
    console.error('\n❌  Insert failed:', insertErr.message, '\n');
    process.exit(1);
  }

  // 4. Verify final count
  const { count, error: countErr } = await supabase
    .from('questions')
    .select('*', { count: 'exact', head: true });

  if (countErr) {
    console.error('⚠️   Could not verify final count:', countErr.message);
  }

  console.log('\n✅  Done!\n');
  console.log(`   Before:   ${countBefore} questions`);
  console.log(`   Inserted: ${toInsert.length} questions`);
  console.log(`   Total:    ${count ?? '?'} questions\n`);
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
