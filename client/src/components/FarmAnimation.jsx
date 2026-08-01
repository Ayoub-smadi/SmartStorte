export default function FarmAnimation() {
  const D = '46s'; // total loop duration

  const css = `
  /* ─── SKY ─── */
  @keyframes skyShift {
    0%,28%     { fill:#7EC8E3; }
    35%,72%    { fill:#4A5568; }
    79%,100%   { fill:#7EC8E3; }
  }
  .farm-sky { animation: skyShift ${D} ease-in-out infinite; }

  /* ─── SUN ─── */
  @keyframes sunFade {
    0%,28%  { opacity:1; transform:translateY(0); }
    35%,72% { opacity:0; transform:translateY(-20px); }
    79%,100%{ opacity:1; transform:translateY(0); }
  }
  .farm-sun { animation: sunFade ${D} ease-in-out infinite; transform-origin:100px 65px; }

  /* ─── RAIN CLOUD ─── */
  @keyframes cloudSlide {
    0%,30%  { transform:translateX(180px); opacity:0; }
    36%,70% { transform:translateX(0); opacity:1; }
    77%,100%{ transform:translateX(180px); opacity:0; }
  }
  .rain-cloud { animation: cloudSlide ${D} ease-in-out infinite; }

  /* ─── RAIN DROP (fast fall + phase visibility) ─── */
  @keyframes dropFall {
    from { transform:translateY(0); }
    to   { transform:translateY(80px); }
  }
  @keyframes dropVisible {
    0%,36%  { opacity:0; }
    38%,70% { opacity:0.85; }
    72%,100%{ opacity:0; }
  }
  .rdrop {
    animation: dropFall 0.55s linear infinite, dropVisible ${D} step-start infinite;
  }

  /* ─── GROUND COLOR ─── */
  @keyframes groundWet {
    0%,35%  { fill:#4CAF50; }
    40%,65% { fill:#2E7D32; }
    75%,100%{ fill:#4CAF50; }
  }
  .farm-grass { animation: groundWet ${D} ease-in-out infinite; }

  /* ─── FARMER BODY MOVE ─── */
  @keyframes farmerWalk {
    0%   { transform:translateX(-130px); }
    21%  { transform:translateX(430px); }   /* done planting */
    29%  { transform:translateX(670px); }   /* at house door */
    32%  { transform:translateX(680px); }
    33%  { transform:translateX(690px); }   /* entering */
    78%  { transform:translateX(640px); }   /* still inside */
    80%  { transform:translateX(630px); }   /* exits */
    88%  { transform:translateX(490px); }   /* moved left to see plants */
    100% { transform:translateX(490px); }   /* stays happy */
  }
  @keyframes farmerHide {
    0%,32%  { opacity:1; }
    34%,79% { opacity:0; }
    80%,100%{ opacity:1; }
  }
  .farmer-g {
    animation: farmerWalk ${D} ease-in-out infinite,
               farmerHide ${D} step-start infinite;
  }

  /* ─── FARMER FLIP (face right → face left after exit) ─── */
  @keyframes farmerFlip {
    0%,79%  { transform:scaleX(1); }
    80%,100%{ transform:scaleX(-1); }
  }
  .farmer-flip { animation: farmerFlip ${D} step-start infinite; transform-origin: 20px 200px; }

  /* ─── LEFT LEG WALK ─── */
  @keyframes legL {
    0%   { transform:rotate(22deg); }
    10%  { transform:rotate(-22deg); }
    21%  { transform:rotate(22deg); }
    22%,100%{ transform:rotate(0deg); }
  }
  .leg-l { animation: legL ${D} ease-in-out infinite; transform-origin:14px 238px; }

  /* ─── RIGHT LEG WALK ─── */
  @keyframes legR {
    0%   { transform:rotate(-22deg); }
    10%  { transform:rotate(22deg); }
    21%  { transform:rotate(-22deg); }
    22%,100%{ transform:rotate(0deg); }
  }
  .leg-r { animation: legR ${D} ease-in-out infinite; transform-origin:28px 238px; }

  /* ─── PLANTING ARM ─── */
  @keyframes armPlant {
    0%,4%   { transform:rotate(-15deg); }
    6%      { transform:rotate(55deg); }   /* reach down to plant */
    8%      { transform:rotate(-15deg); }
    10%,4%  { transform:rotate(-15deg); }
    12%     { transform:rotate(55deg); }
    14%     { transform:rotate(-15deg); }
    16%     { transform:rotate(55deg); }
    18%     { transform:rotate(-15deg); }
    20%     { transform:rotate(55deg); }
    22%,100%{ transform:rotate(-15deg); }
  }
  .arm-plant { animation: armPlant ${D} ease-in-out infinite; transform-origin:4px 206px; }

  /* ─── HAPPY ARM (wave after seeing plants) ─── */
  @keyframes armHappy {
    0%,80%  { transform:rotate(-15deg); }
    83%     { transform:rotate(-75deg); }
    86%     { transform:rotate(-40deg); }
    89%     { transform:rotate(-75deg); }
    92%,100%{ transform:rotate(-55deg); }
  }
  .arm-happy { animation: armHappy ${D} ease-in-out infinite; transform-origin:37px 206px; }

  /* ─── FARMER BOUNCE (happy) ─── */
  @keyframes bounce {
    0%,81%  { transform:translateY(0); }
    83%     { transform:translateY(-10px); }
    85%     { transform:translateY(0); }
    87%     { transform:translateY(-7px); }
    89%     { transform:translateY(0); }
    91%     { transform:translateY(-5px); }
    93%,100%{ transform:translateY(0); }
  }
  .farmer-inner { animation: bounce ${D} ease-in-out infinite; }

  /* ─── SEED SPROUT ─── */
  @keyframes sproutGrow {
    0%,47%  { transform:scaleY(0); opacity:0; }
    49%     { opacity:1; }
    65%,100%{ transform:scaleY(1); }
  }
  .sprout-g {
    animation: sproutGrow ${D} cubic-bezier(.34,1.56,.64,1) infinite;
  }

  /* ─── FARMER SMILE EXPRESSION ─── */
  @keyframes smileBig {
    0%,80%  { transform:scale(1) translateY(0); }
    82%,100%{ transform:scale(1.08) translateY(-1px); }
  }
  .farmer-face { animation: smileBig ${D} ease-in-out infinite; transform-origin:20px 179px; }

  /* ─── HAPPY STARS ─── */
  @keyframes starPop {
    0%,80%  { opacity:0; transform:scale(0); }
    83%     { opacity:1; transform:scale(1.2); }
    88%     { opacity:1; transform:scale(1); }
    95%,100%{ opacity:0; transform:scale(0); }
  }
  .happy-star { animation: starPop ${D} ease-in-out infinite; }

  /* ─── DOOR ─── */
  @keyframes doorSwing {
    0%,30%   { transform:scaleX(1); }
    32%,35%  { transform:scaleX(0.1); }
    36%,78%  { transform:scaleX(0.1); }
    80%,82%  { transform:scaleX(0.1); }
    83%,100% { transform:scaleX(1); }
  }
  .house-door { animation: doorSwing ${D} ease-in-out infinite; transform-origin:778px 275px; }

  /* ─── SEED DOTS APPEAR AS FARMER WALKS ─── */
  @keyframes seedAppear {
    0%,5%   { opacity:0; transform:scale(0); }
    6%,100% { opacity:1; transform:scale(1); }
  }
  `;

  /* Seed positions planted across the field */
  const seedPositions = [80,150,220,290,360,430];
  /* Sprout positions */
  const sprouts = [
    {x:80, h:48}, {x:150, h:42}, {x:220, h:52}, {x:290, h:44}, {x:360, h:50}, {x:430, h:46}
  ];
  /* Rain drop columns */
  const rainCols = Array.from({length:22},(_,i)=>70+i*36);

  return (
    <div style={{width:'100%',maxWidth:900,margin:'0 auto',borderRadius:16,overflow:'hidden',boxShadow:'0 8px 40px rgba(0,71,41,0.18)'}}>
      <style>{css}</style>
      <svg viewBox="0 0 900 400" xmlns="http://www.w3.org/2000/svg"
           style={{width:'100%',height:'auto',display:'block'}}>

        {/* ── SKY ── */}
        <rect className="farm-sky" width="900" height="272" fill="#7EC8E3"/>

        {/* ── SUN ── */}
        <g className="farm-sun">
          <circle cx="100" cy="65" r="42" fill="#FFD54F"/>
          {[0,45,90,135,180,225,270,315].map((d,i)=>(
            <line key={i}
              x1={100+50*Math.cos(d*Math.PI/180)} y1={65+50*Math.sin(d*Math.PI/180)}
              x2={100+65*Math.cos(d*Math.PI/180)} y2={65+65*Math.sin(d*Math.PI/180)}
              stroke="#FFD54F" strokeWidth="4" strokeLinecap="round"/>
          ))}
        </g>

        {/* ── STATIC WHITE CLOUD ── */}
        <g opacity="0.92">
          <ellipse cx="680" cy="52" rx="52" ry="28" fill="#fff"/>
          <ellipse cx="648" cy="64" rx="36" ry="24" fill="#fff"/>
          <ellipse cx="716" cy="64" rx="38" ry="24" fill="#fff"/>
          <ellipse cx="682" cy="70" rx="46" ry="19" fill="#fff"/>
        </g>

        {/* ── RAIN CLOUD (animated) ── */}
        <g className="rain-cloud">
          <ellipse cx="430" cy="52" rx="58" ry="32" fill="#607D8B"/>
          <ellipse cx="396" cy="66" rx="39" ry="27" fill="#546E7A"/>
          <ellipse cx="468" cy="66" rx="42" ry="27" fill="#546E7A"/>
          <ellipse cx="432" cy="74" rx="54" ry="21" fill="#37474F"/>
        </g>

        {/* ── RAIN DROPS (whole field) ── */}
        {rainCols.map((x,i)=>(
          <line key={i} className="rdrop"
            x1={x} y1={90} x2={x-4} y2={140}
            stroke="#90CAF9" strokeWidth="2" strokeLinecap="round"
            style={{animationDelay:`${(i*0.07)%0.55}s`}}/>
        ))}

        {/* ── GROUND ── */}
        <rect x="0" y="268" width="900" height="132" fill="#5D4037"/>
        <ellipse className="farm-grass" cx="450" cy="268" rx="450" ry="20" fill="#4CAF50"/>
        {[0,1,2].map(i=>(
          <ellipse key={i} cx="450" cy={292+i*28} rx="370" ry="7" fill="#3E2211" opacity="0.35"/>
        ))}

        {/* ── PLANTED SEEDS (static dots on ground) ── */}
        {seedPositions.map((x,i)=>(
          <g key={i} style={{animation:`seedAppear ${D} ease-out infinite`, animationDelay:`${(i+1)*1.6}s`, transformOrigin:`${x}px 268px`}}>
            <ellipse cx={x} cy={270} rx="5" ry="3.5" fill="#6D4C41"/>
            <line x1={x} y1={267} x2={x+3} y2={261} stroke="#A5D6A7" strokeWidth="1.5"/>
          </g>
        ))}

        {/* ── SPROUTS (grow during rain) ── */}
        {sprouts.map(({x,h},i)=>(
          <g key={i} className="sprout-g"
             style={{transformOrigin:`${x}px 268px`, animationDelay:`${i*0.35}s`}}>
            <line x1={x} y1={268} x2={x} y2={268-h} stroke="#2E7D32" strokeWidth="3.5" strokeLinecap="round"/>
            <ellipse cx={x-11} cy={268-h+12} rx="12" ry="6" fill="#4CAF50"
              transform={`rotate(-35 ${x-11} ${268-h+12})`}/>
            <ellipse cx={x+11} cy={268-h+9} rx="12" ry="6" fill="#66BB6A"
              transform={`rotate(35 ${x+11} ${268-h+9})`}/>
            <circle cx={x} cy={268-h-1} r="5.5" fill="#81C784"/>
          </g>
        ))}

        {/* ── BIG TREE LEFT ── */}
        <rect x="32" y="194" width="14" height="74" fill="#5D4037" rx="4"/>
        <ellipse cx="39" cy="188" rx="34" ry="31" fill="#388E3C"/>
        <ellipse cx="23" cy="203" rx="22" ry="18" fill="#43A047"/>
        <ellipse cx="55" cy="203" rx="22" ry="18" fill="#2E7D32"/>

        {/* ── HOUSE ── */}
        <g>
          <rect x="726" y="182" width="138" height="96" fill="#EFEBE9" stroke="#BCAAA4" strokeWidth="2"/>
          <polygon points="716,182 795,124 874,182" fill="#C62828" stroke="#B71C1C" strokeWidth="2"/>
          <rect x="836" y="140" width="20" height="44" fill="#D32F2F" rx="2"/>
          {/* Chimney smoke */}
          {[0,1,2].map(i=>(
            <circle key={i} cx={846+i*3} cy={134-i*14} r={6+i*2}
              fill="#CFD8DC" opacity={0.6-i*0.15}/>
          ))}
          {/* Window */}
          <rect x="736" y="198" width="30" height="26" fill="#B3E5FC" rx="3" stroke="#81D4FA" strokeWidth="1.5"/>
          <line x1="751" y1="198" x2="751" y2="224" stroke="#81D4FA" strokeWidth="1.2"/>
          <line x1="736" y1="211" x2="766" y2="211" stroke="#81D4FA" strokeWidth="1.2"/>
          {/* Door */}
          <rect className="house-door" x="778" y="228" width="36" height="50" fill="#8D6E63" rx="4"/>
          <circle cx="810" cy="254" r="4" fill="#FFD54F"/>
          {/* Door arch */}
          <path d="M778 228 Q796 210 814 228" fill="#A1887F"/>
        </g>

        {/* Small fence */}
        {[580,608,636,664].map((x,i)=>(
          <g key={i}>
            <rect x={x} y={248} width="9" height="28" fill="#8D6E63" rx="2"/>
            <polygon points={`${x},248 ${x+4.5},238 ${x+9},248`} fill="#795548"/>
          </g>
        ))}
        <rect x="580" y="256" width="93" height="5" fill="#795548" rx="2"/>
        <rect x="580" y="265" width="93" height="4" fill="#795548" rx="2"/>

        {/* ── FARMER ── */}
        <g className="farmer-g">
          <g className="farmer-flip">
            <g className="farmer-inner">
              {/* Shadow */}
              <ellipse cx="20" cy="268" rx="24" ry="7" fill="rgba(0,0,0,0.18)"/>

              {/* Left leg */}
              <rect className="leg-l" x="7" y="238" width="13" height="30" fill="#1565C0" rx="5"/>
              <ellipse cx="13" cy="268" rx="10" ry="5.5" fill="#3E2723"/>

              {/* Right leg */}
              <rect className="leg-r" x="22" y="238" width="13" height="30" fill="#1565C0" rx="5"/>
              <ellipse cx="28" cy="268" rx="10" ry="5.5" fill="#3E2723"/>

              {/* Body */}
              <rect x="5" y="198" width="32" height="42" fill="#1565C0" rx="8"/>
              {/* Overalls bib */}
              <rect x="10" y="198" width="22" height="24" fill="#1976D2" rx="5"/>
              <rect x="13" y="202" width="7" height="9" fill="#42A5F5" rx="2"/>
              <rect x="22" y="202" width="7" height="9" fill="#42A5F5" rx="2"/>

              {/* Left arm (planting) */}
              <rect className="arm-plant" x="-6" y="204" width="13" height="26" fill="#FFCC80" rx="6"/>
              {/* Seed in left hand */}
              <circle cx="-1" cy="230" r="4" fill="#795548"/>

              {/* Right arm (happy wave) */}
              <rect className="arm-happy" x="35" y="204" width="13" height="26" fill="#FFCC80" rx="6"/>

              {/* Neck */}
              <rect x="15" y="191" width="12" height="10" fill="#FFCC80" rx="3"/>

              {/* Head */}
              <g className="farmer-face">
                <circle cx="21" cy="177" r="20" fill="#FFCC80"/>
                {/* Hat brim */}
                <ellipse cx="21" cy="160" rx="25" ry="6" fill="#6D4C41"/>
                {/* Hat top */}
                <rect x="9" y="151" width="24" height="12" fill="#795548" rx="3"/>
                {/* Hat band */}
                <rect x="9" y="157" width="24" height="4" fill="#4CAF50" rx="1"/>
                {/* Eyes */}
                <circle cx="14" cy="176" r="2.8" fill="#3E2723"/>
                <circle cx="28" cy="176" r="2.8" fill="#3E2723"/>
                <circle cx="15" cy="175" r="1.1" fill="#fff"/>
                <circle cx="29" cy="175" r="1.1" fill="#fff"/>
                {/* Eyebrows */}
                <path d="M11 170 Q14 167 17 170" stroke="#5D4037" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                <path d="M25 170 Q28 167 31 170" stroke="#5D4037" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                {/* Smile */}
                <path d="M14 184 Q21 192 28 184" stroke="#BF360C" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
                {/* Rosy cheeks */}
                <circle cx="10" cy="181" r="5" fill="#FFAB91" opacity="0.5"/>
                <circle cx="32" cy="181" r="5" fill="#FFAB91" opacity="0.5"/>
              </g>
            </g>
          </g>
        </g>

        {/* ── HAPPY STARS (appear when farmer sees plants) ── */}
        {[{x:480,y:210},{x:500,y:195},{x:460,y:200},{x:515,y:215}].map((s,i)=>(
          <text key={i} className="happy-star"
            x={s.x} y={s.y} fontSize="18" textAnchor="middle"
            style={{animationDelay:`${i*0.15}s`, transformOrigin:`${s.x}px ${s.y}px`}}>
            ✨
          </text>
        ))}

      </svg>
    </div>
  );
}
