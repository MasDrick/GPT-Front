import React, { useState } from 'react';
import ContentLoader from 'react-content-loader';

const LazyImage = ({ src, alt, className, usedPrompt, prompt }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const handleImageClick = () => {
    if (!isLoading && !hasError) {
      setIsZoomed(true);
    }
  };

  const handleCloseZoom = () => {
    setIsZoomed(false);
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {isLoading && !hasError && <ImageSkeleton key="skeleton" />}

      {!hasError && (
        <img
          src={src}
          alt={alt}
          className={className}
          style={{
            display: isLoading ? 'none' : 'block',
            width: '100%',
            maxWidth: '400px',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          onClick={handleImageClick}
        />
      )}

      {hasError && (
        <p style={{ color: 'var(--tg-theme-destructive-text-color)' }}>
          Ошибка загрузки изображения, попробуйте еще раз
        </p>
      )}

      {usedPrompt && (
        <div className={prompt}>
          <strong>Промпт: </strong>
          <p>{usedPrompt}</p>
        </div>
      )}

      {/* Увеличенное изображение (модалка) */}
      {isZoomed && (
        <div
          onClick={handleCloseZoom}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            cursor: 'zoom-out',
          }}>
          <img
            src={src}
            alt={alt}
            style={{
              maxWidth: '90%',
              maxHeight: '90%',
              borderRadius: '12px',
              boxShadow: '0 0 20px rgba(0,0,0,0.5)',
            }}
          />
        </div>
      )}
    </div>
  );
};

const ImageSkeleton = (props) => (
  <ContentLoader
    className="messageImage"
    speed={2}
    width={400}
    height={400}
    viewBox="0 0 400 400"
    backgroundColor="var(--tg-theme-secondary-bg-color)"
    foregroundColor="var(--tg-theme-bg-color)"
    {...props}>
    <rect x="0" y="0" rx="8" ry="8" width="400" height="400" />
  </ContentLoader>
);

export default LazyImage;
