import { useEffect } from 'react';
import { useTelegram } from './useTelegram';

const useTelegramTheme = () => {
  const { tg } = useTelegram();

  useEffect(() => {
    if (!tg?.themeParams) return;

    const theme = tg.themeParams;

    document.documentElement.style.setProperty('--tg-theme-bg-color', theme.bg_color || '#17212b');
    document.documentElement.style.setProperty(
      '--tg-theme-text-color',
      theme.text_color || '#f5f5f5',
    );
    document.documentElement.style.setProperty(
      '--tg-theme-accent-text-color',
      theme.accent_text_color || '#6ab2f2',
    );
    document.documentElement.style.setProperty(
      '--tg-theme-button-color',
      theme.button_color || '#5288c1',
    );
    document.documentElement.style.setProperty(
      '--tg-theme-button-text-color',
      theme.button_text_color || '#ffffff',
    );
    document.documentElement.style.setProperty(
      '--tg-theme-destructive-text-color',
      theme.destructive_text_color || '#ec3942',
    );
    document.documentElement.style.setProperty(
      '--tg-theme-hint-color',
      theme.hint_color || '#708499',
    );
    document.documentElement.style.setProperty(
      '--tg-theme-link-color',
      theme.link_color || '#6ab3f3',
    );
    document.documentElement.style.setProperty(
      '--tg-theme-secondary-bg-color',
      theme.secondary_bg_color || '#232e3c',
    );
    document.documentElement.style.setProperty(
      '--tg-theme-section-bg-color',
      theme.section_bg_color || '#17212b',
    );
    document.documentElement.style.setProperty(
      '--tg-theme-section-header-text-color',
      theme.section_header_text_color || '#6ab3f3',
    );
    document.documentElement.style.setProperty(
      '--tg-theme-section-separator-color',
      theme.section_separator_color || '#111921',
    );
    document.documentElement.style.setProperty(
      '--tg-theme-subtitle-text-color',
      theme.subtitle_text_color || '#708499',
    );
    document.documentElement.style.setProperty(
      '--tg-theme-bottom-bar-bg-color',
      theme.bottom_bar_bg_color || '#17212b',
    );
  }, [tg]);

  return null;
};

export default useTelegramTheme;
