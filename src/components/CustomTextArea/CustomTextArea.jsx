import { useRef, useEffect, useState } from 'react';
import { useTelegram } from '../../hooks/useTelegram';
import { Paperclip, ArrowUp, Brain, Ban } from 'lucide-react';
import styles from './CustomTextArea.module.scss';
import useTelegramViewportHack from '../../hooks/useTelegramViewportHack';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessageThunk } from '../../slices/chatThunk';
import { setBrain } from '../../slices/chatHistorySlice';

const CustomTextArea = () => {
  const [active, setActive] = useState(false);
  const [message, setMessage] = useState('');
  const [activeBrain, setActiveBrain] = useState(false);

  const containerRef = useRef(null);
  const textareaRef = useRef(null);

  const { tg, urlBack } = useTelegram();
  const dispatch = useDispatch();

  const model = useSelector((state) => state.activeModel.currentModel);
  const isLoading = useSelector((state) => state.chatHistory.loading);

  const { isKeyboardOpen, keyboardHeight } = useTelegramViewportHack(textareaRef);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = () => {
    if (message.trim() === '') return;

    if (isLoading === false) {
      dispatch(
        sendMessageThunk({
          message,
          model,
          activeBrain,
          urlBack,
        }),
      );
      dispatch(setBrain(activeBrain));

      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

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
          <Paperclip color={'#ffffff'} size={18} />
        </button>

        {['midjourney', 'flux', 'dall-e-3'].includes(model) && (
          <button
            onClick={() => setActiveBrain(!activeBrain)}
            className={`${styles.brainBtn} ${
              tg.themeParams?.bg_color === '#ffffff'
                ? `${styles.btn} ${styles.isLight}`
                : styles.btn
            } ${activeBrain ? styles.activeBrain : ''}`}>
            <Brain color={'#ffffff'} size={16} />
            <span>Умный промпт</span>
          </button>
        )}

        {isLoading ? (
          <button
            className={`${message === '' ? styles.btn : `${styles.btn} `} ${
              tg.themeParams?.bg_color === '#ffffff' ? styles.isLight : ''
            }`}
            onClick={handleSubmit}>
            <Ban size={18} />
          </button>
        ) : (
          <button
            className={`${message === '' ? styles.btn : `${styles.btn} ${styles.activeBtn}`} ${
              tg.themeParams?.bg_color === '#ffffff' ? styles.isLight : ''
            }`}
            onClick={handleSubmit}>
            <ArrowUp color={'#ffffff'} size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default CustomTextArea;
