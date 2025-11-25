
import React from 'react';

interface IconProps {
  className?: string;
}

const PlayIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M8 5.14v13.72L19.72 12 8 5.14z" />
  </svg>
);

export default PlayIcon;
