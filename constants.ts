import { ChartDataPoint, MoodLevel } from './types';
import { Frown, Meh, Smile, Heart, CloudRain } from 'lucide-react';

export const WEEKLY_MOOD_DATA: ChartDataPoint[] = [
  { day: 'Mon', value: 3 },
  { day: 'Tue', value: 2 },
  { day: 'Wed', value: 4 },
  { day: 'Thu', value: 5 },
  { day: 'Fri', value: 4 },
  { day: 'Sat', value: 5 },
  { day: 'Sun', value: 3 }, // Today
];

export const MOOD_OPTIONS = [
  { level: MoodLevel.Terrible, icon: CloudRain, color: 'text-gray-500', label: 'Tồi tệ' },
  { level: MoodLevel.Bad, icon: Frown, color: 'text-blue-400', label: 'Buồn' },
  { level: MoodLevel.Neutral, icon: Meh, color: 'text-purple-300', label: 'Bình thường' },
  { level: MoodLevel.Good, icon: Smile, color: 'text-purple-400', label: 'Vui vẻ' },
  { level: MoodLevel.Excellent, icon: Heart, color: 'text-pink-500', label: 'Tuyệt vời' },
];

export const MOCK_GALLERY_IMAGES = [
  "https://picsum.photos/seed/v1/200/200",
  "https://picsum.photos/seed/v2/200/200",
  "https://picsum.photos/seed/v3/200/200",
  "https://picsum.photos/seed/v4/200/200",
];

export const JOURNAL_PROMPTS = {
  // MOOD: TOUGH (Rất tệ), LOW (Hơi buồn)
  negative: [
    {
      id: 'n1',
      text: "Điều gì đang làm nặng lòng bạn nhất ngay lúc này? Hãy viết nó ra để 'đặt nó xuống'.",
      type: 'venting' // Xả stress
    },
    {
      id: 'n2',
      text: "Ngày hôm nay đã lấy đi của bạn quá nhiều năng lượng. Bạn muốn làm gì để vỗ về bản thân tối nay?",
      type: 'self-care' // Chăm sóc bản thân
    },
    {
      id: 'n3',
      text: "Có điều gì bạn đang tự trách mình không? Hãy thử viết một lời tha thứ cho chính mình.",
      type: 'compassion' // Lòng trắc ẩn
    },
    {
      id: 'n4',
      text: "Dù hôm nay có tệ đến đâu, có một điều nhỏ xíu nào (dù chỉ là một tách cà phê ngon) đã an ủi bạn không?",
      type: 'silver-lining' // Tìm điểm sáng
    },
    {
      id: 'n5',
      text: "Nếu ngày mai là một khởi đầu mới, bạn muốn bỏ lại điều gì ở lại với ngày hôm nay?",
      type: 'closure' // Kết thúc
    },
    {
      id: 'n6',
      text: "Bạn đang cần nghe câu nói gì nhất lúc này? Hãy viết nó ra như thể một người bạn thân đang nói với bạn.",
      type: 'affirmation' // Khẳng định
    },
  ],

  // MOOD: GOOD (Vui), GREAT (Tuyệt vời)
  positive: [
    {
      id: 'p1',
      text: "Khoảnh khắc nào trong ngày hôm nay khiến bạn mỉm cười tươi nhất?",
      type: 'memory' // Ký ức
    },
    {
      id: 'p2',
      text: "Ai là người đã góp phần làm ngày hôm nay của bạn trở nên rực rỡ? Bạn có muốn nhắn gì cho họ không?",
      type: 'gratitude' // Biết ơn
    },
    {
      id: 'p3',
      text: "Đừng khiêm tốn nữa, hôm nay bạn đã làm rất tốt việc gì?",
      type: 'achievement' // Thành tựu
    },
    {
      id: 'p4',
      text: "Hãy mô tả cảm giác hạnh phúc hiện tại của bạn bằng một màu sắc hoặc một bài hát.",
      type: 'savoring' // Thưởng thức
    },
    {
      id: 'p5',
      text: "Năng lượng tích cực này đến từ đâu? Làm sao để bạn duy trì nó cho ngày mai?",
      type: 'reflection' // Suy ngẫm
    },
    {
      id: 'p6',
      text: "Nếu có thể đóng khung một hình ảnh của ngày hôm nay, đó sẽ là hình ảnh nào?",
      type: 'visualization' // Hình dung
    },
  ],

  // MOOD: OKAY (Bình thường), hoặc Chưa chọn (Default)
  neutral: [
    {
      id: 'd1',
      text: "Một điều thú vị hoặc bất ngờ mà bạn tình cờ quan sát được hôm nay là gì?",
      type: 'observation' // Quan sát
    },
    {
      id: 'd2',
      text: "Hôm nay bạn đã học được bài học gì mới (dù là rất nhỏ)?",
      type: 'learning' // Học hỏi
    },
    {
      id: 'd3',
      text: "Nếu mô tả ngày hôm nay bằng một từ khóa duy nhất, từ đó là gì và tại sao?",
      type: 'summary' // Tóm tắt
    },
    {
      id: 'd4',
      text: "Âm thanh, mùi hương hay hương vị nào để lại ấn tượng cho bạn hôm nay?",
      type: 'sensory' // Giác quan
    },
    {
      id: 'd5',
      text: "Có việc gì bạn định làm nhưng chưa làm được không? Bạn cảm thấy thế nào về nó?",
      type: 'check-in' // Kiểm tra
    },
    {
      id: 'd6',
      text: "Điều gì đang chiếm tâm trí bạn lúc này, trước khi chìm vào giấc ngủ?",
      type: 'present' // Hiện tại
    },
  ]
};