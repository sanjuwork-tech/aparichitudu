interface Props {
  opacity?: number;
  className?: string;
}

export function GarudaSilhouette({ opacity = 0.07, className = "" }: Props) {
  return (
    <svg
      viewBox="0 0 800 900"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ color: `rgba(201,168,76,${opacity})` }}
      aria-hidden
    >
      {/* ── LEFT WING – primary feather mass ── */}
      <path d="M390,310 C340,290 270,240 200,190 C140,148 80,110 20,70
               C45,120 65,175 90,218 C115,262 135,295 158,325
               C180,355 200,380 220,400 L360,370 Z" />
      {/* Left wing – secondary layer */}
      <path d="M375,360 C310,340 240,300 165,265 C100,235 40,210 -20,175
               C5,225 30,270 58,308 C86,346 110,375 138,400
               C162,422 188,445 210,460 L355,415 Z" />
      {/* Left wing – tertiary / lower */}
      <path d="M360,415 C290,405 215,385 145,365 C80,348 25,335 -30,310
               C0,355 25,390 55,420 C85,450 115,475 148,498
               L340,465 Z" />
      {/* Left inner wing feathers */}
      <path d="M385,330 C360,318 325,300 295,285 C265,270 235,258 205,245" strokeWidth="4" stroke="currentColor" fill="none" opacity="0.6"/>
      <path d="M375,365 C345,352 310,338 278,325 C248,312 218,302 185,292" strokeWidth="3" stroke="currentColor" fill="none" opacity="0.5"/>
      <path d="M362,400 C330,390 296,378 264,367 C234,357 205,350 172,342" strokeWidth="3" stroke="currentColor" fill="none" opacity="0.4"/>

      {/* ── RIGHT WING – mirror ── */}
      <path d="M410,310 C460,290 530,240 600,190 C660,148 720,110 780,70
               C755,120 735,175 710,218 C685,262 665,295 642,325
               C620,355 600,380 580,400 L440,370 Z" />
      <path d="M425,360 C490,340 560,300 635,265 C700,235 760,210 820,175
               C795,225 770,270 742,308 C714,346 690,375 662,400
               C638,422 612,445 590,460 L445,415 Z" />
      <path d="M440,415 C510,405 585,385 655,365 C720,348 775,335 830,310
               C800,355 775,390 745,420 C715,450 685,475 652,498
               L460,465 Z" />
      {/* Right inner wing feathers */}
      <path d="M415,330 C440,318 475,300 505,285 C535,270 565,258 595,245" strokeWidth="4" stroke="currentColor" fill="none" opacity="0.6"/>
      <path d="M425,365 C455,352 490,338 522,325 C552,312 582,302 615,292" strokeWidth="3" stroke="currentColor" fill="none" opacity="0.5"/>
      <path d="M438,400 C470,390 504,378 536,367 C566,357 595,350 628,342" strokeWidth="3" stroke="currentColor" fill="none" opacity="0.4"/>

      {/* ── BODY / TORSO ── */}
      <ellipse cx="400" cy="390" rx="72" ry="120" />

      {/* ── NECK ── */}
      <ellipse cx="400" cy="265" rx="38" ry="55" />

      {/* ── HEAD – eagle/divine ── */}
      <ellipse cx="400" cy="185" rx="62" ry="72" />

      {/* ── CROWN / HEADDRESS ── */}
      <polygon points="368,122 358,78 382,118" />
      <polygon points="390,116 386,68 400,72 414,68 410,116" />
      <polygon points="432,122 442,78 418,118" />
      {/* Crown band */}
      <rect x="350" y="118" width="100" height="12" rx="4" />
      {/* Crown gems */}
      <circle cx="375" cy="124" r="5" opacity="0.8"/>
      <circle cx="400" cy="124" r="6" opacity="0.9"/>
      <circle cx="425" cy="124" r="5" opacity="0.8"/>

      {/* ── EAGLE BEAK (hooked, facing slight right) ── */}
      <path d="M418,195 C428,200 440,208 445,215 C438,218 428,216 418,212 Z" />
      <path d="M418,212 C428,216 436,222 434,228 C425,226 418,220 418,212 Z" />

      {/* ── EYES ── */}
      <circle cx="386" cy="180" r="10" />
      <circle cx="414" cy="180" r="10" />
      <circle cx="388" cy="179" r="4" fill="rgba(201,168,76,0.9)" />
      <circle cx="416" cy="179" r="4" fill="rgba(201,168,76,0.9)" />

      {/* ── SERPENT / NAGA in hands ── */}
      <path d="M320,360 C300,350 285,335 282,315 C280,298 290,285 305,280
               C310,290 308,300 304,308 C300,316 302,328 315,335 Z" opacity="0.7"/>
      <path d="M480,360 C500,350 515,335 518,315 C520,298 510,285 495,280
               C490,290 492,300 496,308 C500,316 498,328 485,335 Z" opacity="0.7"/>

      {/* ── TAIL FEATHERS ── */}
      <path d="M374,495 L350,575 L336,640 L328,685" strokeWidth="6" stroke="currentColor" fill="none" strokeLinecap="round"/>
      <path d="M384,498 L366,580 L355,648 L350,695" strokeWidth="5" stroke="currentColor" fill="none" strokeLinecap="round"/>
      <path d="M394,500 L382,585 L375,655 L372,705" strokeWidth="5" stroke="currentColor" fill="none" strokeLinecap="round"/>
      <path d="M400,501 L400,590 L400,662 L400,712" strokeWidth="6" stroke="currentColor" fill="none" strokeLinecap="round"/>
      <path d="M406,500 L418,585 L425,655 L428,705" strokeWidth="5" stroke="currentColor" fill="none" strokeLinecap="round"/>
      <path d="M416,498 L434,580 L445,648 L450,695" strokeWidth="5" stroke="currentColor" fill="none" strokeLinecap="round"/>
      <path d="M426,495 L450,575 L464,640 L472,685" strokeWidth="6" stroke="currentColor" fill="none" strokeLinecap="round"/>

      {/* ── LEGS ── */}
      <rect x="368" y="495" width="20" height="95" rx="8" />
      <rect x="412" y="495" width="20" height="95" rx="8" />

      {/* ── TALONS ── */}
      {/* Left foot */}
      <path d="M370,585 C355,596 342,608 332,625" strokeWidth="7" stroke="currentColor" fill="none" strokeLinecap="round"/>
      <path d="M374,586 C368,600 362,614 358,632" strokeWidth="6" stroke="currentColor" fill="none" strokeLinecap="round"/>
      <path d="M378,587 C378,602 378,618 380,636" strokeWidth="6" stroke="currentColor" fill="none" strokeLinecap="round"/>
      <path d="M383,586 C388,600 394,614 398,630" strokeWidth="6" stroke="currentColor" fill="none" strokeLinecap="round"/>
      {/* Right foot */}
      <path d="M430,585 C445,596 458,608 468,625" strokeWidth="7" stroke="currentColor" fill="none" strokeLinecap="round"/>
      <path d="M426,586 C432,600 438,614 442,632" strokeWidth="6" stroke="currentColor" fill="none" strokeLinecap="round"/>
      <path d="M422,587 C422,602 422,618 420,636" strokeWidth="6" stroke="currentColor" fill="none" strokeLinecap="round"/>
      <path d="M417,586 C412,600 406,614 402,630" strokeWidth="6" stroke="currentColor" fill="none" strokeLinecap="round"/>
    </svg>
  );
}
