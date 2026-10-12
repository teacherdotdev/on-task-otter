// The otter's hats and glasses, drawn in the otter's own 220 × 220 drawing
// space so each piece sits on its head. The shop icons reuse the same drawing,
// cropped to the box listed next to it.

const ink = "#5a3d2b";
const outline = { stroke: ink, strokeWidth: 3.5, strokeLinejoin: "round", strokeLinecap: "round" };
const shade = { fill: ink, opacity: 0.15, stroke: "none" };
const shine = { fill: "none", stroke: "#fffaf0", strokeWidth: 2.5, strokeLinecap: "round", opacity: 0.75 };

// A five-pointed star as polygon points, used for the star glasses.
const starPoints = (cx, cy, outer, inner) =>
  Array.from({ length: 10 }, (_, i) => {
    const r = i % 2 ? inner : outer;
    const angle = Math.PI / 5 * i - Math.PI / 2;
    return `${(cx + r * Math.cos(angle)).toFixed(1)},${(cy + r * Math.sin(angle)).toFixed(1)}`;
  }).join(" ");

// A heart about 32 wide, centred on (x, y).
const heartPath = (x, y) =>
  `M${x} ${y + 12} C${x - 8} ${y + 6} ${x - 16} ${y} ${x - 16} ${y - 7} C${x - 16} ${y - 13} ${x - 11} ${y - 16} ${x - 7} ${y - 16} C${x - 3} ${y - 16} ${x - 1} ${y - 13} ${x} ${y - 11} C${x + 1} ${y - 13} ${x + 3} ${y - 16} ${x + 7} ${y - 16} C${x + 11} ${y - 16} ${x + 16} ${y - 13} ${x + 16} ${y - 7} C${x + 16} ${y} ${x + 8} ${y + 6} ${x} ${y + 12}Z`;

// The arms of every pair of glasses run from the lenses back to the ears.
const glassesArms = (left, right) => (
  <path {...outline} fill="none" strokeWidth="5" d={`M${left} 88 L58 85 M${right} 86 L164 82`} />
);

export const accessoryArt = {
  "party-hat": {
    box: "75 -16 73 69",
    art: (
      <g {...outline}>
        <path fill="#a98ad0" d="M80 44 L112 -4 L143 48 C122 42 101 41 80 44Z" />
        <path {...shade} d="M112 -4 L143 48 C137 46 131 45 125 44Z" />
        <path fill="none" stroke="#e8b44f" strokeWidth="5" d="M94 24 C106 21 120 23 129 28 M86 36 C104 32 124 34 138 39" />
        <circle fill="#d9785a" strokeWidth="3" cx="112" cy="-4" r="7" />
        <circle fill="#fffaf0" stroke="none" cx="106" cy="12" r="3" />
      </g>
    ),
  },
  beanie: {
    box: "49 -13 121 80",
    art: (
      <g {...outline}>
        <path fill="#d9785a" d="M64 50 C60 20 84 4 110 4 C136 4 160 20 156 50Z" />
        <path {...shade} d="M132 8 C150 17 160 32 156 50 L143 50 C145 33 141 18 132 8Z" />
        <path fill="#b9583f" d="M58 46 C92 37 128 37 162 46 C165 47 166 49 165 52 L164 58 C163 61 161 62 158 61 C126 53 94 53 62 61 C59 62 57 61 56 58 L55 52 C54 49 55 47 58 46Z" />
        <path fill="none" stroke={ink} strokeWidth="3.5" opacity=".35" d="M80 43 V54 M100 40 V51 M120 40 V51 M140 43 V54" />
        <circle fill="#fffaf0" cx="110" cy="2" r="10" />
      </g>
    ),
  },
  "graduation-cap": {
    box: "45 7 130 76",
    art: (
      <g {...outline}>
        <path fill="#2f3a45" d="M76 34 L76 52 C95 58 125 58 144 52 L144 34Z" />
        <path fill="#4a5a78" d="M50 31 L110 12 L170 31 L110 50Z" />
        <path fill="#fffaf0" stroke="none" opacity=".2" d="M60 31 L110 15 L118 17 L68 33Z" />
        <path fill="none" stroke="#e8b44f" strokeWidth="4" d="M110 31 L152 37 C155 42 156 48 156 55" />
        <path fill="#e8b44f" strokeWidth="3" d="M152 61 H160 L164 78 C160 80 152 80 148 78Z" />
        <path fill="none" strokeWidth="2.5" opacity=".35" d="M153 65 L151.5 76 M159 65 L160.5 76" />
        <circle fill="#e8b44f" strokeWidth="3" cx="156" cy="58" r="4" />
        <circle fill="#e8b44f" strokeWidth="3" cx="110" cy="31" r="4.5" />
      </g>
    ),
  },
  crown: {
    box: "58 -4 103 59",
    art: (
      <g {...outline}>
        <path fill="#e8b44f" d="M74 50 L69 18 L91 33 L110 9 L129 33 L151 18 L146 50 C122 46 98 46 74 50Z" />
        <path {...shade} d="M129 33 L151 18 L146 50 C140 49 134 48 129 48Z" />
        <circle fill="#e8b44f" strokeWidth="3" cx="69" cy="16" r="5.5" />
        <circle fill="#e8b44f" strokeWidth="3" cx="110" cy="7" r="5.5" />
        <circle fill="#e8b44f" strokeWidth="3" cx="151" cy="16" r="5.5" />
        <circle fill="#d9785a" strokeWidth="3" cx="110" cy="38" r="7" />
        <circle fill="#5d84b8" strokeWidth="3" cx="87" cy="41" r="4.5" />
        <circle fill="#5d84b8" strokeWidth="3" cx="133" cy="41" r="4.5" />
        <path {...shine} d="M107 34 C108 33 109 32 111 32" />
      </g>
    ),
  },
  "round-glasses": {
    box: "53 70 116 40",
    art: (
      <g {...outline}>
        {glassesArms(72, 150)}
        <path fill="none" strokeWidth="5" d="M100 89 C105 84 117 83 122 87" />
        <circle fill="#fffaf0" fillOpacity=".45" strokeWidth="8.5" cx="86" cy="91" r="14" />
        <circle fill="#fffaf0" fillOpacity=".45" strokeWidth="8.5" cx="136" cy="89" r="14" />
        <circle fill="none" stroke="#c98b45" strokeWidth="3.5" cx="86" cy="91" r="14" />
        <circle fill="none" stroke="#c98b45" strokeWidth="3.5" cx="136" cy="89" r="14" />
        <path {...shine} strokeWidth="3" d="M78 86 C79 83 81 81 84 80 M128 84 C129 81 131 79 134 78" />
      </g>
    ),
  },
  "lab-goggles": {
    box: "45 64 130 49",
    art: (
      <g {...outline}>
        <path fill="none" strokeWidth="11" d="M50 95 L68 92 M152 88 L170 85" />
        <path fill="none" stroke="#e8b44f" strokeWidth="5" d="M50 95 L68 92 M152 88 L170 85" />
        <path fill="#5a78b0" d="M66 84 C66 74 74 71 86 71 L134 69 C146 69 154 73 154 83 V96 C154 104 148 107 140 107 H126 C120 107 117 100 110 100 C103 100 100 108 94 108 H80 C72 108 66 104 66 96Z" />
        <rect fill="#eef8f9" fillOpacity=".75" strokeWidth="3" x="73" y="78" width="27" height="24" rx="8" />
        <rect fill="#eef8f9" fillOpacity=".75" strokeWidth="3" x="120" y="76" width="27" height="24" rx="8" />
        <path {...shine} strokeWidth="3.5" d="M79 84 L84 92 M126 82 L131 90" />
      </g>
    ),
  },
  "heart-glasses": {
    box: "53 70 116 40",
    art: (
      <g {...outline}>
        {glassesArms(70, 152)}
        <path fill="none" strokeWidth="5" d="M102 86 C107 82 115 82 120 84" />
        <path fill="#e8667f" fillOpacity=".75" strokeWidth="4.5" d={heartPath(86, 93)} />
        <path fill="#e8667f" fillOpacity=".75" strokeWidth="4.5" d={heartPath(136, 91)} />
        <path {...shine} strokeWidth="3.5" d="M75 85 C76 82 78 80 81 80 M125 83 C126 80 128 78 131 78" />
      </g>
    ),
  },
  "star-glasses": {
    box: "53 65 116 49",
    art: (
      <g {...outline}>
        {glassesArms(72, 150)}
        <path fill="none" strokeWidth="5" d="M102 88 C107 84 115 84 120 86" />
        <polygon fill="#e8b44f" fillOpacity=".8" strokeWidth="4.5" points={starPoints(87, 92, 20, 10.5)} />
        <polygon fill="#e8b44f" fillOpacity=".8" strokeWidth="4.5" points={starPoints(135, 90, 20, 10.5)} />
        <path {...shine} strokeWidth="3" d="M80 90 L84 86 M128 88 L132 84" />
      </g>
    ),
  },
};

/** One accessory on its own, sized to fill the shop and purchase icons. */
export const AccessoryIcon = ({ id }) => (
  <svg className="accessory-icon" viewBox={accessoryArt[id].box} aria-hidden="true">
    {accessoryArt[id].art}
  </svg>
);
