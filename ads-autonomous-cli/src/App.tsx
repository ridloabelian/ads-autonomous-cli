import React from 'react';
import { 
  Zap, 
  Clock, 
  Cpu, 
  CheckCircle2, 
  ArrowRight, 
  Mail, 
  BarChart, 
  Users,
  MessageSquare,
  ShieldCheck,
  Star
} from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-brand-primary selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-white font-bold">N</div>
              <span className="text-xl font-bold tracking-tight">n8nMastery</span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
              <a href="#benefits" className="hover:text-brand-primary transition-colors">Benefits</a>
              <a href="#curriculum" className="hover:text-brand-primary transition-colors">Kurikulum</a>
              <a href="#pricing" className="hover:text-brand-primary transition-colors">Harga</a>
              <button className="bg-brand-primary text-white px-5 py-2 rounded-full hover:bg-blue-600 transition-all shadow-md shadow-brand-primary/20">
                Mulai Sekarang
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-brand-secondary/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold mb-6 animate-bounce">
            <Star size={14} className="fill-brand-primary" />
            <span>KURSUS n8n TERLENGKAP DI INDONESIA</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
            Hemat <span className="text-brand-primary italic">20 Jam Kerja</span> Per Minggu <br /> 
            Tanpa Biaya Langganan Mahal.
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Belajar dari nol sampai jago membangun <strong>Agentic Workflow</strong> yang bisa "mikir" otomatis buat bisnis Anda. Ganti asisten manual dengan sistem yang cerdas.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="group bg-brand-primary text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-600 transition-all shadow-xl shadow-brand-primary/30 flex items-center justify-center gap-2">
              Daftar Sekarang & Mulai Automasi
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="bg-white text-gray-900 border border-gray-200 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all">
              Cek Kurikulum
            </button>
          </div>
          <div className="mt-12 flex items-center justify-center gap-8 grayscale opacity-50">
            <img src="https://n8n.io/brand-assets/n8n-logo-black.svg" alt="n8n" className="h-6" />
            <div className="w-[1px] h-6 bg-gray-300"></div>
            <span className="font-bold text-lg">Self-Hosted</span>
            <div className="w-[1px] h-6 bg-gray-300"></div>
            <span className="font-bold text-lg">AI Ready</span>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section id="problem" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Masih Pakai Cara Lama?</h2>
          <p className="text-gray-600">Automasi seharusnya mempermudah, bukan malah menambah beban biaya.</p>
        </div>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 px-4">
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-lg flex items-center justify-center mb-6">
              <Clock size={24} />
            </div>
            <h3 className="text-xl font-bold mb-4">Tugas Manual Melelahkan</h3>
            <p className="text-gray-600 leading-relaxed">
              Copy-paste data dari CRM ke Sheets, membalas chat pelanggan yang berulang, hingga membuat laporan manual setiap hari.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-lg flex items-center justify-center mb-6">
              <BarChart size={24} />
            </div>
            <h3 className="text-xl font-bold mb-4">Biaya Langganan Selangit</h3>
            <p className="text-gray-600 leading-relaxed">
              Zapier dan Make.com makin mahal seiring bertambahnya jumlah task. Biaya operasional bengkak cuma buat "jembatan" data.
            </p>
          </div>
        </div>
      </section>

      {/* The Solution: Benefits Section */}
      <section id="benefits" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                Bangun Sistem yang <span className="text-brand-primary">Bisa Berpikir</span> Untuk Anda
              </h2>
              <div className="space-y-6">
                {[
                  { 
                    icon: Users, 
                    title: "Lead Gen Otomatis", 
                    desc: "Ambil leads dari sosial media, masukkan ke CRM, dan kirim pesan WA personal secara otomatis." 
                  },
                  { 
                    icon: ShieldCheck, 
                    title: "Laporan Keuangan Real-time", 
                    desc: "Sistem otomatis membaca mutasi bank dan membuat laporan harian tanpa campur tangan manusia." 
                  },
                  { 
                    icon: MessageSquare, 
                    title: "AI Customer Support 24/7", 
                    desc: "Bangun agen AI yang beneran pinter buat jawab pertanyaan pelanggan di berbagai channel." 
                  }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="mt-1 flex-shrink-0 w-6 h-6 text-brand-primary">
                      <CheckCircle2 size={24} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold mb-1">{item.title}</h4>
                      <p className="text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-brand-dark rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="ml-4 text-xs font-mono text-gray-400">agentic-workflow.n8n</div>
                </div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-700 rounded-full w-3/4"></div>
                  <div className="h-4 bg-gray-700 rounded-full w-1/2"></div>
                  <div className="h-4 bg-brand-primary/20 rounded-full w-5/6"></div>
                  <div className="grid grid-cols-3 gap-4 mt-8">
                    <div className="h-20 bg-gray-800 rounded-xl flex items-center justify-center">
                      <Cpu className="text-brand-primary" size={32} />
                    </div>
                    <div className="h-20 bg-gray-800 rounded-xl flex items-center justify-center">
                      <Zap className="text-brand-secondary" size={32} />
                    </div>
                    <div className="h-20 bg-gray-800 rounded-xl flex items-center justify-center">
                      <Mail className="text-brand-accent" size={32} />
                    </div>
                  </div>
                </div>
                {/* Floating Badge */}
                <div className="absolute -bottom-4 -right-4 bg-white text-gray-900 p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-gray-100">
                  <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center text-white">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Status</div>
                    <div className="text-sm font-bold">100% Automated</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-brand-dark text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-primary rounded-full blur-[120px]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 italic tracking-tight">Investasikan Sekali, Nikmati Automasi Selamanya.</h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Dapatkan akses penuh ke kurikulum dari nol sampai Agentic Workflow dengan harga khusus.
          </p>
          
          <div className="max-w-lg mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12">
            <div className="text-sm font-bold text-brand-primary uppercase tracking-[0.2em] mb-4">EARLY BIRD OFFER</div>
            <div className="flex justify-center items-end gap-2 mb-4">
              <span className="text-2xl text-gray-500 line-through mb-2 font-medium">Rp 999.000</span>
              <span className="text-5xl md:text-7xl font-black">499rb</span>
            </div>
            <p className="text-gray-400 text-sm mb-10">Harga naik dalam waktu dekat!</p>
            
            <ul className="text-left space-y-4 mb-10 text-gray-300">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="text-brand-secondary" size={20} />
                <span>Akses Selamanya (Lifetime Access)</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="text-brand-secondary" size={20} />
                <span>Kurikulum Step-by-Step (Nol ke Pro)</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="text-brand-secondary" size={20} />
                <span>Templates Workflow n8n Siap Pakai</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="text-brand-secondary" size={20} />
                <span>Grup Komunitas Eksklusif</span>
              </li>
            </ul>
            
            <button className="w-full bg-brand-primary text-white py-5 rounded-2xl font-black text-xl hover:bg-blue-600 transition-all shadow-2xl shadow-brand-primary/20 transform hover:-translate-y-1 active:scale-95">
              GABUNG SEKARANG
            </button>
            <p className="mt-6 text-xs text-gray-500 font-medium">Jaminan 7 Hari Uang Kembali Jika Tidak Puas</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100 text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-6 h-6 bg-brand-primary rounded flex items-center justify-center text-white font-bold text-xs">N</div>
          <span className="font-bold tracking-tight">n8nMastery</span>
        </div>
        <p className="text-gray-400 text-sm">© 2026 n8nMastery Indonesia. Semua hak cipta dilindungi.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
