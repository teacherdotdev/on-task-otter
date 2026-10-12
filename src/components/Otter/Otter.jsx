import { useTranslation } from "../../i18n";

const Otter = ({ equipped, isCelebrating, isFocusing, noiseTone, showAccessorySlots = false }) => {
  const { t } = useTranslation();
  const isLoud = noiseTone === "loud";
  const state = isCelebrating ? "celebrating" : isLoud ? "loud" : isFocusing ? "focusing" : "idle";
  const stateLabels = {
    celebrating: t("otter.stateCelebrating"),
    focusing: t("otter.atDesk"),
    idle: t("otter.stateIdle"),
    loud: t("otter.stateLoud"),
  };

  return (
    <div className={`otter-scene state-${state}`}>
      <p className="otter-message" aria-live="polite">{t(`otter.${state}`)}</p>
      <span className="sparkle one" aria-hidden="true">✦</span>
      <span className="sparkle two" aria-hidden="true">✦</span>
      <div className="otter" role="img" aria-label={stateLabels[state]}>
        <svg className="otter-svg" viewBox="0 0 220 220" aria-hidden="true">
          <g className="focus-chair">
            <path d="M48 126 Q42 126 42 135 L42 203" />
            <path d="M42 171 H72" />
          </g>
          <path className="otter-tail" d="M152 156 C181 172 205 159 208 135 C210 122 201 114 193 118 C186 122 192 133 184 141 C175 150 161 148 150 142Z" />
          <path className="otter-tail-shade" d="M157 154 C178 162 198 154 204 136 C201 152 184 162 166 160Z" />
          <g className="otter-leg otter-leg-left">
            <path className="otter-limb-line" d="M84 172 C82 186 78 196 72 202" />
            <path className="otter-limb-fur" d="M84 172 C82 186 78 196 72 202" />
            <ellipse className="otter-foot" cx="66" cy="205" rx="14" ry="8.5" />
            <path className="otter-toes" d="M58 204 V208 M65 205 V209" />
          </g>
          <g className="otter-leg otter-leg-right">
            <path className="otter-limb-line" d="M136 172 C138 186 142 196 148 202" />
            <path className="otter-limb-fur" d="M136 172 C138 186 142 196 148 202" />
            <ellipse className="otter-foot" cx="154" cy="205" rx="14" ry="8.5" />
            <path className="otter-toes" d="M162 204 V208 M155 205 V209" />
          </g>
          <g className="otter-ear otter-ear-left"><circle cx="59" cy="45" r="17" /></g>
          <g className="otter-ear otter-ear-right"><circle cx="161" cy="45" r="17" /></g>
          <path className="otter-blob" d="M104 25 C76 27 47 48 43 85 C42 90 41 93 39 96 C41 97 42 97 43 98 C42 102 40 105 36 108 C39 110 42 110 45 111 C45 124 51 134 59 140 C56 152 55 170 58 184 C66 199 154 199 162 184 C165 170 164 152 161 140 C169 134 175 124 175 111 C178 110 181 110 184 108 C180 105 178 102 177 98 C178 97 179 97 181 96 C179 93 178 90 177 85 C173 48 144 27 116 25 C114 21 115 17 119 13 C113 14 110 17 109 21 C107 17 103 15 98 15 C102 18 104 21 104 25Z" />
          <path className="otter-shade" d="M146 33 C165 45 175 62 177 85 C179 104 172 124 161 136 C166 118 168 100 166 84 C164 62 157 46 146 33Z" />
          <path className="otter-shade" d="M57 174 C61 188 80 194 110 194 C140 194 159 188 163 174 C161 188 146 197 110 197 C74 197 59 188 57 174Z" />
          <path className="otter-shine" d="M64 63 C68 51 78 42 90 38 C82 45 75 53 71 63 C69 68 63 67 64 63Z" />
          <ellipse className="otter-belly" cx="110" cy="161" rx="38" ry="32" />
          <path className="otter-belly-shade" d="M74 170 C81 186 96 193 110 193 C124 193 139 186 146 170 C137 182 124 187 110 187 C96 187 83 182 74 170Z" />
          <path className="otter-belly-shine" d="M86 154 C85 146 90 139 97 136 C94 141 92 147 92 154 C91 159 86 159 86 154Z" />
          <ellipse className="otter-ear-inner" cx="58" cy="44" rx="8" ry="8.5" />
          <ellipse className="otter-ear-inner" cx="162" cy="44" rx="8" ry="8.5" />
          <g className="otter-face">
            <path className="otter-muzzle" d="M110 104 C100 98 80 101 80 118 C80 132 94 139 110 137 C126 139 140 132 140 118 C140 101 120 98 110 104Z" />
            <path className="otter-whiskers" d="M80 115 C74 112 68 111 61 112 M80 123 C74 123 69 124 63 127 M140 115 C146 112 152 111 159 112 M140 123 C146 123 151 124 157 127" />
            <g className="otter-eye otter-eye-left"><ellipse cx="86" cy="91" rx="7.5" ry="10.5" /><circle cx="83.5" cy="87" r="3.2" /><circle className="otter-glint-small" cx="89" cy="95.5" r="1.5" /></g>
            <g className="otter-eye otter-eye-right"><ellipse cx="136" cy="89" rx="7.5" ry="10.5" /><circle cx="133.5" cy="85" r="3.2" /><circle className="otter-glint-small" cx="139" cy="93.5" r="1.5" /></g>
            <path className="otter-nose" d="M110 100 C119 100 123 104 120 109 C117 114 113 116 110 116 C107 116 103 114 100 109 C97 104 101 100 110 100Z" />
            <path className="otter-nose-shine" d="M104 104 C106 102 110 102 112 103" />
            <path className="otter-mouth otter-mouth-smile" d="M110 116 L110 121 M110 121 C107 129 98 129 95 122 M110 121 C113 129 122 129 125 122" />
            <path className="otter-mouth otter-mouth-focus" d="M110 116 L110 122 M100 125 C105 122 115 122 120 125" />
            <ellipse className="otter-mouth otter-mouth-loud" cx="110" cy="128" rx="9" ry="9.5" />
            <path className="otter-mouth otter-mouth-celebrate" d="M93 120 C99 141 121 141 127 118 C116 125 104 125 93 120Z" />
          </g>
          <g className="otter-arms otter-arms-rest">
            <g className="otter-limb">
              <path className="limb-outline" d="M68 154.5 L98 163.5 A7 7 0 0 0 103.5 151 L75.5 136 A10 10 0 1 0 68 154.5Z" />
              <ellipse className="limb-outline" cx="102" cy="158" rx="9.5" ry="8.5" transform="rotate(22 102 158)" />
              <path className="limb-fill" d="M68 154.5 L98 163.5 A7 7 0 0 0 103.5 151 L75.5 136 A10 10 0 1 0 68 154.5Z" />
              <ellipse className="limb-fill" cx="102" cy="158" rx="9.5" ry="8.5" transform="rotate(22 102 158)" />
              <path className="otter-toes" d="M106 156 L109.5 157.5 M103.5 161.5 L107 163" />
            </g>
            <g className="otter-limb">
              <path className="limb-outline" d="M144.5 136 L116.5 151 A7 7 0 0 0 122 163.5 L152 154.5 A10 10 0 1 0 144.5 136Z" />
              <ellipse className="limb-outline" cx="118" cy="158" rx="9.5" ry="8.5" transform="rotate(158 118 158)" />
              <path className="limb-fill" d="M144.5 136 L116.5 151 A7 7 0 0 0 122 163.5 L152 154.5 A10 10 0 1 0 144.5 136Z" />
              <ellipse className="limb-fill" cx="118" cy="158" rx="9.5" ry="8.5" transform="rotate(158 118 158)" />
              <path className="otter-toes" d="M116.5 161.5 L113 163 M114 156 L110.5 157.5" />
            </g>
          </g>
          <g className="otter-arms otter-arms-loud">
            <g className="otter-limb">
              <path className="limb-outline" d="M73 143.5 L69 117 A7 7 0 0 0 55 117.5 L53 144.5 A10 10 0 1 0 73 143.5Z" />
              <ellipse className="limb-outline" cx="62" cy="116" rx="9.5" ry="8.5" transform="rotate(-92 62 116)" />
              <path className="limb-fill" d="M73 143.5 L69 117 A7 7 0 0 0 55 117.5 L53 144.5 A10 10 0 1 0 73 143.5Z" />
              <ellipse className="limb-fill" cx="62" cy="116" rx="9.5" ry="8.5" transform="rotate(-92 62 116)" />
              <path className="otter-toes" d="M59 113 L58.5 109 M65 113 L64.5 109" />
            </g>
            <g className="otter-limb">
              <path className="limb-outline" d="M167 144.5 L165 117.5 A7 7 0 0 0 151 117 L147 143.5 A10 10 0 1 0 167 144.5Z" />
              <ellipse className="limb-outline" cx="158" cy="116" rx="9.5" ry="8.5" transform="rotate(-88 158 116)" />
              <path className="limb-fill" d="M167 144.5 L165 117.5 A7 7 0 0 0 151 117 L147 143.5 A10 10 0 1 0 167 144.5Z" />
              <ellipse className="limb-fill" cx="158" cy="116" rx="9.5" ry="8.5" transform="rotate(-88 158 116)" />
              <path className="otter-toes" d="M155 113 L155.5 109 M161 113 L161.5 109" />
            </g>
          </g>
          <g className="otter-arms otter-arms-cheer">
            <g className="otter-limb">
              <path className="limb-outline" d="M70.5 137.5 L51 107 A7 7 0 0 0 38.5 114 L53 147 A10 10 0 1 0 70.5 137.5Z" />
              <ellipse className="limb-outline" cx="44" cy="109" rx="9.5" ry="8.5" transform="rotate(-118 44 109)" />
              <path className="limb-fill" d="M70.5 137.5 L51 107 A7 7 0 0 0 38.5 114 L53 147 A10 10 0 1 0 70.5 137.5Z" />
              <ellipse className="limb-fill" cx="44" cy="109" rx="9.5" ry="8.5" transform="rotate(-118 44 109)" />
              <path className="otter-toes" d="M40 108 L38 104.5 M45.5 105 L43.5 101.5" />
            </g>
            <g className="otter-limb">
              <path className="limb-outline" d="M167 147 L181.5 114 A7 7 0 0 0 169 107 L149.5 137.5 A10 10 0 1 0 167 147Z" />
              <ellipse className="limb-outline" cx="176" cy="109" rx="9.5" ry="8.5" transform="rotate(-62 176 109)" />
              <path className="limb-fill" d="M167 147 L181.5 114 A7 7 0 0 0 169 107 L149.5 137.5 A10 10 0 1 0 167 147Z" />
              <ellipse className="limb-fill" cx="176" cy="109" rx="9.5" ry="8.5" transform="rotate(-62 176 109)" />
              <path className="otter-toes" d="M174.5 105 L176.5 101.5 M180 108 L182 104.5" />
            </g>
          </g>
          {equipped.includes("glasses") && (
            <g className="otter-glasses">
              <rect x="72" y="78" width="31" height="24" rx="10" />
              <rect x="121" y="76" width="31" height="24" rx="10" />
              <path d="M103 87 C109 84 115 84 121 86 M72 86 L60 82 M152 84 L163 79" />
              <path className="glasses-shine" d="m78 83 8 14m5-14 7 12m36-14 8 14" />
            </g>
          )}
          {equipped.includes("party-hat") && (
            <g className="otter-hat" transform="translate(-6 0)">
              <path d="M88 39 L123 3 L144 47Z" />
              <path d="M101 26 L132 34 M113 14 L138 42" />
              <circle className="hat-dot" cx="118" cy="31" r="3" />
              <circle cx="123" cy="4" r="6" />
            </g>
          )}
          {equipped.includes("bow-tie") && (
            <g className="otter-bow" transform="translate(5 -24)">
              <path d="M105 162C88 148 72 147 70 157v14c5 10 21 4 35-9 14 13 30 19 35 9v-14c-2-10-18-9-35 5Z" />
              <circle cx="105" cy="162" r="8" />
            </g>
          )}
          {showAccessorySlots && !equipped.includes("glasses") && (
            <g className="accessory-placeholder otter-glasses">
              <rect x="72" y="78" width="31" height="24" rx="10" />
              <rect x="121" y="76" width="31" height="24" rx="10" />
              <path d="M103 87 C109 84 115 84 121 86" />
            </g>
          )}
          {showAccessorySlots && !equipped.includes("party-hat") && (
            <path className="accessory-placeholder" d="M82 45 L117 7 L145 48Z" />
          )}
          {showAccessorySlots && !equipped.includes("bow-tie") && (
            <path className="accessory-placeholder" d="M110 143 C92 130 78 133 76 143v12c6 8 21 2 34-9 13 11 28 17 34 9v-12c-2-10-16-13-34 0Z" />
          )}
          <g className="focus-workspace">
            <path className="desk-top" d="M17 169 Q17 163 23 163 H197 Q203 163 203 169 V178 H17Z" />
            <path className="desk-front" d="M25 178 H195 L188 196 H32Z" />
            <path className="desk-leg" d="M39 193 L36 220 M181 193 L184 220" />
            <g className="focus-paper">
              <path d="M84 164 L148 164 L156 175 H76Z" />
              <path className="paper-line line-one" d="M92 168 H134" />
              <path className="paper-line line-two" d="M88 172 H128" />
            </g>
            <g className="focus-arm-resting">
              <g className="otter-limb">
                <path className="limb-outline" d="M60 155.5 L82.5 169 A7 7 0 0 0 91 158 L72 140 A10 10 0 1 0 60 155.5Z" />
                <ellipse className="limb-outline" cx="87.5" cy="164" rx="9.5" ry="8.5" transform="rotate(37 87.5 164)" />
                <path className="limb-fill" d="M60 155.5 L82.5 169 A7 7 0 0 0 91 158 L72 140 A10 10 0 1 0 60 155.5Z" />
                <ellipse className="limb-fill" cx="87.5" cy="164" rx="9.5" ry="8.5" transform="rotate(37 87.5 164)" />
                <path className="otter-toes" d="M92 163.5 L95 166 M88 168.5 L91.5 171" />
              </g>
            </g>
            <g className="focus-scratch-arm">
              <g className="otter-limb">
                <path className="limb-outline" d="M54 147 L55 159.5 A9 9 0 0 0 73 159.5 L74 147 A10 10 0 1 0 54 147Z" />
                <path className="limb-fill" d="M54 147 L55 159.5 A9 9 0 0 0 73 159.5 L74 147 A10 10 0 1 0 54 147Z" />
              </g>
              <g className="otter-limb">
                <path className="limb-outline" d="M73 167.5 L90.5 145.5 A7 7 0 0 0 80.5 135.5 L58.5 153 A10 10 0 1 0 73 167.5Z" />
                <ellipse className="limb-outline" cx="86.5" cy="139.5" rx="9.5" ry="8.5" transform="rotate(-45 86.5 139.5)" />
                <path className="limb-fill" d="M73 167.5 L90.5 145.5 A7 7 0 0 0 80.5 135.5 L58.5 153 A10 10 0 1 0 73 167.5Z" />
                <ellipse className="limb-fill" cx="86.5" cy="139.5" rx="9.5" ry="8.5" transform="rotate(-45 86.5 139.5)" />
                <path className="otter-toes" d="M86.5 135.5 L89 132.5 M90.5 139.5 L93.5 137" />
              </g>
            </g>
            <g className="focus-writing-arm">
              <g className="otter-limb">
                <path className="limb-outline" d="M147.5 140.5 L134.5 155.5 A7 7 0 0 0 143.5 166 L160.5 155.5 A10 10 0 1 0 147.5 140.5Z" />
                <ellipse className="limb-outline" cx="138.5" cy="161.5" rx="9.5" ry="8.5" transform="rotate(139 138.5 161.5)" />
                <path className="limb-fill" d="M147.5 140.5 L134.5 155.5 A7 7 0 0 0 143.5 166 L160.5 155.5 A10 10 0 1 0 147.5 140.5Z" />
                <ellipse className="limb-fill" cx="138.5" cy="161.5" rx="9.5" ry="8.5" transform="rotate(139 138.5 161.5)" />
              </g>
              <g className="focus-pencil">
                <path className="pencil-body" d="M135 170 L146 141" />
                <path className="pencil-tip" d="M133 175 L135 169" />
                <path className="pencil-eraser" d="M146 141 L148 137" />
              </g>
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}

export default Otter;
