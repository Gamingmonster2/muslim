import type { AdhkarCategory } from "@/lib/types";

/**
 * نصوص الأذكار والرقية الذاتية — مدققة ومصححة، مع مراجعها وترجمة معانيها.
 * لا تُعدَّل النصوص العربية إلا بمراجعة علمية.
 */
export const adhkarCategories: AdhkarCategory[] = [
  {
    id: "morning",
    title: { ar: "أذكار الصباح", en: "Morning adhkar" },
    description: {
      ar: "تُقال بعد صلاة الفجر إلى الضحى، وهي حصن العبد في نهاره.",
      en: "Recited after Fajr until mid-morning — a protection for the rest of your day.",
    },
    icon: "sun",
    accent: "amber",
    items: [
      {
        id: "m1",
        text: `أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ

اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ، لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ، لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ، مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ، يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ، وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ، وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ، وَلَا يَئُودُهُ حِفْظُهُمَا، وَهُوَ الْعَلِيُّ الْعَظِيمُ.`,
        translation:
          "Allah — there is no deity except Him, the Ever-Living, the Sustainer of existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is before them and what will be after them, and they encompass nothing of His knowledge except what He wills. His Kursi extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.",
        count: 1,
        reference: { ar: "البقرة: ٢٥٥", en: "Al-Baqarah 255" },
      },
      {
        id: "m2",
        text: `بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ

قُلْ هُوَ اللَّهُ أَحَدٌ
اللَّهُ الصَّمَدُ
لَمْ يَلِدْ وَلَمْ يُولَدْ
وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ`,
        translation:
          "In the name of Allah, the Most Gracious, the Most Merciful. Say: He is Allah, the One; Allah, the Eternal Refuge; He neither begets nor is born; nor is there to Him any equivalent.",
        count: 3,
        reference: { ar: "الإخلاص: ١-٤", en: "Al-Ikhlas 1-4" },
      },
      {
        id: "m3",
        text: `بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ

قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ
مِنْ شَرِّ مَا خَلَقَ
وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ
وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ
وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ`,
        translation:
          "In the name of Allah, the Most Gracious, the Most Merciful. Say: I seek refuge in the Lord of the daybreak, from the evil of what He has created, from the evil of darkness when it settles, from the evil of the blowers in knots, and from the evil of an envier when he envies.",
        count: 3,
        reference: { ar: "الفلق: ١-٥", en: "Al-Falaq 1-5" },
      },
      {
        id: "m4",
        text: `بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ

قُلْ أَعُوذُ بِرَبِّ النَّاسِ
مَلِكِ النَّاسِ
إِلَهِ النَّاسِ
مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ
الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ
مِنَ الْجِنَّةِ وَالنَّاسِ`,
        translation:
          "In the name of Allah, the Most Gracious, the Most Merciful. Say: I seek refuge in the Lord of mankind, the Sovereign of mankind, the God of mankind, from the evil of the retreating whisperer who whispers in the breasts of mankind, from among the jinn and mankind.",
        count: 3,
        reference: { ar: "الناس: ١-٦", en: "An-Nas 1-6" },
      },
      {
        id: "m5",
        text:
          "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ. رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ. رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ.",
        translation:
          "We have entered the morning and the dominion belongs to Allah. Praise be to Allah; there is no deity except Allah alone, without partner. To Him belongs the dominion and the praise, and He is over all things competent. My Lord, I ask You for the good of this day and the good after it, and I seek refuge in You from the evil of this day and the evil after it. My Lord, I seek refuge in You from laziness and the misery of old age. My Lord, I seek refuge in You from the punishment of the Fire and the punishment of the grave.",
        count: 1,
        reference: { ar: "مسلم", en: "Muslim" },
      },
      {
        id: "m6",
        text:
          "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ.",
        translation:
          "O Allah, by You we enter the morning, by You we enter the evening, by You we live, by You we die, and to You is the resurrection.",
        count: 1,
        reference: { ar: "الترمذي", en: "At-Tirmidhi" },
      },
      {
        id: "m7",
        text:
          "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي، فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ.",
        translation:
          "O Allah, You are my Lord; there is no deity except You. You created me and I am Your servant, and I abide by Your covenant and promise as best I can. I seek refuge in You from the evil of what I have done. I acknowledge Your favor upon me, and I acknowledge my sin, so forgive me, for none forgives sins except You.",
        count: 1,
        reference: { ar: "البخاري — سيد الاستغفار", en: "Al-Bukhari — Sayyid al-Istighfar" },
      },
      {
        id: "m8",
        text:
          "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَهَ إِلَّا أَنْتَ. اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ وَالْفَقْرِ، وَأَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، لَا إِلَهَ إِلَّا أَنْتَ.",
        translation:
          "O Allah, grant me health in my body; O Allah, grant me health in my hearing; O Allah, grant me health in my sight; there is no deity except You. O Allah, I seek refuge in You from disbelief and poverty, and I seek refuge in You from the punishment of the grave; there is no deity except You.",
        count: 3,
        reference: { ar: "أبو داود", en: "Abu Dawud" },
      },
      {
        id: "m9",
        text:
          "حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ، عَلَيْهِ تَوَكَّلْتُ، وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ.",
        translation:
          "Allah is sufficient for me; there is no deity except Him. Upon Him I rely, and He is the Lord of the Great Throne.",
        count: 7,
        reference: { ar: "أبو داود", en: "Abu Dawud" },
      },
      {
        id: "m10",
        text:
          "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ، وَهُوَ السَّمِيعُ الْعَلِيمُ.",
        translation:
          "In the name of Allah, with whose name nothing on earth or in the heaven can cause harm, and He is the All-Hearing, the All-Knowing.",
        count: 3,
        reference: { ar: "أبو داود والترمذي", en: "Abu Dawud & At-Tirmidhi" },
      },
      {
        id: "m11",
        text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ.",
        translation: "Glory be to Allah and praise be to Him.",
        count: 100,
        reference: { ar: "مسلم", en: "Muslim" },
      },
      {
        id: "m12",
        text: "رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ ﷺ نَبِيًّا.",
        translation:
          "I am pleased with Allah as my Lord, with Islam as my religion, and with Muhammad ﷺ as my Prophet.",
        count: 3,
        reference: { ar: "أبو داود", en: "Abu Dawud" },
      },
      {
        id: "m13",
        text:
          "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ، وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ.",
        translation:
          "O Ever-Living, O Sustainer, by Your mercy I seek relief. Set right all my affairs, and do not leave me to myself even for the blink of an eye.",
        count: 1,
        reference: { ar: "الحاكم", en: "Al-Hakim" },
      },
      {
        id: "m14",
        text:
          "اللَّهُمَّ إِنِّي أَصْبَحْتُ أُشْهِدُكَ، وَأُشْهِدُ حَمَلَةَ عَرْشِكَ، وَمَلَائِكَتَكَ وَجَمِيعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللَّهُ لَا إِلَهَ إِلَّا أَنْتَ وَحْدَكَ لَا شَرِيكَ لَكَ، وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ.",
        translation:
          "O Allah, I have entered the morning calling You, the bearers of Your Throne, Your angels and all Your creation to witness that You are Allah; there is no deity except You alone, without partner, and that Muhammad is Your servant and Messenger.",
        count: 4,
        reference: { ar: "أبو داود", en: "Abu Dawud" },
      },
    ],
  },
  {
    id: "evening",
    title: { ar: "أذكار المساء", en: "Evening adhkar" },
    description: {
      ar: "تُقال بعد صلاة العصر إلى غروب الشمس، وتُختم بها يومك.",
      en: "Recited after Asr until sunset — the closing remembrance of your day.",
    },
    icon: "moon",
    accent: "indigo",
    items: [
      {
        id: "e1",
        text: `أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ

اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ، لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ، لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ، مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ، يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ، وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ، وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ، وَلَا يَئُودُهُ حِفْظُهُمَا، وَهُوَ الْعَلِيُّ الْعَظِيمُ.`,
        translation:
          "Allah — there is no deity except Him, the Ever-Living, the Sustainer of existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. His Kursi extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.",
        count: 1,
        reference: { ar: "البقرة: ٢٥٥", en: "Al-Baqarah 255" },
      },
      {
        id: "e2",
        text: `بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ

قُلْ هُوَ اللَّهُ أَحَدٌ، اللَّهُ الصَّمَدُ، لَمْ يَلِدْ وَلَمْ يُولَدْ، وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ`,
        translation:
          "In the name of Allah, the Most Gracious, the Most Merciful. Say: He is Allah, the One; Allah, the Eternal Refuge; He neither begets nor is born; nor is there to Him any equivalent.",
        count: 3,
        reference: { ar: "الإخلاص: ١-٤", en: "Al-Ikhlas 1-4" },
      },
      {
        id: "e3",
        text: `بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ

قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ، مِنْ شَرِّ مَا خَلَقَ، وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ، وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ، وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ`,
        translation:
          "In the name of Allah, the Most Gracious, the Most Merciful. Say: I seek refuge in the Lord of the daybreak, from the evil of what He has created, from the evil of darkness when it settles, from the evil of the blowers in knots, and from the evil of an envier when he envies.",
        count: 3,
        reference: { ar: "الفلق: ١-٥", en: "Al-Falaq 1-5" },
      },
      {
        id: "e4",
        text: `بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ

قُلْ أَعُوذُ بِرَبِّ النَّاسِ، مَلِكِ النَّاسِ، إِلَهِ النَّاسِ، مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ، الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ، مِنَ الْجِنَّةِ وَالنَّاسِ`,
        translation:
          "In the name of Allah, the Most Gracious, the Most Merciful. Say: I seek refuge in the Lord of mankind, the Sovereign of mankind, the God of mankind, from the evil of the retreating whisperer who whispers in the breasts of mankind, from among the jinn and mankind.",
        count: 3,
        reference: { ar: "الناس: ١-٦", en: "An-Nas 1-6" },
      },
      {
        id: "e5",
        text:
          "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ. رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهَا، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا. رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ.",
        translation:
          "We have entered the evening and the dominion belongs to Allah. Praise be to Allah; there is no deity except Allah alone, without partner. My Lord, I ask You for the good of this night and the good after it, and I seek refuge in You from the evil of this night and the evil after it. My Lord, I seek refuge in You from laziness and the misery of old age, and from the punishment of the Fire and the grave.",
        count: 1,
        reference: { ar: "مسلم", en: "Muslim" },
      },
      {
        id: "e6",
        text:
          "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ.",
        translation:
          "O Allah, by You we enter the evening, by You we enter the morning, by You we live, by You we die, and to You is the final destination.",
        count: 1,
        reference: { ar: "الترمذي", en: "At-Tirmidhi" },
      },
      {
        id: "e7",
        text:
          "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي، فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ.",
        translation:
          "O Allah, You are my Lord; there is no deity except You. You created me and I am Your servant, and I abide by Your covenant and promise as best I can. I seek refuge in You from the evil of what I have done. I acknowledge Your favor upon me, and I acknowledge my sin, so forgive me, for none forgives sins except You.",
        count: 1,
        reference: { ar: "البخاري — سيد الاستغفار", en: "Al-Bukhari — Sayyid al-Istighfar" },
      },
      {
        id: "e8",
        text:
          "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَهَ إِلَّا أَنْتَ. اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ وَالْفَقْرِ، وَأَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، لَا إِلَهَ إِلَّا أَنْتَ.",
        translation:
          "O Allah, grant me health in my body, my hearing and my sight; there is no deity except You. I seek refuge in You from disbelief and poverty, and from the punishment of the grave; there is no deity except You.",
        count: 3,
        reference: { ar: "أبو داود", en: "Abu Dawud" },
      },
      {
        id: "e9",
        text:
          "حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ، عَلَيْهِ تَوَكَّلْتُ، وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ.",
        translation:
          "Allah is sufficient for me; there is no deity except Him. Upon Him I rely, and He is the Lord of the Great Throne.",
        count: 7,
        reference: { ar: "أبو داود", en: "Abu Dawud" },
      },
      {
        id: "e10",
        text:
          "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ، وَهُوَ السَّمِيعُ الْعَلِيمُ.",
        translation:
          "In the name of Allah, with whose name nothing on earth or in the heaven can cause harm, and He is the All-Hearing, the All-Knowing.",
        count: 3,
        reference: { ar: "أبو داود والترمذي", en: "Abu Dawud & At-Tirmidhi" },
      },
      {
        id: "e11",
        text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ.",
        translation: "Glory be to Allah and praise be to Him.",
        count: 100,
        reference: { ar: "مسلم", en: "Muslim" },
      },
      {
        id: "e12",
        text: "رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ ﷺ نَبِيًّا.",
        translation:
          "I am pleased with Allah as my Lord, with Islam as my religion, and with Muhammad ﷺ as my Prophet.",
        count: 3,
        reference: { ar: "أبو داود", en: "Abu Dawud" },
      },
      {
        id: "e13",
        text:
          "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ، وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ.",
        translation:
          "O Ever-Living, O Sustainer, by Your mercy I seek relief. Set right all my affairs, and do not leave me to myself even for the blink of an eye.",
        count: 1,
        reference: { ar: "الحاكم", en: "Al-Hakim" },
      },
      {
        id: "e14",
        text:
          "اللَّهُمَّ إِنِّي أَمْسَيْتُ أُشْهِدُكَ، وَأُشْهِدُ حَمَلَةَ عَرْشِكَ، وَمَلَائِكَتَكَ وَجَمِيعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللَّهُ لَا إِلَهَ إِلَّا أَنْتَ وَحْدَكَ لَا شَرِيكَ لَكَ، وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ.",
        translation:
          "O Allah, I have entered the evening calling You, the bearers of Your Throne, Your angels and all Your creation to witness that You are Allah; there is no deity except You alone, without partner, and that Muhammad is Your servant and Messenger.",
        count: 4,
        reference: { ar: "أبو داود", en: "Abu Dawud" },
      },
    ],
  },
  {
    id: "sleep",
    title: { ar: "أذكار النوم", en: "Sleep adhkar" },
    description: {
      ar: "ما يُقال قبل النوم لنوم آمن وقلب مطمئن.",
      en: "What to say before sleeping for a safe night and a calm heart.",
    },
    icon: "bed",
    accent: "violet",
    items: [
      {
        id: "s1",
        text: `اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ، لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ، لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ، مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ، يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ، وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ، وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ، وَلَا يَئُودُهُ حِفْظُهُمَا، وَهُوَ الْعَلِيُّ الْعَظِيمُ.`,
        translation:
          "Allah — there is no deity except Him, the Ever-Living, the Sustainer of existence. His Kursi extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.",
        count: 1,
        reference: { ar: "البقرة: ٢٥٥", en: "Al-Baqarah 255" },
      },
      {
        id: "s2",
        text: "قُلْ هُوَ اللَّهُ أَحَدٌ، اللَّهُ الصَّمَدُ، لَمْ يَلِدْ وَلَمْ يُولَدْ، وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ.",
        translation:
          "Say: He is Allah, the One; Allah, the Eternal Refuge; He neither begets nor is born; nor is there to Him any equivalent.",
        count: 3,
        reference: { ar: "الإخلاص", en: "Al-Ikhlas" },
      },
      {
        id: "s3",
        text: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ، مِنْ شَرِّ مَا خَلَقَ، وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ، وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ، وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ.",
        translation:
          "Say: I seek refuge in the Lord of the daybreak, from the evil of what He has created, from the evil of darkness when it settles, from the evil of the blowers in knots, and from the evil of an envier when he envies.",
        count: 3,
        reference: { ar: "الفلق", en: "Al-Falaq" },
      },
      {
        id: "s4",
        text: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ، مَلِكِ النَّاسِ، إِلَهِ النَّاسِ، مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ، الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ، مِنَ الْجِنَّةِ وَالنَّاسِ.",
        translation:
          "Say: I seek refuge in the Lord of mankind, the Sovereign of mankind, the God of mankind, from the evil of the retreating whisperer who whispers in the breasts of mankind, from among the jinn and mankind.",
        count: 3,
        reference: { ar: "الناس", en: "An-Nas" },
      },
      {
        id: "s5",
        text: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا.",
        translation: "In Your name, O Allah, I die and I live.",
        count: 1,
        reference: { ar: "البخاري", en: "Al-Bukhari" },
      },
      {
        id: "s6",
        text: "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ.",
        translation: "O Allah, protect me from Your punishment on the Day You resurrect Your servants.",
        count: 3,
        reference: { ar: "أبو داود والترمذي", en: "Abu Dawud & At-Tirmidhi" },
      },
      {
        id: "s7",
        text:
          "اللَّهُمَّ أَسْلَمْتُ نَفْسِي إِلَيْكَ، وَفَوَّضْتُ أَمْرِي إِلَيْكَ، وَوَجَّهْتُ وَجْهِي إِلَيْكَ، وَأَلْجَأْتُ ظَهْرِي إِلَيْكَ، رَغْبَةً وَرَهْبَةً إِلَيْكَ، لَا مَلْجَأَ وَلَا مَنْجَا مِنْكَ إِلَّا إِلَيْكَ، آمَنْتُ بِكِتَابِكَ الَّذِي أَنْزَلْتَ، وَبِنَبِيِّكَ الَّذِي أَرْسَلْتَ.",
        translation:
          "O Allah, I submit myself to You, entrust my affair to You, turn my face to You, and rely upon You, out of desire for You and fear of You. There is no refuge and no escape from You except to You. I believe in Your Book which You revealed and in Your Prophet whom You sent.",
        count: 1,
        reference: { ar: "متفق عليه", en: "Agreed upon" },
      },
      {
        id: "s8",
        text: "سُبْحَانَ اللَّهِ.",
        translation: "Glory be to Allah.",
        count: 33,
        reference: { ar: "متفق عليه", en: "Agreed upon" },
      },
      {
        id: "s9",
        text: "الْحَمْدُ لِلَّهِ.",
        translation: "All praise is due to Allah.",
        count: 33,
        reference: { ar: "متفق عليه", en: "Agreed upon" },
      },
      {
        id: "s10",
        text: "اللَّهُ أَكْبَرُ.",
        translation: "Allah is the Greatest.",
        count: 34,
        reference: { ar: "متفق عليه", en: "Agreed upon" },
      },
      {
        id: "s11",
        text: `آمَنَ الرَّسُولُ بِمَا أُنْزِلَ إِلَيْهِ مِنْ رَبِّهِ وَالْمُؤْمِنُونَ، كُلٌّ آمَنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ، لَا نُفَرِّقُ بَيْنَ أَحَدٍ مِنْ رُسُلِهِ، وَقَالُوا سَمِعْنَا وَأَطَعْنَا غُفْرَانَكَ رَبَّنَا وَإِلَيْكَ الْمَصِيرُ. لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا، لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا اكْتَسَبَتْ، رَبَّنَا لَا تُؤَاخِذْنَا إِنْ نَسِينَا أَوْ أَخْطَأْنَا، رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الَّذِينَ مِنْ قَبْلِنَا، رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ، وَاعْفُ عَنَّا وَاغْفِرْ لَنَا وَارْحَمْنَا، أَنْتَ مَوْلَانَا فَانْصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ.`,
        translation:
          "The Messenger has believed in what was revealed to him from his Lord, and so have the believers. All have believed in Allah, His angels, His books and His messengers. We make no distinction between any of His messengers. They say: We hear and we obey; Your forgiveness, our Lord, and to You is the destination. Allah does not burden a soul beyond its capacity. It will have the good it earned and bear the evil it earned. Our Lord, do not hold us accountable if we forget or err. Our Lord, do not place upon us a burden as You placed on those before us. Our Lord, do not burden us with what we cannot bear. Pardon us, forgive us and have mercy on us. You are our Protector, so grant us victory over the disbelieving people.",
        count: 1,
        reference: { ar: "البقرة: ٢٨٥-٢٨٦", en: "Al-Baqarah 285-286" },
      },
    ],
  },
  {
    id: "wake",
    title: { ar: "أذكار الاستيقاظ", en: "Waking adhkar" },
    description: {
      ar: "أول ما يُقال عند الاستيقاظ من النوم.",
      en: "The first words said upon waking from sleep.",
    },
    icon: "sunrise",
    accent: "rose",
    items: [
      {
        id: "w1",
        text: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ.",
        translation:
          "Praise be to Allah who gave us life after having taken it from us, and to Him is the resurrection.",
        count: 1,
        reference: { ar: "البخاري", en: "Al-Bukhari" },
      },
      {
        id: "w2",
        text:
          "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَلَا إِلَهَ إِلَّا اللَّهُ، وَاللَّهُ أَكْبَرُ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ، اللَّهُمَّ اغْفِرْ لِي.",
        translation:
          "There is no deity except Allah alone, without partner. To Him belongs the dominion and the praise, and He is over all things competent. Glory be to Allah, praise be to Allah, there is no deity except Allah, Allah is the Greatest, and there is no might nor power except with Allah. O Allah, forgive me.",
        count: 1,
        reference: { ar: "البخاري", en: "Al-Bukhari" },
      },
      {
        id: "w3",
        text:
          "الْحَمْدُ لِلَّهِ الَّذِي رَدَّ عَلَيَّ رُوحِي، وَعَافَانِي فِي جَسَدِي، وَأَذِنَ لِي بِذِكْرِهِ.",
        translation:
          "Praise be to Allah who returned my soul to me, granted me health in my body, and permitted me to remember Him.",
        count: 1,
        reference: { ar: "الترمذي", en: "At-Tirmidhi" },
      },
    ],
  },
  {
    id: "distress",
    title: { ar: "أدعية الهمّ والحزن", en: "Distress & anxiety" },
    description: {
      ar: "ما يقال عند الضيق والكرب والخوف والغمّ.",
      en: "What to say in times of tightness, grief, fear and anxiety.",
    },
    icon: "heart",
    accent: "emerald",
    items: [
      {
        id: "d1",
        text:
          "لَا إِلَهَ إِلَّا اللَّهُ الْعَظِيمُ الْحَلِيمُ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ الْعَرْشِ الْعَظِيمِ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ السَّمَاوَاتِ وَرَبُّ الْأَرْضِ وَرَبُّ الْعَرْشِ الْكَرِيمِ.",
        translation:
          "There is no deity except Allah, the Mighty, the Forbearing. There is no deity except Allah, Lord of the Great Throne. There is no deity except Allah, Lord of the heavens and Lord of the earth and Lord of the Noble Throne.",
        count: 1,
        reference: { ar: "متفق عليه", en: "Agreed upon" },
      },
      {
        id: "d2",
        text:
          "اللَّهُمَّ إِنِّي عَبْدُكَ، ابْنُ عَبْدِكَ، ابْنُ أَمَتِكَ، نَاصِيَتِي بِيَدِكَ، مَاضٍ فِيَّ حُكْمُكَ، عَدْلٌ فِيَّ قَضَاؤُكَ، أَسْأَلُكَ بِكُلِّ اسْمٍ هُوَ لَكَ، سَمَّيْتَ بِهِ نَفْسَكَ، أَوْ أَنْزَلْتَهُ فِي كِتَابِكَ، أَوْ عَلَّمْتَهُ أَحَدًا مِنْ خَلْقِكَ، أَوِ اسْتَأْثَرْتَ بِهِ فِي عِلْمِ الْغَيْبِ عِنْدَكَ، أَنْ تَجْعَلَ الْقُرْآنَ رَبِيعَ قَلْبِي، وَنُورَ صَدْرِي، وَجِلَاءَ حُزْنِي، وَذَهَابَ هَمِّي.",
        translation:
          "O Allah, I am Your servant, son of Your servant, son of Your maidservant. My forelock is in Your hand, Your command over me is forever executed, and Your decree over me is just. I ask You by every name belonging to You which You have named Yourself with, revealed in Your Book, taught to any of Your creation, or kept hidden in the knowledge of the unseen with You: make the Qur'an the life of my heart, the light of my chest, the departure of my sadness, and the relief of my anxiety.",
        count: 1,
        reference: { ar: "أحمد", en: "Ahmad" },
      },
      {
        id: "d3",
        text:
          "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ.",
        translation:
          "O Allah, I seek refuge in You from anxiety and sorrow, from weakness and laziness, from miserliness and cowardice, from the burden of debt and from being overpowered by men.",
        count: 1,
        reference: { ar: "البخاري", en: "Al-Bukhari" },
      },
      {
        id: "d4",
        text:
          "حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ، عَلَيْهِ تَوَكَّلْتُ، وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ.",
        translation:
          "Allah is sufficient for me; there is no deity except Him. Upon Him I rely, and He is the Lord of the Great Throne.",
        count: 7,
        reference: { ar: "أبو داود", en: "Abu Dawud" },
      },
      {
        id: "d5",
        text: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ.",
        translation: "There is no might and no power except with Allah.",
        count: 10,
        reference: { ar: "متفق عليه", en: "Agreed upon" },
      },
      {
        id: "d6",
        text:
          "اللَّهُمَّ رَحْمَتَكَ أَرْجُو، فَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ، وَأَصْلِحْ لِي شَأْنِي كُلَّهُ، لَا إِلَهَ إِلَّا أَنْتَ.",
        translation:
          "O Allah, it is Your mercy that I hope for. Do not leave me to myself even for the blink of an eye. Set right all my affairs. There is no deity except You.",
        count: 1,
        reference: { ar: "أبو داود", en: "Abu Dawud" },
      },
      {
        id: "d7",
        text: "لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ.",
        translation:
          "There is no deity except You; glory be to You; indeed I have been among the wrongdoers.",
        count: 1,
        reference: { ar: "الأنبياء: ٨٧", en: "Al-Anbiya 87" },
      },
    ],
  },
  {
    id: "healing",
    title: { ar: "الرقية الذاتية", en: "Self-ruqyah" },
    description: {
      ar: "آيات الشفاء والسور المعوذات تقرأها على نفسك أو على من ترقيه.",
      en: "Verses of healing and the protective surahs to recite upon yourself or someone you treat.",
    },
    icon: "heart-pulse",
    accent: "sky",
    items: [
      {
        id: "h1",
        text: `بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ

الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ
الرَّحْمَنِ الرَّحِيمِ
مَالِكِ يَوْمِ الدِّينِ
إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ
اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ
صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ
غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ`,
        translation:
          "In the name of Allah, the Most Gracious, the Most Merciful. All praise is due to Allah, Lord of the worlds, the Most Gracious, the Most Merciful, Sovereign of the Day of Judgment. It is You we worship and You we ask for help. Guide us to the straight path, the path of those upon whom You have bestowed favor, not of those who have earned Your anger nor of those who are astray.",
        count: 7,
        reference: { ar: "الفاتحة", en: "Al-Fatihah" },
      },
      {
        id: "h2",
        text: `اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ، لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ، لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ، مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ، يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ، وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ، وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ، وَلَا يَئُودُهُ حِفْظُهُمَا، وَهُوَ الْعَلِيُّ الْعَظِيمُ.`,
        translation:
          "Allah — there is no deity except Him, the Ever-Living, the Sustainer of existence. His Kursi extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.",
        count: 1,
        reference: { ar: "البقرة: ٢٥٥", en: "Al-Baqarah 255" },
      },
      {
        id: "h3",
        text: `آمَنَ الرَّسُولُ بِمَا أُنْزِلَ إِلَيْهِ مِنْ رَبِّهِ وَالْمُؤْمِنُونَ، كُلٌّ آمَنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ، لَا نُفَرِّقُ بَيْنَ أَحَدٍ مِنْ رُسُلِهِ، وَقَالُوا سَمِعْنَا وَأَطَعْنَا غُفْرَانَكَ رَبَّنَا وَإِلَيْكَ الْمَصِيرُ. لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا، لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا اكْتَسَبَتْ، رَبَّنَا لَا تُؤَاخِذْنَا إِنْ نَسِينَا أَوْ أَخْطَأْنَا، رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الَّذِينَ مِنْ قَبْلِنَا، رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ، وَاعْفُ عَنَّا وَاغْفِرْ لَنَا وَارْحَمْنَا، أَنْتَ مَوْلَانَا فَانْصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ.`,
        translation:
          "The Messenger has believed in what was revealed to him from his Lord, and so have the believers... Our Lord, do not hold us accountable if we forget or err... Pardon us, forgive us and have mercy on us. You are our Protector.",
        count: 1,
        reference: { ar: "البقرة: ٢٨٥-٢٨٦", en: "Al-Baqarah 285-286" },
      },
      {
        id: "h4",
        text: `قُلْ هُوَ اللَّهُ أَحَدٌ، اللَّهُ الصَّمَدُ، لَمْ يَلِدْ وَلَمْ يُولَدْ، وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ.`,
        translation:
          "Say: He is Allah, the One; Allah, the Eternal Refuge; He neither begets nor is born; nor is there to Him any equivalent.",
        count: 3,
        reference: { ar: "الإخلاص", en: "Al-Ikhlas" },
      },
      {
        id: "h5",
        text: `قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ، مِنْ شَرِّ مَا خَلَقَ، وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ، وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ، وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ.`,
        translation:
          "Say: I seek refuge in the Lord of the daybreak, from the evil of what He has created, from the evil of darkness when it settles, from the evil of the blowers in knots, and from the evil of an envier when he envies.",
        count: 3,
        reference: { ar: "الفلق", en: "Al-Falaq" },
      },
      {
        id: "h6",
        text: `قُلْ أَعُوذُ بِرَبِّ النَّاسِ، مَلِكِ النَّاسِ، إِلَهِ النَّاسِ، مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ، الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ، مِنَ الْجِنَّةِ وَالنَّاسِ.`,
        translation:
          "Say: I seek refuge in the Lord of mankind, the Sovereign of mankind, the God of mankind, from the evil of the retreating whisperer who whispers in the breasts of mankind, from among the jinn and mankind.",
        count: 3,
        reference: { ar: "الناس", en: "An-Nas" },
      },
      {
        id: "h7",
        text:
          "وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ شِفَاءٌ وَرَحْمَةٌ لِلْمُؤْمِنِينَ، وَلَا يَزِيدُ الظَّالِمِينَ إِلَّا خَسَارًا.",
        translation:
          "And We send down of the Qur'an that which is healing and mercy for the believers, but it does not increase the wrongdoers except in loss.",
        count: 3,
        reference: { ar: "الإسراء: ٨٢", en: "Al-Isra 82" },
      },
      {
        id: "h8",
        text: "وَإِذَا مَرِضْتُ فَهُوَ يَشْفِينِ.",
        translation: "And when I am ill, it is He who cures me.",
        count: 7,
        reference: { ar: "الشعراء: ٨٠", en: "Ash-Shu'ara 80" },
      },
      {
        id: "h9",
        text: "قُلْ هُوَ لِلَّذِينَ آمَنُوا هُدًى وَشِفَاءٌ.",
        translation: "Say: It is, for those who believe, a guidance and healing.",
        count: 3,
        reference: { ar: "فصلت: ٤٤", en: "Fussilat 44" },
      },
      {
        id: "h10",
        text:
          "وَأَيُّوبَ إِذْ نَادَى رَبَّهُ أَنِّي مَسَّنِيَ الضُّرُّ وَأَنْتَ أَرْحَمُ الرَّاحِمِينَ.",
        translation:
          "And [mention] Ayyub, when he called to his Lord: Indeed, adversity has touched me, and You are the most merciful of the merciful.",
        count: 3,
        reference: { ar: "الأنبياء: ٨٣", en: "Al-Anbiya 83" },
      },
      {
        id: "h11",
        text: "أَسْأَلُ اللَّهَ الْعَظِيمَ رَبَّ الْعَرْشِ الْعَظِيمِ أَنْ يَشْفِيَكَ.",
        translation:
          "I ask Allah the Mighty, Lord of the Great Throne, to heal you.",
        count: 7,
        reference: { ar: "أبو داود والترمذي", en: "Abu Dawud & At-Tirmidhi" },
      },
      {
        id: "h12",
        text: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ.",
        translation:
          "I seek refuge in the perfect words of Allah from the evil of what He has created.",
        count: 3,
        reference: { ar: "مسلم", en: "Muslim" },
      },
      {
        id: "h13",
        text:
          "اللَّهُمَّ رَبَّ النَّاسِ، أَذْهِبِ الْبَاسَ، اشْفِ أَنْتَ الشَّافِي، لَا شَافِيَ إِلَّا أَنْتَ.",
        translation:
          "O Allah, Lord of mankind, remove the harm. Heal, for You are the Healer; there is no healer except You.",
        count: 3,
        reference: { ar: "متفق عليه", en: "Agreed upon" },
      },
    ],
  },
];

export function getAdhkarCategory(id: string): AdhkarCategory | undefined {
  return adhkarCategories.find((category) => category.id === id);
}
