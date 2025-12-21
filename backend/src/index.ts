export default {
  register() {},

  bootstrap({ strapi }: { strapi: any }) {
    strapi.db.lifecycles.subscribe({
      // Проверь, что в schema.json singularName именно 'dealer-request'
      models: ['api::dealer-request.dealer-request'], 

      async afterCreate(event: any) {
        try {
          const { result } = event;
          console.log('🚀 Триггер сработал для:', result.Name || result.name);

          // --- ВСТАВЬ СВОИ ДАННЫЕ ТУТ ---
          const TELEGRAM_TOKEN = '8583378436:AAGAGiPBcC8kiIG5kS9PqrUQEcRTFNN_4pM';
          const CHAT_ID = '1708569556';
          // ------------------------------

          const name = result.Name || result.name || '—';
          const phone = result.Phone || result.phone || '—';
          const occupation = result.Occupation || result.occupation || '—';

          const message = [
            `🚀 *Новая заявка Hegel*`,
            `━━━━━━━━━━━━━━━━━━`,
            `👤 *Имя:* ${name}`,
            `🛠 *Сфера:* ${occupation}`,
            `📞 *Тел:* \`${phone}\``,
          ].join('\n');

          // Отправляем запрос без блокировки основного потока
          fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: CHAT_ID,
              text: message,
              parse_mode: 'Markdown',
            }),
          })
          .then(async (res) => {
            // Типизируем ответ как any, чтобы TS не ругался на unknown
            const data: any = await res.json();
            if (data.ok) {
              console.log('✅ Telegram: Сообщение отправлено');
            } else {
              console.error('❌ Telegram API Error:', data.description || 'Unknown error');
            }
          })
          .catch((err: Error) => {
            console.error('❌ Telegram Network Error:', err.message);
          });

        } catch (globalErr: any) {
          console.error('❌ Ошибка в жизненном цикле:', globalErr.message);
        }
      },
    });
  },
};