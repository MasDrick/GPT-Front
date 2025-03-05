import React, { useState } from 'react';
import ContentLoader from 'react-content-loader';

const LazyImage = ({ src, alt, className }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div style={{ position: 'relative', width: '100%', maxHeight: '400px' }}>
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
          }}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
        />
      )}
      {hasError && (
        <p style={{ color: 'var(--tg-theme-destructive-text-color)' }}>
          Ошибка загрузки изображения, попробуйте еще раз
        </p>
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
