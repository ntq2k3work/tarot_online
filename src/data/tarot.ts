export interface TarotCard {
  id: number;
  name: string;
  nameVi: string;
  type: 'major' | 'minor';
  suit?: 'wands' | 'cups' | 'swords' | 'pentacles';
  number?: number;
  keywords: string[];
  upright: string;
  reversed: string;
  description: string;
  symbol: string;
  image?: string;
}

const TAROT_IMAGE_BASE = 'https://raw.githubusercontent.com/krates98/tarotcardapi/main/images';

function getCardImageUrl(name: string, suit?: string, number?: number): string {
  const formattedName = name.toLowerCase().replace(/\s+/g, '');
  let filename: string;

  if (suit && number) {
    const suitMap: Record<string, string> = {
      wands: 'wands',
      cups: 'cups',
      swords: 'swords',
      pentacles: 'pentacles'
    };
    const numberNames: Record<number, string> = {
      1: 'ace',
      2: 'two',
      3: 'three',
      4: 'four',
      5: 'five',
      6: 'six',
      7: 'seven',
      8: 'eight',
      9: 'nine',
      10: 'ten',
      11: 'page',
      12: 'knight',
      13: 'queen',
      14: 'king'
    };
    const numStr = numberNames[number] || number;
    filename = `${numStr}of${suitMap[suit]}.jpeg`;
  } else {
    filename = `${formattedName}.jpeg`;
  }

  return `${TAROT_IMAGE_BASE}/${filename}`;
}

export const majorArcana: TarotCard[] = [
  {
    id: 0,
    name: 'The Fool',
    nameVi: 'Kẻ Ngốc',
    type: 'major',
    keywords: ['Khởi đầu', 'Phiêu lưu', 'Tự tin', 'Ngây thơ'],
    upright: 'Khởi đầu mới đầy hứng khởi, bước vào hành trình với lòng tin và sự ngây thơ. Đừng sợ hãi, hãy tin vào vũ trụ.',
    reversed: 'Sự liều lĩnh thái quá, thiếu suy nghĩ, hoặc sợ hãi không dám bước ra khỏi vùng an toàn.',
    description: 'Lá bài đại diện cho sự khởi đầu, tinh thần phiêu lưu và niềm tin vào cuộc đời.',
    symbol: '🃏'
  },
  {
    id: 1,
    name: 'The Magician',
    nameVi: 'Ảo Thuật Gia',
    type: 'major',
    keywords: ['Sức mạnh', 'Sáng tạo', 'Quyền năng', 'Hành động'],
    upright: 'Bạn có mọi công cụ cần thiết để thành công. Hãy sử dụng tài năng và ý chí để biến ước mơ thành hiện thực.',
    reversed: 'Kỹ năng bị lãng phí, thao túng, hoặc thiếu tự tin vào khả năng của bản thân.',
    description: 'Đại diện cho khả năng biến đổi, sáng tạo và hiện thực hóa ý muốn.',
    symbol: '🎭'
  },
  {
    id: 2,
    name: 'The High Priestess',
    nameVi: 'Nữ Tư Tế',
    type: 'major',
    keywords: ['Trực giác', 'Bí ẩn', 'Vô thức', 'Sự khôn ngoan'],
    upright: 'Lắng nghe trực giác bên trong. Có những bí mật đang được tiết lộ, hãy tin vào cảm nhận của bạn.',
    reversed: 'Bỏ qua trực giác, bí mật bị che giấu, hoặc rào cản tâm linh.',
    description: 'Biểu tượng cho trí tuệ tiềm ẩn, trực giác và những bí mật của vũ trụ.',
    symbol: '🌙'
  },
  {
    id: 3,
    name: 'The Empress',
    nameVi: 'Nữ Hoàng',
    type: 'major',
    keywords: ['Sự màu mỡ', 'Nuôi dưỡng', 'Tạo dựng', 'Tình yêu'],
    upright: 'Thời kỳ của sự phát triển, màu mỡ và nuôi dưỡng. Tình yêu và vẻ đẹp đang đến với bạn.',
    reversed: 'Sự sáng tạo bị kìm hãm, phụ thuộc, hoặc bỏ bê bản thân.',
    description: 'Đại diện cho tình mẫu tử, sự sáng tạo, màu mỡ và vẻ đẹp tự nhiên.',
    symbol: '👑'
  },
  {
    id: 4,
    name: 'The Emperor',
    nameVi: 'Hoàng Đế',
    type: 'major',
    keywords: ['Quyền lực', 'Cấu trúc', 'Lãnh đạo', 'Sự ổn định'],
    upright: 'Sự ổn định và quyền lực. Bạn đang ở vị trí kiểm soát, hãy thiết lập trật tự và kỷ luật.',
    reversed: 'Tham quyền, cứng nhắc, hoặc thiếu kiểm soát.',
    description: 'Biểu tượng cho quyền lực, cấu trúc, và khả năng lãnh đạo.',
    symbol: '🏛️'
  },
  {
    id: 5,
    name: 'The Hierophant',
    nameVi: 'Giáo Hoàng',
    type: 'major',
    keywords: ['Truyền thống', 'Niềm tin', 'Sự hướng dẫn', 'Cộng đồng'],
    upright: 'Tìm kiếm sự hướng dẫn từ truyền thống hoặc người có kinh nghiệm. Tham gia vào cộng đồng.',
    reversed: 'Phá vỡ truyền thống, nổi loạn, hoặc từ chối tuân theo quy tắc.',
    description: 'Đại diện cho giáo dục, truyền thống, và kết nối tâm linh.',
    symbol: '📿'
  },
  {
    id: 6,
    name: 'The Lovers',
    nameVi: 'Người Yêu',
    type: 'major',
    keywords: ['Tình yêu', 'Sự lựa chọn', 'Hài hòa', 'Mối quan hệ'],
    upright: 'Tình yêu đích thực, sự lựa chọn quan trọng, hoặc mối quan hệ hài hòa đang hình thành.',
    reversed: 'Mâu thuẫn trong mối quan hệ, sự lựa chọn sai lầm, hoặc mất cân bằng.',
    description: 'Biểu tượng cho tình yêu, sự lựa chọn và mối quan hệ đối tác.',
    symbol: '💕'
  },
  {
    id: 7,
    name: 'The Chariot',
    nameVi: 'Cỗ Xe',
    type: 'major',
    keywords: ['Chiến thắng', 'Ý chí', 'Sự quyết tâm', 'Kiểm soát'],
    upright: 'Chiến thắng đang đến gần. Với ý chí mạnh mẽ và sự quyết tâm, bạn sẽ vượt qua mọi thử thách.',
    reversed: 'Thiếu phương hướng, mất kiểm soát, hoặc sự xung đột nội tâm.',
    description: 'Đại diện cho chiến thắng, ý chí và khả năng vượt qua trở ngại.',
    symbol: '⚔️'
  },
  {
    id: 8,
    name: 'Strength',
    nameVi: 'Sức Mạnh',
    type: 'major',
    keywords: ['Dũng cảm', 'Kiên nhẫn', 'Sự kiểm soát', 'Lòng trắc ẩn'],
    upright: 'Sức mạnh bên trong, lòng dũng cảm và kiên nhẫn. Bạn có khả năng chế ngự mọi thử thách.',
    reversed: 'Tự tin yếu kém, nghi ngờ bản thân, hoặc thiếu lòng kiên nhẫn.',
    description: 'Biểu tượng cho sức mạnh tinh thần, lòng dũng cảm và sự kiên nhẫn.',
    symbol: '🦁'
  },
  {
    id: 9,
    name: 'The Hermit',
    nameVi: 'Ẩn Sĩ',
    type: 'major',
    keywords: ['Nội tâm', 'Sự cô độc', 'Tìm kiếm', 'Trí tuệ'],
    upright: 'Thời gian để lui về nội tâm, tìm kiếm sự thật và trí tuệ. Đừng sợ sự cô đơn.',
    reversed: 'Cô lập thái quá, từ chối sự giúp đỡ, hoặc tụt hậu xã hội.',
    description: 'Đại diện cho sự tìm kiếm bên trong, trí tuệ và cô độc.',
    symbol: '🏔️'
  },
  {
    id: 10,
    name: 'Wheel of Fortune',
    nameVi: 'Bánh Xe Số Phận',
    type: 'major',
    keywords: ['Vận may', 'Thay đổi', 'Vòng tuần hoàn', 'Định mệnh'],
    upright: 'Vận may đang đổi chiều, sự thay đổi tích cực đang đến. Cuộc sống luôn vận động.',
    reversed: 'Vận xui, sự thay đổi tiêu cực, hoặc chống lại dòng chảy tự nhiên.',
    description: 'Biểu tượng cho vận may, sự thay đổi và vòng tuần hoàn của cuộc sống.',
    symbol: '🎡'
  },
  {
    id: 11,
    name: 'Justice',
    nameVi: 'Công Lý',
    type: 'major',
    keywords: ['Công bằng', 'Sự thật', 'Luật pháp', 'Quyết định'],
    upright: 'Công bằng sẽ được thực thi. Hãy đưa ra quyết định dựa trên sự thật và lý lẽ.',
    reversed: 'Bất công, thiếu trung thực, hoặc từ chối trách nhiệm.',
    description: 'Đại diện cho công lý, sự thật và hậu quả của hành động.',
    symbol: '⚖️'
  },
  {
    id: 12,
    name: 'The Hanged Man',
    nameVi: 'Người Treo Cổ',
    type: 'major',
    keywords: ['Hy sinh', 'Chờ đợi', 'Góc nhìn mới', 'Buông bỏ'],
    upright: 'Dừng lại và nhìn từ góc độ mới. Sự hy sinh tạm thời sẽ mang lại hiểu biết sâu sắc.',
    reversed: 'Trì hoãn, cản trở, hoặc từ chối buông bỏ những gì không còn phù hợp.',
    description: 'Biểu tượng cho sự hy sinh, góc nhìn mới và buông bỏ.',
    symbol: '🙃'
  },
  {
    id: 13,
    name: 'Death',
    nameVi: 'Cái Chết',
    type: 'major',
    keywords: ['Kết thúc', 'Chuyển đổi', 'Tái sinh', 'Sự lột xác'],
    upright: 'Kết thúc một giai đoạn để bắt đầu giai đoạn mới. Sự chuyển đổi và tái sinh.',
    reversed: 'Sợ hãi sự thay đổi, bám víu vào quá khứ, hoặc chối từ kết thúc.',
    description: 'Đại diện cho sự kết thúc, chuyển đổi và tái sinh - không phải cái chết theo nghĩa đen.',
    symbol: '🦋'
  },
  {
    id: 14,
    name: 'Temperance',
    nameVi: 'Sự Điều Độ',
    type: 'major',
    keywords: ['Cân bằng', 'Kiên nhẫn', 'Hài hòa', 'Trung dung'],
    upright: 'Tìm kiếm sự cân bằng và hài hòa. Kiên nhẫn và điều độ sẽ mang lại kết quả tốt đẹp.',
    reversed: 'Thiếu cân bằng, thái quá, hoặc mâu thuẫn nội tâm.',
    description: 'Biểu tượng cho sự cân bằng, kiên nhẫn và hài hòa.',
    symbol: '☯️'
  },
  {
    id: 15,
    name: 'The Devil',
    nameVi: 'Quỷ Dữ',
    type: 'major',
    keywords: ['Ràng buộc', 'Cám dỗ', 'Vật chất', 'Bóng tối'],
    upright: 'Cảnh giác với những cám dỗ và ràng buộc không lành mạnh. Nhận ra xiềng xích của bạn.',
    reversed: 'Giải phóng khỏi sự ràng buộc, phá vỡ thói quen xấu, hoặc đối mặt với bóng tối.',
    description: 'Đại diện cho những ràng buộc, cám dỗ và mặt tối của bản thân.',
    symbol: '😈'
  },
  {
    id: 16,
    name: 'The Tower',
    nameVi: 'Tháp Babel',
    type: 'major',
    keywords: ['Biến động', 'Sụp đổ', 'Tái thiết', 'Sự thật'],
    upright: 'Sự sụp đổ bất ngờ của những cấu trúc không vững chắc. Tái thiết từ đống đổ nát.',
    reversed: 'Trì hoãn sự sụp đổ, tránh né thay đổi, hoặc sợ hãi biến động.',
    description: 'Biểu tượng cho sự biến động, sụp đổ để tái thiết.',
    symbol: '🗼'
  },
  {
    id: 17,
    name: 'The Star',
    nameVi: 'Ngôi Sao',
    type: 'major',
    keywords: ['Hy vọng', 'Cảm hứng', 'Sự thanh thản', 'Niềm tin'],
    upright: 'Hy vọng và sự chữa lành đang đến. Thời kỳ của sự thanh thản và cảm hứng.',
    reversed: 'Mất niềm tin, tuyệt vọng, hoặc ngắt kết nối với cảm hứng.',
    description: 'Đại diện cho hy vọng, sự chữa lành và cảm hứng.',
    symbol: '⭐'
  },
  {
    id: 18,
    name: 'The Moon',
    nameVi: 'Mặt Trăng',
    type: 'major',
    keywords: ['Ảo giác', 'Nỗi sợ', 'Vô thức', 'Bí ẩn'],
    upright: 'Những ảo giác và nỗi sợ đang nổi lên. Hãy tin vào trực giác để tìm ra sự thật.',
    reversed: 'Sự thật được tiết lộ, giải tỏa nỗi sợ, hoặc thoát khỏi sự nhầm lẫn.',
    description: 'Biểu tượng cho ảo giác, nỗi sợ và những điều ẩn giấu.',
    symbol: '🌙'
  },
  {
    id: 19,
    name: 'The Sun',
    nameVi: 'Mặt Trời',
    type: 'major',
    keywords: ['Niềm vui', 'Thành công', 'Sự tích cực', 'Hạnh phúc'],
    upright: 'Thời kỳ rực rỡ! Niềm vui, thành công và hạnh phúc đang đến với bạn.',
    reversed: 'Tạm thời giảm sút, sự lạc quan thái quá, hoặc thiếu nhiệt huyết.',
    description: 'Đại diện cho niềm vui, thành công và năng lượng tích cực.',
    symbol: '☀️'
  },
  {
    id: 20,
    name: 'Judgement',
    nameVi: 'Phán Quyết',
    type: 'major',
    keywords: ['Sự thức tỉnh', 'Đánh giá', 'Sự cứu rỗi', 'Quyết định'],
    upright: 'Thức tỉnh và đánh giá lại cuộc đời. Thời điểm để đưa ra những quyết định quan trọng.',
    reversed: 'Từ chối thay đổi, sợ hãi đánh giá, hoặc nghi ngờ bản thân.',
    description: 'Biểu tượng cho sự thức tỉnh, đánh giá và quyết định.',
    symbol: '📯'
  },
  {
    id: 21,
    name: 'The World',
    nameVi: 'Thế Giới',
    type: 'major',
    keywords: ['Hoàn thành', 'Tích hợp', 'Thành tựu', 'Sự trọn vẹn'],
    upright: 'Hoàn thành một chu kỳ, thành tựu và sự trọn vẹn. Bạn đã đi đến đích.',
    reversed: 'Sự hoàn thành bị trì hoãn, thiếu kết thúc, hoặc tìm kiếm sự trọn vẹn.',
    description: 'Đại diện cho sự hoàn thành, thành tựu và trọn vẹn.',
    symbol: '🌍'
  }
];

const createMinorArcana = (): TarotCard[] => {
  const suits = [
    { name: 'wands', nameVi: 'Gậy', element: 'Lửa', keywords: ['hành động', 'đam mê', 'sáng tạo'] },
    { name: 'cups', nameVi: 'Cốc', element: 'Nước', keywords: ['cảm xúc', 'tình yêu', 'trực giác'] },
    { name: 'swords', nameVi: 'Kiếm', element: 'Khí', keywords: ['tư duy', 'sự thật', 'xung đột'] },
    { name: 'pentacles', nameVi: 'Tiền', element: 'Đất', keywords: ['vật chất', 'tài chính', 'thực tế'] }
  ];

  const cardMeanings: Record<number, { upright: string; reversed: string; keywords: string[] }> = {
    1: {
      upright: 'Khởi đầu mới, tiềm năng vô hạn, cơ hội của vận mệnh.',
      reversed: 'Cơ hội bị bỏ lỡ, khởi đầu trì trệ, tiềm năng chưa được khai phá.',
      keywords: ['Khởi đầu', 'Cơ hội', 'Tiềm năng']
    },
    2: {
      upright: 'Sự lựa chọn, cân bằng, đối tác.',
      reversed: 'Mâu thuẫn, thiếu quyết định, mất cân bằng.',
      keywords: ['Lựa chọn', 'Cân bằng', 'Đối tác']
    },
    3: {
      upright: 'Hợp tác, phát triển, kỹ năng nhóm.',
      reversed: 'Thiếu phối hợp, dự án thất bại, làm việc đơn độc.',
      keywords: ['Hợp tác', 'Phát triển', 'Nhóm']
    },
    4: {
      upright: 'Ổn định, kiểm soát, nền tảng vững chắc.',
      reversed: 'Bất ổn, thiếu kiểm soát, nền tảng lung lay.',
      keywords: ['Ổn định', 'Kiểm soát', 'Nền tảng']
    },
    5: {
      upright: 'Thử thách, xung đột, mất mát.',
      reversed: 'Vượt qua khó khăn, chấp nhận, hy vọng mới.',
      keywords: ['Thử thách', 'Xung đột', 'Mất mát']
    },
    6: {
      upright: 'Thành công, sự hào phóng, công nhận.',
      reversed: 'Tự mãn, thiếu công bằng, nợ nần.',
      keywords: ['Thành công', 'Hào phóng', 'Công nhận']
    },
    7: {
      upright: 'Đánh giá, phòng thủ, kiên định.',
      reversed: 'Thiếu tập trung, phòng vệ thái quá, mất phương hướng.',
      keywords: ['Đánh giá', 'Phòng thủ', 'Kiên định']
    },
    8: {
      upright: 'Hành động nhanh, thay đổi, di chuyển.',
      reversed: 'Trì hoãn, mắc kẹt, thiếu hành động.',
      keywords: ['Hành động', 'Thay đổi', 'Di chuyển']
    },
    9: {
      upright: 'Sức mạnh, kiên nhẫn, gần đạt mục tiêu.',
      reversed: 'Yếu đuối, thiếu kiên nhẫn, mệt mỏi.',
      keywords: ['Sức mạnh', 'Kiên nhẫn', 'Gần đích']
    },
    10: {
      upright: 'Hoàn thành, gánh nặng, thành tựu cuối cùng.',
      reversed: 'Gánh nặng thái quá, thất bại, từ bỏ.',
      keywords: ['Hoàn thành', 'Gánh nặng', 'Thành tựu']
    },
    11: {
      upright: 'Sự công bằng, cân bằng, sự thật được tiết lộ.',
      reversed: 'Bất công, mất cân bằng, sự thật bị che giấu.',
      keywords: ['Công bằng', 'Cân bằng', 'Sự thật']
    },
    12: {
      upright: 'Sự hiến dâng, hy sinh, đợi chờ.',
      reversed: 'Từ bỏ, thiếu hiến dâng, mất phương hướng.',
      keywords: ['Hiến dâng', 'Hy sinh', 'Đợi chờ']
    },
    13: {
      upright: 'Kết thúc, chuyển đổi, buông bỏ.',
      reversed: 'Sợ hãi thay đổi, bám víu, chối từ.',
      keywords: ['Kết thúc', 'Chuyển đổi', 'Buông bỏ']
    },
    14: {
      upright: 'Cân bằng, điều độ, hòa hợp.',
      reversed: 'Thiếu cân bằng, thái quá, mâu thuẫn.',
      keywords: ['Cân bằng', 'Điều độ', 'Hòa hợp']
    }
  };

  const courtCards = [
    {
      name: 'Page',
      nameVi: 'Hậu',
      upright: 'Sự tò mò, khám phá, tin tức mới.',
      reversed: 'Bất trưởng thành, tin xấu, thiếu tập trung.',
      keywords: ['Tò mò', 'Khám phá', 'Tin tức']
    },
    {
      name: 'Knight',
      nameVi: 'Mã',
      upright: 'Hành động, nhiệt huyết, sự tiến triển.',
      reversed: 'Vội vàng, liều lĩnh, thiếu kiên nhẫn.',
      keywords: ['Hành động', 'Nhiệt huyết', 'Tiến triển']
    },
    {
      name: 'Queen',
      nameVi: 'Vương Hậu',
      upright: 'Trực giác, nuôi dưỡng, sự thấu hiểu.',
      reversed: 'Cảm xúc thái quá, thiếu nuôi dưỡng, bất an.',
      keywords: ['Trực giác', 'Nuôi dưỡng', 'Thấu hiểu']
    },
    {
      name: 'King',
      nameVi: 'Vương',
      upright: 'Quyền lực, lãnh đạo, sự kiểm soát.',
      reversed: 'Tham quyền, độc đoán, thiếu kiểm soát.',
      keywords: ['Quyền lực', 'Lãnh đạo', 'Kiểm soát']
    }
  ];

  const cards: TarotCard[] = [];
  let id = 22;

  for (const suit of suits) {
    for (let num = 1; num <= 14; num++) {
      const isCourt = num > 10;
      const courtIndex = num - 11;
      const meanings = isCourt ? courtCards[courtIndex] : cardMeanings[num];

      let cardName: string;
      let cardNameVi: string;

      if (isCourt) {
        cardName = `${courtCards[courtIndex].name} of ${suit.name.charAt(0).toUpperCase() + suit.name.slice(1)}`;
        cardNameVi = `${courtCards[courtIndex].nameVi} ${suit.nameVi}`;
      } else {
        cardName = num === 1 ? `Ace of ${suit.name.charAt(0).toUpperCase() + suit.name.slice(1)}` : `${num} of ${suit.name.charAt(0).toUpperCase() + suit.name.slice(1)}`;
        cardNameVi = num === 1 ? `Át ${suit.nameVi}` : `${num} ${suit.nameVi}`;
      }

      cards.push({
        id: id++,
        name: cardName,
        nameVi: cardNameVi,
        type: 'minor',
        suit: suit.name as TarotCard['suit'],
        number: num,
        keywords: meanings.keywords,
        upright: meanings.upright,
        reversed: meanings.reversed,
        description: `Lá bài ${cardNameVi} thuộc chất ${suit.nameVi} (${suit.element}), đại diện cho ${suit.keywords.join(', ')}.`,
        symbol: suit.name === 'wands' ? '🔥' : suit.name === 'cups' ? '💧' : suit.name === 'swords' ? '⚔️' : '💰',
        image: getCardImageUrl(cardName, suit.name, num)
      });
    }
  }

  return cards;
};

export const minorArcana = createMinorArcana();

export const allTarotCards: TarotCard[] = [...majorArcana, ...minorArcana];

const majorArcanaImageMap: Record<string, string> = {
  'The Fool': 'thefool.jpeg',
  'The Magician': 'themagician.jpeg',
  'The High Priestess': 'thehighpriestess.jpeg',
  'The Empress': 'theempress.jpeg',
  'The Emperor': 'theemperor.jpeg',
  'The Hierophant': 'thehierophant.jpeg',
  'The Lovers': 'TheLovers.jpg',
  'The Chariot': 'thechariot.jpeg',
  'Strength': 'thestrength.jpeg',
  'The Hermit': 'thehermit.jpeg',
  'Wheel of Fortune': 'wheeloffortune.jpeg',
  'Justice': 'justice.jpeg',
  'The Hanged Man': 'thehangedman.jpeg',
  'Death': 'death.jpeg',
  'Temperance': 'temperance.jpeg',
  'The Devil': 'thedevil.jpeg',
  'The Tower': 'thetower.jpeg',
  'The Star': 'thestar.jpeg',
  'The Moon': 'themoon.jpeg',
  'The Sun': 'thesun.jpeg',
  'Judgement': 'judgement.jpeg',
  'The World': 'theworld.jpeg',
};

majorArcana.forEach((card) => {
  const imageFile = majorArcanaImageMap[card.name];
  if (imageFile) {
    card.image = `${TAROT_IMAGE_BASE}/${imageFile}`;
  }
});

export const spreadTypes = [
  {
    id: 'single',
    name: 'Rút 1 Lá',
    nameVi: 'Một Lá',
    description: 'Lá bài đơn giản, trả lời câu hỏi có/không hoặc hướng dẫn nhanh.',
    cardCount: 1,
    positions: [{ name: 'Câu trả lời', description: 'Thông điệp chính từ vũ trụ' }]
  },
  {
    id: 'three',
    name: 'Trải 3 Lá',
    nameVi: 'Ba Lá',
    description: 'Trải bài phổ biến cho quá khứ - hiện tại - tương lai.',
    cardCount: 3,
    positions: [
      { name: 'Quá khứ', description: 'Những gì đã xảy ra' },
      { name: 'Hiện tại', description: 'Tình trạng hiện tại' },
      { name: 'Tương lai', description: 'Điều có thể xảy ra' }
    ]
  },
  {
    id: 'celtic',
    name: 'Trải Celtic Cross',
    nameVi: 'Thập Tự Celtic',
    description: 'Trải bài chi tiết, phân tích toàn diện tình huống.',
    cardCount: 10,
    positions: [
      { name: 'Bản thân', description: 'Vị trí hiện tại' },
      { name: 'Thách thức', description: 'Vấn đề đối mặt' },
      { name: 'Quá khứ', description: 'Gốc rễ vấn đề' },
      { name: 'Tương lai gần', description: 'Điều sắp đến' },
      { name: 'Mục tiêu', description: 'Kết quả mong muốn' },
      { name: 'Vô thức', description: 'Điều ẩn giấu' },
      { name: 'Bản thân', description: 'Thái độ của bạn' },
      { name: 'Môi trường', description: 'Ảnh hưởng bên ngoài' },
      { name: 'Hy vọng/Nỗi sợ', description: 'Điều bạn mong chờ hoặc sợ hãi' },
      { name: 'Kết quả', description: 'Kết quả cuối cùng' }
    ]
  },
  {
    id: 'love',
    name: 'Trải Tình Yêu',
    nameVi: 'Tình Yêu',
    description: 'Trải bài chuyên về mối quan hệ và tình cảm.',
    cardCount: 5,
    positions: [
      { name: 'Bạn', description: 'Vị trí của bạn trong mối quan hệ' },
      { name: 'Đối phương', description: 'Vị trí của người kia' },
      { name: 'Mối quan hệ', description: 'Tình trạng hiện tại' },
      { name: 'Điểm mạnh', description: 'Điều tích cực' },
      { name: 'Điểm yếu', description: 'Điều cần cải thiện' }
    ]
  },
  {
    id: 'career',
    name: 'Trải Sự Nghiệp',
    nameVi: 'Sự Nghiệp',
    description: 'Hướng dẫn về công việc và con đường sự nghiệp.',
    cardCount: 5,
    positions: [
      { name: 'Hiện tại', description: 'Tình trạng công việc' },
      { name: 'Thách thức', description: 'Vấn đề cần giải quyết' },
      { name: 'Cơ hội', description: 'Điều có thể tận dụng' },
      { name: 'Lời khuyên', description: 'Hướng đi nên chọn' },
      { name: 'Kết quả', description: 'Kết quả tiềm năng' }
    ]
  }
];

export const tarotReaders = [
  {
    id: 1,
    name: 'Luna Mystic',
    nameVi: 'Luna Thần Bí',
    specialty: 'Tình yêu & Mối quan hệ',
    experience: '10 năm kinh nghiệm',
    rating: 4.9,
    reviews: 1250,
    bio: 'Chuyên gia về tình yêu và mối quan hệ. Giúp bạn hiểu rõ bản thân và đối phương.',
    avatar: '🌙',
    available: true
  },
  {
    id: 2,
    name: 'Phoenix Sage',
    nameVi: 'Phoenix Trí Giả',
    specialty: 'Sự nghiệp & Tài chính',
    experience: '15 năm kinh nghiệm',
    rating: 4.8,
    reviews: 980,
    bio: 'Tư vấn sự nghiệp và tài chính. Hướng dẫn bạn đến thành công và thịnh vượng.',
    avatar: '🔥',
    available: true
  },
  {
    id: 3,
    name: 'Aurora Seer',
    nameVi: 'Aurora Tiên Tri',
    specialty: 'Tâm linh & Phát triển bản thân',
    experience: '8 năm kinh nghiệm',
    rating: 4.9,
    reviews: 756,
    bio: 'Kết nối với năng lượng vũ trụ để mang lại sự chữa lành và thức tỉnh.',
    avatar: '✨',
    available: false
  },
  {
    id: 4,
    name: 'Shadow Walker',
    nameVi: 'Shadow Người Đưa Đường',
    specialty: 'Bóng tối & Chữa lành',
    experience: '12 năm kinh nghiệm',
    rating: 4.7,
    reviews: 623,
    bio: 'Giúp bạn đối mặt và chữa lành những tổn thương sâu kín nhất.',
    avatar: '🌑',
    available: true
  }
];
