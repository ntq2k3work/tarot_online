'use client';

import { tarotReaders } from '@/data/tarot';

export default function ReadersPage() {
  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl text-glow-gold text-gold mb-4">
            Tarot Readers
          </h1>
          <p className="text-foreground/60 max-w-2xl mx-auto">
            Kết nối với những người xem bài chuyên nghiệp để được tư vấn chi tiết
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tarotReaders.map((reader) => (
            <div
              key={reader.id}
              className="glass-card-gold p-8 hover:scale-[1.02] transition-transform duration-300"
            >
              <div className="flex items-start gap-6">
                <div className="text-6xl">{reader.avatar}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="font-display text-2xl text-gold">{reader.nameVi}</h2>
                    <div className={`px-2 py-1 rounded-full text-xs ${
                      reader.available ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {reader.available ? 'Online' : 'Offline'}
                    </div>
                  </div>
                  <p className="text-primary-light mb-1">{reader.specialty}</p>
                  <p className="text-sm text-foreground/50 mb-4">{reader.experience}</p>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1 text-gold">
                      <span>★</span>
                      <span className="font-display">{reader.rating}</span>
                    </div>
                    <span className="text-foreground/40 text-sm">
                      ({reader.reviews} đánh giá)
                    </span>
                  </div>

                  <p className="text-foreground/70 text-sm mb-6">{reader.bio}</p>

                  <button
                    disabled={!reader.available}
                    className={`w-full py-3 rounded-full font-display transition-all ${
                      reader.available
                        ? 'bg-gradient-to-r from-primary to-accent text-white hover:shadow-[0_0_20px_rgba(147,51,234,0.5)]'
                        : 'bg-foreground/10 text-foreground/40 cursor-not-allowed'
                    }`}
                  >
                    {reader.available ? 'Kết nối ngay' : 'Hiện không sẵn sàng'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 glass-card p-8">
          <h2 className="font-display text-2xl text-gold mb-6 text-center">
            Tại Sao Chọn Tarot Readers Của Chúng Tôi?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-display text-gold mb-2">Chuyên Nghiệp</h3>
              <p className="text-foreground/60 text-sm">
                Được đào tạo bài bản và có nhiều năm kinh nghiệm
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-accent to-accent-light flex items-center justify-center">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="font-display text-gold mb-2">Bảo Mật</h3>
              <p className="text-foreground/60 text-sm">
                Thông tin cá nhân và buổi đọc được bảo mật tuyệt đối
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center">
                <span className="text-2xl">💝</span>
              </div>
              <h3 className="font-display text-gold mb-2">Tận Tâm</h3>
              <p className="text-foreground/60 text-sm">
                Lắng nghe và đưa ra lời khuyên chân thành, tích cực
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
