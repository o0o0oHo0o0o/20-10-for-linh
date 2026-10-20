// Chỉ cần sửa nội dung ở đây. {name} tự đổi theo recipientName.
window.GARDEN_CONFIG = {
  recipientName: 'Linh',
  senderName: 'Anh',
  introduction: ['Chào {name}!', 'Quà 20/10 của em đây!', 'Nhưng trước tiên, có vài thử thách nhỏ.', 'Thử xem em phá đảo được không nhé!'],
  flowerMessages: [
    { type: 'tulip', name: 'Vui vẻ mỗi ngày', subtitle: 'Tulip hồng', message: 'Chúc {name} nhiều niềm vui, ít deadline và ăn gì cũng ngon!' },
    { type: 'daisy', name: 'Khỏe và dẻo dai', subtitle: 'Cúc trắng', message: 'Chúc em luôn khỏe và tập được thêm nhiều tư thế yoga mới nhé!' },
    { type: 'peony', name: 'Thêm nhiều ngày vui', subtitle: 'Mẫu đơn hồng', message: 'Chúc em làm được những điều mình thích. Hôm nào mình đi chơi tiếp nhé!' }
  ],
  photoGallery: [
    { src: './assets/images/linh-02.png', caption: 'Tấm này anh thích.', alt: '{name} mỉm cười ở quán cà phê', objectPosition: '50% 47%' },
    { src: './assets/images/linh-04.png', caption: 'Tạo dáng có đầu tư.', alt: '{name} mặc áo xanh, tạo dáng trước quán cà phê', objectPosition: '55% 48%' },
    { src: './assets/images/linh-01.png', caption: 'Biểu cảm này được đấy!', alt: '{name} đeo kính và tạo biểu cảm tinh nghịch', objectPosition: '50% 40%' },
    { src: './assets/images/linh-yoga.png', caption: 'Chúc em tập được thêm nhiều tư thế mới nhé!', alt: '{name} đang tập một tư thế yoga trên thảm', objectPosition: '50% 50%', fit: 'contain', tag: 'Yoga lên trình!' },
    { src: './assets/images/linh-05.png', caption: 'Nghỉ tạo dáng một chút.', alt: '{name} tựa tay lên má ở quán cà phê', objectPosition: '50% 60%' },
    { src: './assets/images/linh-06.png', caption: 'Tấm này không được xóa nhé.', alt: '{name} chụp ảnh với biểu cảm phụng phịu đáng yêu', objectPosition: '50% 45%' }
  ],
  couplePhoto: { src: './assets/images/couple-01.png', alt: 'Bức ảnh chung của hai đứa', objectPosition: '50% 50%', fit: 'contain' },
  couplePhotoMessages: ['Mới có một tấm ảnh chung.', 'Hôm nào chụp thêm nhé!'],
  finalLetter: [
    '20/10 vui vẻ nhé, {name}!',
    'Chúc mừng em đã phá đảo khu vườn! Nhận hoa thôi.',
    'Chúc em luôn vui, khỏe và tập được thêm nhiều tư thế yoga mới.',
    'Hôm nào mình đi chơi và chụp thêm ảnh nhé!'
  ],
  signature: 'Người làm vườn',
  easterEggMessage: 'Bướm này không có điểm thưởng đâu. Nhưng chúc em 20/10 vui vẻ thêm lần nữa!',
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
    openingTitle: 'Linh ơi,\ncó quà 20/10 này!',
    openingSubtitle: 'Vượt vài thử thách rồi nhận quà nhé.',
    gardenTitle: 'Tưới hoa nào!',
    gardenIntro: 'Hoa chưa chịu lớn. Thử tài tưới cây của em nào.',
    wateringMessages: ['Chạm vào bình tưới, giúp anh một chút nhé.', 'Lên mầm rồi nè!', 'Sắp nở rồi, cố lên!', 'Hoa nở rồi! Mát tay đấy.'],
    flowersTitle: 'Ba bông hoa,\nba lời chúc.',
    albumTitle: 'Một vài tấm ảnh\nanh thích.',
    finalTitle: 'Happy 20/10, {name}!',
    finalSubtitle: 'Phá đảo rồi!\nBó hoa này của em.'
  }
};
