const BASE_URL = 'https://hegel-backend.onrender.com';
// const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:1337';
const STRAPI_URL = `${BASE_URL}/api/products`;



// 👇👇👇 ВСТАВЬ СЮДА СВОЙ ТОКЕН ИЗ STRAPI (Settings -> API Tokens) 👇👇👇
const API_TOKEN = '93dee8752e3932e7d8ddd126edbfc1aecd84f3c68fee142497a1fe834cd352250a561366f734ae63a3ea6cdeb796251580059cd609c768db1e001c9b8d04d92ce50f1bbb7fc62decf4a5e97febb6f846751f3ad5e80e7cb6fe1955178b4b218bd9c8e3959afe27d2a1414bd0581e8f61fb5db6ff644079fb349e1b8222b7cc9a'; 

// === ФУНКЦИЯ ДЛЯ ПРЕВРАЩЕНИЯ РУССКИХ БУКВ В АНГЛИЙСКИЕ (SLUG) ===
function generateSlug(text) {
  const ru = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 
    'е': 'e', 'ё': 'e', 'ж': 'zh', 'з': 'z', 'и': 'i', 
    'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 
    'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 
    'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 
    'ш': 'sh', 'щ': 'shch', 'ы': 'y', 'э': 'e', 'ю': 'yu', 
    'я': 'ya', 'ъ': '', 'ь': '', ' ': '-'
  };

  return text
    .toLowerCase()
    .split('')
    .map(char => ru[char] || char) // Меняем русские буквы
    .join('')
    .replace(/[^a-z0-9-]/g, '-')   // Удаляем всё лишнее
    .replace(/-+/g, '-')           // Убираем двойные тире
    .replace(/^-|-$/g, '');        // Убираем тире по краям
}

// === ПОЛНАЯ БАЗА ТОВАРОВ ===
const products = [
    // --- СЕРИЯ 11 (Сплошные стены) ---
    { SKU: 'КУ1101', Name: 'Коробка установочная КУ1101 (Ø68x40мм) блочная', Series: 'Серия 11', Type: 'Коробка установочная', IP_Rating: 'IP20', Mounting_Type: 'Скрытый' },
    { SKU: 'КУ1102', Name: 'Коробка установочная КУ1102 (Ø68x60мм) углубленная', Series: 'Серия 11', Type: 'Коробка установочная', IP_Rating: 'IP20', Mounting_Type: 'Скрытый' },
    { SKU: 'КУ1103', Name: 'Коробка установочная КУ1103 (Ø64x40мм)', Series: 'Серия 11', Type: 'Коробка установочная', IP_Rating: 'IP20', Mounting_Type: 'Скрытый' },
    { SKU: 'КУ1104', Name: 'Коробка установочная КУ1104 (Ø64x60мм) углубленная', Series: 'Серия 11', Type: 'Коробка установочная', IP_Rating: 'IP20', Mounting_Type: 'Скрытый' },
    { SKU: 'КУ1105', Name: 'Коробка установочная КУ1105 (Ø64x40мм) круглая', Series: 'Серия 11', Type: 'Коробка установочная', IP_Rating: 'IP20', Mounting_Type: 'Скрытый' },
    { SKU: 'КУ1106', Name: 'Коробка установочная КУ1106 (Ø68x40мм) круглая', Series: 'Серия 11', Type: 'Коробка установочная', IP_Rating: 'IP20', Mounting_Type: 'Скрытый' },
    { SKU: 'КР1101', Name: 'Коробка распределительная КР1101 (90x90x50мм)', Series: 'Серия 11', Type: 'Коробка разветвительная', IP_Rating: 'IP20', Mounting_Type: 'Скрытый' },
    { SKU: 'КР1102', Name: 'Коробка распределительная КР1102 (112x92x60мм)', Series: 'Серия 11', Type: 'Коробка разветвительная', IP_Rating: 'IP20', Mounting_Type: 'Скрытый' },
    { SKU: 'КР1103', Name: 'Коробка распределительная КР1103 (150x120x70мм)', Series: 'Серия 11', Type: 'Коробка разветвительная', IP_Rating: 'IP20', Mounting_Type: 'Скрытый' },
    { SKU: 'КР1104', Name: 'Коробка распределительная КР1104 (190x150x70мм)', Series: 'Серия 11', Type: 'Коробка разветвительная', IP_Rating: 'IP20', Mounting_Type: 'Скрытый' },
    { SKU: 'У-191', Name: 'Коробка распаячная У-191 (Ø93x13мм) плоская', Series: 'Серия 11', Type: 'Коробка разветвительная', IP_Rating: 'IP20', Mounting_Type: 'Скрытый' },
  
    // --- СЕРИЯ 12 (Полые стены / Гипсокартон) ---
    { SKU: 'КУ1201', Name: 'Коробка установочная КУ1201 (ГКЛ, лапки пластик)', Series: 'Серия 12', Type: 'Коробка установочная', IP_Rating: 'IP30', Mounting_Type: 'Полые стены' },
    { SKU: 'КУ1202', Name: 'Коробка установочная КУ1202 (ГКЛ, лапки металл)', Series: 'Серия 12', Type: 'Коробка установочная', IP_Rating: 'IP30', Mounting_Type: 'Полые стены' },
    { SKU: 'КУ1203', Name: 'Коробка установочная КУ1203 (ГКЛ, малая глубина)', Series: 'Серия 12', Type: 'Коробка установочная', IP_Rating: 'IP30', Mounting_Type: 'Полые стены' },
    { SKU: 'КУ1205', Name: 'Коробка установочная КУ1205 (ГКЛ, углубленная)', Series: 'Серия 12', Type: 'Коробка установочная', IP_Rating: 'IP30', Mounting_Type: 'Полые стены' },
    { SKU: 'КР1201', Name: 'Коробка распределительная КР1201 (106x106x45мм)', Series: 'Серия 12', Type: 'Коробка разветвительная', IP_Rating: 'IP30', Mounting_Type: 'Полые стены' },
    { SKU: 'КР1202', Name: 'Коробка распределительная КР1202 (Ø80мм)', Series: 'Серия 12', Type: 'Коробка разветвительная', IP_Rating: 'IP30', Mounting_Type: 'Полые стены' },
    { SKU: 'КР1203', Name: 'Коробка распределительная КР1203 (120x100x50мм)', Series: 'Серия 12', Type: 'Коробка разветвительная', IP_Rating: 'IP30', Mounting_Type: 'Полые стены' },
  
    // --- СЕРИЯ 13 (Монолит) ---
    { SKU: 'КУ1301', Name: 'Коробка установочная КУ1301 (для заливки в бетон)', Series: 'Серия 13', Type: 'Коробка установочная', IP_Rating: 'IP44', Mounting_Type: 'Монолит', Color: 'Черный' },
    { SKU: 'КР1301', Name: 'Коробка распределительная КР1301 (монолит)', Series: 'Серия 13', Type: 'Коробка разветвительная', IP_Rating: 'IP44', Mounting_Type: 'Монолит', Color: 'Черный' },
    { SKU: 'КП5301', Name: 'Кольцо переходное КП5301 (для КУ1301)', Series: 'Серия 13', Type: 'Аксессуар', IP_Rating: 'IP20', Mounting_Type: 'Монолит' },
  
    // --- СЕРИЯ 24 (Открытая установка, IP66, Улица) ---
    { SKU: 'КР2401', Name: 'Коробка КР2401 (81x38x30) герметичная', Series: 'Серия 24', Type: 'Коробка разветвительная', IP_Rating: 'IP66', Mounting_Type: 'Открытый' },
    { SKU: 'КР2402', Name: 'Коробка КР2402 (103x103x32) герметичная', Series: 'Серия 24', Type: 'Коробка разветвительная', IP_Rating: 'IP66', Mounting_Type: 'Открытый' },
    { SKU: 'КР2403', Name: 'Коробка КР2403 (85x85x40) IP66', Series: 'Серия 24', Type: 'Коробка разветвительная', IP_Rating: 'IP66', Mounting_Type: 'Открытый' },
    { SKU: 'КР2404', Name: 'Коробка КР2404 (100x100x50) IP66', Series: 'Серия 24', Type: 'Коробка разветвительная', IP_Rating: 'IP66', Mounting_Type: 'Открытый' },
    { SKU: 'КР2403-08', Name: 'Коробка КР2403-08 (Черная) IP66', Series: 'Серия 24', Type: 'Коробка разветвительная', IP_Rating: 'IP66', Mounting_Type: 'Открытый', Color: 'Черный' },
  
    // --- СЕРИЯ 26 (Открытая установка, IP55, Пром) ---
    { SKU: 'КР2601', Name: 'Коробка КР2601 (Ø65) с гермовводами', Series: 'Серия 26', Type: 'Коробка разветвительная', IP_Rating: 'IP55', Mounting_Type: 'Открытый' },
    { SKU: 'КР2602', Name: 'Коробка КР2602 (Ø85) с гермовводами', Series: 'Серия 26', Type: 'Коробка разветвительная', IP_Rating: 'IP55', Mounting_Type: 'Открытый' },
    { SKU: 'КР2603', Name: 'Коробка КР2603 (85x85) с гермовводами', Series: 'Серия 26', Type: 'Коробка разветвительная', IP_Rating: 'IP55', Mounting_Type: 'Открытый' },
    { SKU: 'КР2604', Name: 'Коробка КР2604 (100x100) с гермовводами', Series: 'Серия 26', Type: 'Коробка разветвительная', IP_Rating: 'IP55', Mounting_Type: 'Открытый' },
    { SKU: 'КР2605', Name: 'Коробка КР2605 (70x70) с гермовводами', Series: 'Серия 26', Type: 'Коробка разветвительная', IP_Rating: 'IP55', Mounting_Type: 'Открытый' },
    { SKU: 'КР2606', Name: 'Коробка КР2606 (150x110) с гермовводами', Series: 'Серия 26', Type: 'Коробка разветвительная', IP_Rating: 'IP55', Mounting_Type: 'Открытый' },
    
    // --- СЕРИЯ 28 (Приборные коробки IP65) ---
    { SKU: 'КР2801-110', Name: 'Коробка приборная КР2801-110 (полистирол)', Series: 'Серия 28', Type: 'Коробка разветвительная', IP_Rating: 'IP65', Mounting_Type: 'Открытый' },
    { SKU: 'КР2802-410', Name: 'Коробка приборная КР2802-410 (ABS)', Series: 'Серия 28', Type: 'Коробка разветвительная', IP_Rating: 'IP65', Mounting_Type: 'Открытый' },
    { SKU: 'КР2803-720', Name: 'Коробка приборная КР2803-720 (PC, прозр. крышка)', Series: 'Серия 28', Type: 'Коробка разветвительная', IP_Rating: 'IP65', Mounting_Type: 'Открытый' },
  
    // --- СЕРИЯ ALFA (ЭУИ) ---
    { SKU: 'ВА10-111', Name: 'Выключатель 1-кл ALFA (Белый)', Series: 'ALFA', Type: 'Выключатель', IP_Rating: 'IP20', Mounting_Type: 'Открытый', Color: 'Белый' },
    { SKU: 'ВА10-111-01', Name: 'Выключатель 1-кл ALFA (Слоновая кость)', Series: 'ALFA', Type: 'Выключатель', IP_Rating: 'IP20', Mounting_Type: 'Открытый', Color: 'Слоновая кость' },
    { SKU: 'ВА10-111-02', Name: 'Выключатель 1-кл ALFA (Сосна)', Series: 'ALFA', Type: 'Выключатель', IP_Rating: 'IP20', Mounting_Type: 'Открытый', Color: 'Сосна' },
    { SKU: 'ВА10-114', Name: 'Выключатель 1-кл ALFA с подсветкой', Series: 'ALFA', Type: 'Выключатель', IP_Rating: 'IP20', Mounting_Type: 'Открытый' },
    { SKU: 'ВА10-151', Name: 'Выключатель 2-кл ALFA (Белый)', Series: 'ALFA', Type: 'Выключатель', IP_Rating: 'IP20', Mounting_Type: 'Открытый' },
    { SKU: 'РА16-101', Name: 'Розетка 1-м ALFA без заземления', Series: 'ALFA', Type: 'Розетка', IP_Rating: 'IP20', Mounting_Type: 'Открытый' },
    { SKU: 'РА16-111', Name: 'Розетка 1-м ALFA с заземлением', Series: 'ALFA', Type: 'Розетка', IP_Rating: 'IP20', Mounting_Type: 'Открытый' },
    { SKU: 'РА16-112', Name: 'Розетка 1-м ALFA с з/к и шторками', Series: 'ALFA', Type: 'Розетка', IP_Rating: 'IP20', Mounting_Type: 'Открытый' },
    { SKU: 'РА16-141', Name: 'Розетка 2-м ALFA без заземления', Series: 'ALFA', Type: 'Розетка', IP_Rating: 'IP20', Mounting_Type: 'Открытый' },
    { SKU: 'РА16-151', Name: 'Розетка 2-м ALFA с заземлением', Series: 'ALFA', Type: 'Розетка', IP_Rating: 'IP20', Mounting_Type: 'Открытый' },
    { SKU: 'ВА16-211', Name: 'Выключатель ALFA IP44 (Герметичный)', Series: 'ALFA', Type: 'Выключатель', IP_Rating: 'IP44', Mounting_Type: 'Открытый' },
    { SKU: 'РА16-211', Name: 'Розетка ALFA IP44 с крышкой', Series: 'ALFA', Type: 'Розетка', IP_Rating: 'IP44', Mounting_Type: 'Открытый' },
  
    // --- СЕРИЯ MASTER (ЭУИ Скрытые) ---
    { SKU: 'ВС10-311', Name: 'Выключатель 1-кл MASTER (Белый)', Series: 'MASTER', Type: 'Выключатель', IP_Rating: 'IP20', Mounting_Type: 'Скрытый' },
    { SKU: 'ВС10-312', Name: 'Выключатель 1-кл MASTER с подсветкой', Series: 'MASTER', Type: 'Выключатель', IP_Rating: 'IP20', Mounting_Type: 'Скрытый' },
    { SKU: 'ВС10-351', Name: 'Выключатель 2-кл MASTER (Белый)', Series: 'MASTER', Type: 'Выключатель', IP_Rating: 'IP20', Mounting_Type: 'Скрытый' },
    { SKU: 'РС16-301', Name: 'Розетка 1-м MASTER без з/к', Series: 'MASTER', Type: 'Розетка', IP_Rating: 'IP20', Mounting_Type: 'Скрытый' },
    { SKU: 'РС16-311', Name: 'Розетка 1-м MASTER с заземлением', Series: 'MASTER', Type: 'Розетка', IP_Rating: 'IP20', Mounting_Type: 'Скрытый' },
  
    // --- АКСЕССУАРЫ ---
    { SKU: 'У731М', Name: 'Сжим ответвительный У731М (4-10/1.5-10 мм2)', Series: 'Сжимы', Type: 'Аксессуар', IP_Rating: 'IP20', Mounting_Type: 'Открытый' },
    { SKU: 'У733М', Name: 'Сжим ответвительный У733М (16-35/1.5-10 мм2)', Series: 'Сжимы', Type: 'Аксессуар', IP_Rating: 'IP20', Mounting_Type: 'Открытый' },
    { SKU: 'У734М', Name: 'Сжим ответвительный У734М (16-35/16-25 мм2)', Series: 'Сжимы', Type: 'Аксессуар', IP_Rating: 'IP20', Mounting_Type: 'Открытый' },
    { SKU: 'У859М', Name: 'Сжим ответвительный У859М (50-70/4-35 мм2)', Series: 'Сжимы', Type: 'Аксессуар', IP_Rating: 'IP20', Mounting_Type: 'Открытый' },
    
    { SKU: 'ПК5201', Name: 'Переходник ПК5201 (для КУ1202/1204)', Series: 'Аксессуары', Type: 'Аксессуар' },
    { SKU: 'ПК5202', Name: 'Переходник ПК5202 (для КУ1201/1205)', Series: 'Аксессуары', Type: 'Аксессуар' },
    { SKU: 'К5001', Name: 'Крышка универсальная К5001 (Ø85мм)', Series: 'Аксессуары', Type: 'Аксессуар' },
    { SKU: 'А1-01', Name: 'Кнопка звонковая А1-01', Series: 'Аксессуары', Type: 'Выключатель', IP_Rating: 'IP20' },
    
    { SKU: 'РП35/7,5-0.3', Name: 'DIN-рейка 300мм (РП35/7,5)', Series: 'Аксессуары', Type: 'Аксессуар', Material: 'Оцинкованная сталь' },
    { SKU: 'РП35/7,5-0.6', Name: 'DIN-рейка 600мм (РП35/7,5)', Series: 'Аксессуары', Type: 'Аксессуар', Material: 'Оцинкованная сталь' },
    { SKU: 'PE 63.08', Name: 'Шина PE 63.08 (Земля, 8 отв.)', Series: 'Аксессуары', Type: 'Аксессуар', Material: 'Латунь' },
    { SKU: 'N 63.08', Name: 'Шина N 63.08 (Ноль, 8 отв.)', Series: 'Аксессуары', Type: 'Аксессуар', Material: 'Латунь' },
    { SKU: 'КУП1101', Name: 'Коробка уравнивания потенциалов КУП1101', Series: 'Аксессуары', Type: 'Коробка уравнивания потенциалов' },
];

async function seed() {
  console.log(`🚀 Начинаем загрузку ${products.length} товаров...`);

  if (!API_TOKEN || API_TOKEN === 'ВСТАВИТЬ_ТОКЕН_СЮДА') {
    console.error('❌ ОШИБКА: Токен не вставлен!');
    return;
  }

  let successCount = 0;

  for (const product of products) {
    try {
      // 1. Создаем красивый Slug (транслит)
      // Добавляем случайное число, чтобы не было конфликтов при повторном запуске
      const slug = generateSlug(product.SKU) + '-' + Math.floor(Math.random() * 9999);

      // 2. Данные
      const body = {
        data: {
          Name: product.Name,
          SKU: product.SKU,
          Series: product.Series,
          Type: product.Type || 'Аксессуар',
          IP_Rating: product.IP_Rating || 'IP20',
          Mounting_Type: product.Mounting_Type || 'Скрытый',
          Material: product.Material || 'Пластик',
          Color: product.Color || 'Серый', // Добавил цвет по умолчанию
          Slug: slug,
          Description: `Продукция HEGEL. Артикул: ${product.SKU}. Наименование: ${product.Name}. Высокое качество и надежность.`,
          Is_Individual_Pack: false,
          publishedAt: new Date().toISOString(), 
        }
      };

      // 3. Отправка
      const res = await fetch(STRAPI_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_TOKEN}`, 
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        console.log(`✅ OK: ${product.SKU}`);
        successCount++;
      } else {
        const err = await res.json();
        // Если уже есть - не страшно
        if (err.error && err.error.message.includes('unique')) {
           console.log(`⚠️ Уже есть: ${product.SKU}`);
        } else {
           console.error(`❌ Ошибка ${product.SKU}:`, JSON.stringify(err, null, 2));
        }
      }

    } catch (error) {
      console.error(`❌ Ошибка сети:`, error);
    }
  }

  console.log(`\n🏁 Готово! Успешно загружено: ${successCount} из ${products.length}`);
}

seed();