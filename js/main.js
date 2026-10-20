(() => {
  'use strict';
  const config = window.GARDEN_CONFIG;
  const stage = document.querySelector('#stage');
  const dialog = document.querySelector('#message-dialog');
  const photoDialog = document.querySelector('#photo-dialog');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const state = { chapter: 0, water: 0, flowers: new Set(), photo: 0, busy: false, butterfly: 0, album: 'gallery', letter: false, memoryRound: 0, memorySequence: [], memoryInput: 0, memoryReady: false, memoryUnlocked: false };
  let timers = [], dialogDone = null, lastFocus = null, meterFrame = 0, meterStart = 0, meterPosition = 4;
  const logic = { round: 0, order: [], selected: null, solved: false, attempts: 0 };
  const flowerNames = { tulip: 'Tulip', daisy: 'Cúc', peony: 'Mẫu đơn', lavender: 'Oải hương', hydrangea: 'Cẩm tú cầu' };
  const $ = (query, root = document) => root.querySelector(query);
  const text = value => String(value ?? '').replaceAll('{name}', config.recipientName).normalize('NFC');
  const escape = value => text(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const lines = value => escape(value).replaceAll('\n', '<br>');
  const later = (fn, ms) => { const id = setTimeout(fn, reduced.matches ? Math.min(ms, 60) : ms); timers.push(id); return id; };
  const status = message => { $('#live-status').textContent = text(message); };
  const arrow = '<span aria-hidden="true">↗</span>';
  const sparkle = '<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M16 2Q16 16 30 16Q16 16 16 30Q16 16 2 16Q16 16 16 2Z" fill="currentColor"/></svg>';

  function flower(type = 'tulip', extra = '') {
    let head;
    if (type === 'lavender') {
      head = '<path d="M90 106V20" stroke="#819474" stroke-width="4"/>' + Array.from({length:7},(_,i)=>`<g transform="translate(90 ${24+i*10})"><ellipse cx="-7" cy="0" rx="8" ry="13" transform="rotate(-35)" fill="${i%2?'#b6a0c6':'#9c83b2'}"/><ellipse cx="7" cy="0" rx="8" ry="13" transform="rotate(35)" fill="#c9b4d6"/></g>`).join('');
    } else if (type === 'hydrangea') {
      head = Array.from({length:13},(_,i)=>{const angle=i*2.4, radius=i===0?0:15+Math.floor(i/5)*12;const x=90+Math.cos(angle)*radius,y=62+Math.sin(angle)*radius;return `<g transform="translate(${x} ${y})"><circle cx="-7" cy="-6" r="10" fill="#a7b8cb"/><circle cx="7" cy="-6" r="10" fill="#bdc7dc"/><circle cx="-7" cy="8" r="10" fill="#aeb8d2"/><circle cx="7" cy="8" r="10" fill="#d2cce0"/><circle r="3" fill="#e8dfb8"/></g>`;}).join('');
    } else if (type === 'daisy') {
      head = Array.from({length: 12}, (_, i) => `<ellipse cx="90" cy="37" rx="10" ry="29" transform="rotate(${i * 30} 90 65)" fill="${i % 2 ? '#fffaf2' : '#f5ebd9'}" stroke="#d9c9ac" stroke-width=".7"/>`).join('') + '<circle cx="90" cy="65" r="16" fill="#d2ad59"/><circle cx="90" cy="65" r="11" fill="#e9cb7b"/><path d="M84 61h1m8 7h1m-10 2h1m8-13h1" stroke="#ae873e" stroke-width="3" stroke-linecap="round"/>';
    } else if (type === 'peony') {
      head = Array.from({length: 8}, (_, i) => `<ellipse cx="90" cy="46" rx="24" ry="30" transform="rotate(${i * 45} 90 67)" fill="${['#eebac4','#d992a8','#edb2c1','#e3a1b4'][i % 4]}" stroke="#c9829b" stroke-width=".7"/>`).join('') + '<path d="M62 57Q71 38 87 49Q102 35 113 54Q125 74 103 86Q80 101 65 80Q53 70 62 57Z" fill="#f5ced4"/><path d="M73 58Q87 49 96 62Q108 57 107 72Q99 86 87 78Q71 84 73 58Z" fill="#de9ab0"/><path d="M83 61Q99 53 100 68Q91 80 83 71Z" fill="#f9d7db"/>';
    } else {
      head = '<path d="M87 97Q55 86 54 40Q73 38 89 58Q109 35 127 40Q127 88 96 98Z" fill="#ca7891"/><path d="M69 52Q66 28 84 13Q104 23 106 51L99 88L78 89Z" fill="#eeb4bf"/><path d="M54 39Q80 43 94 68Q109 40 127 39Q127 93 91 101Q56 95 54 39Z" fill="#df98ac"/><path d="M57 44Q79 58 91 91M122 46Q110 66 97 92" fill="none" stroke="#eebac6" stroke-width="2"/>';
    }
    return `<svg class="flower-svg ${extra}" viewBox="0 0 180 300" fill="none" aria-hidden="true"><g class="flower-stem"><path d="M90 284Q101 187 90 86" stroke="#718a68" stroke-width="5" stroke-linecap="round"/><path class="leaf leaf-left" d="M94 219Q40 204 39 144Q89 155 94 219Z" fill="#93aa86"/><path d="M94 219L48 158" stroke="#718a68"/><path class="leaf leaf-right" d="M95 181Q139 173 149 120Q106 129 95 181Z" fill="#afbf9c"/><path d="M98 178L141 131" stroke="#829775"/></g><g class="flower-head">${head}</g></svg>`;
  }

  function sprig(flip = false) {
    return `<svg viewBox="0 0 200 380" class="sprig ${flip ? 'flipped' : ''}" fill="none" aria-hidden="true"><path d="M100 375Q53 244 124 40" stroke="#879b78" stroke-width="2"/>${[[100,290,-30],[88,233,34],[94,180,-25],[104,127,25],[115,79,-18]].map(([x,y,r]) => `<g transform="translate(${x} ${y}) rotate(${r})"><path d="M0 0Q-63-12-54-64Q-6-57 0 0" fill="#b5c1a2"/><path d="M0 0L-45-52" stroke="#8ea080"/><path d="M0 8Q55-7 49-47Q6-41 0 8" fill="#9eaf8e"/><path d="M0 8L42-38" stroke="#809476"/></g>`).join('')}</svg>`;
  }

  function bouquet() {
    return `<div class="bouquet" aria-label="Bó tulip hồng, cúc trắng và mẫu đơn, gói giấy kem và thắt nơ hồng" role="img"><div class="bouquet-foliage">${sprig()}${sprig(true)}</div><div class="bouquet-flower bf-one">${flower('tulip')}</div><div class="bouquet-flower bf-two">${flower('daisy')}</div><div class="bouquet-flower bf-three">${flower('peony')}</div><div class="bouquet-flower bf-four">${flower('daisy')}</div><div class="bouquet-flower bf-five">${flower('tulip')}</div><svg class="bouquet-wrap" viewBox="0 0 400 520" fill="none" aria-hidden="true"><path class="wrap-back" d="M72 210L185 454L243 457L336 205L203 274Z" fill="#e8d9bc" stroke="#d4bf9c"/><path class="wrap-left" d="M62 222L207 302L231 470L178 454Z" fill="#f9edda" stroke="#d4bf9c"/><path class="wrap-right" d="M336 216L207 302L179 457L235 469Z" fill="#f2e3c9" stroke="#d4bf9c"/><path d="M78 242L197 321L187 416M321 236L220 322L226 424" stroke="#d8c3a0"/><g class="bouquet-ribbon"><path d="M169 365Q204 376 246 360L242 379Q207 390 176 380Z" fill="#b8677f"/><path d="M206 376Q148 309 132 344Q118 376 206 380M208 377Q262 310 279 341Q296 373 208 380" fill="#d995a8" stroke="#b76882" stroke-width="2"/><path d="M206 379Q185 407 164 447L183 442L191 455Q213 410 211 381M211 381Q229 421 260 432L255 415L269 411Q234 396 216 378" fill="#d995a8" stroke="#b76882"/><ellipse cx="209" cy="378" rx="12" ry="10" fill="#c77c93"/></g></svg></div>`;
  }

  function butterfly() {
    return `<button class="butterfly" aria-label="Chạm vào chú bướm" title="Một vị khách nhỏ"><svg viewBox="0 0 70 60" fill="none" aria-hidden="true"><g class="butterfly-wings"><path d="M35 30Q4-8 5 20Q3 39 28 34Q4 49 22 53Q36 50 35 30Z" fill="#c398a5"/><path d="M35 30Q66-8 65 20Q67 39 42 34Q66 49 48 53Q34 50 35 30Z" fill="#e2b9c3"/></g><path d="M35 23V45M35 26L28 18M35 26L42 18" stroke="#856570" stroke-width="1.5"/></svg></button>`;
  }
  function petals() { return `<div class="petals" aria-hidden="true">${Array.from({length: 8}, (_,i) => `<i style="--i:${i};--x:${8 + i * 12}%"></i>`).join('')}</div>`; }
  function heading(kicker, title, subtitle = '') { return `<div class="scene-heading"><p class="eyebrow">${kicker}</p><h1 tabindex="-1">${lines(title)}</h1>${subtitle ? `<p class="scene-subtitle">${lines(subtitle)}</p>` : ''}</div>`; }
  function button(label, id, cls = '') { return `<button class="button ${cls}" id="${id}">${label}${arrow}</button>`; }

  function opening() {
    return `<section class="scene opening">${petals()}<div class="opening-botanical botanical-left">${sprig()}${flower('peony')}${flower('daisy')}</div><div class="opening-botanical botanical-right">${sprig(true)}${flower('tulip')}${flower('daisy')}</div>${heading('MỘT MÓN QUÀ NHỎ · 20 THÁNG 10', config.ui.openingTitle, config.ui.openingSubtitle)}<div class="envelope-stage"><div class="little-spark spark-one">${sparkle}</div><div class="little-spark spark-two">${sparkle}</div><div class="envelope" id="envelope"><div class="envelope-back"></div><div class="letter-peek"><span>Gửi ${escape(config.recipientName)},</span><i>Một điều dễ thương đang chờ em…</i></div><div class="envelope-front"></div><div class="envelope-flap"></div><div class="envelope-address">To: ${escape(config.recipientName)}<span>just a little something, for you</span></div><button class="wax-seal" id="open-seal" aria-label="Mở phong thư">${sparkle}</button></div><p class="handwritten envelope-caption">Có người gửi em một thứ này…</p></div><div class="opening-actions">${button('Mở xem ai gửi nào', 'open-envelope')}<span class="tiny-note">Dành cho em một chút thời gian thật dịu dàng.</span></div><article class="intro-letter" id="intro-letter" hidden><p class="eyebrow">LÁ THƯ ĐẦU TIÊN</p>${config.introduction.map((p,i) => i === 0 ? `<h2>${escape(p)}</h2>` : `<p>${escape(p)}</p>`).join('')}${button('Để em xem nào', 'enter-garden')}</article>${butterfly()}</section>`;
  }
  function garden() {
    return `<section class="scene garden">${heading('CHƯƠNG 02 · GIEO MỘT CHÚT THƯƠNG', config.ui.gardenTitle, config.ui.gardenIntro)}<div class="garden-landscape"><div class="cloud cloud-one"></div><div class="cloud cloud-two"></div><div class="hill hill-back"></div><div class="hill hill-front"></div><div class="garden-sprig gs-left">${sprig()}</div><div class="garden-sprig gs-right">${sprig(true)}</div><div class="growing-pot" id="growing-pot"><div class="plant">${flower('tulip', 'growing-flower')}</div><svg class="pot" viewBox="0 0 180 160" fill="none" aria-hidden="true"><ellipse cx="90" cy="30" rx="71" ry="18" fill="#a46e61"/><path d="M23 32L41 137Q90 158 139 137L157 32Z" fill="#d9a798"/><path d="M37 52L50 130M145 53L132 130" stroke="#edc1b0" stroke-width="3"/><path d="M15 20Q90 41 165 20L160 50Q90 70 20 50Z" fill="#e6b8a5"/><ellipse cx="90" cy="22" rx="74" ry="17" fill="#bd8a77"/><ellipse cx="90" cy="23" rx="62" ry="11" fill="#775c4a"/><path d="M82 23Q81 10 94 13Q103 24 88 27" fill="#d1b477"/></svg></div><button class="watering-can" id="water" aria-label="Tưới cây lần 1"><svg viewBox="0 0 190 170" fill="none" aria-hidden="true"><path d="M135 65Q193 38 175 94Q162 122 139 104" stroke="#829a8d" stroke-width="12"/><path d="M57 100L19 47L5 54L44 124" fill="#99b3a2" stroke="#6e8c7c" stroke-width="2"/><path d="M57 58L140 61L150 142Q101 165 49 141Z" fill="#a8beac" stroke="#7f9b88" stroke-width="2"/><ellipse cx="99" cy="60" rx="42" ry="10" fill="#7e9b88"/><path d="M69 77L66 130M128 79L134 132" stroke="#c4d5c4" stroke-width="4"/><path d="M7 45L25 38L30 51L9 60Z" fill="#708e7c"/><path d="M78 42Q99 22 118 43" stroke="#7f9b88" stroke-width="6"/></svg><span>tưới một chút</span></button><div class="water-drops" aria-hidden="true">${'<i></i>'.repeat(6)}</div></div><div class="garden-status"><div class="water-progress" aria-label="Tiến độ tưới cây"><span></span><span></span><span></span></div><p id="water-message" aria-live="polite">${escape(config.ui.wateringMessages[0])}</p><div id="garden-next" hidden>${button('Trong vườn còn gì nữa?', 'to-flowers')}</div></div>${butterfly()}</section>`;
  }
  function flowers() {
    return `<section class="scene flowers">${heading('CHƯƠNG 03 · DÀNH RIÊNG CHO EM', config.ui.flowersTitle, 'Chạm vào từng bông thử nhé. Mỗi bông có một lời nhắn.')}<div class="flower-collection">${config.flowerMessages.map((item,i) => `<button class="flower-card" data-flower="${i}" aria-label="Đọc lời nhắn ${escape(item.subtitle)}"><span class="flower-number">0${i+1}</span><span class="flower-art">${flower(item.type)}</span><span class="flower-caption">${escape(item.subtitle)}</span><span class="flower-hint">${escape(item.name)} <span aria-hidden="true">↗</span></span></button>`).join('')}</div><div class="basket-row"><div class="basket" aria-hidden="true"><svg viewBox="0 0 95 70"><path d="M23 26Q25-9 47 3Q68-9 73 26" fill="none" stroke="#a48b64" stroke-width="4"/><path d="M10 26H85L73 65H23Z" fill="#d9c49e" stroke="#af9670"/><path d="M15 37H81M18 48H77M21 58H74M30 28L35 64M47 28V65M65 28L60 64" fill="none" stroke="#b59e78"/></svg><span id="basket-flowers"></span></div><p id="basket-count" aria-live="polite">Giỏ hoa của em · 0 / 3</p></div><div class="flowers-complete" id="flowers-complete" hidden><p>Thu hoạch thành công! Mà hình như anh vẫn còn giấu thứ gì đó…</p>${button('Khám phá tiếp', 'to-album')}</div>${butterfly()}</section>`;
  }
  function album() {
    return `<section class="scene album">${heading('CHƯƠNG 04 · MỘT GÓC THẬT DỄ THƯƠNG', config.ui.albumTitle)}<div id="album-content"><div class="scrapbook"><div class="scrapbook-note"><span class="handwritten">the little things</span><span>một vài khoảnh khắc<br>anh muốn giữ lại.</span>${sprig()}</div><div class="photo-stack"><div class="polaroid ghost-photo"></div><div class="polaroid" id="gallery-card"><span class="washi-tape" aria-hidden="true"></span><button class="photo-open" id="photo-open" aria-label="Phóng to ảnh"><img id="gallery-image" alt="" draggable="false"><span class="photo-zoom" aria-hidden="true">↗</span></button><p id="photo-caption"></p></div></div><span class="album-stamp" aria-hidden="true">a little<br>collection<br>of you ♡</span></div><div class="gallery-controls"><button class="round-button" id="previous-photo" aria-label="Ảnh trước">←</button><span id="photo-count"></span><button class="round-button" id="next-photo" aria-label="Ảnh tiếp theo">→</button></div><p class="gallery-tip">Vuốt để xem ảnh · Chạm vào ảnh để ngắm rõ hơn</p>${button('Còn một tấm ảnh đặc biệt…', 'special-photo', 'button-secondary')}</div>${butterfly()}</section>`;
  }
  function finalScene() {
    return `<section class="scene finale">${petals()}${heading('CHƯƠNG 05 · HOA ĐÃ NỞ VÌ EM', config.ui.finalTitle, config.ui.finalSubtitle)}<div class="final-composition"><div class="bouquet-halo"></div>${bouquet()}<span class="handwritten bouquet-note">tất cả những bông hoa này,<br>đều dành cho em.</span></div><div class="final-actions">${button('Nhận thêm một bức thư', 'read-final')}<p class="tiny-note">Gửi em, một ngày 20/10 thật dịu dàng.</p></div><article class="final-letter" hidden><span class="letter-flower" aria-hidden="true">${flower('daisy')}</span><p class="eyebrow">MỘT VÀI ĐIỀU ANH MUỐN NÓI</p><h2>Gửi ${escape(config.recipientName)},</h2><div class="letter-copy">${config.finalLetter.map(p => `<p>${escape(p)}</p>`).join('')}</div><p class="signature">${escape(config.signature)}<span>${escape(config.senderName)}</span></p><div class="letter-actions"><button class="text-button" id="hide-final">Ngắm bó hoa thêm chút nữa ↗</button><button class="text-button" id="replay">Xem lại khu vườn ↺</button></div></article><p class="made-final">Made just for ${escape(config.recipientName)}</p>${butterfly()}</section>`;
  }

  const scenes = [opening, garden, flowers, album, finalScene];
  function renderChapter(index, initial = false) {
    timers.forEach(clearTimeout); timers = [];
    cancelAnimationFrame(meterFrame);
    state.chapter = index; state.busy = false; state.butterfly = 0;
    status('');
    stage.innerHTML = scenes[index]();
    $('#chapter-count').textContent = `${String(index+1).padStart(2,'0')} / 05`;
    $('#chapter-dots').innerHTML = scenes.map((_, i) => `<span class="${i <= index ? 'filled' : ''}" ${i === index ? 'aria-current="step"' : ''}></span>`).join('');
    document.body.dataset.chapter = index;
    if (!initial) { window.scrollTo({top:0, behavior:'instant'}); $('h1', stage).focus({preventScroll:true}); }
    bindCommon();
    if (index === 0) {
      $('#open-envelope').onclick = openEnvelope; $('#open-seal').onclick = openEnvelope;
      $('#enter-garden').onclick = () => renderChapter(1);
    }
    if (index === 1) {
      $('#water').onclick = water; $('#to-flowers').onclick = () => renderChapter(2);
      setupWateringGame();
    }
    if (index === 2) {
      document.querySelectorAll('[data-flower]').forEach(el => el.onclick = () => flowerTurn(Number(el.dataset.flower)));
      $('#to-album').onclick = () => startLogicRound(0);
      setupMemoryGame();
    }
    if (index === 3) bindAlbum();
    if (index === 4) {
      $('#read-final').onclick = showFinal;
      $('#hide-final').onclick = hideFinal;
      $('#replay').onclick = reset;
    }
  }
  function bindCommon() {
    $('.butterfly', stage).onclick = () => {
      if (state.busy) return;
      state.butterfly++;
      if (state.butterfly === 3) {
        showDialog('MỘT BÍ MẬT NHỎ', 'Bắt được anh rồi.', config.easterEggMessage, sparkle, 'Em biết rồi nha', null);
        state.butterfly = 0;
      }
    };
  }
  function openEnvelope() {
    if (state.busy) return;
    state.busy = true;
    $('#open-envelope').disabled = true; $('#open-seal').disabled = true;
    $('#envelope').classList.add('is-open');
    later(() => {
      $('.opening').classList.add('reading-intro');
      $('#intro-letter').hidden = false;
      $('#enter-garden').focus({preventScroll:true});
      status('Lá thư đã mở. ' + config.introduction.map(text).join(' '));
    }, 1400);
  }
  function setupWateringGame() {
    const panel = document.createElement('div'); panel.className = 'watering-game';
    panel.innerHTML = '<div class="game-topline"><span class="game-label">THỬ THÁCH 01 · CANH NHỊP TƯỚI</span><span id="water-level">Mức 1 / 3</span></div><div class="timing-track" id="timing-track" role="img" aria-label="Giọt nước di chuyển. Bấm tưới khi giọt ở trong vùng hồng."><span class="timing-target" id="timing-target"></span><span class="timing-cursor" id="timing-cursor"></span></div><p class="game-help">Canh giọt nước vào <strong>vùng hồng</strong>, rồi chạm bình tưới.<br>Càng lớn, hoa càng khó chiều. Trượt sẽ lùi một nấc.</p><button class="button button-secondary" id="timing-water">Tưới ngay <span aria-hidden="true">↓</span></button>';
    $('.garden-status').before(panel);
    const cue = document.createElement('p'); cue.id='timing-cue'; cue.className='timing-cue';cue.textContent='Chờ giọt nước…';
    $('#timing-track').after(cue);
    $('#timing-water').onclick = water;
    $('#water-message').textContent = 'Ba nhịp tưới chuẩn để đánh thức bông hoa.';
    startMeter();
  }
  function startMeter() {
    cancelAnimationFrame(meterFrame);
    const level = config.difficulty.watering[state.water];
    if (!level || state.chapter !== 1) return;
    $('#water-level').textContent = `Mức ${state.water+1} / 3`;
    $('#timing-target').style.left = `${level.center-level.width/2}%`;
    $('#timing-target').style.width = `${level.width}%`;
    $('#timing-water').disabled = false;
    $('#water').disabled = false;
    $('#water').setAttribute('aria-label', `Tưới cây lần ${state.water+1}`);
    $('#timing-track').classList.remove('hit', 'miss');
    meterStart = performance.now(); meterPosition = 4;
    const tick = now => {
      if (state.chapter !== 1 || state.busy) return;
      const period = level.period * (reduced.matches ? 1.5 : 1);
      meterPosition = 50 - 46 * Math.cos((now-meterStart)/period*2*Math.PI);
      $('#timing-cursor').style.left = `${meterPosition}%`;
      const inZone=Math.abs(meterPosition-level.center)<=level.width/2;
      $('#timing-track').classList.toggle('in-zone',inZone);
      $('#timing-cue').textContent=inZone?'Đúng nhịp!':'Chờ giọt nước…';
      meterFrame = requestAnimationFrame(tick);
    };
    meterFrame = requestAnimationFrame(tick);
  }
  function updateGrowth() {
    $('#growing-pot').dataset.growth = state.water;
    document.querySelectorAll('.water-progress span').forEach((el,i) => el.classList.toggle('done', i < state.water));
  }
  function water() {
    if (state.busy || state.water >= 3) return;
    state.busy = true; cancelAnimationFrame(meterFrame);
    const can = $('#water'), level = config.difficulty.watering[state.water];
    can.disabled = true; $('#timing-water').disabled = true;
    const hit = Math.abs(meterPosition - level.center) <= level.width/2;
    $('#timing-cue').textContent=hit?'Chuẩn rồi!':'Lệch nhịp mất rồi';
    $('#timing-track').classList.add(hit ? 'hit' : 'miss');
    if (!hit) {
      const lost = state.water > 0;
      state.water = Math.max(0,state.water-1); updateGrowth();
      $('#water-message').textContent = lost ? 'Ôi, lệch một nhịp! Lùi một nấc, thử lại nhé.' : 'Chưa trúng rồi. Đợi giọt nước vào vùng hồng nhé.';
      status($('#water-message').textContent);
      later(() => { state.busy=false; startMeter(); }, 1100);
      return;
    }
    $('.garden-landscape').classList.add('is-watering');
    later(() => {
      state.water++; updateGrowth();
      $('#water-message').textContent = text(config.ui.wateringMessages[state.water]);
      status(`${state.water}/3. ${text(config.ui.wateringMessages[state.water])}`);
    }, 550);
    later(() => {
      $('.garden-landscape').classList.remove('is-watering'); state.busy = false;
      if (state.water === 3) {
        $('.watering-game').classList.add('game-won'); $('#timing-water').hidden=true;
        $('#water-level').textContent='3 / 3 · Hoàn thành'; $('.game-help').textContent='Ba nhịp thật chuẩn. Bông hoa này xứng đáng dành cho em.';
        $('#garden-next').hidden = false; can.classList.add('finished'); $('#to-flowers').focus({preventScroll:true});
      } else startMeter();
    }, 1700);
  }

  function setupMemoryGame() {
    const panel = document.createElement('div'); panel.className='memory-game';
    panel.innerHTML='<div class="game-topline"><span class="game-label">THỬ THÁCH 02 · NHỚ NHỊP HOA NỞ</span><span id="memory-level">Vòng 1 / 3</span></div><p id="memory-prompt" aria-live="polite">Nhớ thứ tự hoa sáng lên, rồi chạm lại đúng thứ tự nhé.</p><div class="memory-progress" id="memory-progress"></div><button class="button button-secondary" id="memory-start">Xem nhịp hoa đầu tiên ↗</button><p class="game-help">Ba vòng: 3 → 4 → 5 nhịp. Hoa sẽ nở nhanh hơn mỗi vòng.</p>';
    $('.flower-collection').before(panel);
    $('.flowers .scene-subtitle').textContent='Nhớ được nhịp hoa nở, em sẽ mở được những lời nhắn.';
    $('.basket-row').hidden=true;
    document.querySelectorAll('[data-flower]').forEach(el=>{el.disabled=true;$('.flower-hint',el).textContent='Đợi nhịp hoa…';});
    $('#memory-start').onclick=playMemory;
    renderMemoryProgress();
  }
  function renderMemoryProgress() {
    const level = config.difficulty.memory[state.memoryRound];
    $('#memory-progress').innerHTML=Array.from({length:level.length},(_,i)=>`<span class="${i<state.memoryInput?'done':''}"></span>`).join('');
  }
  function playMemory() {
    if (state.busy || state.memoryUnlocked) return;
    state.busy=true; state.memoryReady=false; state.memoryInput=0;
    const level=config.difficulty.memory[state.memoryRound];
    if (!state.memorySequence.length) {
      for(let i=0;i<level.length;i++) {
        const choices=[0,1,2].filter(n=>n!==state.memorySequence[i-1]);
        state.memorySequence.push(choices[Math.floor(Math.random()*choices.length)]);
      }
    }
    renderMemoryProgress();
    $('#memory-level').textContent=`Vòng ${state.memoryRound+1} / 3 · ${level.length} nhịp`;
    $('#memory-prompt').textContent='Nhìn kỹ nhé… nhớ thứ tự những bông hoa sáng lên.';
    $('#memory-start').disabled=true;
    document.querySelectorAll('[data-flower]').forEach(el=>{el.disabled=true;el.classList.remove('wrong');$('.flower-hint',el).textContent='Nhìn kỹ nhé…';});
    let position=0;
    // Use real readable durations even when motion is reduced. Only decorative motion is removed.
    const schedule=(fn,ms)=>{const id=setTimeout(fn,ms);timers.push(id);};
    const cue=()=>{
      const el=$(`[data-flower="${state.memorySequence[position]}"]`);
      el.classList.add('is-cue');
      schedule(()=>{
        el.classList.remove('is-cue'); position++;
        if(position<state.memorySequence.length) schedule(cue,level.gap);
        else {
          state.busy=false;state.memoryReady=true;
          $('#memory-prompt').textContent=`Đến lượt em! Nhớ đủ ${level.length} nhịp nhé.`;
          $('#memory-start').disabled=false;$('#memory-start').textContent='Xem lại nhịp hoa ↺';
          document.querySelectorAll('[data-flower]').forEach(card=>{card.disabled=false;$('.flower-hint',card).textContent='Chạm theo thứ tự em nhớ';});
          status(`Đến lượt em. Hãy chạm ${level.length} bông theo đúng thứ tự.`);
        }
      },level.on);
    };
    schedule(cue,500);
  }
  function flowerTurn(index) {
    if(state.memoryUnlocked){pickFlower(index);return;}
    if(!state.memoryReady || state.busy)return;
    const card=$(`[data-flower="${index}"]`);
    if(index!==state.memorySequence[state.memoryInput]) {
      state.memoryReady=false;state.memoryInput=0;card.classList.add('wrong');renderMemoryProgress();
      $('#memory-prompt').textContent='Lệch một bông rồi. Xem lại và thử vòng này lần nữa nhé.';
      $('#memory-start').textContent='Xem lại và thử tiếp ↺';
      document.querySelectorAll('[data-flower]').forEach(el=>el.disabled=true);
      status('Chưa đúng thứ tự. Bấm xem lại để thử tiếp vòng này.');return;
    }
    state.memoryInput++;renderMemoryProgress();card.classList.add('is-cue');
    later(()=>card.classList.remove('is-cue'),200);
    const length=state.memorySequence.length;
    $('#memory-prompt').textContent=`Đúng rồi · ${state.memoryInput} / ${length} nhịp`;
    if(state.memoryInput!==length)return;
    state.memoryReady=false;
    document.querySelectorAll('[data-flower]').forEach(el=>el.disabled=true);
    if(state.memoryRound<config.difficulty.memory.length-1) {
      state.memoryRound++;state.memorySequence=[];state.memoryInput=0;
      $('#memory-prompt').textContent=`Qua vòng rồi! Vòng ${state.memoryRound+1} sẽ dài hơn và nhanh hơn một chút.`;
      $('#memory-start').textContent=`Sẵn sàng cho vòng ${state.memoryRound+1} ↗`;
      status($('#memory-prompt').textContent);
    } else {
      state.memoryUnlocked=true;$('.memory-game').classList.add('game-won');
      $('#memory-prompt').textContent='Em nhớ giỏi ghê. Cả ba lời nhắn đều mở rồi!';$('#memory-start').hidden=true;
      $('.memory-game .game-help').textContent='Giờ em có thể đọc các bông hoa theo bất kỳ thứ tự nào.';
      $('.basket-row').hidden=false;
      document.querySelectorAll('[data-flower]').forEach((el,i)=>{el.disabled=false;$('.flower-hint',el).textContent=config.flowerMessages[i].name+' ↗';});
      status('Đã hoàn thành cả ba vòng. Chạm vào từng bông để đọc lời nhắn.');
    }
  }

  function startLogicRound(round) {
    timers.forEach(clearTimeout); timers=[]; state.busy=false;
    logic.round=round;logic.selected=null;logic.solved=false;logic.attempts=0;
    const puzzle=config.logicPuzzles[round];
    logic.order=[...puzzle.flowers];
    for(let i=logic.order.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[logic.order[i],logic.order[j]]=[logic.order[j],logic.order[i]];}
    if(window.GardenPuzzles.check(logic.order,puzzle).correct) [logic.order[0],logic.order[1]]=[logic.order[1],logic.order[0]];
    stage.innerHTML=`<section class="scene logic-scene">${heading('THỬ THÁCH 03 · NGƯỜI LÀM VƯỜN THÔNG THÁI',puzzle.title,'Sắp xếp các bông hoa từ trái sang phải để tất cả manh mối đều đúng.')}<div class="logic-rounds">${config.logicPuzzles.map((p,i)=>`<span class="${i===round?'current':i<round?'passed':''}">${p.flowers.length} bông${i<round?' ✓':''}</span>`).join('<i aria-hidden="true">→</i>')}</div><div class="logic-clues"><p class="eyebrow">NHỮNG ĐIỀU ANH NHỚ ĐƯỢC</p><ol>${puzzle.clues.map(c=>`<li>${escape(c)}</li>`).join('')}</ol></div><p class="logic-directions">Chạm một bông, rồi chạm bông khác để đổi chỗ.<br>“Bên phải” không nhất thiết là “ngay bên phải”.</p><div class="logic-board" id="logic-board" aria-label="Luống hoa, sắp từ trái sang phải"></div><p id="logic-feedback" class="logic-feedback" aria-live="polite">Đủ ${puzzle.flowers.length} bông. Chỉ có một cách sắp đúng.</p><div class="logic-actions">${button('Kiểm tra luống hoa','check-logic')}<button class="text-button" id="logic-hint">Cần một gợi ý nhỏ?</button></div><p id="logic-hint-copy" class="logic-hint-copy" hidden>${escape(puzzle.hint)}</p><div id="logic-next-wrap" hidden>${button(round===config.logicPuzzles.length-1?'Mở album bí mật':'Đến luống hoa khó hơn','logic-next')}</div>${butterfly()}</section>`;
    renderLogicBoard();bindCommon();
    $('#check-logic').onclick=checkLogic;
    $('#logic-hint').onclick=()=>{$('#logic-hint-copy').hidden=false;$('#logic-hint').hidden=true;};
    $('#logic-next').onclick=()=>{if(!logic.solved)return;if(round+1<config.logicPuzzles.length)startLogicRound(round+1);else renderChapter(3);};
    window.scrollTo({top:0,behavior:'instant'});$('h1',stage).focus({preventScroll:true});
    status(`Vòng suy luận ${round+1}. ${puzzle.flowers.length} bông hoa.`);
  }
  function renderLogicBoard(focusIndex) {
    $('#logic-board').innerHTML=logic.order.map((type,i)=>`<button class="logic-flower ${logic.selected===i?'selected':''}" data-slot="${i}" aria-pressed="${logic.selected===i}" aria-label="Vị trí ${i+1}: ${flowerNames[type]}" ${logic.solved?'disabled':''}><span class="slot-number">${i+1}</span><span class="logic-flower-art">${flower(type)}</span><span>${flowerNames[type]}</span></button>`).join('');
    document.querySelectorAll('[data-slot]').forEach(el=>el.onclick=()=>selectLogicSlot(Number(el.dataset.slot)));
    if(focusIndex!==undefined)$(`[data-slot="${focusIndex}"]`).focus({preventScroll:true});
  }
  function selectLogicSlot(index) {
    if(logic.solved)return;
    if(logic.selected===null){logic.selected=index;$('#logic-feedback').textContent=`Đã chọn ${flowerNames[logic.order[index]]}. Chọn bông muốn đổi chỗ.`;}
    else if(logic.selected===index){logic.selected=null;$('#logic-feedback').textContent='Đã bỏ chọn. Em cứ thong thả suy nghĩ nhé.';}
    else {
      const first=logic.selected;
      [logic.order[first],logic.order[index]]=[logic.order[index],logic.order[first]];
      logic.selected=null;
      $('#logic-feedback').textContent='Đã đổi chỗ. Em đối chiếu lại các manh mối nhé.';
    }
    renderLogicBoard(index);
  }
  function checkLogic() {
    if(logic.solved)return;
    logic.attempts++;
    const result=window.GardenPuzzles.check(logic.order,config.logicPuzzles[logic.round]);
    if(!result.correct){$('#logic-feedback').textContent=`Đúng ${result.matched} / ${result.total} manh mối. Vẫn còn điều chưa khớp, thử cách khác nhé.`;status($('#logic-feedback').textContent);return;}
    logic.solved=true;logic.selected=null;renderLogicBoard();
    $('#logic-feedback').textContent=logic.round===2?'Đúng cả rồi! Em đã tìm ra cách sắp duy nhất. Album mở cửa đón em.':'Chính xác! Tất cả manh mối đều khớp.';
    $('.logic-actions').hidden=true;$('#logic-hint-copy').hidden=true;$('#logic-next-wrap').hidden=false;
    $('.logic-board').classList.add('solved');status($('#logic-feedback').textContent);$('#logic-next').focus({preventScroll:true});
  }
  function showDialog(label, title, message, art, action, done) {
    lastFocus = document.activeElement; dialogDone = done;
    $('#dialog-label').textContent = label; $('#dialog-title').textContent = text(title);
    $('#dialog-body').textContent = text(message); $('#dialog-art').innerHTML = art;
    $('#dialog-action').textContent = action;
    dialog.showModal();
  }
  function closeDialog() { dialog.close(); }
  $('#dialog-action').onclick = closeDialog; $('#close-dialog').onclick = closeDialog;
  dialog.addEventListener('close', () => {
    const done = dialogDone; dialogDone = null;
    if (done) done();
    if (lastFocus?.isConnected) lastFocus.focus({preventScroll:true});
  });
  dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) closeDialog(); } });
  function pickFlower(index) {
    const item = config.flowerMessages[index];
    const already = state.flowers.has(index);
    showDialog(item.subtitle.toLocaleUpperCase('vi'), item.name, item.message, flower(item.type), already ? 'Đọc lại vẫn thấy thương' : 'Cất vào giỏ hoa', () => {
      if (already) return;
      state.flowers.add(index);
      const card = $(`[data-flower="${index}"]`); card.classList.add('picked');
      $('.flower-hint', card).textContent = 'Đã cất vào giỏ · chạm để đọc lại';
      $('#basket-flowers').innerHTML = [...state.flowers].map(i => flower(config.flowerMessages[i].type)).join('');
      $('#basket-count').textContent = `Giỏ hoa của em · ${state.flowers.size} / 3`;
      if (state.flowers.size === 3) { $('#flowers-complete').hidden = false; status('Đã thu hoạch đủ ba bông hoa. Có thể khám phá tiếp.'); }
    });
  }

  const placeholder = `data:image/svg+xml;charset=utf-8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800"><rect width="600" height="800" fill="#f2e6dc"/><rect x="25" y="25" width="550" height="750" rx="160" fill="none" stroke="#c6ad9e"/><path d="M300 560V310M300 470Q170 430 190 350Q290 370 300 470M300 430Q420 380 410 320Q315 350 300 430" fill="#a9bea7" stroke="#829775" stroke-width="6"/><path d="M230 270Q270 270 300 310Q330 270 370 270Q370 390 300 400Q230 390 230 270" fill="#d995aa"/><text x="300" y="650" text-anchor="middle" fill="#6d535f" font-size="24" font-family="Georgia">A little moment to keep</text></svg>')}`;
  function loadImage(img, item) {
    img.onerror = () => { img.onerror = null; img.src = placeholder; img.classList.add('is-placeholder'); };
    img.classList.remove('is-placeholder');
    img.alt = text(item.alt || 'Một khoảnh khắc của {name}');
    img.style.objectPosition = item.objectPosition || '50% 50%';
    img.style.objectFit = item.fit || 'cover';
    img.src = item.src || placeholder;
  }
  function bindAlbum() {
    state.album = 'gallery';
    updatePhoto();
    $('#previous-photo').onclick = () => changePhoto(-1);
    $('#next-photo').onclick = () => changePhoto(1);
    $('#photo-open').onclick = () => showPhoto(config.photoGallery[state.photo] || {}, config.photoGallery[state.photo]?.caption || 'Một chỗ dành cho những khoảnh khắc sắp tới.');
    $('#special-photo').onclick = specialEnvelope;
    let touchX = 0, touchY = 0, swiped = false;
    const card = $('#gallery-card');
    card.addEventListener('touchstart', e => { touchX=e.changedTouches[0].clientX; touchY=e.changedTouches[0].clientY; swiped=false; }, {passive:true});
    card.addEventListener('touchend', e => { const dx=e.changedTouches[0].clientX-touchX, dy=e.changedTouches[0].clientY-touchY; if(Math.abs(dx)>40 && Math.abs(dx)>Math.abs(dy)) { swiped=true; changePhoto(dx<0?1:-1); } }, {passive:true});
    card.addEventListener('click', e => { if(swiped) { e.stopPropagation(); e.preventDefault(); swiped=false; } }, true);
    card.addEventListener('keydown', e => { if(e.key==='ArrowRight' || e.key==='ArrowLeft') { e.preventDefault(); changePhoto(e.key==='ArrowRight'?1:-1); } });
  }
  function updatePhoto() {
    const photos = config.photoGallery;
    const item = photos[state.photo] || {caption:'Một chỗ dành cho những khoảnh khắc sắp tới.'};
    loadImage($('#gallery-image'), item);
    $('#photo-caption').textContent = text(item.caption);
    $('#photo-count').textContent = `${String(photos.length ? state.photo+1 : 0).padStart(2,'0')} / ${String(photos.length).padStart(2,'0')}`;
    $('#previous-photo').disabled = state.photo === 0;
    $('#next-photo').disabled = state.photo >= photos.length-1;
    status(item.caption);
  }
  function changePhoto(direction) {
    if (state.busy || state.photo+direction < 0 || state.photo+direction >= config.photoGallery.length) return;
    state.busy = true;
    $('#gallery-card').classList.add('turning');
    later(() => { state.photo += direction; updatePhoto(); $('#gallery-card').classList.remove('turning'); state.busy=false; }, 220);
  }
  function showPhoto(item, caption) {
    lastFocus = document.activeElement;
    loadImage($('#full-photo'), {...item, fit:'contain'});
    $('#full-caption').textContent = text(caption); photoDialog.showModal();
  }
  $('#close-photo').onclick = () => photoDialog.close();
  photoDialog.addEventListener('close', () => { if(lastFocus?.isConnected) lastFocus.focus({preventScroll:true}); });
  function specialEnvelope() {
    state.album = 'special-envelope';
    $('#album-content').innerHTML = `<div class="special-envelope"><span class="handwritten">Anh để dành tấm này ở đây.</span><button id="reveal-couple" class="special-photo-envelope" aria-label="Mở bức ảnh chung"><span>SPECIAL PHOTO</span><strong>01</strong><i>của hai đứa mình</i><span class="small-seal">♡</span></button><p>Chạm để mở một điều đặc biệt.</p></div>`;
    $('#reveal-couple').onclick = revealCouple; $('#reveal-couple').focus({preventScroll:true});
  }
  function revealCouple() {
    state.album = 'couple';
    $('#album-content').innerHTML = `<div class="couple-layout"><div class="empty-polaroid ep-left"><span>một ngày<br>nào đó…</span></div><div class="polaroid couple-polaroid"><span class="washi-tape" aria-hidden="true"></span><button class="photo-open" id="couple-open" aria-label="Phóng to ảnh chung"><img id="couple-image" alt=""></button><p>our first little memory</p></div><div class="empty-polaroid ep-right"><span>và nhiều ngày<br>sau nữa.</span></div></div><div class="couple-copy"><p>${escape(config.couplePhotoMessages[0])}</p><p class="handwritten">${escape(config.couplePhotoMessages[1])}</p></div>${button('Đến món quà cuối nhé', 'to-finale')}<button class="text-button album-back" id="album-back">← Xem lại những tấm ảnh</button>`;
    loadImage($('#couple-image'), config.couplePhoto);
    $('#couple-open').onclick = () => showPhoto(config.couplePhoto, config.couplePhotoMessages[0]);
    $('#to-finale').onclick = () => renderChapter(4);
    $('#album-back').onclick = () => renderChapter(3);
    $('#couple-open').focus({preventScroll:true});
  }
  function showFinal() {
    state.letter = true; $('.finale').classList.add('is-reading'); $('.final-letter').hidden = false;
    $('.final-actions').hidden = true; $('.final-letter').setAttribute('tabindex','-1'); $('.final-letter').focus({preventScroll:true});
    later(() => $('.final-letter').scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'nearest'}), 100);
  }
  function hideFinal() {
    state.letter=false; $('.finale').classList.remove('is-reading'); $('.final-letter').hidden=true; $('.final-actions').hidden=false;
    $('#read-final').focus({preventScroll:true}); window.scrollTo({top:0,behavior:reduced.matches?'instant':'smooth'});
  }
  function reset() { state.water=0; state.flowers.clear(); state.photo=0; state.album='gallery'; state.letter=false; state.memoryRound=0; state.memorySequence=[];state.memoryInput=0;state.memoryReady=false;state.memoryUnlocked=false;logic.round=0;logic.order=[];logic.selected=null;logic.solved=false;logic.attempts=0;renderChapter(0); }

  document.title = text(config.ui.siteTitle);
  document.querySelectorAll('[data-name]').forEach(el => el.textContent = config.recipientName);
  $('meta[name="description"]').content = text('Một khu vườn nhỏ, một món quà ngày 20/10 dành riêng cho {name}.');
  $('.brand').onclick = e => { e.preventDefault(); reset(); };
  if (config.musicAvailable) {
    const audio = new Audio(config.musicSrc); audio.loop = true; audio.volume = .18;
    const control = $('#sound-button'); control.hidden=false;
    audio.addEventListener('error', () => { control.hidden=true; });
    control.onclick = async () => {
      if(audio.paused) { try { await audio.play(); control.textContent='♫'; control.setAttribute('aria-label','Tắt nhạc'); control.setAttribute('aria-pressed','true'); } catch { status('Chưa mở được nhạc. Em có thể thử lại nhé.'); } }
      else { audio.pause(); control.textContent='♪'; control.setAttribute('aria-label','Bật nhạc'); control.setAttribute('aria-pressed','false'); }
    };
    audio.load();
  }
  renderChapter(0, true);
})();
