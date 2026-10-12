// The app icon: the same otter from the dashboard, cropped into a round badge.
// Kept in sync with public/favicon.svg.
const OtterMark = ({ className = "otter-mark", title = "On-task Otter" }) => (
  <svg className={className} viewBox="18 -7 184 184" role="img" aria-label={title}>
    <clipPath id="otter-mark-badge"><circle cx="110" cy="85" r="92" /></clipPath>
    <circle cx="110" cy="85" r="92" fill="#25433d" />
    <g clipPath="url(#otter-mark-badge)">
      <g fill="#9e6340" stroke="#5a3d2b" strokeWidth="4">
        <circle cx="59" cy="45" r="17" />
        <circle cx="161" cy="45" r="17" />
      </g>
      <path
        fill="#b5774c"
        stroke="#5a3d2b"
        strokeWidth="4"
        strokeLinejoin="round"
        d="M104 25 C76 27 47 48 43 85 C42 90 41 93 39 96 C41 97 42 97 43 98 C42 102 40 105 36 108 C39 110 42 110 45 111 C45 124 51 134 59 140 C56 152 55 170 58 184 C66 199 154 199 162 184 C165 170 164 152 161 140 C169 134 175 124 175 111 C178 110 181 110 184 108 C180 105 178 102 177 98 C178 97 179 97 181 96 C179 93 178 90 177 85 C173 48 144 27 116 25 C114 21 115 17 119 13 C113 14 110 17 109 21 C107 17 103 15 98 15 C102 18 104 21 104 25Z"
      />
      <path fill="#5a3d2b" opacity=".15" d="M146 33c19 12 29 29 31 52 2 19-5 39-16 51 5-18 7-36 5-52-2-22-9-38-20-51Z" />
      <path fill="#fff8ea" opacity=".35" d="M64 63c4-12 14-21 26-25-8 7-15 15-19 25-2 5-8 4-7 0Z" />
      <ellipse cx="58" cy="44" rx="8" ry="8.5" fill="#eba59c" />
      <ellipse cx="162" cy="44" rx="8" ry="8.5" fill="#eba59c" />
      <path fill="#fdf3e3" stroke="#5a3d2b" strokeWidth="3" strokeLinejoin="round" d="M110 104c-10-6-30-3-30 14 0 14 14 21 30 19 16 2 30-5 30-19 0-17-20-20-30-14Z" />
      <path
        fill="none"
        stroke="#5a3d2b"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity=".5"
        d="M80 115c-6-3-12-4-19-3M80 123c-6 0-11 1-17 4M140 115c6-3 12-4 19-3M140 123c6 0 11 1 17 4"
      />
      <g fill="#3f2a1e">
        <ellipse cx="86" cy="91" rx="7.5" ry="10.5" />
        <ellipse cx="136" cy="89" rx="7.5" ry="10.5" />
        <path d="M110 100c9 0 13 4 10 9-3 5-7 7-10 7s-7-2-10-7c-3-5 1-9 10-9Z" />
      </g>
      <g fill="#fffaf0">
        <circle cx="83.5" cy="87" r="3.2" />
        <circle cx="133.5" cy="85" r="3.2" />
        <circle cx="89" cy="95.5" r="1.5" />
        <circle cx="139" cy="93.5" r="1.5" />
      </g>
      <path
        fill="none"
        stroke="#3f2a1e"
        strokeWidth="3.5"
        strokeLinecap="round"
        d="M110 116v5M110 121c-3 8-12 8-15 1M110 121c3 8 12 8 15 1"
      />
    </g>
  </svg>
);

export default OtterMark;
