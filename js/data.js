/*
 * data.js
 * All lesson content lives here. To add or fix a word, just edit this file.
 *
 * W(text, zh, emoji, swatch)
 *   text   : the English word or phrase (this is what gets spoken and written)
 *   zh     : small Chinese hint shown on the card (optional)
 *   emoji  : picture shown on the card (optional)
 *   swatch : a CSS color, used instead of an emoji for the colors lesson (optional)
 */
(function (root) {
  'use strict';

  const W = (text, zh, emoji, swatch) => ({
    text,
    zh: zh || '',
    emoji: emoji || '',
    swatch: swatch || '',
  });

  // Hand-drawn pictures for words that have no good emoji. Any W() "emoji" value that
  // starts with <svg is drawn as artwork instead of text.
  const S = (inner) => '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' + inner + '</svg>';
  const ART = {
    skirt: S('<path d="M20 14h24l11 37H9z" fill="#ec407a"/><rect x="19" y="9" width="26" height="8" rx="2" fill="#c2185b"/><path d="M26 18l-6 33M32 18v33M38 18l6 33" stroke="#f48fb1" stroke-width="2.5" fill="none"/>'),
    eraser: S('<g transform="rotate(-28 32 32)"><rect x="8" y="21" width="48" height="22" rx="5" fill="#4d8dff"/><rect x="8" y="21" width="20" height="22" rx="5" fill="#ff6b9a"/><rect x="26" y="21" width="3" height="22" fill="#fff" opacity=".7"/></g>'),
    desk: S('<rect x="6" y="18" width="52" height="8" rx="2" fill="#c9893b"/><rect x="10" y="26" width="6" height="28" fill="#8d5a2b"/><rect x="48" y="26" width="6" height="28" fill="#8d5a2b"/><rect x="20" y="26" width="22" height="14" rx="2" fill="#a8702f"/><circle cx="31" cy="33" r="2" fill="#ffe0a3"/>'),
    marker: S('<g transform="rotate(35 32 32)"><rect x="24" y="8" width="16" height="34" rx="4" fill="#e53935"/><rect x="24" y="8" width="16" height="10" rx="4" fill="#b71c1c"/><path d="M26 42h12l-3 12h-6z" fill="#37474f"/><circle cx="32" cy="57" r="2.5" fill="#e53935"/></g>'),
    ugly: S('<path d="M32 6c14 0 24 10 24 24 0 16-11 28-24 28S8 46 8 30C8 16 18 6 32 6z" fill="#9ccc65"/><circle cx="23" cy="26" r="7" fill="#fff"/><circle cx="41" cy="28" r="4" fill="#fff"/><circle cx="24" cy="27" r="3" fill="#263238"/><circle cx="41" cy="28" r="2" fill="#263238"/><path d="M17 44l6-5 5 6 5-6 5 6 6-5 3 3" stroke="#263238" stroke-width="3" fill="none" stroke-linejoin="round"/><path d="M14 14l8 5M50 12l-8 6" stroke="#558b2f" stroke-width="3" stroke-linecap="round"/>'),
    fat: S('<ellipse cx="32" cy="42" rx="26" ry="18" fill="#ff9a3d"/><circle cx="32" cy="22" r="14" fill="#ff9a3d"/><path d="M20 12l3 10-10-3zM44 12l-3 10 10-3z" fill="#ff9a3d"/><circle cx="27" cy="21" r="2" fill="#263238"/><circle cx="37" cy="21" r="2" fill="#263238"/><path d="M30 26h4l-2 2z" fill="#ff6b9a"/><path d="M14 40q4-4 8 0M42 40q4-4 8 0" stroke="#e8590c" stroke-width="3" fill="none"/>'),
    thin: S('<ellipse cx="32" cy="40" rx="8" ry="20" fill="#9fa8c9"/><circle cx="32" cy="16" r="10" fill="#9fa8c9"/><path d="M24 8l2 8-8-2zM40 8l-2 8 8-2z" fill="#9fa8c9"/><circle cx="28" cy="15" r="1.8" fill="#263238"/><circle cx="36" cy="15" r="1.8" fill="#263238"/><path d="M40 52q14 2 12-14" stroke="#9fa8c9" stroke-width="4" fill="none" stroke-linecap="round"/>'),
    straw: S('<path d="M18 22h28l-3 34H21z" fill="#bfe6f5"/><path d="M20 34h24l-1 22H21z" fill="#8fd0ee"/><path d="M34 30V8l12-4" stroke="#e53935" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M34 16l4-1.5M34 24l4-1.5" stroke="#fff" stroke-width="3"/>'),
    bottle: S('<rect x="26" y="4" width="12" height="7" rx="2" fill="#3f51b5"/><path d="M27 11h10v8l6 8v28q0 4-4 4H25q-4 0-4-4V27l6-8z" fill="#cfeaf7"/><rect x="21" y="32" width="22" height="14" fill="#4d8dff"/>'),
    knife: S('<g transform="rotate(-35 32 32)"><path d="M6 28h30l8 4-8 4H6z" fill="#b0bec5"/><rect x="36" y="27" width="22" height="10" rx="5" fill="#ffd54f"/></g>'),
  };

  const LESSONS = [
    {
      id: 1,
      title: 'Greetings',
      icon: '👋',
      words: [
        W('fine', '好', '🙂'),
        W('great', '很棒', '🙌'),
        W('name', '名字', '📛'),
        W('thank you', '謝謝', '🎁'),
        W('see you later', '待會見', '🫡'),
        W('goodbye', '再見', '👋'),
        W('nice to meet you', '很高興認識你', '🤝'),
        W('good morning', '早安', '🌅'),
        W('good afternoon', '午安', '☀️'),
        W('good evening', '晚上好', '🌇'),
      ],
    },
    {
      id: 2,
      title: 'Classroom Actions',
      icon: '🏫',
      words: [
        W('sit down', '坐下', '🪑'),
        W('stand up', '站起來', '🧍'),
        W('make a circle', '圍成一圈', '⭕'),
        W('be quiet', '安靜', '🤫'),
        W('pencil', '鉛筆', '✏️'),
        W('book', '書', '📖'),
        W('open', '打開', '📂'),
        W('close', '關上', '🚪'),
        W('put away', '收起來', '🧺'),
        W('take out', '拿出來', '📤'),
      ],
    },
    {
      id: 3,
      title: 'Family and Friends',
      icon: '👨‍👩‍👧',
      words: [
        W('boy', '男孩', '👦'),
        W('girl', '女孩', '👧'),
        W('man', '男人', '👨'),
        W('woman', '女人', '👩'),
        W('baby', '嬰兒', '👶'),
        W('mom', '媽媽', '👩'),
        W('mother', '母親', '👩'),
        W('dad', '爸爸', '👨'),
        W('father', '父親', '👨'),
        W('friend', '朋友', '🧑‍🤝‍🧑'),
        W('brother', '兄弟', '👦'),
        W('sister', '姊妹', '👧'),
      ],
    },
    {
      id: 4,
      title: 'Toys and Transport',
      icon: '🚂',
      words: [
        W('ball', '球', '⚽'),
        W('doll', '娃娃', '🪆'),
        W('train', '火車', '🚂'),
        W('car', '汽車', '🚗'),
        W('truck', '卡車', '🚚'),
        W('bus', '公車', '🚌'),
        W('airplane', '飛機', '✈️'),
        W('boat', '船', '⛵'),
        W('kite', '風箏', '🪁'),
        W('box', '箱子', '📦'),
      ],
    },
    {
      id: 5,
      title: 'Animals',
      icon: '🐶',
      words: [
        W('cat', '貓', '🐱'),
        W('dog', '狗', '🐶'),
        W('bird', '鳥', '🐦'),
        W('fish', '魚', '🐟'),
        W('rabbit', '兔子', '🐰'),
        W('horse', '馬', '🐴'),
        W('cow', '乳牛', '🐮'),
        W('pig', '豬', '🐷'),
        W('chicken', '雞', '🐔'),
        W('duck', '鴨子', '🦆'),
      ],
    },
    {
      id: 6,
      title: 'Numbers',
      icon: '🔢',
      words: [
        W('zero', '0', '0'),
        W('one', '1', '1'),
        W('two', '2', '2'),
        W('three', '3', '3'),
        W('four', '4', '4'),
        W('five', '5', '5'),
        W('six', '6', '6'),
        W('seven', '7', '7'),
        W('eight', '8', '8'),
        W('nine', '9', '9'),
        W('ten', '10', '10'),
      ],
    },
    {
      id: 7,
      title: 'Weather',
      icon: '🌦️',
      words: [
        W('sunny', '晴天', '☀️'),
        W('cloudy', '多雲', '☁️'),
        W('windy', '有風', '💨'),
        W('rainy', '下雨', '🌧️'),
        W('snowy', '下雪', '❄️'),
        W('hot', '熱', '🥵'),
        W('warm', '溫暖', '😊'),
        W('cool', '涼爽', '😎'),
        W('chilly', '涼颼颼', '🧣'),
        W('cold', '冷', '🥶'),
      ],
    },
    {
      id: 8,
      title: 'Colors',
      icon: '🎨',
      words: [
        W('red', '紅色', '', '#e53935'),
        W('blue', '藍色', '', '#1e88e5'),
        W('green', '綠色', '', '#2e9e4f'),
        W('yellow', '黃色', '', '#fdd835'),
        W('orange', '橘色', '', '#fb8c00'),
        W('purple', '紫色', '', '#8e24aa'),
        W('pink', '粉紅色', '', '#ec407a'),
        W('brown', '咖啡色', '', '#8d5a2b'),
        W('white', '白色', '', '#ffffff'),
        W('black', '黑色', '', '#263238'),
      ],
    },
    {
      id: 9,
      title: 'Clothes',
      icon: '👕',
      words: [
        W('shirt', '襯衫', '👔'),
        W('pants', '長褲', '👖'),
        W('shorts', '短褲', '🩳'),
        W('skirt', '裙子', ART.skirt),
        W('T-shirt', 'T恤', '👕'),
        W('sweater', '毛衣', '🧶'),
        W('dress', '洋裝', '👗'),
        W('shoes', '鞋子', '👟'),
        W('socks', '襪子', '🧦'),
        W('hat', '帽子', '👒'),
      ],
    },
    {
      id: 10,
      title: 'School Things',
      icon: '🎒',
      words: [
        W('eraser', '橡皮擦', ART.eraser),
        W('pen', '原子筆', '🖊️'),
        W('ruler', '尺', '📏'),
        W('desk', '書桌', ART.desk),
        W('crayon', '蠟筆', '🖍️'),
        W('marker', '麥克筆', ART.marker),
        W('chair', '椅子', '🪑'),
        W('computer', '電腦', '💻'),
        W('notebook', '筆記本', '📓'),
        W('backpack', '書包', '🎒'),
      ],
    },
    {
      id: 11,
      title: 'Describing Words',
      icon: '🐘',
      words: [
        W('pretty', '漂亮', '🌸'),
        W('ugly', '醜', ART.ugly),
        W('big', '大', '🐘'),
        W('small', '小', '🐭'),
        W('fast', '快', '🐆'),
        W('slow', '慢', '🐌'),
        W('new', '新', '✨'),
        W('old', '舊', '🕰️'),
        W('fat', '胖', ART.fat),
        W('thin', '瘦', ART.thin),
      ],
    },
    {
      id: 12,
      title: 'Table Things',
      icon: '🍽️',
      words: [
        W('cup', '杯子', '🍵'),
        W('plate', '盤子', '🍽️'),
        W('bowl', '碗', '🥣'),
        W('fork', '叉子', '🍴'),
        W('spoon', '湯匙', '🥄'),
        W('straw', '吸管', ART.straw),
        W('bottle', '瓶子', ART.bottle),
        W('knife', '刀子', ART.knife),
        W('chopsticks', '筷子', '🥢'),
        W('bag', '袋子', '👜'),
      ],
      plurals: [
        W('cups', '杯子(複數)', '🍵'),
        W('plates', '盤子(複數)', '🍽️'),
        W('bowls', '碗(複數)', '🥣'),
        W('forks', '叉子(複數)', '🍴'),
        W('spoons', '湯匙(複數)', '🥄'),
        W('straws', '吸管(複數)', ART.straw),
        W('bottles', '瓶子(複數)', ART.bottle),
        W('knives', '刀子(複數)', ART.knife),
        W('bags', '袋子(複數)', '👜'),
      ],
    },
  ];

  // Sight words, grouped by the color blocks on the poster (left to right, top to bottom).
  const SIGHT_RAW = [
    ['#7fc65a', 'an are a at as and after all about by'],
    ['#f6a85c', 'be been but could can called do did down each'],
    ['#f08bb1', 'for find first from go get give he his him'],
    ['#f5d94e', 'her have has had how in if I into is'],
    ['#8c96e8', 'it its just know long like little may made my'],
    ['#b768c8', 'more make many most no not now one of on way'],
    ['#5fbcbc', 'or over other only out people quite rain right run water'],
    ['#c5e05a', 'she so said some see to the they time this words'],
    ['#74d3ee', 'than there two their that them these then use up where'],
    ['#f27f7f', 'very with what was we when were which you your yes'],
  ];

  const SIGHT_SETS = SIGHT_RAW.map((row, i) => ({
    id: i + 1,
    color: row[0],
    words: row[1].split(' ').map((t) => W(t)),
  }));

  // Attach the cropped textbook picture to every lesson word (sight words have none).
  // Pictures live in img/lessonN/<word>.png. Plurals and synonyms reuse a shared picture.
  const SHARE = {
    mother: 'mom', father: 'dad', cups: 'cup', plates: 'plate', bowls: 'bowl', forks: 'fork',
    spoons: 'spoon', straws: 'straw', bottles: 'bottle', knives: 'knife', bags: 'bag',
  };
  LESSONS.forEach((l) => {
    l.words.concat(l.plurals || []).forEach((w) => {
      const base = SHARE[w.text] || w.text;
      w.img = 'img/lesson' + l.id + '/' + base.toLowerCase().replace(/\s+/g, '-') + '.png';
    });
  });

  // How each letter is SPOKEN when a child taps "Spell". Voices read bare capitals badly
  // ("capital T") and respellings like "ay" as "aye", so these are real English words or
  // clear respellings that sound like the letter name. Fix a single letter here if needed.
  const SPELL = {
    a: 'eigh', b: 'bee', c: 'sea', d: 'dee', e: 'ee', f: 'eff', g: 'gee', h: 'aitch',
    i: 'eye', j: 'jay', k: 'kay', l: 'ell', m: 'em', n: 'en', o: 'oh', p: 'pea',
    q: 'queue', r: 'are', s: 'ess', t: 'tea', u: 'you', v: 'vee', w: 'double you',
    x: 'ex', y: 'why', z: 'zee',
  };

  const DATA = { LESSONS, SIGHT_SETS, SPELL };
  root.DATA = DATA;
  if (typeof module !== 'undefined' && module.exports) module.exports = DATA;
})(typeof window !== 'undefined' ? window : globalThis);
