
import React from 'react';

interface IconProps {
  className?: string;
}

const MicrophoneIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Zm6.5 9a.5.5 0 0 1-1 0a5.5 5.5 0 1 0-11 0a.5.5 0 0 1-1 0a6.5 6.5 0 1 1 13 0Z"/>
    <path d="M12 18.5a1.5 1.5 0 0 1-1.5-1.5v-2a.5.5 0 0 1 1 0v2a.5.5 0 0 0 .5.5h.5a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 1 1 0v2A1.5 1.5 0 0 1 12 18.5Z"/>
    <path d="M15.5 11a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1 0-1h1a.5.5 0 0 1 .5.5Zm-7 0a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1 0-1h1a.5.5 0 0 1 .5.5Z"/>
  </svg>
);

export default MicrophoneIcon;
