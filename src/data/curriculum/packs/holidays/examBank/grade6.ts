import type { ExamBankPack } from '../../../examBank/types';

/**
 * The holidays pack's grade 6 exam bank (Feature 43), by the unit number in its mission ids.
 * Review-level grammar (Present Simple, do / does, Present Progressive) with holiday words.
 * The last 2 items of each list and the second passage are for the mock exam.
 */
export const HOLIDAYS_GRADE_6_EXAM_BANK: ExamBankPack = {
  // Autumn & winter: traditions in Present Simple, Sukkot and Hanukkah in Present Progressive
  31: {
    vocabulary: [
      {
        clozeEn: 'Lighting candles on Hanukkah is an old ____.',
        clozeHe: 'הדלקת נרות בחנוכה היא מסורת עתיקה.',
        answer: 'tradition',
        wrong: ['raincoat', 'roof'],
      },
      {
        clozeEn: 'Our ____ from Beer Sheva come to visit every holiday.',
        clozeHe: 'קרובי המשפחה שלנו מבאר שבע באים לבקר בכל חג.',
        answer: 'relatives',
        wrong: ['candle', 'apple'],
      },
      {
        clozeEn: 'We use paper and glue to ____ the sukkah.',
        clozeHe: 'אנחנו משתמשים בנייר ובדבק כדי לקשט את הסוכה.',
        answer: 'decorate',
        wrong: ['cloudy', 'honey'],
      },
      {
        clozeEn: 'Take an umbrella, because the sky is grey and ____.',
        clozeHe: 'קחו מטרייה, כי השמיים אפורים ומעוננים.',
        answer: 'cloudy',
        wrong: ['tradition', 'roof'],
      },
      {
        clozeEn: 'Bees work hard to make sweet ____.',
        clozeHe: 'דבורים עובדות קשה כדי להכין דבש מתוק.',
        answer: 'honey',
        wrong: ['raincoat', 'relatives'],
      },
      {
        clozeEn: 'When it rains, I wear my yellow ____ to school.',
        clozeHe: 'כשיורד גשם, אני לובש/ת את מעיל הגשם הצהוב שלי לבית הספר.',
        answer: 'raincoat',
        wrong: ['apple', 'decorate'],
      },
    ],
    grammar: [
      {
        questionEn: 'Complete: "Every year my uncle ____ the shofar."',
        correct: 'blows',
        wrong: ['blow', 'is blow'],
        explainHe: 'מנהג של כל שנה הוא Present Simple, ועם he מוסיפים s: blows.',
        hintHe: 'Every year מראה הרגל, ו-my uncle הוא he. מה מוסיפים לפועל עם he?',
      },
      {
        questionEn: 'Complete: "Look! The children ____ the sukkah now."',
        correct: 'are decorating',
        wrong: ['decorates', 'is decorating'],
        explainHe: 'Look! ו-now אומרים שזה קורה עכשיו. the children הם רבים, ולכן are decorating.',
        hintHe: 'זה קורה עכשיו, ו-the children הם רבים. איזו צורה של be מתאימה לרבים?',
      },
      {
        questionEn: 'Which question is correct?',
        correct: 'Does your family build a sukkah every year?',
        wrong: ['Do your family build a sukkah every year?', 'Does your family builds a sukkah every year?'],
        explainHe: 'your family היא it, ולכן Does, והפועל אחריו בלי s: build.',
        hintHe: 'your family היא it. בדקו את מילת השאלה ואת צורת הפועל שאחריה.',
      },
      {
        questionEn: 'Complete: "We usually ____ candles at five o\'clock."',
        correct: 'light',
        wrong: ['lights', 'are light'],
        explainHe: 'usually מראה הרגל (Present Simple), ועם we הפועל בלי s: light.',
        hintHe: 'usually מראה הרגל, והנושא הוא we. האם מוסיפים משהו לפועל?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: "It isn't raining now, but it is very cloudy.",
        wrong: ["It doesn't raining now, but it is very cloudy.", "It isn't rain now, but it is very cloudy."],
        explainHe: 'בשלילה של Present Progressive אומרים isn’t ופועל עם ing: isn’t raining.',
        hintHe: 'now אומר שזה קורה עכשיו. בשלילה של עכשיו צריך צורה של be ופועל עם ing.',
      },
      {
        questionEn: 'Complete: "What ____ your grandma cook for Rosh Hashana?"',
        correct: 'does',
        wrong: ['do', 'is'],
        explainHe: 'your grandma היא she, ולכן בשאלה ב-Present Simple אומרים does.',
        hintHe: 'your grandma היא she, והפועל cook בא אחר כך בצורה בסיסית.',
      },
    ],
    sentences: [
      { en: 'Every year we eat a round challah on Rosh Hashana.', he: 'בכל שנה אנחנו אוכלים חלה עגולה בראש השנה.' },
      { en: 'My relatives always bring sweet cakes.', he: 'קרובי המשפחה שלי תמיד מביאים עוגות מתוקות.' },
      { en: 'Right now Dad is putting branches on the roof.', he: 'ממש עכשיו אבא שם ענפים על הגג.' },
      { en: 'Is your sister making a paper chain?', he: 'אחותך מכינה שרשרת נייר?' },
      { en: 'Grandpa is lighting the candles in the window.', he: 'סבא מדליק את הנרות בחלון.' },
      { en: 'Do you eat doughnuts every Hanukkah?', he: 'אתם אוכלים סופגניות בכל חנוכה?' },
    ],
    passages: [
      {
        passageEn:
          'It is the evening before Sukkot. The Cohen family is very busy. Dad is building the walls of the sukkah. The twins are making paper chains in the living room. Every year they hang the chains on the roof.',
        passageHe:
          'זה הערב שלפני סוכות. משפחת כהן עסוקה מאוד. אבא בונה את הקירות של הסוכה. התאומים מכינים שרשראות נייר בסלון. בכל שנה הם תולים את השרשראות על הגג.',
        questions: [
          {
            questionEn: 'What is Dad building?',
            questionHe: 'מה אבא בונה?',
            correct: 'The walls of the sukkah.',
            wrong: ['A new table.', 'A big tent.'],
          },
          {
            questionEn: 'Where are the twins making paper chains?',
            questionHe: 'איפה התאומים מכינים שרשראות נייר?',
            correct: 'In the living room.',
            wrong: ['In the garden.', 'In the kitchen.'],
          },
          {
            questionEn: 'Where do they hang the chains every year?',
            questionHe: 'איפה הם תולים את השרשראות בכל שנה?',
            correct: 'On the roof.',
            wrong: ['On the door.', 'On a tree.'],
          },
        ],
      },
      {
        passageEn:
          'It is a cold and cloudy evening in December. Tom is wearing his raincoat and boots. He is walking to his grandparents’ house. Every Hanukkah his grandma makes potato latkes. Tom always lights the first candle.',
        passageHe:
          'זה ערב קר ומעונן בדצמבר. תום לובש את מעיל הגשם והמגפיים שלו. הוא הולך לבית של סבא וסבתא שלו. בכל חנוכה סבתא שלו מכינה לביבות תפוחי אדמה. תום תמיד מדליק את הנר הראשון.',
        questions: [
          {
            questionEn: 'What is Tom wearing?',
            questionHe: 'מה תום לובש?',
            correct: 'His raincoat and boots.',
            wrong: ['A warm hat.', 'A costume.'],
          },
          {
            questionEn: 'Where is Tom walking?',
            questionHe: 'לאן תום הולך?',
            correct: 'To his grandparents’ house.',
            wrong: ['To school.', 'To the park.'],
          },
          {
            questionEn: 'What does Grandma make every Hanukkah?',
            questionHe: 'מה סבתא מכינה בכל חנוכה?',
            correct: 'Potato latkes.',
            wrong: ['Doughnuts.', 'Honey cake.'],
          },
        ],
      },
    ],
  },

  // Spring & summer: Tu BiShvat, Purim, Passover, Independence Day, Shavuot, vacation
  32: {
    vocabulary: [
      {
        clozeEn: 'Dates and figs are ____ that we eat on Tu BiShvat.',
        clozeHe: 'תמרים ותאנים הם פירות יבשים שאנחנו אוכלים בט״ו בשבט.',
        answer: 'dried fruit',
        wrong: ['barbecue', 'flag'],
      },
      {
        clozeEn: 'On Purim we send a ____ of sweets to our friends.',
        clozeHe: 'בפורים אנחנו שולחים מתנה של ממתקים לחברים שלנו.',
        answer: 'gift',
        wrong: ['spring', 'seder'],
      },
      {
        clozeEn: 'On Passover we eat ____ instead of bread.',
        clozeHe: 'בפסח אנחנו אוכלים מצה במקום לחם.',
        answer: 'matzah',
        wrong: ['mask', 'summer'],
      },
      {
        clozeEn: 'At the ____ the youngest child asks four questions.',
        clozeHe: 'בליל הסדר הילד הצעיר ביותר שואל ארבע קושיות.',
        answer: 'seder',
        wrong: ['vacation', 'gift'],
      },
      {
        clozeEn: 'The smell of meat on the ____ fills the park.',
        clozeHe: 'הריח של הבשר על המנגל ממלא את הפארק.',
        answer: 'barbecue',
        wrong: ['matzah', 'plant'],
      },
      {
        clozeEn: 'In July and August we are on our summer ____.',
        clozeHe: 'ביולי ובאוגוסט אנחנו בחופש הגדול.',
        answer: 'vacation',
        wrong: ['seder', 'mask'],
      },
    ],
    grammar: [
      {
        questionEn: 'Complete: "____ you eat dates on Tu BiShvat?"',
        correct: 'Do',
        wrong: ['Does', 'Are'],
        explainHe: 'עם you שואלים ב-Present Simple עם Do.',
        hintHe: 'הנושא הוא you, והפועל eat בא בצורה בסיסית. איזו מילת שאלה מתאימה ל-you?',
      },
      {
        questionEn: 'Complete: "Does Noam ____ a costume every Purim?"',
        correct: 'wear',
        wrong: ['wears', 'wearing'],
        explainHe: 'אחרי Does הפועל בא בצורה בסיסית, בלי s ובלי ing.',
        hintHe: 'ה-s כבר נמצאת במילת השאלה. באיזו צורה בא הפועל אחריה?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'This week Mom is cleaning the kitchen for Passover.',
        wrong: ['This week Mom are cleaning the kitchen for Passover.', 'This week Mom cleaning the kitchen for Passover.'],
        explainHe: 'This week זה עכשיו, ולכן is cleaning. Mom היא she, ולכן is.',
        hintHe: 'This week מתאר מה שקורה בזמן הזה. Mom היא she: בדקו איזו צורה של be חסרה או לא נכונה.',
      },
      {
        questionEn: 'Complete: "My sister ____ plant flowers every spring."',
        correct: "doesn't",
        wrong: ["don't", "isn't"],
        explainHe: 'my sister היא she, ובשלילה ב-Present Simple אומרים doesn’t + פועל בסיסי.',
        hintHe: 'my sister היא she, והפועל plant בא בצורה בסיסית. איזו מילת שלילה מתאימה ל-she?',
      },
      {
        questionEn: 'Which question is correct?',
        correct: 'What are you doing on Independence Day?',
        wrong: ['What you are doing on Independence Day?', 'What are you do on Independence Day?'],
        explainHe: 'בשאלה are בא לפני you, והפועל עם ing: What are you doing?',
        hintHe: 'בשאלה הפועל העזר בא לפני הנושא, והפועל הראשי צריך את הסיומת של Present Progressive.',
      },
      {
        questionEn: 'Complete: "On Shavuot many children ____ white clothes."',
        correct: 'wear',
        wrong: ['wears', 'is wearing'],
        explainHe: 'זה מנהג קבוע (Present Simple), ו-many children הם רבים, ולכן wear בלי s.',
        hintHe: 'זה מנהג של כל שנה, והנושא ברבים. האם מוסיפים משהו לפועל?',
      },
    ],
    sentences: [
      { en: 'Every Tu BiShvat our class plants a small tree.', he: 'בכל ט״ו בשבט הכיתה שלנו נוטעת עץ קטן.' },
      { en: 'Does your brother like his Purim mask?', he: 'אחיך אוהב את המסכה שלו לפורים?' },
      { en: 'Right now we are washing the windows for Passover.', he: 'ממש עכשיו אנחנו שוטפים את החלונות לפסח.' },
      { en: 'Grandpa reads the story at the seder every year.', he: 'סבא קורא את הסיפור בליל הסדר בכל שנה.' },
      { en: 'The kids are waving small flags in the street.', he: 'הילדים מנופפים בדגלים קטנים ברחוב.' },
      { en: 'Where do you usually go in the summer?', he: 'לאן אתם בדרך כלל נוסעים בקיץ?' },
    ],
    passages: [
      {
        passageEn:
          'Every Purim, Shir and her mom make gift baskets. They put cookies, candy and an orange in each basket. This year Shir is wearing a bee costume. Right now she is bringing a basket to her neighbor. Her neighbor always gives her chocolate.',
        passageHe:
          'בכל פורים שיר ואמא שלה מכינות סלי מתנה. הן שמות עוגיות, ממתקים ותפוז בכל סל. השנה שיר מחופשת לדבורה. ממש עכשיו היא מביאה סל לשכנה שלה. השכנה תמיד נותנת לה שוקולד.',
        questions: [
          {
            questionEn: 'What do Shir and her mom make every Purim?',
            questionHe: 'מה שיר ואמא שלה מכינות בכל פורים?',
            correct: 'Gift baskets.',
            wrong: ['Paper masks.', 'Honey cakes.'],
          },
          {
            questionEn: 'What costume is Shir wearing this year?',
            questionHe: 'לאיזו תחפושת שיר מחופשת השנה?',
            correct: 'A bee costume.',
            wrong: ['A queen costume.', 'A cat costume.'],
          },
          {
            questionEn: 'What does the neighbor always give her?',
            questionHe: 'מה השכנה תמיד נותנת לה?',
            correct: 'Chocolate.',
            wrong: ['An orange.', 'Cookies.'],
          },
        ],
      },
      {
        passageEn:
          'Today is the first day of the summer vacation. Eyal is sitting on the beach with his friends. They are building a big sand castle. Every summer Eyal goes to a sports camp in July. In August his family usually travels to the north.',
        passageHe:
          'היום הוא היום הראשון של החופש הגדול. אייל יושב בחוף עם החברים שלו. הם בונים ארמון חול גדול. בכל קיץ אייל הולך למחנה ספורט ביולי. באוגוסט המשפחה שלו בדרך כלל נוסעת לצפון.',
        questions: [
          {
            questionEn: 'Where is Eyal sitting?',
            questionHe: 'איפה אייל יושב?',
            correct: 'On the beach.',
            wrong: ['In the park.', 'At home.'],
          },
          {
            questionEn: 'What are Eyal and his friends building?',
            questionHe: 'מה אייל והחברים שלו בונים?',
            correct: 'A big sand castle.',
            wrong: ['A small boat.', 'A tent.'],
          },
          {
            questionEn: 'Where does his family usually travel in August?',
            questionHe: 'לאן המשפחה שלו בדרך כלל נוסעת באוגוסט?',
            correct: 'To the north.',
            wrong: ['To Eilat.', 'To a sports camp.'],
          },
        ],
      },
    ],
  },
};
