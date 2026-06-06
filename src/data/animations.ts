// BlueTrain — SVG animations library

export const ANIMS: Record<string, string> = {

  /* ─── Calentamiento ─── */
  'row-warmup': `<svg class="stick-fig" viewBox="0 0 400 300">
    <line class="floor" x1="40" y1="220" x2="360" y2="220"/>
    <g class="er-body">
      <circle class="head" cx="200" cy="65" r="14"/>
      <line class="body" x1="200" y1="79" x2="200" y2="135"/>
      <line class="body" x1="200" y1="135" x2="180" y2="180"/>
      <line class="body" x1="200" y1="135" x2="220" y2="180"/>
      <line class="body" x1="180" y1="180" x2="180" y2="220"/>
      <line class="body" x1="220" y1="180" x2="220" y2="220"/>
      <g class="er-arm"><line class="body" x1="200" y1="100" x2="260" y2="120"/></g>
    </g>
    <rect x="265" y="115" width="35" height="20" rx="4" fill="#2a2a2a" stroke="#888" stroke-width="2"/>
  </svg>`,

  'cat-cow': `<svg class="stick-fig" viewBox="0 0 400 300">
    <line class="floor" x1="40" y1="220" x2="360" y2="220"/>
    <g class="cc-back">
      <circle class="head" cx="140" cy="140" r="14"/>
      <path class="body" d="M 154 145 Q 200 130 250 145"/>
      <line class="body" x1="155" y1="150" x2="155" y2="200"/>
      <line class="body" x1="250" y1="150" x2="250" y2="200"/>
      <line class="body" x1="155" y1="145" x2="135" y2="195"/>
      <line class="body" x1="250" y1="145" x2="270" y2="195"/>
    </g>
    <path class="motion-line" d="M 200 110 Q 210 90 215 110"/>
  </svg>`,

  'thoracic-opener': `<svg class="stick-fig" viewBox="0 0 400 300">
    <line class="floor" x1="40" y1="220" x2="360" y2="220"/>
    <circle class="head" cx="170" cy="155" r="13"/>
    <path class="body" d="M 184 158 L 250 162"/>
    <line class="body" x1="180" y1="170" x2="180" y2="215"/>
    <line class="body" x1="245" y1="170" x2="245" y2="215"/>
    <line class="body" x1="195" y1="175" x2="195" y2="215"/>
    <line class="body" x1="230" y1="175" x2="230" y2="215"/>
    <line class="body" x1="190" y1="160" x2="160" y2="170"/>
    <g class="tr-rotate"><line class="body" x1="220" y1="160" x2="250" y2="90"/></g>
    <path class="motion-line" d="M 260 90 Q 290 80 305 110"/>
  </svg>`,

  'glute-bridge': `<svg class="stick-fig" viewBox="0 0 400 300">
    <line class="floor" x1="40" y1="220" x2="360" y2="220"/>
    <g class="br-hip">
      <circle class="head" cx="125" cy="190" r="13"/>
      <line class="body" x1="138" y1="190" x2="220" y2="170"/>
      <line class="body" x1="220" y1="170" x2="260" y2="215"/>
      <line class="body" x1="260" y1="215" x2="290" y2="215"/>
    </g>
    <line class="body" x1="125" y1="200" x2="125" y2="215"/>
    <path class="motion-line" d="M 218 160 L 218 145" stroke-width="2"/>
    <text x="220" y="138" fill="#d4ff00" font-size="9" font-family="JetBrains Mono" text-anchor="middle">UP</text>
  </svg>`,

  'world-stretch': `<svg class="stick-fig" viewBox="0 0 400 300">
    <line class="floor" x1="40" y1="220" x2="360" y2="220"/>
    <circle class="head" cx="180" cy="135" r="13"/>
    <line class="body" x1="180" y1="148" x2="230" y2="180"/>
    <line class="body" x1="230" y1="180" x2="260" y2="215"/>
    <line class="body" x1="230" y1="180" x2="200" y2="215"/>
    <line class="body" x1="180" y1="148" x2="150" y2="200"/>
    <g class="tr-rotate"><line class="body" x1="200" y1="155" x2="180" y2="90"/></g>
    <line class="body" x1="195" y1="160" x2="155" y2="200"/>
    <path class="motion-line" d="M 175 80 Q 200 65 220 80"/>
  </svg>`,

  'dead-bug': `<svg class="stick-fig" viewBox="0 0 400 300">
    <line class="floor" x1="40" y1="220" x2="360" y2="220"/>
    <line class="floor" x1="100" y1="180" x2="280" y2="180" stroke-dasharray="2 2"/>
    <ellipse cx="200" cy="178" rx="55" ry="12" fill="#1c1c1c" stroke="#3a3a3a" stroke-width="1"/>
    <circle class="head" cx="148" cy="178" r="11"/>
    <g class="db-al"><line class="body" x1="150" y1="170" x2="125" y2="115"/></g>
    <g class="db-ar"><line class="body" x1="170" y1="170" x2="195" y2="115"/></g>
    <g class="db-ll"><line class="body" x1="230" y1="178" x2="265" y2="125"/></g>
    <g class="db-lr"><line class="body" x1="245" y1="178" x2="275" y2="125"/></g>
  </svg>`,

  'jumping-jacks': `<svg class="stick-fig" viewBox="0 0 400 300">
    <line class="floor" x1="40" y1="220" x2="360" y2="220"/>
    <g class="jj-all">
      <circle class="head" cx="200" cy="70" r="14"/>
      <line class="body" x1="200" y1="84" x2="200" y2="140"/>
      <g class="jj-al"><line class="body" x1="200" y1="95" x2="160" y2="125"/></g>
      <g class="jj-ar"><line class="body" x1="200" y1="95" x2="240" y2="125"/></g>
      <g class="jj-ll"><line class="body" x1="200" y1="140" x2="180" y2="215"/></g>
      <g class="jj-lr"><line class="body" x1="200" y1="140" x2="220" y2="215"/></g>
    </g>
  </svg>`,

  /* ─── Fuerza ─── */
  'back-squat': `<svg class="stick-fig" viewBox="0 0 400 300">
    <line class="floor" x1="40" y1="220" x2="360" y2="220"/>
    <g class="sq-body">
      <circle class="head" cx="200" cy="65" r="14"/>
      <line class="body" x1="200" y1="79" x2="200" y2="140"/>
      <line class="barbell" x1="155" y1="85" x2="245" y2="85"/>
      <circle r="14" cx="155" cy="85" class="weight"/>
      <circle r="14" cx="245" cy="85" class="weight"/>
      <line class="body" x1="200" y1="140" x2="180" y2="180"/>
      <line class="body" x1="200" y1="140" x2="220" y2="180"/>
      <line class="body" x1="180" y1="180" x2="180" y2="220"/>
      <line class="body" x1="220" y1="180" x2="220" y2="220"/>
      <line class="body" x1="200" y1="95" x2="170" y2="85"/>
      <line class="body" x1="200" y1="95" x2="230" y2="85"/>
    </g>
  </svg>`,

  'plank-rkc': `<svg class="stick-fig" viewBox="0 0 400 300">
    <line class="floor" x1="40" y1="220" x2="360" y2="220"/>
    <g class="plank-body">
      <line class="body" x1="105" y1="180" x2="280" y2="180"/>
      <circle class="head" cx="105" cy="175" r="11"/>
      <line class="body" x1="115" y1="180" x2="115" y2="215"/>
      <line class="body" x1="115" y1="215" x2="135" y2="215"/>
      <line class="body" x1="280" y1="180" x2="285" y2="215"/>
      <line class="body" x1="270" y1="180" x2="275" y2="215"/>
    </g>
  </svg>`,

  'bulgarian-split': `<svg class="stick-fig" viewBox="0 0 400 300">
    <line class="floor" x1="40" y1="220" x2="360" y2="220"/>
    <rect x="265" y="180" width="60" height="6" class="equipment" rx="2"/>
    <line class="body" x1="265" y1="186" x2="270" y2="215" stroke-width="2" stroke="#888"/>
    <line class="body" x1="320" y1="186" x2="320" y2="215" stroke-width="2" stroke="#888"/>
    <g class="bg-body">
      <circle class="head" cx="180" cy="80" r="13"/>
      <line class="body" x1="180" y1="93" x2="180" y2="155"/>
      <line class="body" x1="180" y1="100" x2="155" y2="135"/>
      <line class="body" x1="180" y1="100" x2="205" y2="135"/>
      <line class="body" x1="180" y1="155" x2="180" y2="215"/>
      <line class="body" x1="180" y1="155" x2="275" y2="175"/>
    </g>
    <circle r="8" cx="155" cy="135" class="weight"/>
    <circle r="8" cx="205" cy="135" class="weight"/>
  </svg>`,

  'pallof-press': `<svg class="stick-fig" viewBox="0 0 400 300">
    <line class="floor" x1="40" y1="220" x2="360" y2="220"/>
    <rect x="60" y="120" width="6" height="80" class="equipment"/>
    <circle class="head" cx="200" cy="80" r="14"/>
    <line class="body" x1="200" y1="94" x2="200" y2="160"/>
    <line class="body" x1="200" y1="160" x2="180" y2="215"/>
    <line class="body" x1="200" y1="160" x2="220" y2="215"/>
    <g class="pa-arms">
      <line class="body" x1="200" y1="110" x2="135" y2="135"/>
      <line class="body" x1="135" y1="135" x2="66" y2="135"/>
    </g>
    <path class="motion-line" d="M 240 110 L 280 110"/>
    <text x="290" y="115" fill="#d4ff00" font-size="9" font-family="JetBrains Mono">PRESS</text>
  </svg>`,

  'farmer-carry': `<svg class="stick-fig" viewBox="0 0 400 300">
    <line class="floor" x1="40" y1="220" x2="360" y2="220"/>
    <g class="fc-body">
      <circle class="head" cx="200" cy="65" r="14"/>
      <line class="body" x1="200" y1="79" x2="200" y2="140"/>
      <line class="body" x1="200" y1="90" x2="155" y2="130"/>
      <line class="body" x1="200" y1="90" x2="245" y2="130"/>
      <g class="fc-ll"><line class="body" x1="200" y1="140" x2="185" y2="215"/></g>
      <g class="fc-lr"><line class="body" x1="200" y1="140" x2="215" y2="215"/></g>
    </g>
    <rect x="135" y="125" width="40" height="22" rx="3" class="weight"/>
    <rect x="225" y="125" width="40" height="22" rx="3" class="weight"/>
    <line x1="155" y1="125" x2="155" y2="115" stroke="#888" stroke-width="2"/>
    <line x1="245" y1="125" x2="245" y2="115" stroke="#888" stroke-width="2"/>
  </svg>`,

  'deadlift': `<svg class="stick-fig" viewBox="0 0 400 300">
    <line class="floor" x1="40" y1="220" x2="360" y2="220"/>
    <g class="dl-body">
      <circle class="head" cx="200" cy="75" r="14"/>
      <line class="body" x1="200" y1="89" x2="200" y2="160"/>
      <line class="body" x1="200" y1="160" x2="175" y2="215"/>
      <line class="body" x1="200" y1="160" x2="225" y2="215"/>
      <line class="body" x1="200" y1="100" x2="180" y2="155"/>
      <line class="body" x1="200" y1="100" x2="220" y2="155"/>
    </g>
    <g class="dl-bar">
      <line class="barbell" x1="140" y1="155" x2="260" y2="155"/>
      <circle r="16" cx="140" cy="155" class="weight"/>
      <circle r="16" cx="260" cy="155" class="weight"/>
    </g>
  </svg>`,

  'hollow-hold': `<svg class="stick-fig" viewBox="0 0 400 300">
    <line class="floor" x1="40" y1="220" x2="360" y2="220"/>
    <g class="ho-body">
      <circle class="head" cx="120" cy="155" r="12"/>
      <path class="body" d="M 132 155 Q 200 130 280 145"/>
      <line class="body" x1="132" y1="148" x2="100" y2="120"/>
      <line class="body" x1="280" y1="145" x2="320" y2="115"/>
    </g>
  </svg>`,

  'pull-up': `<svg class="stick-fig" viewBox="0 0 400 300">
    <line x1="120" y1="50" x2="280" y2="50" stroke="#888" stroke-width="4"/>
    <line x1="120" y1="50" x2="120" y2="35" stroke="#888" stroke-width="3"/>
    <line x1="280" y1="50" x2="280" y2="35" stroke="#888" stroke-width="3"/>
    <g class="pu-body">
      <circle class="head" cx="200" cy="92" r="13"/>
      <line class="body" x1="200" y1="105" x2="200" y2="170"/>
      <line class="body" x1="200" y1="105" x2="170" y2="55"/>
      <line class="body" x1="200" y1="105" x2="230" y2="55"/>
      <line class="body" x1="200" y1="170" x2="190" y2="210"/>
      <line class="body" x1="200" y1="170" x2="210" y2="210"/>
    </g>
  </svg>`,

  'db-row': `<svg class="stick-fig" viewBox="0 0 400 300">
    <line class="floor" x1="40" y1="220" x2="360" y2="220"/>
    <rect x="80" y="155" width="120" height="10" class="equipment"/>
    <line x1="100" y1="165" x2="100" y2="215" stroke="#888" stroke-width="3"/>
    <line x1="180" y1="165" x2="180" y2="215" stroke="#888" stroke-width="3"/>
    <circle class="head" cx="155" cy="135" r="12"/>
    <path class="body" d="M 167 138 Q 220 135 270 138"/>
    <line class="body" x1="155" y1="145" x2="155" y2="155"/>
    <line class="body" x1="270" y1="138" x2="280" y2="215"/>
    <line class="body" x1="240" y1="138" x2="240" y2="155"/>
    <g class="rw-arm">
      <line class="body" x1="200" y1="140" x2="220" y2="170"/>
      <rect x="210" y="167" width="22" height="35" rx="2" class="rw-weight weight"/>
    </g>
  </svg>`,

  'hammer-curl': `<svg class="stick-fig" viewBox="0 0 400 300">
    <line class="floor" x1="40" y1="220" x2="360" y2="220"/>
    <circle class="head" cx="200" cy="65" r="14"/>
    <line class="body" x1="200" y1="79" x2="200" y2="160"/>
    <line class="body" x1="200" y1="160" x2="185" y2="215"/>
    <line class="body" x1="200" y1="160" x2="215" y2="215"/>
    <line class="body" x1="200" y1="100" x2="160" y2="135"/>
    <g class="cu-arm">
      <line class="body" x1="200" y1="100" x2="240" y2="135"/>
      <rect x="232" y="132" width="20" height="35" rx="2" class="weight"/>
    </g>
    <rect x="148" y="132" width="20" height="35" rx="2" class="weight"/>
  </svg>`,

  'tricep-extension': `<svg class="stick-fig" viewBox="0 0 400 300">
    <line class="floor" x1="40" y1="220" x2="360" y2="220"/>
    <circle class="head" cx="200" cy="80" r="14"/>
    <line class="body" x1="200" y1="94" x2="200" y2="170"/>
    <line class="body" x1="200" y1="170" x2="185" y2="215"/>
    <line class="body" x1="200" y1="170" x2="215" y2="215"/>
    <g class="tr-arm">
      <line class="body" x1="200" y1="105" x2="200" y2="55"/>
      <rect x="190" y="35" width="22" height="22" rx="2" class="weight"/>
    </g>
  </svg>`,

  /* ─── Competición ─── */
  'wall-ball': `<svg class="stick-fig" viewBox="0 0 400 300">
    <line class="floor" x1="40" y1="220" x2="360" y2="220"/>
    <line x1="320" y1="40" x2="320" y2="220" stroke="#888" stroke-width="3"/>
    <circle cx="320" cy="65" r="10" fill="none" stroke="#d4ff00" stroke-width="2"/>
    <g class="wb-body">
      <circle class="head" cx="200" cy="80" r="14"/>
      <line class="body" x1="200" y1="94" x2="200" y2="150"/>
      <line class="body" x1="200" y1="150" x2="180" y2="190"/>
      <line class="body" x1="200" y1="150" x2="220" y2="190"/>
      <line class="body" x1="180" y1="190" x2="180" y2="220"/>
      <line class="body" x1="220" y1="190" x2="220" y2="220"/>
      <line class="body" x1="200" y1="105" x2="225" y2="80"/>
      <line class="body" x1="200" y1="105" x2="175" y2="80"/>
    </g>
    <g class="wb-ball"><circle cx="230" cy="60" r="12" fill="#d4ff00" opacity="0.85"/></g>
  </svg>`,

  'burpee': `<svg class="stick-fig" viewBox="0 0 400 300">
    <line class="floor" x1="40" y1="220" x2="360" y2="220"/>
    <g class="bp-body">
      <circle class="head" cx="200" cy="65" r="14"/>
      <line class="body" x1="200" y1="79" x2="200" y2="140"/>
      <line class="body" x1="200" y1="95" x2="170" y2="115"/>
      <line class="body" x1="200" y1="95" x2="230" y2="115"/>
      <line class="body" x1="200" y1="140" x2="180" y2="180"/>
      <line class="body" x1="200" y1="140" x2="220" y2="180"/>
      <line class="body" x1="180" y1="180" x2="180" y2="215"/>
      <line class="body" x1="220" y1="180" x2="220" y2="215"/>
    </g>
    <path class="motion-line" d="M 100 195 Q 200 175 300 195" stroke-dasharray="2 2"/>
  </svg>`,

  'running': `<svg class="stick-fig" viewBox="0 0 400 300">
    <line class="floor" x1="40" y1="220" x2="360" y2="220"/>
    <g class="ru-body">
      <circle class="head" cx="200" cy="65" r="14"/>
      <line class="body" x1="200" y1="79" x2="200" y2="135"/>
      <g class="ru-af"><line class="body" x1="200" y1="90" x2="200" y2="125"/></g>
      <g class="ru-ab"><line class="body" x1="200" y1="90" x2="200" y2="125"/></g>
      <g class="ru-lf"><line class="body" x1="200" y1="135" x2="200" y2="200"/></g>
      <g class="ru-lb"><line class="body" x1="200" y1="135" x2="200" y2="200"/></g>
    </g>
    <path class="motion-line" d="M 80 110 L 130 110 M 100 130 L 140 130 M 70 90 L 120 90"/>
  </svg>`,

  'kb-swing': `<svg class="stick-fig" viewBox="0 0 400 300">
    <line class="floor" x1="40" y1="220" x2="360" y2="220"/>
    <g class="kb-body">
      <circle class="head" cx="200" cy="75" r="14"/>
      <line class="body" x1="200" y1="89" x2="200" y2="150"/>
      <line class="body" x1="200" y1="150" x2="180" y2="190"/>
      <line class="body" x1="200" y1="150" x2="220" y2="190"/>
      <line class="body" x1="180" y1="190" x2="180" y2="220"/>
      <line class="body" x1="220" y1="190" x2="220" y2="220"/>
    </g>
    <g class="kb-arms">
      <line class="body" x1="200" y1="100" x2="200" y2="160"/>
      <circle cx="200" cy="170" r="14" class="weight"/>
      <line x1="195" y1="155" x2="190" y2="160" stroke="#888" stroke-width="2"/>
      <line x1="205" y1="155" x2="210" y2="160" stroke="#888" stroke-width="2"/>
    </g>
  </svg>`,

  'mountain-climber': `<svg class="stick-fig" viewBox="0 0 400 300">
    <line class="floor" x1="40" y1="220" x2="360" y2="220"/>
    <line class="body" x1="105" y1="170" x2="280" y2="170"/>
    <circle class="head" cx="105" cy="165" r="11"/>
    <line class="body" x1="115" y1="170" x2="115" y2="215"/>
    <line class="body" x1="280" y1="170" x2="285" y2="215"/>
    <g class="mc-ll"><line class="body" x1="280" y1="170" x2="220" y2="220"/></g>
    <g class="mc-lr"><line class="body" x1="280" y1="170" x2="270" y2="215"/></g>
  </svg>`,

  'walking-lunges': `<svg class="stick-fig" viewBox="0 0 400 300">
    <line class="floor" x1="40" y1="220" x2="360" y2="220"/>
    <g class="lg-body">
      <circle class="head" cx="200" cy="80" r="14"/>
      <line class="body" x1="200" y1="94" x2="200" y2="155"/>
      <line class="body" x1="200" y1="100" x2="160" y2="145"/>
      <line class="body" x1="200" y1="100" x2="240" y2="145"/>
      <line class="body" x1="200" y1="155" x2="245" y2="180"/>
      <line class="body" x1="245" y1="180" x2="265" y2="215"/>
      <line class="body" x1="200" y1="155" x2="155" y2="215"/>
    </g>
    <rect x="148" y="142" width="22" height="30" rx="3" class="weight"/>
    <rect x="232" y="142" width="22" height="30" rx="3" class="weight"/>
  </svg>`,

  'renegade-row': `<svg class="stick-fig" viewBox="0 0 400 300">
    <line class="floor" x1="40" y1="220" x2="360" y2="220"/>
    <line class="body" x1="105" y1="175" x2="280" y2="175"/>
    <circle class="head" cx="105" cy="170" r="11"/>
    <line class="body" x1="115" y1="175" x2="115" y2="215"/>
    <line class="body" x1="280" y1="175" x2="290" y2="215"/>
    <line class="body" x1="155" y1="175" x2="155" y2="215"/>
    <rect x="100" y="208" width="30" height="14" rx="2" class="weight"/>
    <g class="rr-arm">
      <line class="body" x1="220" y1="175" x2="220" y2="140"/>
      <rect x="207" y="130" width="30" height="14" rx="2" class="weight"/>
    </g>
  </svg>`,

  'burpee-broad': `<svg class="stick-fig" viewBox="0 0 400 300">
    <line class="floor" x1="40" y1="220" x2="360" y2="220"/>
    <g class="bbj-all">
      <circle class="head" cx="200" cy="70" r="14"/>
      <line class="body" x1="200" y1="84" x2="200" y2="140"/>
      <line class="body" x1="200" y1="95" x2="175" y2="110"/>
      <line class="body" x1="200" y1="95" x2="225" y2="110"/>
      <line class="body" x1="200" y1="140" x2="180" y2="180"/>
      <line class="body" x1="200" y1="140" x2="220" y2="180"/>
      <line class="body" x1="180" y1="180" x2="180" y2="215"/>
      <line class="body" x1="220" y1="180" x2="220" y2="215"/>
    </g>
    <path class="motion-line" d="M 100 200 Q 200 140 320 200" stroke-dasharray="3 3"/>
  </svg>`,

  'sled-push': `<svg class="stick-fig" viewBox="0 0 400 300">
    <line class="floor" x1="40" y1="220" x2="360" y2="220"/>
    <g class="sl-all">
      <rect x="60" y="180" width="60" height="40" rx="3" class="weight"/>
      <line x1="120" y1="190" x2="170" y2="160" stroke="#888" stroke-width="4"/>
      <line x1="120" y1="210" x2="170" y2="180" stroke="#888" stroke-width="4"/>
      <line x1="170" y1="160" x2="170" y2="180" stroke="#888" stroke-width="4"/>
      <circle class="head" cx="200" cy="90" r="13"/>
      <line class="body" x1="208" y1="100" x2="245" y2="160"/>
      <line class="body" x1="245" y1="160" x2="230" y2="215"/>
      <line class="body" x1="245" y1="160" x2="270" y2="215"/>
      <line class="body" x1="205" y1="103" x2="170" y2="170"/>
      <line class="body" x1="215" y1="100" x2="175" y2="165"/>
    </g>
    <path class="motion-line" d="M 100 145 L 60 145"/>
  </svg>`,

  'sled-pull': `<svg class="stick-fig" viewBox="0 0 400 300">
    <line class="floor" x1="40" y1="220" x2="360" y2="220"/>
    <rect x="280" y="185" width="55" height="35" rx="3" class="weight"/>
    <line x1="200" y1="140" x2="280" y2="195" stroke="#888" stroke-width="2" stroke-dasharray="4 3"/>
    <circle class="head" cx="170" cy="90" r="13"/>
    <line class="body" x1="170" y1="103" x2="160" y2="160"/>
    <line class="body" x1="160" y1="160" x2="145" y2="215"/>
    <line class="body" x1="160" y1="160" x2="175" y2="215"/>
    <line class="body" x1="170" y1="115" x2="200" y2="135"/>
    <line class="body" x1="170" y1="115" x2="200" y2="145"/>
    <path class="motion-line" d="M 95 140 L 60 140"/>
  </svg>`,

  'ski-erg': `<svg class="stick-fig" viewBox="0 0 400 300">
    <line class="floor" x1="40" y1="220" x2="360" y2="220"/>
    <rect x="180" y="40" width="40" height="30" rx="3" class="equipment"/>
    <line x1="190" y1="70" x2="190" y2="115" stroke="#888" stroke-width="1.5" stroke-dasharray="3 3"/>
    <line x1="210" y1="70" x2="210" y2="115" stroke="#888" stroke-width="1.5" stroke-dasharray="3 3"/>
    <g class="sk-body">
      <circle class="head" cx="200" cy="85" r="13"/>
      <line class="body" x1="200" y1="98" x2="200" y2="155"/>
      <line class="body" x1="200" y1="155" x2="180" y2="195"/>
      <line class="body" x1="200" y1="155" x2="220" y2="195"/>
      <line class="body" x1="180" y1="195" x2="180" y2="220"/>
      <line class="body" x1="220" y1="195" x2="220" y2="220"/>
      <g class="sk-arms">
        <line class="body" x1="195" y1="100" x2="195" y2="155"/>
        <line class="body" x1="205" y1="100" x2="205" y2="155"/>
      </g>
    </g>
  </svg>`,

  /* ─── Cooldown ─── */
  'pigeon-pose': `<svg class="stick-fig" viewBox="0 0 400 300">
    <line class="floor" x1="40" y1="220" x2="360" y2="220"/>
    <g class="stretch">
      <circle class="head" cx="150" cy="145" r="13"/>
      <path class="body" d="M 162 150 Q 220 145 270 150"/>
      <line class="body" x1="160" y1="158" x2="135" y2="215"/>
      <line class="body" x1="270" y1="150" x2="335" y2="215"/>
      <path class="body" d="M 195 160 Q 220 175 265 195"/>
      <line class="body" x1="150" y1="158" x2="125" y2="215"/>
    </g>
  </svg>`,

  'child-pose': `<svg class="stick-fig" viewBox="0 0 400 300">
    <line class="floor" x1="40" y1="220" x2="360" y2="220"/>
    <g class="stretch">
      <circle class="head" cx="155" cy="195" r="13"/>
      <path class="body" d="M 168 195 Q 230 175 280 195"/>
      <line class="body" x1="168" y1="195" x2="105" y2="180"/>
      <line class="body" x1="280" y1="195" x2="280" y2="215"/>
      <line class="body" x1="260" y1="195" x2="260" y2="215"/>
    </g>
  </svg>`,

  'hamstring-stretch': `<svg class="stick-fig" viewBox="0 0 400 300">
    <line class="floor" x1="40" y1="220" x2="360" y2="220"/>
    <g class="stretch">
      <circle class="head" cx="120" cy="200" r="13"/>
      <line class="body" x1="133" y1="200" x2="240" y2="200"/>
      <line class="body" x1="240" y1="200" x2="280" y2="100"/>
      <line class="body" x1="240" y1="200" x2="280" y2="215"/>
      <line class="body" x1="240" y1="200" x2="295" y2="115"/>
      <line class="body" x1="180" y1="200" x2="225" y2="135"/>
      <path class="motion-line" d="M 295 115 L 285 100"/>
    </g>
  </svg>`,

  'breathing': `<svg class="stick-fig" viewBox="0 0 400 300">
    <line class="floor" x1="40" y1="220" x2="360" y2="220"/>
    <circle class="head" cx="200" cy="80" r="14"/>
    <line class="body" x1="200" y1="94" x2="200" y2="160"/>
    <line class="body" x1="200" y1="160" x2="180" y2="215"/>
    <line class="body" x1="200" y1="160" x2="220" y2="215"/>
    <line class="body" x1="200" y1="110" x2="170" y2="155"/>
    <line class="body" x1="200" y1="110" x2="230" y2="155"/>
    <circle class="br-circle" cx="200" cy="135" r="20" fill="none" stroke="#d4ff00" stroke-width="2" opacity="0.6"/>
    <text x="200" y="55" fill="#d4ff00" font-size="10" font-family="JetBrains Mono" text-anchor="middle">4-7-8</text>
  </svg>`,

  'ninety-ninety': `<svg class="stick-fig" viewBox="0 0 400 300">
    <line class="floor" x1="40" y1="220" x2="360" y2="220"/>
    <g class="stretch">
      <circle class="head" cx="200" cy="95" r="14"/>
      <line class="body" x1="200" y1="109" x2="200" y2="170"/>
      <line class="body" x1="200" y1="120" x2="180" y2="160"/>
      <line class="body" x1="200" y1="120" x2="220" y2="160"/>
      <line class="body" x1="200" y1="170" x2="140" y2="170"/>
      <line class="body" x1="140" y1="170" x2="140" y2="215"/>
      <line class="body" x1="200" y1="170" x2="260" y2="170"/>
      <line class="body" x1="260" y1="170" x2="260" y2="215"/>
    </g>
  </svg>`,

  'doorway-pec': `<svg class="stick-fig" viewBox="0 0 400 300">
    <line class="floor" x1="40" y1="220" x2="360" y2="220"/>
    <line x1="100" y1="40" x2="100" y2="220" stroke="#888" stroke-width="4"/>
    <g class="stretch">
      <circle class="head" cx="180" cy="85" r="14"/>
      <line class="body" x1="180" y1="99" x2="180" y2="160"/>
      <line class="body" x1="180" y1="105" x2="100" y2="100"/>
      <line class="body" x1="180" y1="105" x2="200" y2="160"/>
      <line class="body" x1="180" y1="160" x2="170" y2="215"/>
      <line class="body" x1="180" y1="160" x2="190" y2="215"/>
    </g>
  </svg>`,

  'lat-stretch': `<svg class="stick-fig" viewBox="0 0 400 300">
    <line x1="100" y1="60" x2="300" y2="60" stroke="#888" stroke-width="4"/>
    <g class="stretch">
      <line class="body" x1="200" y1="105" x2="180" y2="65"/>
      <line class="body" x1="200" y1="105" x2="220" y2="65"/>
      <circle class="head" cx="195" cy="118" r="13"/>
      <path class="body" d="M 200 130 Q 195 165 200 185"/>
      <line class="body" x1="200" y1="185" x2="185" y2="240"/>
      <line class="body" x1="200" y1="185" x2="215" y2="240"/>
    </g>
  </svg>`,

  'supine-twist': `<svg class="stick-fig" viewBox="0 0 400 300">
    <line class="floor" x1="40" y1="220" x2="360" y2="220"/>
    <g class="stretch">
      <circle class="head" cx="120" cy="170" r="12"/>
      <line class="body" x1="132" y1="170" x2="220" y2="170"/>
      <line class="body" x1="132" y1="170" x2="100" y2="195"/>
      <line class="body" x1="132" y1="170" x2="100" y2="145"/>
      <line class="body" x1="220" y1="170" x2="260" y2="120"/>
      <line class="body" x1="260" y1="120" x2="290" y2="180"/>
    </g>
  </svg>`,

  /* ─── Extras ─── */
  'ski-erg-warm': `<svg class="stick-fig" viewBox="0 0 400 300">
    <line class="floor" x1="40" y1="220" x2="360" y2="220"/>
    <rect x="180" y="40" width="40" height="30" rx="3" class="equipment"/>
    <line x1="200" y1="70" x2="200" y2="130" stroke="#888" stroke-width="2" stroke-dasharray="3 3"/>
    <g class="sk-body">
      <circle class="head" cx="200" cy="95" r="13"/>
      <line class="body" x1="200" y1="108" x2="200" y2="170"/>
      <line class="body" x1="200" y1="170" x2="180" y2="215"/>
      <line class="body" x1="200" y1="170" x2="220" y2="215"/>
      <g class="sk-arms"><line class="body" x1="200" y1="110" x2="200" y2="155"/></g>
    </g>
  </svg>`,

  'band-pull-apart': `<svg class="stick-fig" viewBox="0 0 400 300">
    <line class="floor" x1="40" y1="220" x2="360" y2="220"/>
    <circle class="head" cx="200" cy="75" r="14"/>
    <line class="body" x1="200" y1="89" x2="200" y2="160"/>
    <line class="body" x1="200" y1="160" x2="180" y2="215"/>
    <line class="body" x1="200" y1="160" x2="220" y2="215"/>
    <line class="body" x1="200" y1="100" x2="160" y2="125"/>
    <line class="body" x1="200" y1="100" x2="240" y2="125"/>
    <g class="ba-band">
      <line x1="160" y1="125" x2="240" y2="125" stroke="#d4ff00" stroke-width="3"/>
    </g>
  </svg>`,

  'scap-pullup': `<svg class="stick-fig" viewBox="0 0 400 300">
    <line x1="120" y1="50" x2="280" y2="50" stroke="#888" stroke-width="4"/>
    <g class="sc-body">
      <circle class="head" cx="200" cy="100" r="13"/>
      <line class="body" x1="200" y1="113" x2="200" y2="175"/>
      <line class="body" x1="200" y1="113" x2="170" y2="55"/>
      <line class="body" x1="200" y1="113" x2="230" y2="55"/>
      <line class="body" x1="200" y1="175" x2="190" y2="215"/>
      <line class="body" x1="200" y1="175" x2="210" y2="215"/>
    </g>
  </svg>`,

  'ytw-prone': `<svg class="stick-fig" viewBox="0 0 400 300">
    <line class="floor" x1="40" y1="220" x2="360" y2="220"/>
    <line class="body" x1="100" y1="180" x2="280" y2="180"/>
    <circle class="head" cx="100" cy="175" r="11"/>
    <line class="body" x1="280" y1="180" x2="295" y2="215"/>
    <line class="body" x1="280" y1="180" x2="305" y2="215"/>
    <g class="ytw-arms">
      <line class="body" x1="155" y1="180" x2="115" y2="140"/>
      <line class="body" x1="155" y1="180" x2="100" y2="140"/>
    </g>
  </svg>`,

  'bird-dog': `<svg class="stick-fig" viewBox="0 0 400 300">
    <line class="floor" x1="40" y1="220" x2="360" y2="220"/>
    <line class="body" x1="150" y1="175" x2="250" y2="175"/>
    <circle class="head" cx="138" cy="165" r="11"/>
    <line class="body" x1="150" y1="175" x2="150" y2="215"/>
    <line class="body" x1="250" y1="175" x2="250" y2="215"/>
    <line class="body" x1="175" y1="175" x2="175" y2="215"/>
    <line class="body" x1="225" y1="175" x2="225" y2="215"/>
    <g class="bd-arm-a"><line class="body" x1="150" y1="175" x2="105" y2="130"/></g>
    <g class="bd-leg-a"><line class="body" x1="250" y1="175" x2="305" y2="130"/></g>
  </svg>`,

  'push-up-dog': `<svg class="stick-fig" viewBox="0 0 400 300">
    <line class="floor" x1="40" y1="220" x2="360" y2="220"/>
    <g class="pud-body">
      <circle class="head" cx="180" cy="155" r="11"/>
      <path class="body" d="M 192 158 Q 240 145 280 155"/>
      <line class="body" x1="190" y1="165" x2="170" y2="215"/>
      <line class="body" x1="280" y1="155" x2="305" y2="215"/>
      <line class="body" x1="280" y1="155" x2="280" y2="215"/>
    </g>
  </svg>`,

  'goblet-squat': `<svg class="stick-fig" viewBox="0 0 400 300">
    <line class="floor" x1="40" y1="220" x2="360" y2="220"/>
    <g class="gob-body">
      <circle class="head" cx="200" cy="75" r="14"/>
      <line class="body" x1="200" y1="89" x2="200" y2="155"/>
      <line class="body" x1="200" y1="155" x2="180" y2="195"/>
      <line class="body" x1="200" y1="155" x2="220" y2="195"/>
      <line class="body" x1="180" y1="195" x2="180" y2="220"/>
      <line class="body" x1="220" y1="195" x2="220" y2="220"/>
      <line class="body" x1="200" y1="100" x2="190" y2="125"/>
      <line class="body" x1="200" y1="100" x2="210" y2="125"/>
      <rect x="185" y="115" width="30" height="20" rx="2" class="weight"/>
    </g>
  </svg>`,

  't-pushup': `<svg class="stick-fig" viewBox="0 0 400 300">
    <line class="floor" x1="40" y1="220" x2="360" y2="220"/>
    <line class="body" x1="120" y1="175" x2="280" y2="175"/>
    <circle class="head" cx="115" cy="165" r="11"/>
    <line class="body" x1="280" y1="175" x2="285" y2="215"/>
    <line class="body" x1="280" y1="175" x2="295" y2="215"/>
    <line class="body" x1="125" y1="175" x2="125" y2="215"/>
    <g class="bd-arm-a"><line class="body" x1="200" y1="175" x2="220" y2="100"/></g>
    <text x="240" y="105" fill="#d4ff00" font-size="10" font-family="JetBrains Mono">↑ T</text>
  </svg>`,

  'sl-deadlift': `<svg class="stick-fig" viewBox="0 0 400 300">
    <line class="floor" x1="40" y1="220" x2="360" y2="220"/>
    <g class="sld-body">
      <circle class="head" cx="200" cy="80" r="14"/>
      <line class="body" x1="200" y1="94" x2="200" y2="155"/>
      <line class="body" x1="200" y1="105" x2="195" y2="150"/>
      <line class="body" x1="200" y1="105" x2="205" y2="150"/>
      <rect x="180" y="145" width="40" height="14" rx="2" class="weight"/>
      <line class="body" x1="200" y1="155" x2="260" y2="160"/>
    </g>
    <line class="body" x1="200" y1="155" x2="200" y2="215"/>
  </svg>`,

  'suitcase-carry': `<svg class="stick-fig" viewBox="0 0 400 300">
    <line class="floor" x1="40" y1="220" x2="360" y2="220"/>
    <g class="sc-body">
      <circle class="head" cx="200" cy="65" r="14"/>
      <line class="body" x1="200" y1="79" x2="195" y2="140"/>
      <line class="body" x1="200" y1="92" x2="175" y2="135"/>
      <line class="body" x1="200" y1="92" x2="240" y2="140"/>
      <line class="body" x1="195" y1="140" x2="180" y2="215"/>
      <line class="body" x1="195" y1="140" x2="210" y2="215"/>
    </g>
    <rect x="225" y="135" width="35" height="25" rx="3" class="weight"/>
    <line x1="240" y1="135" x2="240" y2="125" stroke="#888" stroke-width="2"/>
    <text x="155" y="125" fill="#d4ff00" font-size="9" font-family="JetBrains Mono">CORE</text>
  </svg>`,

  'squat-jump': `<svg class="stick-fig" viewBox="0 0 400 300">
    <line class="floor" x1="40" y1="220" x2="360" y2="220"/>
    <g class="sqj-body">
      <circle class="head" cx="200" cy="65" r="14"/>
      <line class="body" x1="200" y1="79" x2="200" y2="140"/>
      <line class="body" x1="200" y1="90" x2="170" y2="115"/>
      <line class="body" x1="200" y1="90" x2="230" y2="115"/>
      <line class="body" x1="200" y1="140" x2="180" y2="180"/>
      <line class="body" x1="200" y1="140" x2="220" y2="180"/>
      <line class="body" x1="180" y1="180" x2="180" y2="215"/>
      <line class="body" x1="220" y1="180" x2="220" y2="215"/>
    </g>
    <path class="motion-line" d="M 160 50 L 160 30 M 240 50 L 240 30 M 200 40 L 200 20"/>
  </svg>`,

  'row-machine': `<svg class="stick-fig" viewBox="0 0 400 300">
    <line class="floor" x1="40" y1="220" x2="360" y2="220"/>
    <rect x="60" y="200" width="280" height="8" rx="3" class="equipment"/>
    <rect x="285" y="115" width="40" height="60" rx="4" class="equipment"/>
    <g class="er-body">
      <circle class="head" cx="180" cy="100" r="13"/>
      <line class="body" x1="180" y1="113" x2="190" y2="170"/>
      <line class="body" x1="190" y1="170" x2="230" y2="180"/>
      <line class="body" x1="230" y1="180" x2="260" y2="200"/>
      <g class="er-arm"><line class="body" x1="180" y1="115" x2="265" y2="140"/></g>
    </g>
    <line x1="265" y1="140" x2="285" y2="145" stroke="#888" stroke-width="2" stroke-dasharray="2 2"/>
  </svg>`,

  'jump-rope': `<svg class="stick-fig" viewBox="0 0 400 300">
    <line class="floor" x1="40" y1="220" x2="360" y2="220"/>
    <g class="jr-body">
      <circle class="head" cx="200" cy="75" r="14"/>
      <line class="body" x1="200" y1="89" x2="200" y2="155"/>
      <line class="body" x1="200" y1="100" x2="175" y2="135"/>
      <line class="body" x1="200" y1="100" x2="225" y2="135"/>
      <line class="body" x1="200" y1="155" x2="180" y2="210"/>
      <line class="body" x1="200" y1="155" x2="220" y2="210"/>
    </g>
    <g class="jr-rope">
      <ellipse cx="200" cy="155" rx="50" ry="80" fill="none" stroke="#d4ff00" stroke-width="1.5" opacity="0.7"/>
    </g>
  </svg>`,

  /* ─── Fallback genérico ─── */
  'generic': `<svg class="stick-fig" viewBox="0 0 400 300">
    <line class="floor" x1="40" y1="220" x2="360" y2="220"/>
    <g class="stretch">
      <circle class="head" cx="200" cy="75" r="14"/>
      <line class="body" x1="200" y1="89" x2="200" y2="155"/>
      <line class="body" x1="200" y1="100" x2="170" y2="140"/>
      <line class="body" x1="200" y1="100" x2="230" y2="140"/>
      <line class="body" x1="200" y1="155" x2="180" y2="215"/>
      <line class="body" x1="200" y1="155" x2="220" y2="215"/>
    </g>
  </svg>`

};
