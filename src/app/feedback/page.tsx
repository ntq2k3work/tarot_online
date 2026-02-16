'use client';

import { useState } from 'react';

interface Feedback {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  spreadType: string;
}

const sampleFeedbacks: Feedback[] = [
  {
    id: '1',
    name: 'Minh Anh',
    rating: 5,
    comment: 'Rất chính xác! Lá bài nói đúng về tình huống của mình. Cảm ơn Tarot Online!',
    date: '2026-02-10',
    spreadType: 'Ba Lá'
  },
  {
    id: '2',
    name: 'Thanh Huyền',
    rating: 5,
    comment: 'Giao diện đẹp, dễ sử dụng. Mình đã giới thiệu cho nhiều bạn bè rồi.',
    date: '2026-02-08',
    spreadType: 'Tình Yêu'
  },
  {
    id: '3',
    name: 'Hoàng Nam',
    rating: 4,
    comment: 'Trải nghiệm thú vị. Mong sẽ có thêm nhiều cách trải bài hơn.',
    date: '2026-02-05',
    spreadType: 'Sự Nghiệp'
  },
  {
    id: '4',
    name: 'Lan Chi',
    rating: 5,
    comment: 'Lịch sử đọc bài rất tiện, mình hay xem lại để đối chiếu với thực tế.',
    date: '2026-02-01',
    spreadType: 'Thập Tự Celtic'
  }
];

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(sampleFeedbacks);
  const [formData, setFormData] = useState({
    name: '',
    rating: 5,
    comment: '',
    spreadType: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const spreadOptions = ['Một Lá', 'Ba Lá', 'Thập Tự Celtic', 'Tình Yêu', 'Sự Nghiệp'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.comment) return;

    const newFeedback: Feedback = {
      id: Date.now().toString(),
      ...formData,
      date: new Date().toISOString().split('T')[0]
    };

    setFeedbacks([newFeedback, ...feedbacks]);
    setFormData({ name: '', rating: 5, comment: '', spreadType: '' });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const avgRating = (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1);

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl text-glow-gold text-gold mb-4">
            Đánh Giá & Phản Hồi
          </h1>
          <p className="text-foreground/60 max-w-2xl mx-auto">
            Chia sẻ trải nghiệm của bạn với cộng đồng
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass-card p-6 text-center">
            <div className="text-4xl font-display text-gold mb-2">{avgRating}</div>
            <div className="flex justify-center gap-1 text-gold mb-2">
              {[...Array(5)].map((_, i) => (
                <span key={i}>{i < Math.round(parseFloat(avgRating)) ? '★' : '☆'}</span>
              ))}
            </div>
            <p className="text-foreground/60 text-sm">Đánh giá trung bình</p>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-4xl font-display text-primary-light mb-2">{feedbacks.length}</div>
            <p className="text-foreground/60 text-sm">Lượt đánh giá</p>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-4xl font-display text-accent mb-2">98%</div>
            <p className="text-foreground/60 text-sm">Hài lòng</p>
          </div>
        </div>

        <div className="glass-card p-8 mb-12">
          <h2 className="font-display text-2xl text-gold mb-6">Gửi Đánh Giá Của Bạn</h2>
          
          {submitted && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-center">
              Cảm ơn bạn đã gửi đánh giá! ✨
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-foreground/60 mb-2">Tên của bạn</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-background/50 border border-primary/30 rounded-lg px-4 py-3 text-foreground focus:border-primary focus:outline-none"
                  placeholder="Nhập tên..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-foreground/60 mb-2">Cách trải bài đã dùng</label>
                <select
                  value={formData.spreadType}
                  onChange={(e) => setFormData({...formData, spreadType: e.target.value})}
                  className="w-full bg-background/50 border border-primary/30 rounded-lg px-4 py-3 text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="">Chọn cách trải bài</option>
                  {spreadOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm text-foreground/60 mb-2">Đánh giá</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({...formData, rating: star})}
                    className={`text-3xl transition-colors ${
                      star <= formData.rating ? 'text-gold' : 'text-foreground/20'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-foreground/60 mb-2">Nhận xét của bạn</label>
              <textarea
                value={formData.comment}
                onChange={(e) => setFormData({...formData, comment: e.target.value})}
                className="w-full bg-background/50 border border-primary/30 rounded-lg px-4 py-3 text-foreground focus:border-primary focus:outline-none resize-none"
                rows={4}
                placeholder="Chia sẻ trải nghiệm của bạn..."
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-primary to-accent text-white font-display rounded-lg hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] transition-all"
            >
              Gửi đánh giá
            </button>
          </form>
        </div>

        <div>
          <h2 className="font-display text-2xl text-gold mb-6">Đánh Gía Gần Đây</h2>
          <div className="space-y-4">
            {feedbacks.map((feedback) => (
              <div key={feedback.id} className="glass-card p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-display text-gold">{feedback.name}</h3>
                    <p className="text-sm text-foreground/50">{feedback.date}</p>
                  </div>
                  <div className="flex gap-1 text-gold">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < feedback.rating ? '' : 'opacity-30'}>★</span>
                    ))}
                  </div>
                </div>
                {feedback.spreadType && (
                  <span className="inline-block px-2 py-1 bg-primary/20 rounded text-xs text-primary-light mb-3">
                    {feedback.spreadType}
                  </span>
                )}
                <p className="text-foreground/70">{feedback.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
