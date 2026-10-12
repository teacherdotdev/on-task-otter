// Built-in surfaces share the room's coordinates, so rewards stay on their tops.
// Kitchen counter tops sit at y=232 (backsplash from y=192), the wall shelf at
// y=150; the bathroom vanity top is y≈223–246 and its shelf y=174.
const INK = '#5a3d2b';
const BRASS = '#d8a84a';

const BrassFaucet = ({ d }) => (
  <>
    <path d={d} fill="none" stroke={INK} strokeWidth="9" />
    <path d={d} fill="none" stroke={BRASS} strokeWidth="4" />
  </>
);

const RoomFixtures = ({ room }) => {
  if (room !== 'kitchen' && room !== 'bathroom') return null;
  return (
    <svg className="room-fixtures" viewBox="0 0 900 440" aria-hidden="true">
      <g stroke={INK} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round">
        {room === 'kitchen' ? <>
          {/* Cream tile backsplash */}
          <path d="M40 192h355v42H40zM565 192h300v42H565z" fill="#f6e9cf" />
          <g stroke={INK} strokeWidth="1.5" opacity=".28">
            <path d="M40 212h355M565 212h300" />
            <path d="M90 192v20m50-20v20m50-20v20m50-20v20m50-20v20m50-20v20M65 212v20m50-20v20m50-20v20m50-20v20m50-20v20m50-20v20m50-20v20" />
            <path d="M615 192v20m50-20v20m50-20v20m50-20v20m50-20v20M590 212v20m50-20v20m50-20v20m50-20v20m50-20v20m50-20v20" />
          </g>
          {/* Sage cabinets */}
          <rect x="43" y="246" width="349" height="88" rx="6" fill="#9bb58a" />
          <rect x="568" y="246" width="294" height="88" rx="6" fill="#9bb58a" />
          <path d="M50 322h335v10H50zM575 322h280v10H575z" fill={INK} stroke="none" opacity=".18" />
          <rect x="55" y="258" width="99" height="60" rx="7" fill="#b5caa3" />
          <rect x="166" y="258" width="99" height="60" rx="7" fill="#b5caa3" />
          <rect x="580" y="258" width="131" height="60" rx="7" fill="#b5caa3" />
          <rect x="724" y="258" width="126" height="60" rx="7" fill="#b5caa3" />
          <path d="M60 263h89M171 263h89M585 263h121M729 263h116" stroke="#fff8ea" strokeWidth="2" opacity=".5" />
          <g fill={BRASS} strokeWidth="2">
            <circle cx="140" cy="276" r="5" /><circle cx="180" cy="276" r="5" />
            <circle cx="697" cy="276" r="5" /><circle cx="738" cy="276" r="5" />
          </g>
          {/* Cream stove */}
          <rect x="277" y="246" width="104" height="80" rx="7" fill="#fbf1dc" />
          <rect x="289" y="273" width="80" height="42" rx="8" fill="#7a5340" />
          <rect x="296" y="280" width="66" height="28" rx="5" fill="#ffe7a3" stroke="none" opacity=".35" />
          <path d="M298 266h62" stroke={BRASS} strokeWidth="4" />
          <path d="M298 266h62" stroke={INK} strokeWidth="1.5" opacity=".4" />
          <g fill={BRASS} strokeWidth="2">
            <circle cx="296" cy="256" r="4" /><circle cx="316" cy="256" r="4" /><circle cx="356" cy="256" r="4" />
          </g>
          {/* Honey wood counter tops */}
          <rect x="36" y="232" width="363" height="15" rx="5" fill="#d9a066" />
          <rect x="561" y="232" width="308" height="15" rx="5" fill="#d9a066" />
          <path d="M42 236h351M567 236h296" stroke="#fff8ea" strokeWidth="2" opacity=".45" />
          <path d="M120 242q30-3 60 0M640 242q30-3 60 0" stroke={INK} strokeWidth="1.5" fill="none" opacity=".3" />
          {/* Burners */}
          <g fill={INK} stroke="none" opacity=".75">
            <ellipse cx="305" cy="239" rx="17" ry="4" /><ellipse cx="355" cy="239" rx="17" ry="4" />
          </g>
          {/* Farmhouse sink: its rim flush with the counter top and its apron
              dropping through the counter edge; the tap rises behind it */}
          <BrassFaucet d="M710 229v-20q0-13-11-13t-11 13v3" />
          <rect x="704" y="226" width="12" height="5" rx="2" fill={BRASS} strokeWidth="2" />
          <rect x="642" y="231" width="92" height="26" rx="5" fill="#fbf1dc" />
          <path d="M647 250h82v4h-82z" fill={INK} stroke="none" opacity=".1" />
          <rect x="636" y="228" width="104" height="7" rx="3.5" fill="#fbf1dc" />
          <path d="M641 230.5h94" stroke="#6fa7a0" strokeWidth="2" opacity=".9" />
          <path d="M648 240h30" stroke="#fff" strokeWidth="2" opacity=".7" />
          {/* Wall shelf */}
          <rect x="62" y="156" width="8" height="13" rx="3" fill="#a86f45" strokeWidth="2" />
          <rect x="210" y="156" width="8" height="13" rx="3" fill="#a86f45" strokeWidth="2" />
          <rect x="49" y="150" width="183" height="8" rx="3" fill="#a86f45" />
        </> : <>
          {/* Honey wood vanity */}
          <path d="m264 253 18-15v95l-18 14z" fill="#c48a55" />
          <rect x="57" y="252" width="207" height="95" rx="5" fill="#d9a066" />
          <rect x="67" y="268" width="88" height="66" rx="7" fill="#e8c290" />
          <rect x="166" y="268" width="88" height="66" rx="7" fill="#e8c290" />
          <path d="M72 273h78M171 273h78" stroke="#fff8ea" strokeWidth="2" opacity=".55" />
          <path d="M90 318q20-4 40 0M190 318q20-4 40 0" stroke={INK} strokeWidth="1.5" fill="none" opacity=".3" />
          <g fill={BRASS} strokeWidth="2">
            <rect x="136" y="284" width="6" height="18" rx="3" /><rect x="179" y="284" width="6" height="18" rx="3" />
          </g>
          {/* Cream counter slab */}
          <path d="m268 246 17-23v14l-17 22z" fill="#d6c19f" />
          <path d="m49 246 20-23h216l-17 23z" fill="#fbf1dc" />
          <rect x="49" y="246" width="219" height="13" rx="3" fill="#ead9bd" />
          {/* Basin and brass tap */}
          <ellipse cx="164" cy="239" rx="56" ry="12" fill="#6fa7a0" />
          <ellipse cx="164" cy="236" rx="44" ry="7" fill="#d3e6dc" strokeWidth="2" />
          <BrassFaucet d="M186 229v-23q0-14-15-14t-15 14" />
          {/* Stubby legs */}
          <rect x="76" y="346" width="11" height="12" rx="4" fill="#a86f45" strokeWidth="2" />
          <rect x="236" y="346" width="11" height="12" rx="4" fill="#a86f45" strokeWidth="2" />
          {/* Wall shelf */}
          <rect x="470" y="179" width="7" height="12" rx="3" fill="#a86f45" strokeWidth="2" />
          <rect x="568" y="179" width="7" height="12" rx="3" fill="#a86f45" strokeWidth="2" />
          <rect x="459" y="174" width="127" height="7" rx="3" fill="#a86f45" />
        </>}
      </g>
    </svg>
  );
};

export default RoomFixtures;
