export default {
  async afterCreate(event: any) {
    const { result } = event;
    
    // 1. ДИАГНОСТИКА: Посмотрим, что реально лежит в базе
    console.log('--- ДАННЫЕ ИЗ БАЗЫ ---');
    console.log(JSON.stringify(result, null, 2));

    const TELEGRAM_TOKEN = '';
    const CHAT_ID = '';

    // 2. ФУНКЦИЯ ПОИСКА ПОЛЯ (независимо от регистра)
    const getVal = (obj: any, key: string) => obj[key] || obj[key.toLowerCase()] || obj[key.charAt(0).toUpperCase() + key.slice(1)] || '—';

    const name = getVal(result, 'Name');
    const phone = getVal(result, 'Phone');
    const occ = getVal(result, 'Occupation');
    const email = getVal(result, 'Email');
    const msg = getVal(result, 'Message');

    const message = [
      `🚀 *Новая заявка Hegel*`,
      `━━━━━━━━━━━━━━━━━━`,
      `👤 *Имя:* ${name}`,
      `🛠 *Сфера:* ${occ}`,
      `📞 *Тел:* \`${phone}\``,
      `📧 *Email:* ${email}`,
      `💬 *Сообщение:*`,
      `${msg}`,
    ].join('\n');

    try {
      console.log('📡 Отправка в Telegram...');
      const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
          parse_mode: 'Markdown',
        }),
      });

      const resData = (await response.json()) as { ok: boolean; description?: string };

      if (resData.ok) {
        console.log('✅ УСПЕХ: Сообщение в Telegram доставлено!');
      } else {
        console.log('❌ ОШИБКА TELEGRAM API:', resData.description);
      }
    } catch (err) {
      console.error('❌ ОШИБКА СЕТИ:', err);
    }
  },
};