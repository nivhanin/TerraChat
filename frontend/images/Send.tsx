import * as React from 'react';
import SvgIcon from '@mui/material/SvgIcon';

interface SendSvgProps {
  color: string;
}

export default function SendSvg({ color }: SendSvgProps) {
  return (
    <SvgIcon>
      <svg
        width='32'
        height='32'
        viewBox='0 0 32 32'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <g id='iconamoon:send-fill'>
          <path
            id='Vector'
            fillRule='evenodd'
            clipRule='evenodd'
            d='M4.53599 8.89734C4.18933 5.78534 7.39333 3.50001 10.224 4.84134L26.1493 12.3853C29.2 13.8293 29.2 18.1707 26.1493 19.6147L10.224 27.16C7.39333 28.5013 4.19066 26.216 4.53599 23.104L5.17599 17.3333H16C16.3536 17.3333 16.6928 17.1929 16.9428 16.9428C17.1929 16.6928 17.3333 16.3536 17.3333 16C17.3333 15.6464 17.1929 15.3073 16.9428 15.0572C16.6928 14.8072 16.3536 14.6667 16 14.6667H5.17733L4.53599 8.89734Z'
            fill={color}
          />
        </g>
      </svg>
    </SvgIcon>
  );
}
