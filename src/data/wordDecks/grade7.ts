import type { GradeDecks } from './types';

/**
 * Grade 7's Ministry word decks (docs/content-packs-roadmap.md §3). Each deck is written with the
 * core pack it ships with and stays hidden until that pack is released.
 */
export const GRADE_7_DECKS: GradeDecks = [
  {
    id: 'g7-season2-1-environment',
    packId: 'season2-1',
    topicEn: 'Environment',
    topicHe: 'הסביבה',
    items: [
      { wordEn: 'environment', translationHe: 'סביבה', partOfSpeech: 'n', exampleEn: 'We must protect the environment.', exampleHe: 'אנחנו חייבים לשמור על הסביבה.', ministryList: 'band-2-core-1', recProd: 'prod' },
      { wordEn: 'destroy', translationHe: 'להרוס', partOfSpeech: 'v', exampleEn: 'Fires can destroy a whole forest.', exampleHe: 'שריפות יכולות להרוס יער שלם.', ministryList: 'band-2-core-1', recProd: 'prod' },
      { wordEn: 'danger', translationHe: 'סכנה', partOfSpeech: 'n', exampleEn: 'Many animals are in danger.', exampleHe: 'בעלי חיים רבים נמצאים בסכנה.', ministryList: 'band-2-core-1', recProd: 'prod' },
      { wordEn: 'wild', translationHe: 'פראי', partOfSpeech: 'adj', exampleEn: 'Wild animals need a safe home.', exampleHe: 'חיות בר צריכות בית בטוח.', ministryList: 'band-2-core-1', recProd: 'rec' },
      { wordEn: 'stone', translationHe: 'אבן', partOfSpeech: 'n', exampleEn: 'The old wall is made of stone.', exampleHe: 'החומה העתיקה עשויה מאבן.', ministryList: 'band-2-core-1', recProd: 'prod' },
      { wordEn: 'industry', translationHe: 'תעשייה', partOfSpeech: 'n', exampleEn: 'Industry uses a lot of water and energy.', exampleHe: 'התעשייה משתמשת בהרבה מים ואנרגיה.', ministryList: 'band-2-core-1', recProd: 'rec' },
      { wordEn: 'increase', translationHe: 'לעלות; לגדול', partOfSpeech: 'v', exampleEn: 'The number of cars on the roads increases every year.', exampleHe: 'מספר המכוניות על הכבישים עולה כל שנה.', ministryList: 'band-2-core-1', recProd: 'rec' },
      { wordEn: 'affect', translationHe: 'להשפיע על', partOfSpeech: 'v', exampleEn: 'Dirty air affects our health.', exampleHe: 'אוויר מזוהם משפיע על הבריאות שלנו.', ministryList: 'band-2-core-1', recProd: 'prod' },
      { wordEn: 'lack of', translationHe: 'מחסור ב־', partOfSpeech: 'phrase', exampleEn: 'Lack of rain is a big problem for farmers.', exampleHe: 'מחסור בגשם הוא בעיה גדולה לחקלאים.', ministryList: 'band-2-core-1', recProd: 'prod' },
      { wordEn: 'petrol', translationHe: 'דלק; בנזין', partOfSpeech: 'n', exampleEn: 'Electric cars do not need petrol.', exampleHe: 'מכוניות חשמליות לא צריכות דלק.', ministryList: 'band-2-core-1', recProd: 'prod' },
      { wordEn: 'pure', translationHe: 'טהור; נקי', partOfSpeech: 'adj', exampleEn: 'The water in the spring is pure.', exampleHe: 'המים במעיין נקיים.', ministryList: 'band-2-core-1', recProd: 'prod' },
      { wordEn: 'garbage', translationHe: 'זבל; אשפה', partOfSpeech: 'n', exampleEn: 'Please put the garbage in the bin.', exampleHe: 'בבקשה לזרוק את הזבל לפח.', ministryList: 'band-2-core-1', recProd: 'rec' },
      { wordEn: 'gas', translationHe: 'גז', partOfSpeech: 'n', exampleEn: 'Cars send gas into the air.', exampleHe: 'מכוניות פולטות גז לאוויר.', ministryList: 'band-2-core-1', recProd: 'rec' },
      { wordEn: 'Earth', translationHe: 'כדור הארץ', partOfSpeech: 'n', exampleEn: 'The Earth is our home.', exampleHe: 'כדור הארץ הוא הבית שלנו.', ministryList: 'band-2-core-1', recProd: 'prod' },
      { wordEn: 'energy', translationHe: 'אנרגיה', partOfSpeech: 'n', exampleEn: 'We get energy from the sun.', exampleHe: 'אנחנו מקבלים אנרגיה מהשמש.', ministryList: 'band-2-core-1', recProd: 'prod' },
      { wordEn: 'natural', translationHe: 'טבעי', partOfSpeech: 'adj', exampleEn: 'Honey is a natural food.', exampleHe: 'דבש הוא מזון טבעי.', ministryList: 'band-2-core-1', recProd: 'prod' },
      { wordEn: 'reduce', translationHe: 'להפחית; לצמצם', partOfSpeech: 'v', exampleEn: 'We can reduce the plastic we use.', exampleHe: 'אנחנו יכולים לצמצם את הפלסטיק שאנחנו משתמשים בו.', ministryList: 'band-2-core-1', recProd: 'rec' },
      { wordEn: 'factory', translationHe: 'מפעל', partOfSpeech: 'n', exampleEn: 'The factory is near the river.', exampleHe: 'המפעל נמצא ליד הנהר.', ministryList: 'band-2-core-1', recProd: 'rec' },
      { wordEn: 'traffic', translationHe: 'תנועה; פקקים', partOfSpeech: 'n', exampleEn: 'There is a lot of traffic in the city in the morning.', exampleHe: 'בבוקר יש הרבה תנועה בעיר.', ministryList: 'band-2-core-1', recProd: 'prod' },
      { wordEn: 'resource', translationHe: 'משאב', partOfSpeech: 'n', exampleEn: 'Water is an important resource.', exampleHe: 'מים הם משאב חשוב.', ministryList: 'band-2-core-1', recProd: 'rec' },
    ],
  },
  {
    id: 'g7-season2-2-fitness',
    packId: 'season2-2',
    topicEn: 'Fitness',
    topicHe: 'כושר',
    items: [
      { wordEn: 'exercise', translationHe: 'פעילות גופנית; תרגיל', partOfSpeech: 'n', exampleEn: 'Exercise is good for your heart.', exampleHe: 'פעילות גופנית טובה ללב.', ministryList: 'band-2-core-1', recProd: 'prod' },
      { wordEn: 'health', translationHe: 'בריאות', partOfSpeech: 'n', exampleEn: 'Sleep is important for your health.', exampleHe: 'שינה חשובה לבריאות.', ministryList: 'band-2-core-1', recProd: 'rec' },
      { wordEn: 'strength', translationHe: 'כוח', partOfSpeech: 'n', exampleEn: 'Swimming builds strength.', exampleHe: 'שחייה בונה כוח.', ministryList: 'band-2-core-1', recProd: 'prod' },
      { wordEn: 'pain', translationHe: 'כאב', partOfSpeech: 'n', exampleEn: 'After the game I had a pain in my leg.', exampleHe: 'אחרי המשחק היה לי כאב ברגל.', ministryList: 'band-2-core-1', recProd: 'prod' },
      { wordEn: 'blood', translationHe: 'דם', partOfSpeech: 'n', exampleEn: 'The heart sends blood around the body.', exampleHe: 'הלב מזרים דם בכל הגוף.', ministryList: 'band-2-core-1', recProd: 'rec' },
      { wordEn: 'brain', translationHe: 'מוח', partOfSpeech: 'n', exampleEn: 'Sport is good for the brain too.', exampleHe: 'ספורט טוב גם למוח.', ministryList: 'band-2-core-1', recProd: 'rec' },
      { wordEn: 'weight', translationHe: 'משקל', partOfSpeech: 'n', exampleEn: 'He checks his weight every week.', exampleHe: 'הוא בודק את המשקל שלו כל שבוע.', ministryList: 'band-2-core-1', recProd: 'prod' },
      { wordEn: 'skate', translationHe: 'להחליק (בגלגיליות)', partOfSpeech: 'v', exampleEn: 'We skate in the park on Fridays.', exampleHe: 'אנחנו מחליקים בגלגיליות בפארק בימי שישי.', ministryList: 'band-2-core-1', recProd: 'prod' },
      { wordEn: 'muscle', translationHe: 'שריר', partOfSpeech: 'n', exampleEn: 'Running makes your leg muscles strong.', exampleHe: 'ריצה מחזקת את שרירי הרגליים.', ministryList: 'band-2-core-1', recProd: 'rec' },
      { wordEn: 'stomach', translationHe: 'בטן; קיבה', partOfSpeech: 'n', exampleEn: 'Do not run on a full stomach.', exampleHe: 'לא רצים עם בטן מלאה.', ministryList: 'band-2-core-1', recProd: 'rec' },
      { wordEn: 'slim', translationHe: 'רזה; דק', partOfSpeech: 'adj', exampleEn: 'The dancer is tall and slim.', exampleHe: 'הרקדנית גבוהה ורזה.', ministryList: 'band-2-core-1', recProd: 'rec' },
      { wordEn: 'baseball', translationHe: 'בייסבול', partOfSpeech: 'n', exampleEn: 'Baseball is very popular in America.', exampleHe: 'בייסבול פופולרי מאוד באמריקה.', ministryList: 'band-2-core-1', recProd: 'rec' },
      { wordEn: 'gym', translationHe: 'חדר כושר', partOfSpeech: 'n', exampleEn: 'My brother goes to the gym after school.', exampleHe: 'אחי הולך לחדר הכושר אחרי בית הספר.', ministryList: 'band-2-core-1', recProd: 'rec' },
      { wordEn: 'physical', translationHe: 'גופני', partOfSpeech: 'adj', exampleEn: 'Physical activity makes you feel good.', exampleHe: 'פעילות גופנית גורמת להרגשה טובה.', ministryList: 'band-2-core-1', recProd: 'rec' },
      { wordEn: 'coach', translationHe: 'מאמן', partOfSpeech: 'n', exampleEn: 'Our coach tells us to drink water.', exampleHe: 'המאמן שלנו אומר לנו לשתות מים.', ministryList: 'band-2-core-1', recProd: 'rec' },
      { wordEn: 'race', translationHe: 'מרוץ', partOfSpeech: 'n', exampleEn: 'She won the race.', exampleHe: 'היא ניצחה במרוץ.', ministryList: 'band-2-core-1', recProd: 'prod' },
      { wordEn: 'score', translationHe: 'להבקיע; לצבור נקודות', partOfSpeech: 'v', exampleEn: 'He scored two goals in the game.', exampleHe: 'הוא הבקיע שני שערים במשחק.', ministryList: 'band-2-core-1', recProd: 'rec' },
      { wordEn: 'lift', translationHe: 'להרים', partOfSpeech: 'v', exampleEn: 'Lift the ball with both hands.', exampleHe: 'מרימים את הכדור בשתי הידיים.', ministryList: 'band-2-core-1', recProd: 'prod' },
      { wordEn: 'hurt', translationHe: 'לכאוב; לפגוע', partOfSpeech: 'v', exampleEn: 'My back hurts after the game.', exampleHe: 'הגב כואב לי אחרי המשחק.', ministryList: 'band-2-core-1', recProd: 'rec' },
      { wordEn: 'headache', translationHe: 'כאב ראש', partOfSpeech: 'n', exampleEn: 'Drink water when you have a headache.', exampleHe: 'כדאי לשתות מים כשכואב הראש.', ministryList: 'band-2-core-1', recProd: 'rec' },
    ],
  },
];
