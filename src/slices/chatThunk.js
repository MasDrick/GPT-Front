// slices/chatThunk.js
import { addMessage, setLastUserMessage } from './chatHistorySlice';
import axios from 'axios';

export const sendMessageThunk =
  ({ message, model, activeBrain, urlBack }) =>
  async (dispatch) => {
    if (!message.trim()) return;

    // Сохраняем последний запрос в Redux
    dispatch(setLastUserMessage(message));

    const apiUrl = `${urlBack}/generate/?prompt=${encodeURIComponent(
      message,
    )}&model=${model}&smart_prompt=${activeBrain}`;

    dispatch(addMessage({ type: 'user', text: message }));

    try {
      const response = await axios.post(apiUrl);
      const { response: botResponse, image_url: imageUrl } = response.data;

      dispatch(
        addMessage({
          type: 'bot',
          text: botResponse || '',
          image: imageUrl || '',
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
    }
  };
