-- ═══════════════════════════════════════════════════════════════
--  KindQuest — Seed Questions (12 scenario-based questions)
--
--  Run this in: Supabase Dashboard → SQL Editor → New Query
--
--  All questions feature "Temurbek" as the protagonist in real-life
--  moral scenarios, making the game feel like an interactive story.
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

-- 1 · discipline · Kechki ovqatdan keyin stol
('discipline',
 'Temurbek oilasi bilan kechki ovqat yedi. Ovqatdan so''ng onasi charchagan, dadasi ishdan qaytgan. Temurbek stolni kim yig''ishtirishi kerak deb o''ylaydi?',
 'Тимур поужинал вместе с семьёй. После еды мама устала, папа только вернулся с работы. Тимур думает, кто должен убрать со стола?',
 'Temurbek had dinner with his family. After the meal mum is tired and dad just got home from work. Who does Temurbek think should clear the table?',
 'Faqat onam — u har doim yig''ishtiradi', 'Только мама — она всегда убирает', 'Only mum — she always does it',
 'Faqat dadam — u katta', 'Только папа — он старший', 'Only dad — he is the adult',
 'Hech kim — idishlar o''zi yuvilib ketadi', 'Никто — посуда сама помоется', 'Nobody — the dishes wash themselves',
 'Hamma birga — ovqatda qatnashgan hamma yig''ishtiradi', 'Все вместе — убирают те, кто ел', 'Everyone together — whoever ate clears up',
 'D',
 'Stol yig''ishtirish oiladagi umumiy mas''uliyat. Hamma o''z ulushini qo''shganda uy doim tartibli va oila baxtli bo''ladi.',
 'Убирать со стола — общая ответственность в семье. Когда каждый вносит свой вклад, дом в порядке и семья счастлива.',
 'Clearing the table is a shared family responsibility. When everyone contributes, the home stays tidy and the family is happy.'),

-- 2 · discipline · Kiyimlarni qo'yish joyi
('discipline',
 'Temurbek maktabdan qaytdi va maktab formasi bilan futbolkasini yechdi. U ularni qaerga qo''yishi kerak?',
 'Тимур вернулся из школы и снял школьную форму и футболку. Куда ему их положить?',
 'Temurbek got home from school and took off his uniform and T-shirt. Where should he put them?',
 'Erga tashlaydi — keyinroq yig''ishtiradi', 'Бросит на пол — потом уберёт', 'Drop them on the floor — tidy later',
 'Karavot ustiga tashlab ketadi', 'Бросит на кровать', 'Throw them on the bed',
 'Shkaf yoki ilgichiga ilib qo''yadi — har narsa o''z joyida', 'Повесит в шкаф или на крючок — каждой вещи своё место', 'Hang them in the wardrobe or on a hook — everything in its place',
 'Singlisiga beradi', 'Отдаст сестре', 'Give them to his sister',
 'C',
 'Buyumlarni o''z joyiga qo''yish — tartiblilik va intizomning belgisi. Bu vaqtni tejaydi va uyni chiroyli saqlaydi.',
 'Класть вещи на своё место — признак порядка и дисциплины. Это экономит время и сохраняет дом в чистоте.',
 'Putting things in their place shows tidiness and discipline. It saves time and keeps the home looking neat.'),

-- 3 · discipline · Avtobus
('discipline',
 'Temurbek do''sti bilan avtobusda ketmoqda. Ular kulgili bir voqea haqida gaplashmoqchi. Avtobus odamlar bilan to''la. Temurbekning ovozi qanday bo''lishi kerak?',
 'Тимур едет в автобусе с другом. Они хотят поговорить о смешном случае. Автобус полон людей. Каким должен быть голос Тимура?',
 'Temurbek is riding the bus with a friend. They want to talk about something funny. The bus is full of people. How loud should Temurbek''s voice be?',
 'Juda baland — hamma eshitsin va kulsın', 'Очень громко — пусть все слышат и смеются', 'Very loud — let everyone hear and laugh',
 'Baqirib gaplashadi — bu qiziqarli', 'Кричит — это же интересно', 'Shout — it is interesting',
 'Past, boshqalarga xalal bermaydigan darajada', 'Тихо, чтобы не мешать остальным', 'Quietly, so as not to disturb others',
 'Umuman gaplashmaydi', 'Вообще не разговаривает', 'Does not speak at all',
 'C',
 'Jamoat transportida past ovozda gaplashish — atrofdagilarga hurmatning ko''rinishi. Boshqalarning tinchligini buzmaslik muhim odob qoidasi.',
 'Говорить тихо в общественном транспорте — проявление уважения к окружающим. Не нарушать покой других — важное правило этикета.',
 'Speaking quietly on public transport shows respect for those around you. Not disturbing others is an important rule of good manners.'),

-- 4 · discipline · Kinozal
('discipline',
 'Temurbek sinfdoshlari bilan kinoteatrga bordi. Film boshlanish oldidan sumkasidagi telefoni jiringlab qoldi. U nima qilishi kerak?',
 'Тимур пришёл в кинотеатр с одноклассниками. Перед началом фильма в его сумке зазвонил телефон. Что ему нужно сделать?',
 'Temurbek went to the cinema with classmates. Before the film started, his phone rang inside his bag. What should he do?',
 'Darhol javob berib, baland ovozda gaplashadi', 'Сразу ответит и будет говорить громко', 'Answer immediately and speak loudly',
 'Zalda qolib, telefonda gaplashadi', 'Останется в зале и поговорит по телефону', 'Stay in the hall and talk on the phone',
 'Telefonni o''chiradi yoki jimlik rejimiga o''tkazadi', 'Выключит или переведёт телефон в беззвучный режим', 'Switch the phone off or to silent mode',
 'Qo''ng''iroqni qaytarib, hammaning diqqatini jalb qiladi', 'Перезвонит и привлечёт внимание всех', 'Call back and attract everyone''s attention',
 'C',
 'Kinoda telefon o''chirilgan yoki jim rejimda bo''lishi kerak. Bu boshqa tomoshabinlarga hurmatning ko''rinishi va intizomning belgisi.',
 'В кинотеатре телефон должен быть выключен или в беззвучном режиме. Это проявление уважения к другим зрителям и признак дисциплины.',
 'Phones must be off or silent in cinemas. This shows respect for other viewers and is a sign of discipline.'),

-- 5 · kindness · Do'st uy vazifasini tushunmadi
('kindness',
 'Temurbekning do''sti Bobur matematika uy vazifasini tushunmadi va xafa bo''lib o''tirdi. Temurbek nima qilishi kerak?',
 'Друг Тимура Бобур не понял домашнее задание по математике и расстроился. Что должен сделать Тимур?',
 'Temurbek''s friend Bobur did not understand the maths homework and felt upset. What should Temurbek do?',
 'E''tibor bermaydi — Boburning o''z muammosi', 'Не обратит внимания — это проблема Бобура', 'Ignore it — it is Bobur''s problem',
 'Javoblarini ko''chirib beradi', 'Даст списать ответы', 'Let him copy the answers',
 'Tushuntirib beradi va birgalikda bajaradilar', 'Объяснит и они сделают вместе', 'Explain it and work through it together',
 'Qiyin ekan deb kuldiradi', 'Посмеётся, что задание сложное', 'Laugh and say it is too hard',
 'C',
 'Tushuntirish orqali yordam berish — chin do''stlikning ko''rinishi. Javobni ko''chirish esa o''rganishga yordam bermaydi va halol emas.',
 'Помочь объяснением — настоящая дружба. Списывать ответы не помогает учиться и нечестно.',
 'Helping by explaining is true friendship. Copying answers does not help with learning and is not honest.'),

-- 6 · kindness · Kasal sinfdosh
('kindness',
 'Temurbekning sinfdoshi Sarvinoz kasal bo''lib maktabga kela olmadi. Dars ko''p edi va uy vazifasi ham berildi. Temurbek nima qilishi kerak?',
 'Одноклассница Тимура Сарвиноз заболела и не смогла прийти в школу. Уроков было много, и задали домашнее задание. Что должен сделать Тимур?',
 'Temurbek''s classmate Sarvinoz was sick and could not come to school. There were many lessons and homework was assigned. What should Temurbek do?',
 'E''tibor bermaydi', 'Не обратит внимания', 'Pay no attention',
 'Yaqinlashmasligi uchun xursand bo''ladi', 'Обрадуется, что она не пришла', 'Feel glad she did not come',
 'Qo''ng''iroq qilib yoki xabar yozib ahvolini so''raydi va uy vazifasini aytadi', 'Позвонит или напишет, спросит о здоровье и расскажет о домашнем задании', 'Call or message to ask how she is and share the homework',
 'Uning partasiga o''tirib oladi', 'Займёт её место за партой', 'Take her seat at the desk',
 'C',
 'Kasal do''stning ahvolini so''rab, dars ma''lumotlarini ulashish — g''amxo''rlik va mehribonlikning eng chiroyli ko''rinishi.',
 'Спросить больного друга о здоровье и поделиться учебной информацией — прекрасное проявление заботы и доброты.',
 'Checking on a sick friend and sharing school updates is the most beautiful expression of care and kindness.'),

-- 7 · respect · Uy vazifasini bajarmaganlik
('respect',
 'Temurbek kecha uy vazifasini bajarmaganini o''qituvchi sinf oldida so''radi. Nima bo''lgandi? Temurbek nima deyishi kerak?',
 'Учитель спросил Тимура перед классом о домашнем задании, которое тот не выполнил. Что случилось? Что должен сказать Тимур?',
 'The teacher asked Temurbek in front of the class about homework he had not done. What happened? What should Temurbek say?',
 'Daftarni yo''qotib qo''ydim deb yolg''on gapiradi', 'Солжёт, что потерял тетрадь', 'Lie and say he lost the notebook',
 'Boshqa o''quvchini ayblab qo''yadi', 'Обвинит другого ученика', 'Blame another student',
 'Bajarmaganligini tan olib, keyingi safar albatta bajarishga va''da beradi', 'Признаётся и обещает выполнить в следующий раз', 'Admit it and promise to do it next time',
 'Darsdan chiqib ketadi', 'Выйдет из класса', 'Walk out of class',
 'C',
 'O''z xatolarini tan olish — mas''uliyatli va halol bolaning belgisi. Yolg''on muammoni yanada kattalashtiradi va ishonchni yo''qotadi.',
 'Признавать свои ошибки — признак ответственного и честного ребёнка. Ложь усугубляет проблему и подрывает доверие.',
 'Admitting your mistakes is the mark of a responsible and honest child. Lying only makes problems worse and breaks trust.'),

-- 8 · respect · Gul idishini sindirish
('respect',
 'Temurbek uyda to''p o''ynayotganda gul idishini sindirdi. Ota-onasi boshqa xonada — hali bilmaydi. Temurbek nima qilishi kerak?',
 'Тимур играл мячом дома и разбил вазу. Родители в другой комнате — они ещё не знают. Что должен сделать Тимур?',
 'Temurbek was playing with a ball indoors and broke a vase. His parents are in another room and do not know yet. What should he do?',
 'Parchalalarni berkitib qo''yadi', 'Спрячет осколки', 'Hide the pieces',
 'Singlisini ayblab qo''yadi', 'Обвинит сестру', 'Blame his sister',
 'Hech kim ko''rmagan deb o''ylaydi', 'Думает, что никто не заметит', 'Think no one will notice',
 'Ota-onasiga haqiqatni aytib, kechirim so''raydi', 'Скажет родителям правду и попросит прощения', 'Tell his parents the truth and apologise',
 'D',
 'Haqiqatni aytish — qiyin bo''lsa ham — ishonch va hurmatni mustahkamlaydi. Yashirish yoki boshqani ayblab qo''yish muammoni kattalashtiradi.',
 'Говорить правду — даже когда трудно — укрепляет доверие и уважение. Скрывать или обвинять других только усугубляет ситуацию.',
 'Telling the truth — even when it is hard — builds trust and respect. Hiding or blaming others only makes things worse.'),

-- 9 · home · Charchagan ota
('home',
 'Temurbekning dadasi uzoq kunlik ishdan charchab uyga qaytdi. U divanga cho''zilib ko''zini yumdi. Temurbek nima qilishi kerak?',
 'Папа Тимура вернулся домой после долгого рабочего дня и лёг на диван, закрыв глаза. Что должен сделать Тимур?',
 'Temurbek''s dad came home exhausted after a long day at work and lay down on the sofa with his eyes closed. What should Temurbek do?',
 'O''yin haqida ko''p gapirib charchatadi', 'Будет много говорить об играх и утомит его', 'Talk a lot about games and tire him out',
 'Ko''proq cho''ntak puli so''raydi', 'Попросит больше карманных денег', 'Ask for more pocket money',
 'Suvini olib keladi va dam olishiga yordam beradi', 'Принесёт воду и поможет ему отдохнуть', 'Bring him water and help him rest',
 'Televizorni baland qo''yadi', 'Включит телевизор на полную громкость', 'Turn the TV up loud',
 'C',
 'Charchagan ota-onaga g''amxo''rlik ko''rsatish — mehr va hurmatning eng chiroyli ko''rinishi. Kichik yordamlar katta baxt keltiradi.',
 'Проявлять заботу об уставших родителях — самое красивое выражение любви и уважения. Маленькая помощь приносит большую радость.',
 'Showing care for tired parents is the most beautiful sign of love and respect. Small acts of help bring great happiness.'),

-- 10 · kindness · Konfet qog'ozi
('kindness',
 'Temurbek ko''chada konfet yedi. Qo''lida qog''oz qoldi. Yaqin atrofda axlat qutisi ko''rinmaydi. Temurbek nima qilishi kerak?',
 'Тимур шёл по улице и съел конфету. В руке осталась обёртка. Урны рядом нет. Что должен сделать Тимур?',
 'Temurbek was walking down the street and ate a sweet. He has the wrapper in his hand. There is no bin nearby. What should he do?',
 'Erga tashlab ketadi — hammam shunday qiladi', 'Бросит на землю — все так делают', 'Drop it on the ground — everyone does it',
 'Shamolga uchiradi', 'Пустит по ветру', 'Let the wind take it',
 'Axlat qutisi topilguncha cho''ntagida saqlaydi', 'Положит в карман до ближайшей урны', 'Keep it in his pocket until he finds a bin',
 'Boshqaning hovlisiga tashlab ketadi', 'Бросит во двор к кому-нибудь', 'Throw it into someone else''s yard',
 'C',
 'Atrof-muhitni asrash — har kimning burchi. Axlat qutisi topilguncha qog''ozni saqlash — mas''uliyatli va odobli xulqdir.',
 'Беречь окружающую среду — долг каждого. Хранить мусор до урны — ответственное и воспитанное поведение.',
 'Protecting the environment is everyone''s duty. Keeping litter until you find a bin is responsible and good behaviour.'),

-- 11 · kindness · Maktab bog'chasidagi gullar
('kindness',
 'Temurbek maktab hovlisida o''ynayotganda, bir bola atay maktab bog''chasidagi gullarni sindira boshlaganini ko''rdi. Temurbek nima qilishi kerak?',
 'Тимур играл во дворе школы и увидел, как один мальчик специально ломает цветы в школьном саду. Что должен сделать Тимур?',
 'Temurbek was playing in the school yard and saw a boy deliberately breaking flowers in the school garden. What should Temurbek do?',
 'Indamaydi — unga tegishli emas', 'Промолчит — не его дело', 'Stay quiet — it is not his business',
 'U ham sindiradi', 'Тоже сломает', 'Break some too',
 'Kuldiradi', 'Будет смеяться', 'Laugh about it',
 'O''qituvchiga yoki maktab xodimiga xabar beradi', 'Сообщит учителю или работнику школы', 'Tell a teacher or school staff member',
 'D',
 'Umumiy mulkni himoya qilish — har bir o''quvchining mas''uliyati. Xabar berish — to''g''ri va jasur ishdir, bu ayg''oqchilik emas.',
 'Защищать общее имущество — ответственность каждого ученика. Сообщить — правильный и смелый поступок, а не ябедничество.',
 'Protecting shared property is every student''s responsibility. Reporting it is the right and brave thing to do, not telling tales.'),

-- 12 · honesty · Sovg'a yoqmasa
('honesty',
 'Temurbekka tug''ilgan kuni uchun amakisi kitob sovg''a qildi. Lekin Temurbek o''yin mashinani xohlagan edi va bu sovg''a unga unchalik yoqmadi. Temurbek nima deyishi kerak?',
 'На день рождения дядя подарил Тимуру книгу. Но Тимур хотел игрушечную машину, и подарок ему не очень понравился. Что должен сказать Тимур?',
 'For his birthday Temurbek''s uncle gave him a book. But Temurbek had wanted a toy car and did not really like the gift. What should Temurbek say?',
 'Bu menga yoqmadi deb yuziga aytadi', 'Скажет прямо, что не понравилось', 'Say directly that he does not like it',
 'Sovg''ani orqasidan tashlab ketadi', 'Бросит подарок позади', 'Throw the gift behind his back',
 'Rahmat aytadi va mehrli qabul qiladi', 'Скажет спасибо и примет с теплотой', 'Say thank you and accept it warmly',
 'Indamaydi va yuzini burishtiradi', 'Промолчит и скорчит недовольное лицо', 'Stay silent and pull a displeased face',
 'C',
 'Har qanday sovg''ani minnatdorlik bilan qabul qilish — odobli va mehribonlikning ko''rinishi. Muhimi narxda emas, beg''araz niyatdadir.',
 'Принять любой подарок с благодарностью — признак воспитанности и доброты. Важна не цена, а бескорыстное намерение.',
 'Accepting any gift with gratitude is a sign of good manners and kindness. What matters is the thoughtful intention, not the price.')

ON CONFLICT DO NOTHING;

-- ── Verify: how many questions are in the table now? ─────────────
SELECT count(*) AS total_questions FROM public.questions;
