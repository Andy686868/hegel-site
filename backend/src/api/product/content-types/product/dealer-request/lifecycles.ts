export default {
  async afterCreate(event) {
    const { result } = event;

    // ВСТАВЬ СВОИ ДАННЫЕ ТУТ
    const TELEGRAM_TOKEN = '8583378436:AAGAGiPBcC8kiIG5kS9PqrUQEcRTFNN_4pM';
    const CHAT_ID = '1708569556';

    const message = [
      `🚀 *Новая заявка дилера Hegel*`,
      `━━━━━━━━━━━━━━━━━━`,
      `👤 *Имя/Компания:* ${result.Name}`,
      `🛠 *Сфера:* ${result.Occupation}`,
      `📞 *Телефон:* \`${result.Phone}\``,
      `📧 *Email:* ${result.Email}`,
      `💬 *Сообщение:*`,
      `${result.Message || 'Без комментария'}`,
      `━━━━━━━━━━━━━━━━━━`,
      `✅ _Заявка сохранена в базе Strapi_`
    ].join('\n');

    try {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
          parse_mode: 'Markdown',
        }),
      });
      console.log('✅ Уведомление в Telegram отправлено');
    } catch (err) {
      console.error('❌ Ошибка отправки в Telegram:', err);
    }
  },
};