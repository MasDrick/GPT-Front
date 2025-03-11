import {useRef, useEffect, useState} from 'react';
import {useTelegram} from '../../hooks/useTelegram';
import {Paperclip, ArrowUp, Brain} from 'lucide-react';
import styles from './CustomTextArea.module.scss';
import axios from 'axios';
import useTelegramViewportHack from '../../hooks/useTelegramViewportHack';

import {useDispatch, useSelector} from "react-redux";

import {addMessage} from "../../slices/chatHistorySlice.js";


const CustomTextArea = () => {
  const [active, setActive] = useState(false);
  const [message, setMessage] = useState('');
  const [activeBrain, setActiveBrain] = useState(false)

  const containerRef = useRef(null);
  const textareaRef = useRef(null);

  const {tg, urlBack} = useTelegram();

  const dispatch = useDispatch();

  const model = useSelector(state => state.activeModel.currentModel);

  const {isKeyboardOpen, keyboardHeight} = useTelegramViewportHack(textareaRef);

  useEffect(() => {
    const adjustTextareaHeight = () => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    };

    adjustTextareaHeight();
  }, [message]);

  const handleSubmit = async () => {
    if (message.trim() === '') return;

    // Формируем URL с query-параметрами
    const apiUrl = `${urlBack}/generate/?prompt=${encodeURIComponent(message)}&model=${model}&smart_prompt=${activeBrain}`;

    // Добавляем сообщение пользователя в чат
    dispatch(addMessage({type: 'user', text: message}));
    setMessage('');
    textareaRef.current.style.height = 'auto';

    try {
      // Отправляем запрос
      const response = await axios.post(apiUrl);
      const {response: botResponse, image_url: imageUrl} = response.data;

      // Добавляем ответ бота в чат
      dispatch(addMessage({type: 'bot', text: botResponse || '', image: imageUrl || ''}));
    } catch (error) {
      console.error('Ошибка при получении ответа:', error);
      dispatch(addMessage({
        type: 'bot',
        text: 'Произошла ошибка. Пожалуйста, попробуйте позже.',
      },));

    }
  };


  const focusIOS = () => {
    textareaRef.current.focus();
  }


  return (
    <div
      ref={containerRef}
      style={{
        marginBottom: isKeyboardOpen ? `${keyboardHeight * 0.27}px` : '0',
      }}
      className={`${styles.custom_textarea} ${active ? styles.active : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        setActive(true);
        focusIOS()
      }}>
        <textarea
          ref={textareaRef}
          placeholder={`Спросить у ${model}`}
          className={styles.textarea}
          value={message}
          onFocus={() => setActive(true)}
          onBlur={() => setActive(false)}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
      <div className={styles.buttons}>
        <button
          className={
            tg.themeParams?.bg_color === '#ffffff' ? `${styles.btn} ${styles.isLight}` : styles.btn
          }>
          <Paperclip color={'#ffffff'} size={18}/>
        </button>

        {
          ['midjourney', 'flux', 'dall-e-3'].includes(model) &&
          <button onClick={() => setActiveBrain(!activeBrain)}
                  className={`${styles.brainBtn} ${tg.themeParams?.bg_color === '#ffffff' ? `${styles.btn} ${styles.isLight}` : styles.btn} ${activeBrain ? styles.activeBrain : ''}`}
          >
            <Brain color={'#ffffff'} size={16}/> <span>Умный промпт</span>
          </button>
        }

        <button
          className={`${message === '' ? styles.btn : `${styles.btn} ${styles.activeBtn}`} ${
            tg.themeParams?.bg_color === '#ffffff' ? styles.isLight : ''
          }`}
          onClick={handleSubmit}>
          <ArrowUp color={'#ffffff'} size={18}/>
        </button>
      </div>
    </div>
  );
};

export default CustomTextArea;
