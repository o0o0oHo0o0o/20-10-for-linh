// Chỉ cần sửa nội dung ở đây. {name} tự đổi theo recipientName.
window.GARDEN_CONFIG = {
  recipientName: 'Linh',
  senderName: 'Anh',
  introduction: ['Chào {name}!', 'Hôm nay anh có một món quà nho nhỏ.', 'Nhưng hình như có vài bông hoa đang không chịu hợp tác với anh…', 'Hay em thử giúp anh một chút nhé?'],
  flowerMessages: [
    { type: 'tulip', name: 'Một chút niềm vui', subtitle: 'Tulip hồng', message: 'Chúc {name} lúc nào cũng có thật nhiều chuyện vui. Còn những chuyện không vui thì mong chúng chóng qua một chút.' },
    { type: 'daisy', name: 'Một chút bình yên', subtitle: 'Cúc trắng', message: 'Mong em luôn khỏe mạnh, làm được những điều mình thích. Chúc em tập thêm được thật nhiều tư thế yoga mới, và nhớ dành thời gian nghỉ ngơi nữa nhé.' },
    { type: 'peony', name: 'Một chút thương', subtitle: 'Mẫu đơn hồng', message: 'Cảm ơn em vì đã khiến những ngày gần đây của anh có thêm một điều để mong chờ.' }
  ],
  photoGallery: [
    { src: './assets/images/linh-02.png', caption: 'Tấm này anh thích.', alt: '{name} mỉm cười ở quán cà phê', objectPosition: '50% 47%' },
    { src: './assets/images/linh-04.png', caption: 'Một chiếc ảnh rất dễ thương.', alt: '{name} mặc áo xanh, tạo dáng trước quán cà phê', objectPosition: '55% 48%' },
    { src: './assets/images/linh-01.png', caption: 'Cho anh lưu vào bộ sưu tập nhé.', alt: '{name} đeo kính và tạo biểu cảm tinh nghịch', objectPosition: '50% 40%' },
    { src: './assets/images/linh-yoga.png', caption: 'Chúc em chinh phục thêm thật nhiều tư thế yoga mới nhé!', alt: '{name} đang tập một tư thế yoga trên thảm', objectPosition: '50% 50%', fit: 'contain', tag: 'Mỗi ngày, thêm một chút dẻo dai' },
    { src: './assets/images/linh-05.png', caption: 'Thêm một khoảnh khắc anh muốn giữ.', alt: '{name} tựa tay lên má ở quán cà phê', objectPosition: '50% 60%' },
    { src: './assets/images/linh-06.png', caption: 'Và cả phiên bản tinh nghịch này nữa.', alt: '{name} chụp ảnh với biểu cảm phụng phịu đáng yêu', objectPosition: '50% 45%' }
  ],
  couplePhoto: { src: './assets/images/couple-01.png', alt: 'Bức ảnh chung của hai đứa', objectPosition: '50% 50%', fit: 'contain' },
  couplePhotoMessages: ['Ảnh chung của mình mới có một tấm thôi…', 'Nhưng anh nghĩ album này vẫn còn nhiều chỗ trống.'],
  finalLetter: [
    '20/10 vui vẻ nhé, {name}!',
    'Anh định tặng em một bó hoa, nhưng nghĩ mãi rồi lại muốn làm thêm một điều gì đó hơi khác một chút. Thế là khu vườn nhỏ này ra đời.',
    'Mong em có một ngày thật vui, nhận được nhiều điều dễ thương và luôn cảm thấy được quan tâm. Chúc em tập được thêm nhiều tư thế yoga mới, từng chút một, theo nhịp của riêng em.',
    'Mình mới bắt đầu có thêm những kỷ niệm cùng nhau thôi. Cứ từ từ tận hưởng những ngày sắp tới là được, nhỉ?',
    'Cảm ơn em vì đã làm cho những ngày gần đây của anh đặc biệt hơn một chút.',
    'Thương em!'
  ],
  signature: 'Từ anh, với một chút thương',
  easterEggMessage: 'Bí mật nè: Thật ra hoa ở đây chẳng cần tưới nước đâu. Anh chỉ kiếm cớ để em ở lại lâu hơn một chút thôi.',
  musicEnabledByDefault: false,
  // Thêm file này rồi đổi musicAvailable thành true nếu muốn có nút bật nhạc.
  musicAvailable: false,
  musicSrc: './assets/audio/background.mp3',
  logicPuzzles: [
    {
      title: 'Một luống hoa nhỏ',
      flowers: ['tulip', 'daisy', 'peony'],
      clues: ['Cúc đứng ngoài cùng bên trái.', 'Tulip đứng ngay bên trái Mẫu đơn.'],
      rules: [
        { type: 'position', flower: 'daisy', value: 0 },
        { type: 'adjacent', left: 'tulip', right: 'peony' }
      ],
      hint: 'Đặt bông có vị trí chắc chắn trước, rồi xét hai chỗ còn lại.'
    },
    {
      title: 'Thêm hoa, thêm một chút nghĩ',
      flowers: ['tulip', 'daisy', 'peony', 'lavender'],
      clues: ['Tulip đứng bên phải Cúc.', 'Có đúng hai bông nằm giữa Oải hương và Tulip.', 'Mẫu đơn đứng ngay bên trái Cúc.', 'Oải hương không đứng ở cuối luống.'],
      rules: [
        { type: 'before', left: 'daisy', right: 'tulip' },
        { type: 'gap', left: 'lavender', right: 'tulip', value: 2 },
        { type: 'adjacent', left: 'peony', right: 'daisy' },
        { type: 'notPosition', flower: 'lavender', value: 3 }
      ],
      hint: 'Trong luống bốn bông, hai bông có hai bông khác nằm giữa thì phải ở đâu?'
    },
    {
      title: 'Câu đố cuối của người làm vườn',
      flowers: ['tulip', 'daisy', 'peony', 'lavender', 'hydrangea'],
      clues: ['Tulip không nằm ở hai đầu luống.', 'Có đúng hai bông nằm giữa Mẫu đơn và Cẩm tú cầu.', 'Oải hương đứng ngay bên trái Tulip.', 'Cúc đứng bên phải Tulip.', 'Mẫu đơn đứng bên trái Oải hương.'],
      rules: [
        { type: 'notEdge', flower: 'tulip' },
        { type: 'gap', left: 'peony', right: 'hydrangea', value: 2 },
        { type: 'adjacent', left: 'lavender', right: 'tulip' },
        { type: 'before', left: 'tulip', right: 'daisy' },
        { type: 'before', left: 'peony', right: 'lavender' }
      ],
      hint: 'Ghép Oải hương–Tulip thành một cặp. Mẫu đơn phải ở trước cặp đó, còn Cúc ở phía sau. Sau đó mới xét khoảng cách tới Cẩm tú cầu.'
    }
  ],
  difficulty: {
    // Mỗi lần đúng, tốc độ tăng và vùng tưới thu hẹp. Sai lùi một nấc.
    watering: [
      { center: 52, width: 30, period: 3200 },
      { center: 67, width: 24, period: 2700 },
      { center: 35, width: 18, period: 2300 }
    ],
    // Ba vòng ghi nhớ: 3, 4 rồi 5 bông; nhịp gợi ý cũng nhanh dần.
    memory: [
      { length: 3, on: 700, gap: 320 },
      { length: 4, on: 580, gap: 280 },
      { length: 5, on: 460, gap: 240 }
    ]
  },
  ui: {
    siteTitle: 'Khu vườn nhỏ của {name}',
    openingTitle: 'Có một khu vườn nhỏ,\nđang đợi em ghé qua.',
    openingSubtitle: 'Và một người đã để dành tất cả những bông hoa này cho em.',
    gardenTitle: 'Một bông hoa\nđang đợi em.',
    gardenIntro: 'Anh trồng thử một bông hoa cho em. Nhưng mà… nó chưa chịu lớn.',
    wateringMessages: ['Chạm vào bình tưới, giúp anh một chút nhé.', 'Một chiếc mầm nhỏ. Có tiến triển rồi nè!', 'Thêm chút nữa thôi, hình như sắp được rồi…', 'Ơ, hóa ra nó đợi em thật.'],
    flowersTitle: 'Ba bông hoa,\nba điều muốn nói.',
    albumTitle: 'Những điều nhỏ xíu,\nanh muốn giữ lại.',
    finalTitle: 'Happy 20/10, {name}!',
    finalSubtitle: 'Anh không giỏi trồng hoa lắm.\nMay mà lần này có em giúp.'
  }
};
