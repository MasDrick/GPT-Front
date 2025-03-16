import { addMessage, setLoading } from './chatHistorySlice';
import axios from 'axios';

export const sendMessageThunk =
  ({ message, model, activeBrain, urlBack }) =>
  async (dispatch) => {
    if (!message.trim()) return;

    const apiUrl = `${urlBack}/generate/?prompt=${encodeURIComponent(
      message,
    )}&model=${model}&smart_prompt=${activeBrain}`;

    dispatch(addMessage({ type: 'user', text: message }));
    dispatch(setLoading(true)); // 👉 Показываем загрузку

    try {
      const response = await axios.post(apiUrl);
      const {
        response: botResponse,
        image_url: imageUrl,
        used_prompt: used_prompt,
      } = response.data;

      dispatch(
        addMessage({
          type: 'bot',
          text: botResponse || '',
          image: imageUrl || '',
          apiUrl: apiUrl || '',
          activeBrain: activeBrain || '',
          used_prompt: used_prompt || '',
          userPrompt: message || '',
        }),
      );
    } catch (error) {
      console.error('Ошибка при получении ответа:', error);
      dispatch(
        addMessage({
          type: 'bot',
          text: 'Произошла ошибка. Пожалуйста, попробуйте позже.',
        }),
      );
    } finally {
      dispatch(setLoading(false)); // 👉 Снимаем флаг загрузки
    }
  };
