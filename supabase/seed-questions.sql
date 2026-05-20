-- ═══════════════════════════════════════════════════════════════
--  KindQuest — Seed Questions (12 questions)
--
--  Run this in: Supabase Dashboard → SQL Editor → New Query
--
--  Safe to run multiple times — uses ON CONFLICT DO NOTHING so
--  existing questions are never overwritten or duplicated.
-- ═══════════════════════════════════════════════════════════════

INSERT INTO public.questions (
  category,
  question_uz, question_ru, question_en,
  option_a_uz, option_a_ru, option_a_en,
  option_b_uz, option_b_ru, option_b_en,
  option_c_uz, option_c_ru, option_c_en,
  option_d_uz, option_d_ru, option_d_en,
  correct_answer,
  explanation_uz, explanation_ru, explanation_en
) VALUES

-- 1
('discipline',
 'Ovqat yegandan keyin stol ustini kim yig''ishtirishi kerak?',
 'Кто должен убирать со стола после еды?',
 'Who should clean up the table after eating?',
 'Faqat onaginam', 'Только мама', 'Only my mum',
 'Faqat dadaginam', 'Только папа', 'Only my dad',
 'Hech kim — o''zi tozalanib ketadi', 'Никто — само очистится', 'Nobody — it cleans itself',
 'Ovqat yeyishda qatnashgan hamma birga', 'Все, кто ел, вместе', 'Everyone who ate, together',
 'D',
 'Stol yig''ishtirish — oiladagi umumiy mas''uliyat. Hamma o''z ulushini qo''shganda uy doim tartibli bo''ladi.',
 'Убирать со стола — общая ответственность в семье. Когда каждый вносит свой вклад, дом всегда в порядке.',
 'Cleaning the table is a shared family responsibility. When everyone contributes, the home stays tidy.'),

-- 2
('discipline',
 'Kiyimlarni kiyib bo''lgach, qayerda saqlash kerak?',
 'Где нужно хранить одежду после того, как её сняли?',
 'Where should you keep your clothes after taking them off?',
 'Erga tashlash kerak', 'Бросить на пол', 'Drop them on the floor',
 'Karavot ustiga tashlab ketish', 'Бросить на кровать', 'Throw them on the bed',
 'O''z joyiga — shkaf yoki ilgichga ilib qo''yish', 'На своё место — повесить в шкаф или на крючок', 'In their place — hang in the wardrobe or on a hook',
 'Singlimga berish', 'Отдать сестре', 'Give them to my sister',
 'C',
 'Buyumlarni o''z joyiga qo''yish — tartiblilik va intizomning belgisidir. Bu kelajakda vaqtni ham tejaydi.',
 'Класть вещи на своё место — признак порядка и дисциплины. Это также экономит время в будущем.',
 'Putting things in their place shows tidiness and discipline. It also saves time later.'),

-- 3
('discipline',
 'Avtobusda boshqalar bilan suhbatlashayotganda ovozingiz qanday bo''lishi kerak?',
 'Каким должен быть ваш голос при разговоре в автобусе?',
 'How loud should your voice be when talking on a bus?',
 'Juda baland — hamma eshitsin', 'Очень громко — пусть все слышат', 'Very loud — let everyone hear',
 'Baqiriq bilan', 'С криком', 'With shouting',
 'Past va boshqalarga xalal bermaydigan darajada', 'Тихо и не мешая другим', 'Quietly, without disturbing others',
 'Umuman gaplashmaslik kerak', 'Вообще не разговаривать', 'Not talk at all',
 'C',
 'Jamoat transportida past ovozda gaplashish — atrofdagi odamlarga hurmatning ko''rinishidir.',
 'Говорить тихо в общественном транспорте — проявление уважения к окружающим.',
 'Speaking quietly on public transport is a sign of respect for those around you.'),

-- 4
('discipline',
 'Kinozalda film ko''rayotganda telefoningiz jiringladi. Siz nima qilasiz?',
 'В кинотеатре во время фильма зазвонил телефон. Что вы сделаете?',
 'Your phone rings in a cinema during a film. What do you do?',
 'Darhol javob beraman va baland ovozda gaplashaman', 'Сразу отвечу и буду говорить громко', 'Answer immediately and speak loudly',
 'Zalda qolgan holda baland ovozda gaplashaman', 'Остаюсь в зале и говорю громко', 'Stay in the hall and speak loudly',
 'Telefonni o''chirib qo''yaman yoki jimlik rejimiga o''tkazaman', 'Отключу телефон или переведу в беззвучный режим', 'Turn off or silence the phone',
 'Qo''ng''iroqni qaytaraman va hamma diqqatini jalb qilaman', 'Перезвоню и привлеку всеобщее внимание', 'Call back and draw everyone''s attention',
 'C',
 'Jamoat joylarida boshqalarga xalal bermaslik — muhim qoidadir. Kinoda telefon o''chirilgan bo''lishi kerak.',
 'Не мешать другим в общественных местах — важное правило. В кинотеатре телефон должен быть отключён.',
 'Not disturbing others in public places is an important rule. Phones should be silent in cinemas.'),

-- 5
('kindness',
 'Do''stingiz uy vazifasini tushunmadi. Siz nima qilasiz?',
 'Друг не понял домашнее задание. Что вы сделаете?',
 'Your friend did not understand the homework. What do you do?',
 'E''tibor bermayman', 'Не обращу внимания', 'Ignore it',
 'Javoblarni ko''chirib berib ketaman', 'Дам списать ответы', 'Let them copy my answers',
 'Unga tushuntirib beraman va birgalikda bajaramiz', 'Объясню и выполним вместе', 'Explain it and work through it together',
 'Qiyin ekanini aytib kuldiraman', 'Засмеюсь, что это сложно', 'Laugh and say it is too hard',
 'C',
 'Tushuntirish orqali yordam berish — do''stlikning eng yaxshi ko''rinishidir. Javobni ko''chirish esa o''rganishga yordam bermaydi.',
 'Помочь объяснением — лучшее проявление дружбы. Списать ответы не поможет научиться.',
 'Helping by explaining is the best form of friendship. Copying answers does not help learning.'),

-- 6
('kindness',
 'Sinfdoshingiz kasalligi sababli maktabga kelmadi. Siz nima qilasiz?',
 'Одноклассник заболел и не пришёл в школу. Что вы сделаете?',
 'Your classmate is sick and absent from school. What do you do?',
 'E''tibor bermayman', 'Не обращу внимания', 'Pay no attention',
 'Uning yo''qligidan xursand bo''laman', 'Обрадуюсь, что его нет', 'Be glad they are absent',
 'Qo''ng''iroq qilib yoki xabar yozib ahvolini so''rayman', 'Позвоню или напишу и спрошу, как он', 'Call or message to ask how they are',
 'Uning skameykasiga o''tirib olaman', 'Займу его место за партой', 'Take their seat at the desk',
 'C',
 'Kasal do''stning ahvolini so''rash — g''amxo''rlik va mehribonlikning belgisidir.',
 'Спросить о здоровье больного друга — признак заботы и доброты.',
 'Checking on a sick friend shows care and kindness.'),

-- 7
('respect',
 'O''qituvchi bergan uy vazifasini bajarmadiez. U sizdan so''raganda nima deyasiz?',
 'Вы не выполнили домашнее задание. Учитель спрашивает. Что скажете?',
 'You did not complete your homework. The teacher asks about it. What do you say?',
 'Yo''qotib qo''ydim deb yolg''on gapirgani', 'Солгу, что потерял', 'Lie and say I lost it',
 'Boshqa o''quvchini ayblayman', 'Обвиню другого ученика', 'Blame another student',
 'Bajarmaganimni tan olib, keyingi safar albatta bajarishga va''da beraman', 'Признаюсь и пообещаю выполнить в следующий раз', 'Admit it and promise to do it next time',
 'Darsdan chiqib ketaman', 'Выйду из класса', 'Walk out of class',
 'C',
 'O''z xatolarini tan olish — mas''uliyatli va halol bolaning belgisidir. Yolg''on muammoni yanada kattalashtiradi.',
 'Признавать свои ошибки — признак ответственного и честного ребёнка. Ложь только усугубляет проблему.',
 'Admitting your mistakes is the mark of a responsible and honest child. Lying only makes problems worse.'),

-- 8
('respect',
 'Uyda gul idishini sindirib qo''ydingiz. Ota-onangiz hali bilmaydi. Nima qilasiz?',
 'Вы разбили вазу дома. Родители ещё не знают. Что делаете?',
 'You broke a vase at home. Your parents do not know yet. What do you do?',
 'Parchalalarini berkitaman', 'Спрячу осколки', 'Hide the pieces',
 'Singilni ayblayman', 'Обвиню сестру', 'Blame my sister',
 'Hech kim ko''rmaydi deb o''ylayman', 'Подумаю, что никто не заметит', 'Think nobody will notice',
 'Ota-onamga haqiqatni aytib, kechirim so''rayman', 'Скажу родителям правду и попрошу прощения', 'Tell my parents the truth and apologise',
 'D',
 'Haqiqatni aytish — qiyin bo''lsa ham — ishonch va hurmatni mustahkamlaydi. Yashirish muammoni kattalashtiradi.',
 'Говорить правду — даже когда трудно — укрепляет доверие и уважение. Скрывать только усугубляет ситуацию.',
 'Telling the truth — even when hard — builds trust and respect. Hiding it only makes things worse.'),

-- 9
('home',
 'Dadangiz ishdan charchab qaytdi. Siz nima qilasiz?',
 'Папа вернулся домой уставшим с работы. Что вы сделаете?',
 'Your father comes home tired from work. What do you do?',
 'O''yin haqida ko''p gapirib charchataman', 'Буду много говорить об играх и утомлю его', 'Talk a lot about games and tire him out',
 'Ko''proq pul so''rayman', 'Попрошу больше денег', 'Ask for more money',
 'Suvini olib kelaman, dam olishiga yordam beraman', 'Принесу воду и помогу ему отдохнуть', 'Bring him water and help him rest',
 'Televizorni baland qo''yaman', 'Включу телевизор на полную громкость', 'Turn the TV up loud',
 'C',
 'Charchagan ota-onaga g''amxo''rlik ko''rsatish — mehr va hurmatning eng chiroyli belgisidir.',
 'Проявлять заботу о уставших родителях — самое красивое выражение любви и уважения.',
 'Showing care for tired parents is the most beautiful sign of love and respect.'),

-- 10
('kindness',
 'Ko''chada yurganingizda qo''lingizda konfet qog''ozi qoldi. Nima qilasiz?',
 'Вы идёте по улице и у вас в руке осталась обёртка от конфеты. Что сделаете?',
 'You are walking on the street and have a sweet wrapper in your hand. What do you do?',
 'Erga tashlayman — hammam shunday qiladi', 'Брошу на землю — все так делают', 'Drop it on the ground — everyone does it',
 'Shamolga uchiraman', 'Пущу по ветру', 'Let the wind take it',
 'Axlat qutisi topilguncha cho''ntagimda saqlayman', 'Положу в карман до ближайшей урны', 'Keep it in my pocket until I find a bin',
 'Boshqaning uyiga tashlayman', 'Брошу во двор к кому-нибудь', 'Throw it into someone else''s yard',
 'C',
 'Atrof-muhitni asrash — hammaning burchi. Axlat qutisi topilguncha qog''ozni saqlash — mas''uliyatli xulqdir.',
 'Беречь окружающую среду — долг каждого. Хранить мусор до урны — ответственное поведение.',
 'Protecting the environment is everyone''s duty. Keeping litter until you find a bin is responsible behaviour.'),

-- 11
('kindness',
 'Maktab bog''chasidagi gullarni kim sindirganini ko''rdingiz. Siz nima qilasiz?',
 'Вы видели, кто сломал цветы в школьном саду. Что вы сделаете?',
 'You saw who broke the flowers in the school garden. What do you do?',
 'Indamayman — menga tegishli emas', 'Промолчу — не моё дело', 'Stay quiet — it is not my business',
 'Men ham sindiraman', 'Тоже сломаю', 'Break some too',
 'Kuldiraman', 'Буду смеяться', 'Laugh about it',
 'O''qituvchiga yoki maktab xodimiga xabar beraman', 'Сообщу учителю или работнику школы', 'Tell a teacher or school staff member',
 'D',
 'Umumiy mulkni himoya qilish — har bir o''quvchining mas''uliyati. Xabar berish — to''g''ri va jasur ishdir.',
 'Защищать общее имущество — ответственность каждого ученика. Сообщить — правильный и смелый поступок.',
 'Protecting shared property is every student''s responsibility. Reporting it is the right and brave thing to do.'),

-- 12
('honesty',
 'Birov sizga sovg''a berdi, lekin u sizga yoqmadi. Siz nima deyasiz?',
 'Вам подарили подарок, но он вам не понравился. Что вы скажете?',
 'Someone gave you a gift but you do not like it. What do you say?',
 'Bu menga yoqmadi deb yuziga aytaman', 'Скажу прямо, что не понравилось', 'Say directly that I do not like it',
 'Sovg''ani orqasidan tashlab ketaman', 'Брошу подарок позади', 'Throw the gift away behind their back',
 'Rahmat aytaman va mehr bilan qabul qilaman', 'Скажу спасибо и приму с теплотой', 'Say thank you and accept it warmly',
 'Indamayman va yuzimni burishtiraman', 'Промолчу и скорчу недовольное лицо', 'Stay silent and make a displeased face',
 'C',
 'Har qanday sovg''ani minnatdorlik bilan qabul qilish — odobli va mehribonlikning ko''rinishidir. Muhimi narxda emas, niyatdadir.',
 'Принять любой подарок с благодарностью — признак воспитанности и доброты. Важна не цена, а намерение.',
 'Accepting any gift with gratitude is a sign of good manners and kindness. What matters is the thought, not the price.')

ON CONFLICT DO NOTHING;

-- ── Verify: how many questions are in the table now? ─────────────
SELECT count(*) AS total_questions FROM public.questions;
