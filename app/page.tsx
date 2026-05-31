"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Search, Heart, ShoppingCart, User, Menu, X, ChevronRight, ChevronDown, Check,
  Shield, Award, Calendar, RefreshCcw, MapPin, BadgePercent, Trash2, Edit, Sparkles,
  Send, Mic, HelpCircle, AlertTriangle, FileText, Download, CheckCircle, RotateCcw, Share2
} from "lucide-react";

// Types
interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  fps: number;
  price: number;
  discount: number;
  condition: "Baru" | "Preloved StrikeSwap™" | "Rental StrikeRent™";
  rating: number;
  reviews: number;
  badge: string;
  legal: boolean;
  rentalPrice?: number;
  deposit?: number;
  grade?: "A" | "B" | "C";
  owner?: string;
  city?: string;
  available?: boolean;
  imageUrl?: string;
}

// Dummy Database
const ALL_PRODUCTS: Product[] = [
  { id: "TM-VSR10", name: "Tokyo Marui VSR-10 GS Custom", brand: "Tokyo Marui", category: "Sniper Rifle", fps: 300, price: 7200000, discount: 10, condition: "Baru", rating: 4.9, reviews: 128, badge: "TERLARIS", legal: true, imageUrl: "https://www.rainbow8.com/cdn/shop/products/p_sub1_130909103517_2048x2048_c88910e9-d077-4e93-a170-1824a903d738.jpg?v=1571439606" },
  { id: "WE-M92FS", name: "WE-Tech M92 Gen2 GBB", brand: "WE-Tech", category: "Pistol", fps: 320, price: 3500000, discount: 0, condition: "Baru", rating: 4.7, reviews: 84, badge: "NONE", legal: true, imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaL2CBPRzOI3Wv6w7cZzfLfsI2Ta3JMV97ag&s" },
  { id: "GG-CM16", name: "G&G Raider CM16 Carbine AEG", brand: "G&G", category: "AEG & GBB", fps: 360, price: 4800000, discount: 15, condition: "Baru", rating: 4.8, reviews: 240, badge: "DISKON 15%", legal: true, imageUrl: "https://res.cloudinary.com/tmh-trading-gmbh/private_images/s--I3wocnFs--/c_fit,h_980,w_1400/f_auto/q_auto/webshop/media/80/e8/21/1693489573/101728060_4/g%26g_cm16_raider_l"  },
  { id: "NOV-SSG10", name: "Novritsch SSG10 A1", brand: "NOVRISTCH", category: "Sniper Rifle", fps: 450, price: 12500000, discount: 0, condition: "Baru", rating: 5.0, reviews: 62, badge: "BARU", legal: true, imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQipZf_l8pzXZnf_-pWa6vaNbXiey51tFfEsw&s"  },
  { id: "ICS-M4", name: "ICS CXP-Pelador M4 AEG", brand: "ICS", category: "AEG & GBB", fps: 380, price: 5900000, discount: 0, condition: "Baru", rating: 4.6, reviews: 41, badge: "NONE", legal: true, imageUrl: "https://www.airsoftatlanta.com/cdn/shop/products/DSC08315_1024x1024.jpg?v=1678855721"  },
  { id: "UMX-G17", name: "Umarex Glock 17 Gen5 GBB", brand: "Umarex", category: "Pistol", fps: 300, price: 4990000, discount: 0, condition: "Baru", rating: 4.9, reviews: 310, badge: "TERLARIS", legal: true, imageUrl: "https://image.makewebeasy.net/makeweb/m_1920x0/qRYrSLgiP/Foto_produk/umarex_g17_gen_5_v2.jpg?v=202405291424"  },
  { id: "CA-M249", name: "Classic Army M249 LMG", brand: "Classic Army", category: "AEG & GBB", fps: 390, price: 9500000, discount: 20, condition: "Baru", rating: 4.5, reviews: 33, badge: "DISKON 20%", legal: true, imageUrl: "https://cdn.webshopapp.com/shops/201476/files/306314895/classic-army-ca005m-ca249-mk2-lmg-aeg-133-joule-bk.jpg"  },
  { id: "TM-VSR10-CPO", name: "Tokyo Marui VSR-10 CPO", brand: "Tokyo Marui", category: "Sniper Rifle", fps: 400, price: 4100000, discount: 0, condition: "Preloved StrikeSwap™", rating: 4.4, reviews: 18, badge: "CPO GRADE B", legal: true, grade: "B", imageUrl: "https://image.makewebeasy.net/makeweb/m_1920x0/qRYrSLgiP/Foto_produk/WhatsApp_Image_2025_07_25_at_13_13_28.jpeg?v=202405291424"  },
  { id: "GG-CM16-CPO", name: "G&G CM16 Raider CPO", brand: "G&G", category: "AEG & GBB", fps: 350, price: 2900000, discount: 0, condition: "Preloved StrikeSwap™", rating: 4.3, reviews: 29, badge: "CPO GRADE C", legal: true, grade: "C", imageUrl: "https://www.guay2.com/web/image/product.template/444/image_1024?unique=58fe7ea"  },
  { id: "WE-G19-CPO", name: "WE Glock 19 Gen4 CPO", brand: "WE-Tech", category: "Pistol", fps: 310, price: 1850000, discount: 0, condition: "Preloved StrikeSwap™", rating: 4.5, reviews: 45, badge: "CPO GRADE A", legal: true, grade: "A", imageUrl: "https://shop.jkarmy.com/media/catalog/product/cache/c68e9bbb2d73eded5f4972f8e568886c/w/e/we-g19-g4-mos-bk_2_-jkarmy.jpg"  },
  { id: "RENT-M4-WE", name: "WE-Tech M4 Katana Rental", brand: "WE-Tech", category: "AEG & GBB", fps: 400, price: 2500000, discount: 0, rentalPrice: 250000, deposit: 500000, condition: "Rental StrikeRent™", rating: 4.7, reviews: 72, badge: "RENTAL", legal: true, grade: "A", owner: "Hendrikus Hendrana", city: "Jakarta", available: true, imageUrl: "https://www.airsoftmegastore.com/image/cache/catalog/product/pd-9376-1200x800-1-1200x1200.jpg"  },
  { id: "RENT-L96-WELL", name: "Well L96 Sniper Rental", brand: "Classic Army", category: "Sniper Rifle", fps: 430, price: 1800000, discount: 0, rentalPrice: 180000, deposit: 400000, condition: "Rental StrikeRent™", rating: 4.5, reviews: 39, badge: "RENTAL", legal: true, grade: "B", owner: "Joseph Marzani", city: "Bandung", available: true, imageUrl: "https://pictures.milgear.fi/0/1/original/17764.webp"  },
];

export default function StrikeZoneApp() {
  const [activeTab, setActiveTab] = useState<string>("landing");
  const [cart, setCart] = useState<{ product: Product; qty: number }[]>([
    { product: ALL_PRODUCTS[2], qty: 1 }, // G&G Raider CM16
    { product: ALL_PRODUCTS[0], qty: 1 }, // TM VSR-10
    { product: ALL_PRODUCTS[5], qty: 1 }  // Umarex Glock 17
  ]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Helper inside navigation
  const navigateTo = (tab: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) => item.product.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { product, qty: 1 }];
    });
  };

  const toggleWishlist = (id: string) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const cartCount = useMemo(() => cart.reduce((acc, item) => acc + item.qty, 0), [cart]);

  return (
    <div className="relative min-h-screen bg-[#080E18] text-[#F0F0F0] overflow-hidden">
      <div className="hex-grid-overlay opacity-40"></div>
      <div className="noise-overlay opacity-30"></div>

      {/* FIXED NAVBAR */}
      <nav id="navbar" className="sticky top-0 z-50 w-full transition-all duration-300 border-b border-[#1E3050] bg-[#0D1B2A]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span onClick={() => navigateTo("landing")} className="text-2xl font-bold font-heading text-[#4CAF50] cursor-pointer flex items-center gap-1 hover:opacity-85">
                ⚡ StrikeZone.id
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-6 text-[14px] font-medium tracking-wide">
              {[
                { label: "Produk", tab: "katalog" },
                { label: "StrikeRent™", tab: "strikerent" },
                { label: "StrikeSwap™", tab: "strikeswap" },
                { label: "AI Advisor", tab: "strikerai" },
                { label: "Event", tab: "strikeevent" },
                { label: "Komunitas", tab: "strikerank" },
                { label: "StrikeID™", tab: "strikeid" }
              ].map((item) => (
                <button
                  key={item.tab}
                  onClick={() => navigateTo(item.tab)}
                  className={`relative py-2 text-sm hover:text-[#4CAF50] transition-colors cursor-pointer ${
                    activeTab === item.tab ? "text-[#4CAF50] font-bold" : "text-[#8A9BB0]"
                  }`}
                >
                  {item.label}
                  {activeTab === item.tab && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#4CAF50]" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <button onClick={() => navigateTo("katalog")} className="p-1 hover:text-[#4CAF50] text-[#8A9BB0]" title="Cari">
                <Search size={20} />
              </button>
              <button onClick={() => navigateTo("strikerank")} className="p-1 hover:text-red-500 text-[#8A9BB0] relative">
                <Heart size={20} className={wishlist.length > 0 ? "fill-red-500 text-red-500" : ""} />
                {wishlist.length > 0 && <span className="absolute -top-1 -right-1 leading-none text-[10px] bg-red-500 text-white font-bold rounded-full h-4 w-4 flex items-center justify-center">{wishlist.length}</span>}
              </button>
              <button onClick={() => navigateTo("cart")} className="p-1 hover:text-[#4CAF50] text-[#8A9BB0] relative" title="Keranjang">
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 leading-none text-[10px] bg-red-600 text-white font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1 text-[#8A9BB0] hover:text-white"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0D1B2A]/95 border-b border-[#1E3050] px-4 pt-2 pb-4 space-y-2 animate-fadeIn">
            {[
              { label: "Katalog Produk", tab: "katalog" },
              { label: "StrikeRent™ Rental", tab: "strikerent" },
              { label: "StrikeSwap™ Preloved", tab: "strikeswap" },
              { label: "STRIKER AI™ Advisor", tab: "strikerai" },
              { label: "StrikeEvent™ Turnamen", tab: "strikeevent" },
              { label: "StrikeRank™ Komunitas", tab: "strikerank" },
              { label: "Verify StrikeID™", tab: "strikeid" },
              { label: "Keranjang Belanja", tab: "cart" }
            ].map((item) => (
              <button
                key={item.tab}
                onClick={() => navigateTo(item.tab)}
                className="block w-full text-left py-2 px-3 rounded text-base hover:bg-[#162033] hover:text-[#4CAF50] text-[#8A9BB0] transition"
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* CORE PAGES AREA */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "landing" && <LandingPage navigateTo={navigateTo} handleAddToCart={handleAddToCart} wishlist={wishlist} toggleWishlist={toggleWishlist} />}
        {activeTab === "katalog" && <KatalogPage handleAddToCart={handleAddToCart} wishlist={wishlist} toggleWishlist={toggleWishlist} />}
        {activeTab === "strikerai" && <StrikerAIPage handleAddToCart={handleAddToCart} />}
        {activeTab === "strikerent" && <StrikeRentPage handleAddToCart={handleAddToCart} />}
        {activeTab === "strikeswap" && <StrikeSwapPage handleAddToCart={handleAddToCart} wishlist={wishlist} toggleWishlist={toggleWishlist} />}
        {activeTab === "strikerank" && <StrikeRankPage />}
        {activeTab === "strikeevent" && <StrikeEventPage />}
        {activeTab === "strikeid" && <StrikeIDPage />}
        {activeTab === "cart" && <CartAndCheckoutPage cart={cart} setCart={setCart} navigateTo={navigateTo} />}
      </main>

      {/* FOOTER */}
      <footer className="bg-[#04080F] border-t border-[#1E3050] mt-16 text-xs text-[#8A9BB0] py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <span className="text-[#4CAF50] text-xl font-bold font-heading block mb-2">⚡ StrikeZone.id</span>
            <p className="mb-4 leading-relaxed">Platform airsoft premium legal pertama dan terlengkap di Indonesia. Gear Up. Strike Hard.</p>
            <p className="text-[10px]">© 2026 StrikeZone.id. Seluruh hak cipta dilindungi.</p>
          </div>
          <div>
            <h4 className="text-[#F0F0F0] font-heading font-semibold text-sm mb-3">LAYANAN UTAMA</h4>
            <ul className="space-y-2">
              <li><button onClick={() => navigateTo("katalog")} className="hover:text-white transition">Katalog AEG & GBB</button></li>
              <li><button onClick={() => navigateTo("strikerent")} className="hover:text-white transition">StrikeRent™ Sewa Airsoft</button></li>
              <li><button onClick={() => navigateTo("strikeswap")} className="hover:text-white transition">StrikeSwap™ Jual-Beli Bekas</button></li>
              <li><button onClick={() => navigateTo("strikerai")} className="hover:text-white transition">STRIKER AI™ Asisten Pribadi</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[#F0F0F0] font-heading font-semibold text-sm mb-3">REGULASI & KEANGGOTAAN</h4>
            <ul className="space-y-2">
              <li><button onClick={() => navigateTo("strikeid")} className="hover:text-white transition">StrikeID™ Verifikasi KTP</button></li>
              <li><button onClick={() => navigateTo("strikeevent")} className="hover:text-white transition">Direktori Event Nasional</button></li>
              <li><button onClick={() => navigateTo("strikerank")} className="hover:text-white transition">MilRank XP & Pangkat Komunitas</button></li>
              <li><a href="#" className="hover:text-white transition">Hukum Airsoft Indonesia</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[#F0F0F0] font-heading font-semibold text-sm mb-3">KREDENTIAL LEGALITAS</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#4CAF50] font-bold text-[10px]">
                <Shield size={14} /> 100% LEGAL & RESMI (PERKAPOLRI)
              </div>
              <p className="leading-relaxed">Setiap unit airsoft dilengkapi badge verifikasi resmi dan lulus inspeksi laboratorium FPS sebelum dikirimkan.</p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-[#1E3050]/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px]">
          <p>© 2026 StrikeZone.id. Seluruh hak cipta dilindungi.</p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[#8A9BB0] uppercase font-mono tracking-wider font-semibold">Project By:</span>
            <span className="text-[#4CAF50] hover:text-white transition duration-150 font-medium">Thomas Becket Tegar Surya Christy</span>
            <span className="text-[#1E3050] font-bold">•</span>
            <span className="text-[#4CAF50] hover:text-white transition duration-150 font-medium">Althaffayiz Syafiq</span>
            <span className="text-[#1E3050] font-bold">•</span>
            <span className="text-[#4CAF50] hover:text-white transition duration-150 font-medium">Barry Caesar Satrio Himalaya Jamallulail</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// -------------------------------------------------------------
// [1] LANDING PAGE
// -------------------------------------------------------------
function LandingPage({ navigateTo, handleAddToCart, wishlist, toggleWishlist }: { navigateTo: (t: string) => void, handleAddToCart: (p: Product) => void, wishlist: string[], toggleWishlist: (id: string) => void }) {
  const showcaseProducts = ALL_PRODUCTS.slice(0, 4);

  return (
    <div className="space-y-16 py-4 animate-fadeIn">
      {/* HERO SECTION */}
      <section className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[70vh]">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 bg-[#162033]/80 border border-[#1E3050] px-3 py-1 text-xs text-[#4CAF50] rounded font-bold uppercase tracking-wider">
            <Sparkles size={14} className="animate-pulse" /> Platform Airsoft #1 Indonesia
          </div>

          <h1 className="text-5xl sm:text-7xl font-black font-heading tracking-tight leading-none text-white uppercase">
            GEAR UP. <br />
            <span className="text-[#4CAF50] glitch-text relative inline-block">STRIKE HARD.</span>
          </h1>

          <p className="text-base sm:text-lg text-[#8A9BB0] max-w-xl leading-relaxed">
            Platform e-commerce airsoft premium terlengkap di Indonesia. 
            Unit 100% legal terverifikasi, pasar rental terjamin, tukar-tambah aman CPO, serta dipandu sistem AI penasehat taktis pintar.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
            <button
              onClick={() => navigateTo("katalog")}
              className="bg-[#4CAF50] hover:bg-[#2E7D32] text-white font-bold py-4 px-8 rounded-sm transition-all duration-200 transform hover:scale-105 shadow-lg shadow-[#4CAF50]/20 text-center font-heading"
            >
              MULAI BELANJA TAKTIS
            </button>
            <button
              onClick={() => navigateTo("strikerent")}
              className="border border-[#E67E22] text-[#E67E22] hover:bg-[#E67E22]/10 font-bold py-4 px-8 rounded-sm transition text-center font-heading"
            >
              JELAJAHI STRIKERENT™
            </button>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-[#1E3050] pt-6 text-[11px] font-bold text-[#8A9BB0] tracking-wide uppercase">
            <div className="flex items-center gap-2">
              <Check className="text-[#4CAF50]" size={16} /> Unit Resmi Legal
            </div>
            <div className="flex items-center gap-2">
              <Check className="text-[#4CAF50]" size={16} /> FPS Lab-Tested
            </div>
            <div className="flex items-center gap-2">
              <Check className="text-[#4CAF50]" size={16} /> Rental Bergaransi
            </div>
            <div className="flex items-center gap-2">
              <Check className="text-[#4CAF50]" size={16} /> 50k+ Anggota
            </div>
          </div>
        </div>

        {/* Visual Kanan */}
        <div className="lg:col-span-5 relative flex justify-center items-center">
          <div className="w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] bg-gradient-to-tr from-[#162033] to-[#0D1B2A] border-2 border-[#1E3050] relative rotate-12 flex items-center justify-center rounded-2xl shadow-xl hover:rotate-6 transition duration-500 overflow-hidden">
            <div className="absolute inset-0 bg-[#4CAF50]/5 animate-pulse"></div>
            {/* Hexagon lines */}
            <svg viewBox="0 0 100 100" className="w-48 h-48 text-[#4CAF50]/20 absolute animate-spin duration-[20s]">
              <polygon points="50,15 90,35 90,75 50,95 10,75 10,35" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <svg viewBox="0 0 100 100" className="w-56 h-56 text-[#E67E22]/20 absolute animate-spin duration-[15s] animate-reverse">
              <polygon points="50,10 95,30 95,78 50,98 5,78 5,30" fill="none" stroke="currentColor" strokeWidth="1" />
            </svg>
            <div className="text-center rotate-[-12deg] relative z-10">
              <p className="text-5xl">⚡</p>
              <h2 className="font-heading text-2xl font-bold uppercase tracking-wider text-white mt-1">SZ MISSION</h2>
              <span className="text-[10px] text-[#4CAF50] font-mono tracking-widest block uppercase mt-1">READY TO DEPLOY</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE STRIP */}
      <section className="bg-[#0D1B2A] border-y border-[#4CAF50] py-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-[#1E3050]">
          {[
            { label: "STRIKER AI™", desc: "Pilih & racik loadout", tab: "strikerai", icon: "🤖" },
            { label: "StrikeRent™", desc: "Sewa sebelum membeli", tab: "strikerent", icon: "🔄" },
            { label: "StrikeSwap™", desc: "Jual-beli unit bekas", tab: "strikeswap", icon: "♻️" },
            { label: "StrikeEvent™", desc: "Direktori turnamen nasional", tab: "strikeevent", icon: "🎯" }
          ].map((f, idx) => (
            <div key={idx} onClick={() => navigateTo(f.tab)} className="cursor-pointer group px-2">
              <span className="text-2xl block mb-1 group-hover:scale-110 transition">{f.icon}</span>
              <h3 className="font-heading font-bold text-sm tracking-wide text-white group-hover:text-[#4CAF50] transition">{f.label}</h3>
              <p className="text-[11px] text-[#8A9BB0]">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* KATEGORI */}
      <section className="space-y-6">
        <h2 className="text-2xl font-black font-heading tracking-wide text-white flex items-center gap-3">
          <span className="h-2 w-2 bg-[#4CAF50]"></span> KATEGORI UTAMA
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: "AEG & GBB Assault", count: "148 Unit", icon: "💥" },
            { name: "Sniper Rifle", count: "42 Unit", icon: "🎯" },
            { name: "Pistol Handgun", count: "89 Unit", icon: "🔫" },
            { name: "Gear Taktis & Vest", count: "210 Item", icon: "🪖" },
            { name: "BB & Amunisi", count: "34 Jenis", icon: "⚡" },
            { name: "Proteksi Diri", count: "78 Item", icon: "🛡️" },
            { name: "Suku Cadang / Upgrade", count: "312 Item", icon: "🔧" },
            { name: "Bundle Tactical Set", count: "12 Paket", icon: "📦" }
          ].map((cat, idx) => (
            <div
              key={idx}
              onClick={() => navigateTo("katalog")}
              className="bg-[#0D1B2A] border border-[#1E3050] hover:border-[#4CAF50] transition p-5 rounded group cursor-pointer"
            >
              <span className="text-3xl block mb-2">{cat.icon}</span>
              <h3 className="font-heading text-base font-bold text-white group-hover:text-[#4CAF50] transition uppercase">{cat.name}</h3>
              <span className="text-xs text-[#8A9BB0]">{cat.count}</span>
            </div>
          ))}
        </div>
      </section>

      {/* PALING DICARI WEEKLY */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black font-heading tracking-wide text-white flex items-center gap-3">
            <span className="h-2 w-2 bg-red-500 animate-ping"></span> PALING DICARI MINGGU INI
            <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">LIVE 🔴</span>
          </h2>
          <button onClick={() => navigateTo("katalog")} className="text-sm text-[#4CAF50] hover:underline font-bold">
            Semua Produk &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {showcaseProducts.map((p) => (
            <ProductCard key={p.id} product={p} handleAddToCart={handleAddToCart} wishlist={wishlist} toggleWishlist={toggleWishlist} />
          ))}
        </div>
      </section>

      {/* BANNER STRIKEID */}
      <section className="bg-gradient-to-r from-[#0D1B2A] to-[#162033] border border-[#1E3050] rounded-lg p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-8 space-y-4">
          <span className="text-xs text-[#E67E22] font-mono tracking-widest font-bold uppercase">STRIKEID™ LEGAL VERIFIED</span>
          <h2 className="text-3xl font-heading font-black text-white leading-tight uppercase">Belanja Tenang. Unit Aman & Terjamin Resmi.</h2>
          <p className="text-sm text-[#8A9BB0] leading-relaxed max-w-2xl">
            StrikeID™ membantu memverifikasi KTP Anda demi tertib administrasi sesuai imbauan dan regulasi olahraga rekreasi di Indonesia. Dapatkan sertikasi lab-test FPS gratis pasca-beli.
          </p>
          <button
            onClick={() => navigateTo("strikeid")}
            className="bg-[#4CAF50] hover:bg-[#2E7D32] text-white text-xs font-bold py-3 px-6 rounded-sm uppercase tracking-wide transition inline-block font-heading"
          >
            Selesaikan Verifikasi KTP — Gratis
          </button>
        </div>
        <div className="md:col-span-4 flex justify-center">
          <div className="border border-dashed border-[#4CAF50]/40 p-3 rounded-full">
            <Shield className="text-[#4CAF50] w-20 h-20 animate-pulse" />
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="space-y-6">
        <h2 className="text-2xl font-black font-heading text-white text-center uppercase tracking-wider">Apa Kata Komunitas Operator</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Komandan Reza_47", rank: "★ Sergeant, Jakarta", text: "StrikeZone.id merubah hobi airsoft di Indonesia. Unit TM VSR-10 yang saya sewa di StrikeRent sangat mulus, performa persis seperti aslinya. Dan yang penting legalitas KTP terbit lancar." },
            { name: "Mayor Bowo", rank: "★★ Lieutenant, Surabaya", text: "Asisten STRIKER AI membantu memilih gear M4 AEG dengan ketepatan suku cadang yang luar biasa. Sangat intuitif! Belanja di sini tidak pusing masalah kompatibilitas." },
            { name: "Operator Santi", rank: "Recruit, Depok", text: "Toko airsoft paling modern! Saya baru membeli Pistol Umarex Glock 17 bekas di StrikeSwap. Kondisi super mulus Grade A, harga benchmark akurat. Rekomended seller!" }
          ].map((t, idx) => (
            <div key={idx} className="bg-[#0D1B2A] border border-[#1E3050] p-6 rounded relative">
              <span className="text-3xl text-[#4CAF50]/40 absolute top-4 right-4">”</span>
              <p className="text-xs text-[#8A9BB0] leading-relaxed italic mb-4">&ldquo;{t.text}&rdquo;</p>
              <h4 className="font-heading font-bold text-sm text-white uppercase">{t.name}</h4>
              <span className="text-[10px] text-[#E67E22] font-mono uppercase">{t.rank}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// PRODUCT CARD COMPONENT
function ProductCard({ product, handleAddToCart, wishlist, toggleWishlist }: { product: Product, handleAddToCart: (p: Product) => void, wishlist: string[], toggleWishlist: (id: string) => void }) {
  const isWishlisted = wishlist.includes(product.id);
  const discountedPrice = product.price * (1 - product.discount / 100);

  return (
    <div className="bg-[#0D1B2A] border border-[#1E3050] hover:border-[#4CAF50]/50 hover:translate-y-[-4px] transition-all duration-200 rounded overflow-hidden flex flex-col justify-between group relative">
      <div>
        {/* Card Photo placeholder */}
        <div className="h-44 bg-gradient-to-b from-[#162033] to-[#0D1B2A] relative flex items-center justify-center p-4">
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {product.badge !== "NONE" && (
              <span className={`text-[9px] font-bold uppercase tracking-wider py-0.5 px-2 rounded ${
                product.badge.includes("DISKON") ? "bg-[#E67E22]" : "bg-blue-600"
              } text-white`}>
                {product.badge}
              </span>
            )}
            <span className="text-[9px] font-bold bg-[#162033]/80 text-[#8A9BB0] border border-[#1E3050] py-0.5 px-2 rounded flex items-center gap-1 z-10">
              🔬 {product.fps} FPS
            </span>
          </div>

          <span className="text-[9px] font-bold bg-emerald-600 text-white py-0.5 px-1.5 rounded uppercase absolute top-2 right-2 flex items-center gap-1 z-10">
            LULUS LAB ✅
          </span>

          {/* Dummy visual gun wireframe */}
          <div className="text-center">
            <span className="text-4xl block group-hover:scale-110 transition duration-300">
              {product.category.includes("Sniper") ? "🎯" : product.category.includes("Pistol") ? "🔫" : "💥"}
            </span>
            <span className="text-[10px] text-[#8A9BB0] font-mono uppercase tracking-widest block mt-2">{product.brand}</span>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 space-y-2">
          <h3 className="font-heading text-sm font-bold text-white group-hover:text-[#4CAF50] transition uppercase line-clamp-1">
            {product.name}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-[#8A9BB0]">
            <span className="text-yellow-500 font-bold">★ {product.rating.toFixed(1)}</span>
            <span>({product.reviews} reviews)</span>
          </div>

          {/* Pricing */}
          <div className="pt-1">
            {product.discount > 0 ? (
              <div className="space-y-0.5">
                <span className="text-xs text-red-500 line-through">Rp {product.price.toLocaleString("id-ID")}</span>
                <p className="text-sm font-bold text-white font-heading">
                  Rp {discountedPrice.toLocaleString("id-ID")}
                </p>
              </div>
            ) : (
              <p className="text-sm font-bold text-white font-heading">
                Rp {product.price.toLocaleString("id-ID")}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 pt-0 flex gap-2">
        <button
          onClick={() => handleAddToCart(product)}
          className="bg-[#4CAF50] hover:bg-[#2E7D32] text-xs font-bold font-heading text-white tracking-wider uppercase py-2 px-3 rounded-sm flex-1 transition"
        >
          TAMBAH KE CART
        </button>
        <button
          onClick={() => toggleWishlist(product.id)}
          className={`border border-[#1E3050] hover:border-red-500 hover:text-red-500 p-2 rounded-sm transition ${
            isWishlisted ? "text-red-500 border-red-500" : "text-[#8A9BB0]"
          }`}
          title="Wishlist"
        >
          <Heart size={16} className={isWishlisted ? "fill-red-500" : ""} />
        </button>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// [2] KATALOG PRODUK WITH JS FILTERS
// -------------------------------------------------------------
function KatalogPage({ handleAddToCart, wishlist, toggleWishlist }: { handleAddToCart: (p: Product) => void, wishlist: string[], toggleWishlist: (id: string) => void }) {
  const [search, setSearch] = useState("");
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [fpsVal, setFpsVal] = useState<number>(500);
  const [priceVal, setPriceVal] = useState<number>(15000000);
  const [condition, setCondition] = useState<string>("Semua");
  const [legalOnly, setLegalOnly] = useState(true);
  const [sortOption, setSortOption] = useState("populer");
  const [isListView, setIsListView] = useState(false);

  const categories = ["AEG & GBB", "Sniper Rifle", "Pistol", "Gear Taktis"];
  const brands = ["Tokyo Marui", "WE-Tech", "G&G", "NOVRISTCH", "ICS", "Classic Army", "Umarex"];

  const handleCatChange = (cat: string) => {
    setSelectedCats(prev => prev.includes(cat) ? prev.filter(x => x !== cat) : [...prev, cat]);
  };

  const handleBrandChange = (brand: string) => {
    setSelectedBrands(prev => prev.includes(brand) ? prev.filter(x => x !== brand) : [...prev, brand]);
  };

  const resetFilters = () => {
    setSearch("");
    setSelectedCats([]);
    setSelectedBrands([]);
    setFpsVal(500);
    setPriceVal(15000000);
    setCondition("Semua");
    setLegalOnly(true);
  };

  // Filter logic
  const filteredProducts = ALL_PRODUCTS.filter((p) => {
    // Search
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    // Category
    if (selectedCats.length > 0 && !selectedCats.includes(p.category)) return false;
    // Brand
    if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) return false;
    // FPS
    if (p.fps > fpsVal) return false;
    // Price
    if (p.price > priceVal) return false;
    // Condition
    if (condition !== "Semua") {
      if (condition === "Baru" && p.condition !== "Baru") return false;
      if (condition === "Preloved" && !p.condition.includes("Preloved")) return false;
      if (condition === "Rental" && !p.condition.includes("Rental")) return false;
    }
    // Legal
    if (legalOnly && !p.legal) return false;

    return true;
  }).sort((a, b) => {
    if (sortOption === "harga-asc") return a.price - b.price;
    if (sortOption === "harga-desc") return b.price - a.price;
    if (sortOption === "abjad") return a.name.localeCompare(b.name);
    return b.rating - a.rating; // Default populer
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* HEADER BREADCRUMB */}
      <div className="text-xs text-[#8A9BB0] tracking-wider uppercase">
        Beranda &gt; <span className="text-[#4CAF50]">Katalog Taktis</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* SIDEBAR FILTER */}
        <aside className="w-full lg:w-72 bg-[#0D1B2A] border border-[#1E3050] p-6 rounded space-y-6 shrink-0 h-fit">
          <div className="flex items-center justify-between border-b border-[#1E3050] pb-4">
            <h3 className="font-heading text-base font-bold uppercase text-white flex items-center gap-2">
              ⚙️ OPERATIONAL FILTER
            </h3>
            <button onClick={resetFilters} className="text-xs text-red-500 hover:underline font-bold">
              RESET ALL
            </button>
          </div>

          {/* Search bar */}
          <div className="space-y-2">
            <label className="text-xs text-white font-bold block uppercase tracking-wider">Cari Item</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Cari model unit..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#162033] border border-[#1E3050] text-[#F0F0F0] text-xs px-3 py-2.5 rounded focus:outline-none focus:border-[#4CAF50] pr-8"
              />
              <Search className="absolute right-2.5 top-2.5 text-[#8A9BB0]" size={15} />
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <label className="text-xs text-white font-bold block uppercase tracking-wider">Sistem Kategori</label>
            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {categories.map((cat) => (
                <label key={cat} className="flex items-center text-xs text-[#8A9BB0] hover:text-white cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={selectedCats.includes(cat)}
                    onChange={() => handleCatChange(cat)}
                    className="mr-2 accent-[#4CAF50]"
                  />
                  {cat}
                </label>
              ))}
            </div>
          </div>

          {/* Brands */}
          <div className="space-y-2">
            <label className="text-xs text-white font-bold block uppercase tracking-wider">Pabrikan (Brand)</label>
            <div className="space-y-1.5 max-h-44 overflow-y-auto">
              {brands.map((b) => (
                <label key={b} className="flex items-center text-xs text-[#8A9BB0] hover:text-white cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(b)}
                    onChange={() => handleBrandChange(b)}
                    className="mr-2 accent-[#4CAF50]"
                  />
                  {b}
                </label>
              ))}
            </div>
          </div>

          {/* FPS Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-white">
              <span className="uppercase">MAKSIMAL KLAIM FPS</span>
              <span className="text-[#4CAF50]">{fpsVal} FPS</span>
            </div>
            <input
              type="range"
              min="200"
              max="500"
              step="10"
              value={fpsVal}
              onChange={(e) => setFpsVal(Number(e.target.value))}
              className="w-full accent-[#4CAF50] bg-[#162033] h-1.5 rounded cursor-pointer"
            />
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-white">
              <span className="uppercase">MAKSIMAL BUDGET</span>
              <span className="text-[#E67E22] text-[11px]">Rp {priceVal.toLocaleString("id-ID")}</span>
            </div>
            <input
              type="range"
              min="500000"
              max="15000000"
              step="250000"
              value={priceVal}
              onChange={(e) => setPriceVal(Number(e.target.value))}
              className="w-full accent-[#4CAF50] bg-[#162033] h-1.5 rounded cursor-pointer"
            />
          </div>

          {/* Condition Select */}
          <div className="space-y-2">
            <label className="text-xs text-white font-bold block uppercase tracking-wider">Kondisi Ops</label>
            <div className="space-y-1.5">
              {[
                { label: "Semua Kondisi", val: "Semua" },
                { label: "Baru Gress", val: "Baru" },
                { label: "Preloved Swap CPO", val: "Preloved" },
                { label: "Rental Mil-Spec", val: "Rental" }
              ].map((cond) => (
                <label key={cond.val} className="flex items-center text-xs text-[#8A9BB0] hover:text-white cursor-pointer select-none">
                  <input
                    type="radio"
                    name="conditionRadio"
                    checked={condition === cond.val}
                    onChange={() => setCondition(cond.val)}
                    className="mr-2 accent-[#4CAF50]"
                  />
                  {cond.label}
                </label>
              ))}
            </div>
          </div>

          {/* Legal verification toggle */}
          <div className="flex items-center justify-between border-t border-[#1E3050] pt-4">
            <span className="text-xs text-[#8A9BB0] font-bold uppercase tracking-wider flex items-center gap-1">
              🎖️ KHUSUS UNIT LEGAL
            </span>
            <button
              onClick={() => setLegalOnly(!legalOnly)}
              className={`w-11 h-6 rounded-full transition-colors flex items-center p-1 cursor-pointer ${
                legalOnly ? "bg-[#4CAF50]" : "bg-[#162033]"
              }`}
            >
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                legalOnly ? "translate-x-5" : "translate-x-0"
              }`} />
            </button>
          </div>
        </aside>

        {/* PRODUCTS AREA */}
        <div className="flex-1 space-y-6">
          {/* SORT AND VIEW CONTROLS */}
          <div className="bg-[#0D1B2A] border border-[#1E3050] p-4 rounded flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="text-xs text-[#8A9BB0]">
              Menampilkan <span className="text-[#4CAF50] font-bold">{filteredProducts.length}</span> dari {ALL_PRODUCTS.length} unit
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-white uppercase shrink-0">Urutan:</span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="bg-[#162033] border border-[#1E3050] text-[#F0F0F0] text-xs px-2.5 py-1.5 rounded focus:outline-none focus:border-[#4CAF50]"
                >
                  <option value="populer">Paling Kompeten / Rating</option>
                  <option value="harga-asc">Harga Terendah</option>
                  <option value="harga-desc">Harga Tertinggi</option>
                  <option value="abjad">Nama Abjad A-Z</option>
                </select>
              </div>

              <div className="border-l border-[#1E3050] h-6 pl-4 flex items-center gap-1.5">
                <button
                  onClick={() => setIsListView(false)}
                  className={`p-1.5 rounded ${!isListView ? "bg-[#4CAF50] text-white" : "text-[#8A9BB0] hover:text-white"}`}
                  title="Grid"
                >
                  田
                </button>
                <button
                  onClick={() => setIsListView(true)}
                  className={`p-1.5 rounded ${isListView ? "bg-[#4CAF50] text-white" : "text-[#8A9BB0] hover:text-white"}`}
                  title="List"
                >
                  ☰
                </button>
              </div>
            </div>
          </div>

          {/* PRODUCTS GRID */}
          {filteredProducts.length > 0 ? (
            <div className={
              isListView
                ? "flex flex-col gap-4 animate-fadeIn"
                : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn"
            }>
              {filteredProducts.map((p) => {
                if (isListView) {
                  return (
                    <div key={p.id} className="bg-[#0D1B2A] border border-[#1E3050] p-4 rounded flex flex-col sm:flex-row items-center justify-between gap-4 hover:border-[#4CAF50] transition">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl bg-[#162033] p-4 rounded text-center">
                          {p.category.includes("Sniper") ? "🎯" : p.category.includes("Pistol") ? "🔫" : "💥"}
                        </div>
                        <div>
                          <h4 className="font-heading font-bold text-base text-white uppercase">{p.name}</h4>
                          <p className="text-xs text-[#8A9BB0]">{p.brand} · {p.fps} FPS · {p.condition}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="font-heading font-bold text-white text-base">Rp {p.price.toLocaleString("id-ID")}</span>
                        <button
                          onClick={() => handleAddToCart(p)}
                          className="bg-[#4CAF50] hover:bg-[#2E7D32] text-xs font-bold py-2 px-4 rounded transition"
                        >
                          BELI
                        </button>
                      </div>
                    </div>
                  );
                }
                return (
                  <ProductCard key={p.id} product={p} handleAddToCart={handleAddToCart} wishlist={wishlist} toggleWishlist={toggleWishlist} />
                );
              })}
            </div>
          ) : (
            <div className="bg-[#0D1B2A] border border-[#1E3050] rounded-lg p-12 text-center text-[#8A9BB0]">
              <AlertTriangle className="mx-auto text-[#E67E22] mb-3" size={40} />
              <p className="text-sm font-bold uppercase mb-1">Ops! Sistem Kosong</p>
              <p className="text-xs max-w-sm mx-auto">Kami tidak dapat menemukan produk yang sesuai dengan filter Anda. Silakan bersihkan ops pencarian.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// [3] STRIKER AI™ CHAT DIALOGUE
// -------------------------------------------------------------
function StrikerAIPage({ handleAddToCart }: { handleAddToCart: (p: Product) => void }) {
  const [messages, setMessages] = useState<any[]>([
    { role: "ai", text: "Halo, Operator! Saya STRIKER AI™, asisten belanja airsoft pertama di Indonesia. Ceritakan gaya bermainmu, posisi favorit, dan budget — saya akan racikkan loadout terbaik Anda." },
    { role: "user", text: "Hei, saya pemula, suka posisi sniper jarak jauh, budget sekitar 3 juta" },
    { role: "ai", text: "Siap, Operator! Untuk sniper pemula dengan budget Rp3 juta, saya rekomendasikan Opsi Loadout khusus. Loadout terbaik saya adalah XT-Sierra Setup: Tokyo Marui VSR-10 clone (G&G Raider atau Well model clone) + BB 0.28g + scope taktis + bipod pendukung.\n\nTotal estimasi: Rp2.850.000. FPS stabil legal aman Indonesia (350-370 FPS). Sangat direkomendasikan untuk menembus target 40m+." },
    { role: "user", text: "Iya, tampilkan. Dan apakah BB 0.28 cocok sama inner barrel stocknya?" },
    { role: "ai", text: "Kompatibilitas: ✅ BB 0.28g SANGAT KOMPATIBEL dengan bore standar. Untuk presisi angin jarak jauh, bobot 0.28g jauh lebih stabil daripada 0.20g standar pabrik. Saya juga merekomendasikan bundle hemat yang sudah saya rilis di sebelah kanan." }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Suggested questions chips
  const suggestions = [
    "Cek Kompatibilitas BB Berat", "Rekomendasikan AEG Assault", "Aturan FPS Legal Indonesia", "Cara Memilih Pistol GBB"
  ];

  const handleSend = async (customPrompt?: string) => {
    const textMsg = customPrompt || inputVal;
    if (!textMsg.trim()) return;

    setMessages(prev => [...prev, { role: "user", text: textMsg }]);
    setInputVal("");
    setIsTyping(true);

    try {
      // POST command to our next.js api chat route
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textMsg, history: messages }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: "ai", text: data.text }]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: "ai", text: "Radio pusat sibuk, Operator. Hubungi kembali sesaat lagi." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="border border-[#1E3050] bg-[#0D1B2A] rounded-lg p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* PANEL KIRI - CHAT INBOX */}
        <div className="lg:col-span-7 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#1E3050] pb-6 lg:pb-0 lg:pr-6 min-h-[480px]">
          
          <div className="flex items-center justify-between border-b border-[#1E3050] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="text-[#4CAF50] animate-pulse" />
              <div>
                <h4 className="font-heading font-black text-sm text-white">🤖 STRIKER AI™ ASISTEN</h4>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#4CAF50] rounded-full animate-ping"></span>
                  <p className="text-[10px] text-emerald-400 font-mono tracking-widest uppercase">RADIO ONLINE CONNECTED</p>
                </div>
              </div>
            </div>
            <span className="text-[10px] bg-[#162033] border border-[#1E3050] px-2 py-1 rounded text-[#8A9BB0]">v3.5 FLASH</span>
          </div>

          {/* Chat scrolling areas */}
          <div className="flex-1 space-y-4 overflow-y-auto max-h-[360px] pr-2 mb-4">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex gap-3 text-xs leading-relaxed max-w-[85%] ${
                m.role === "ai" ? "items-start mr-auto" : "items-start ml-auto flex-row-reverse text-right"
              }`}>
                <div className={`p-2 rounded ${m.role === "ai" ? "bg-[#162033] text-left border-l-3 border-[#4CAF50]" : "bg-[#4CAF50]/15 text-left border-r-3 border-[#E67E22]"}`}>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-0.5">{m.role === "ai" ? "STRIKER AI" : "OP USER"}</p>
                  <p className="text-[#F0F0F0] whitespace-pre-wrap">{m.text}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-1.5 text-[#4CAF50] text-xs">
                <span className="animate-bounce">●</span>
                <span className="animate-bounce delay-100">●</span>
                <span className="animate-bounce delay-200">●</span>
                <span className="text-[9px] text-[#8A9BB0] tracking-widest uppercase ml-1">STRIKER MENGULAS SARAN...</span>
              </div>
            )}
          </div>

          {/* Input block */}
          <div className="space-y-3">
            {/* Chips suggest */}
            <div className="flex flex-wrap gap-1.5">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(s)}
                  className="bg-[#162033] border border-[#1E3050] hover:border-[#4CAF50] transition text-[10px] px-2.5 py-1 text-[#8A9BB0] hover:text-white rounded"
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Diskusikan gaya permainan / tanyakan part..."
                value={inputVal}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                onChange={(e) => setInputVal(e.target.value)}
                className="flex-1 bg-[#162033] border border-[#1E3050] text-[#F0F0F0] text-xs px-3 py-3 rounded-sm focus:outline-none focus:border-[#4CAF50]"
              />
              <button
                onClick={() => handleSend()}
                className="bg-[#4CAF50] hover:bg-[#2E7D32] px-4 rounded-sm text-white transition flex items-center justify-center font-heading font-black text-xs"
              >
                KIRIM <Send size={12} className="ml-1" />
              </button>
            </div>
          </div>
        </div>

        {/* PANEL KANAN - REKOMENDASI BOX */}
        <div className="lg:col-span-5 space-y-4">
          <h4 className="font-heading font-black text-sm text-white uppercase tracking-wider flex items-center gap-1.5">
            🎯 REKOMENDASI AI UNTUKMU
          </h4>

          {/* compact cards */}
          <div className="bg-[#162033] border border-[#1E3050] p-4 rounded space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] bg-[#E67E22] text-white font-bold py-0.5 px-2 rounded tracking-widest uppercase">AI BEST CORNER BUNDLE</span>
              <span className="text-[11px] text-[#4CAF50] font-bold">HEMAT Rp100.000</span>
            </div>
            
            <h5 className="font-heading font-bold text-sm text-white uppercase">PAKET SIERRA SNIPER OPS</h5>
            <ul className="text-xs text-[#8A9BB0] space-y-1.5 list-disc list-inside">
              <li>Tokyo Marui VSR-10 GS (Rekomendasi Utama)</li>
              <li>BB Biodegradable 0.28g (3000 pcs)</li>
              <li>Sniper Scope 3-9x40 + High ring mount</li>
              <li>Bipod Taktis Logam Kokoh</li>
            </ul>

            <div className="pt-2 border-t border-[#1E3050] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#8A9BB0] block uppercase line-through">Rp 7.850.000</span>
                <span className="font-heading font-black text-white text-base">Rp 7.750.000</span>
              </div>
              <button
                onClick={() => handleAddToCart(ALL_PRODUCTS[0])}
                className="bg-[#4CAF50] hover:bg-[#2E7D32] text-xs font-bold px-4 py-2 rounded transition"
              >
                BELI BUNDLE SIERRA
              </button>
            </div>
          </div>

          <div className="bg-[#162033] border border-[#1E3050] p-4 rounded space-y-3">
            <h5 className="font-heading font-bold text-xs text-white uppercase">TABEL KOMPATIBILITAS (TESTED ACCORDING TO LAB)</h5>
            <div className="space-y-2 text-[10px]">
              {[
                { name: "BB 0.28g dengan VSR-10 Barrel", status: "KOMPATIBEL", desc: "Akurasi lurus & stabil di angin kencang." },
                { name: "Scope 3x-9x dengan VSR Rail", status: "KOMPATIBEL", desc: "Memerlukan high ring, langsung pasang." },
                { name: "Tokyo Marui Mag vs Clone", status: "⚠️ PERHATIKAN", desc: "Memerlukan amplas kikir tipis pada latch." }
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center border-b border-[#1E3050] pb-1.5">
                  <div>
                    <p className="text-[#F0F0F0] font-bold">{item.name}</p>
                    <p className="text-[#8A9BB0]">{item.desc}</p>
                  </div>
                  <span className={`font-bold px-1.5 py-0.5 rounded text-[8px] ${
                    item.status === "KOMPATIBEL" ? "bg-emerald-600/30 text-emerald-400" : "bg-[#E67E22]/30 text-[#E67E22]"
                  }`}>{item.status}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// [4] STRIKERENT™ PROTOTYPE
// -------------------------------------------------------------
function StrikeRentPage({ handleAddToCart }: { handleAddToCart: (p: Product) => void }) {
  const rentalGears = ALL_PRODUCTS.filter(p => p.condition.includes("Rental"));
  const [cityFilter, setCityFilter] = useState("Semua");
  const [startRent, setStartRent] = useState("");
  const [endRent, setEndRent] = useState("");

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* rent stats steps */}
      <section className="bg-gradient-to-r from-[#162033] to-[#0D1B2A] border border-[#1E3050] rounded p-6">
        <h2 className="text-3xl font-heading font-black text-white text-center uppercase mb-1">Coba Sebelum Beli. Hemat & Terlindungi.</h2>
        <p className="text-sm text-[#8A9BB0] text-center max-w-2xl mx-auto mb-6">Nikmati kebebasan bermain skirmish akhir pekan dengan unit premium terlatih tanpa harus beli permanen. Asuransi asuransi deposit 100% aman.</p>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
          {[
            { step: "1. Tentukan Unit", d: "Saring kriteria kesukaan" },
            { step: "2. Masukkan Tanggal", d: "Cek jadwal ketersediaan" },
            { step: "3. Deposit Aman & Bayar", d: "Escrow otomatis terjamin" },
            { step: "4. Pengantaran Taktis", d: "Unit dikirim ke area" },
            { step: "5. Kembalikan Gampang", d: "Deposit Anda cair instan" }
          ].map((s, i) => (
            <div key={i} className="border border-[#1E3050] p-4 rounded bg-[#0D1B2A]">
              <h5 className="font-heading font-bold text-xs text-[#4CAF50] uppercase mt-1">{s.step}</h5>
              <p className="text-[10px] text-[#8A9BB0]">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* RENTAL SEARCH CONTROLS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#0D1B2A] border border-[#1E3050] p-4 rounded">
        <div>
          <label className="text-[10px] text-[#8A9BB0] font-bold block uppercase mb-1">PILIH KOTA DEPLOYMENT</label>
          <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} className="w-full bg-[#162033] border border-[#1E3050] text-xs p-2 rounded text-white focus:outline-none">
            <option value="Semua">Semua Kota (Jakarta & Bandung)</option>
            <option value="Jakarta">Jakarta Selatan & Utara</option>
            <option value="Bandung">Bandung Raya</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] text-[#8A9BB0] font-bold block uppercase mb-1">TANGGAL MULAI SEWA</label>
          <input type="date" value={startRent} onChange={(e) => setStartRent(e.target.value)} className="w-full bg-[#162033] border border-[#1E3050] text-xs p-2 rounded text-white focus:outline-none" />
        </div>
        <div>
          <label className="text-[10px] text-[#8A9BB0] font-bold block uppercase mb-1">TANGGAL SELESAI SEWA</label>
          <input type="date" value={endRent} onChange={(e) => setEndRent(e.target.value)} className="w-full bg-[#162033] border border-[#1E3050] text-xs p-2 rounded text-white focus:outline-none" />
        </div>
      </div>

      {/* RENTAL EXCLUSIVES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rentalGears.filter(g => cityFilter === "Semua" || g.city === cityFilter).map((gear) => (
          <div key={gear.id} className="bg-[#0D1B2A] border border-[#1E3050] hover:border-[#4CAF50] transition rounded p-5 flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-40 h-36 bg-[#162033] rounded flex flex-col items-center justify-center font-bold text-3xl shrink-0 p-4 relative">
              <span>{gear.category.includes("Sniper") ? "🎯" : "💥"}</span>
              <span className="text-[9px] bg-red-600 px-1 py-0.5 rounded text-white uppercase absolute top-2 left-2">GRADE {gear.grade}</span>
              <span className="text-[9px] bg-[#1E3050] px-1 py-0.5 rounded text-[#8A9BB0] uppercase absolute bottom-2 right-2">TESTED</span>
            </div>

            <div className="flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h4 className="font-heading font-black text-base text-white uppercase">{gear.name}</h4>
                <p className="text-xs text-[#8A9BB0]">Pemilik: <span className="text-emerald-400 font-bold">{gear.owner}</span> · {gear.city}</p>
                <div className="mt-2 grid grid-cols-2 gap-1 text-[10px] text-[#8A9BB0]">
                  <p>🔫 Rate: <span className="text-white font-bold">Rp {gear.rentalPrice?.toLocaleString("id-ID")}/hari</span></p>
                  <p>💳 Deposito: <span className="text-white font-bold">Rp {gear.deposit?.toLocaleString("id-ID")}</span></p>
                  <p>⚡ Kecepatan: <span className="text-white font-bold">{gear.fps} FPS</span></p>
                  <p>🛡️ Perlindungan: <span className="text-[#4CAF50] font-bold">Asuransi Aktif</span></p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleAddToCart(gear)}
                  className="bg-[#4CAF50] hover:bg-[#2E7D32] text-xs font-bold py-2.5 px-4 rounded-sm transition flex-1 font-heading uppercase"
                >
                  Sewa Sekarang
                </button>
                <button
                  onClick={() => handleAddToCart(gear)}
                  className="border border-[#E67E22] text-[#E67E22] hover:bg-[#E67E22]/10 text-xs font-bold py-2.5 px-3 rounded-sm transition font-heading uppercase"
                >
                  Try & Buy
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* JADI PROVIDER */}
      <div className="bg-[#162033] border border-[#1E3050] rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h4 className="font-heading font-black text-lg text-white uppercase">Punya Gear Menganggur?</h4>
          <p className="text-sm text-[#8A9BB0]">Jadikan unit airsoft menganggur di lemari besi Anda sebagai pasif income ekstra Rp2.000.000 - Rp5.000.000 per bulan.</p>
        </div>
        <button className="bg-[#E67E22] hover:bg-[#B75E10] text-[#080E18] hover:text-white font-heading font-bold text-xs py-3 px-6 rounded-sm uppercase transition tracking-wide shrink-0">
          Daftarkan Gear Saya Sebagai Host
        </button>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// [5] STRIKESWAP™ DYNAMIC VALUATION & MARKETPLACE
// -------------------------------------------------------------
function StrikeSwapPage({ handleAddToCart, wishlist, toggleWishlist }: { handleAddToCart: (p: Product) => void, wishlist: string[], toggleWishlist: (id: string) => void }) {
  const swapProducts = ALL_PRODUCTS.filter(p => p.condition.includes("Preloved"));

  // Valuation tool state
  const [valBrand, setValBrand] = useState("Tokyo Marui");
  const [valModel, setValModel] = useState("VSR-10");
  const [valGrade, setValGrade] = useState("A");

  const computedValue = useMemo(() => {
    let base = 6000000;
    if (valBrand === "G&G") base = 4000000;
    if (valBrand === "WE-Tech") base = 3000000;
    if (valBrand === "NOVRISTCH") base = 10000000;

    let multiplier = 0.95; // Grade A
    if (valGrade === "B") multiplier = 0.75;
    if (valGrade === "C") multiplier = 0.55;

    const finalVal = base * multiplier;
    return {
      min: finalVal * 0.9,
      max: finalVal * 1.05
    };
  }, [valBrand, valGrade]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* SWAP HERO SYSTEM */}
      <section className="bg-gradient-to-r from-[#0D1B2A] to-[#162033] border border-[#1E3050] p-6 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        {[
          { icon: "🛡️", title: "CPO Certified", desc: "Grade kelayakan tuntas uji lab sirkuit mekanika kami." },
          { icon: "🤝", title: "Escrow Protection", desc: "Uang pembeli aman di rekening, cair jika barang sesuai." },
          { icon: "🔬", title: "Grading Transparan", desc: "Gradasi mutu A, B, C berdasar standard uji internal." }
        ].map((item, idx) => (
          <div key={idx} className="space-y-2 p-2">
            <span className="text-3xl block">{item.icon}</span>
            <h4 className="font-heading font-black text-sm text-[#4CAF50] uppercase">{item.title}</h4>
            <p className="text-xs text-[#8A9BB0] leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* DYNAMIC PRICE BENCHMARK TOOL */}
      <div className="bg-[#0D1B2A] border border-[#E67E22] p-6 rounded-lg grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-4 space-y-4">
          <h4 className="font-heading font-black text-[#E67E22] text-sm uppercase tracking-wider">🔬 STRIKESWAP™ BENCHMARK VALIDATOR</h4>
          <p className="text-[11px] text-[#8A9BB0]">Cari tahu harga wajar unit bekas di pasar Indonesia berdasarkam data real-time transaksi StrikeSwap™.</p>
          
          <div className="space-y-3 text-xs">
            <div>
              <label className="text-[9px] text-[#8A9BB0] font-bold block uppercase mb-1">Pilih Pabrikan</label>
              <select value={valBrand} onChange={(e) => setValBrand(e.target.value)} className="w-[100%] bg-[#162033] border border-[#1E3050] p-2 rounded text-white focus:outline-none">
                <option value="Tokyo Marui">Tokyo Marui</option>
                <option value="G&G">G&G Combat</option>
                <option value="WE-Tech">WE-Tech GBB</option>
                <option value="NOVRISTCH">NOVRISTCH Tactical</option>
              </select>
            </div>
            <div>
              <label className="text-[9px] text-[#8A9BB0] font-bold block uppercase mb-1">Atur Jenis Grade Fisik</label>
              <div className="flex gap-2">
                {["A", "B", "C"].map((g) => (
                  <button
                    key={g}
                    onClick={() => setValGrade(g)}
                    className={`flex-1 py-1 px-3 border rounded text-xs font-bold leading-none uppercase ${
                      valGrade === g ? "bg-[#E67E22] text-white border-[#E67E22]" : "bg-transparent text-[#8A9BB0] border-[#1E3050]"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Output valuation */}
        <div className="md:col-span-8 bg-[#162033] p-6 rounded border border-[#1E3050] flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-[#8A9BB0] uppercase tracking-widest block">ESTIMASI KELAS HARGA WAJAR</span>
            <p className="text-3xl font-black font-heading text-white">
              Rp {Math.floor(computedValue.min).toLocaleString("id-ID")} — Rp {Math.floor(computedValue.max).toLocaleString("id-ID")}
            </p>
            <p className="text-[10px] text-[#4CAF50] font-mono uppercase tracking-wider">Metode kalkulasi 48 transaksi live StrikeSwap™ terbaru.</p>
          </div>

          <div className="grid grid-cols-3 gap-2 border-t border-[#1E3050] pt-4 text-[10px] text-[#8A9BB0]">
            <div>
              <span className="font-bold text-white block uppercase">GRADE A</span>
              <p>90-100% prima, FPS standard prima.</p>
            </div>
            <div>
              <span className="font-bold text-white block uppercase">GRADE B</span>
              <p>75-89%, lecet wajar pemakaian.</p>
            </div>
            <div>
              <span className="font-bold text-white block uppercase">GRADE C</span>
              <p>50-74%, baret dalam / butuh minor tuning.</p>
            </div>
          </div>
        </div>
      </div>

      {/* SWAP LISTINGS GRID */}
      <section className="space-y-4">
        <h3 className="font-heading text-lg font-black text-white uppercase tracking-wider">UNIT PRELOVED PILIHAN CPO</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {swapProducts.map((p) => (
            <ProductCard key={p.id} product={p} handleAddToCart={handleAddToCart} wishlist={wishlist} toggleWishlist={toggleWishlist} />
          ))}
        </div>
      </section>
    </div>
  );
}

// -------------------------------------------------------------
// [6] GAMIFIED STRIKERANK™ & KOMUNITAS
// -------------------------------------------------------------
function StrikeRankPage() {
  const [subTab, setSubTab] = useState("nasional");

  const mockLeaderboard = useMemo(() => {
    if (subTab === "nasional") {
      return [
        { key: 1, pos: 1, name: "Komandan Sugi", rank: "General", xp: 148200 },
        { key: 2, pos: 2, name: "Letnan Gunawan", rank: "Colonel", xp: 125100 },
        { key: 3, pos: 3, name: "Sersan_Bowo", rank: "Lieutenant", xp: 95300 },
        { key: 4, pos: 247, name: "Kamu (Operator_Reza)", rank: "Sergeant", xp: 4200, current: true }
      ];
    }
    return [
      { key: 5, pos: 1, name: "Sersan_Bowo", rank: "Lieutenant", xp: 95300 },
      { key: 6, pos: 2, name: "Sersan_Hendra", rank: "Lieutenant", xp: 82000 },
      { key: 7, pos: 247, name: "Kamu (Operator_Reza)", rank: "Sergeant", xp: 4200, current: true }
    ];
  }, [subTab]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* HERO LEADERBOARD CARD */}
      <div className="bg-[#0D1B2A] border border-[#E67E22] p-6 rounded-lg grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-8 flex items-center gap-4">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-[#162033] rounded-full border-2 border-yellow-500 flex items-center justify-center font-bold text-3xl">
            🎖️
          </div>
          <div>
            <h3 className="font-heading font-black text-2xl text-white uppercase">Sersan Kepala Reza</h3>
            <p className="text-xs text-[#E67E22] font-mono uppercase tracking-widest font-bold">RECRUIT (LEVEL 4) ➔ SERGEANT (★ CURRENT)</p>
            <div className="mt-2 w-full md:w-64 bg-[#162033] h-2.5 rounded-full overflow-hidden border border-[#1E3050]">
              <div className="bg-yellow-500 h-full w-[72%]"></div>
            </div>
            <span className="text-[9px] text-[#8A9BB0] block mt-1">4.200 / 6.000 XP untuk naik pangkat ke Letnan Dua (Lieutenant)</span>
          </div>
        </div>

        {/* User stats */}
        <div className="md:col-span-4 grid grid-cols-2 gap-2 text-center text-xs tracking-wide">
          <div className="bg-[#162033] border border-[#1E3050] p-2.5 rounded">
            <span className="text-xs text-[#8A9BB0] block">SERANGAN EVENT</span>
            <span className="font-heading font-black text-white text-base">8 Kali</span>
          </div>
          <div className="bg-[#162033] border border-[#1E3050] p-2.5 rounded">
            <span className="text-xs text-[#8A9BB0] block">REPUTASI SWAP</span>
            <span className="font-heading font-black text-white text-base">99% Positif</span>
          </div>
        </div>
      </div>

      {/* RECENT FEED LOGS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Achievements list */}
        <div className="lg:col-span-6 bg-[#0D1B2A] border border-[#1E3050] p-6 rounded-lg space-y-4">
          <h4 className="font-heading font-black text-white text-sm uppercase tracking-wider flex items-center gap-2">
            🏆 INTEGRASI PRESTASI & LENCANA TAKTIS
          </h4>
          <div className="grid grid-cols-2 gap-3 text-xs">
            {[
              { title: "First Blood", desc: "Pembelian unit airsoft pertama.", unlocked: true },
              { title: "Sakit Hati Jauh", desc: "Upgrade VSR-10 tembus jangkauan lab.", unlocked: true },
              { title: "Inspektur Legal", desc: "Menyelesaikan Verifikasi KTP.", unlocked: true },
              { title: "Bintang Lapangan", desc: "Ditinjau di 5 Turnamen Skirmish.", unlocked: false }
            ].map((ach, idx) => (
              <div key={idx} className={`p-3 rounded border flex gap-2.5 items-center ${
                ach.unlocked ? "bg-[#162033] border-emerald-500/50" : "bg-transparent border-[#1E3050] opacity-50"
              }`}>
                <span className="text-2xl">{ach.unlocked ? "🏅" : "🔒"}</span>
                <div>
                  <h5 className="font-bold text-white uppercase text-[11px] leading-tight">{ach.title}</h5>
                  <p className="text-[9px] text-[#8A9BB0] mt-0.5">{ach.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mini leaderboard rankings */}
        <div className="lg:col-span-6 bg-[#0D1B2A] border border-[#1E3050] p-6 rounded-lg space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E3050] pb-2">
            <h4 className="font-heading font-black text-white text-sm uppercase tracking-wider">
              ⚔️ MIL-XP LEADERBOARD
            </h4>
            <div className="flex gap-1.5">
              <button
                onClick={() => setSubTab("nasional")}
                className={`text-[9px] font-bold px-2 py-1 uppercase rounded-sm border ${
                  subTab === "nasional" ? "bg-[#4CAF50] border-[#4CAF50] text-[#080E18]" : "bg-transparent border-[#1E3050] text-[#8A9BB0]"
                }`}
              >
                Nasional
              </button>
              <button
                onClick={() => setSubTab("regional")}
                className={`text-[9px] font-bold px-2 py-1 uppercase rounded-sm border ${
                  subTab === "regional" ? "bg-[#4CAF50] border-[#4CAF50] text-[#080E18]" : "bg-transparent border-[#1E3050] text-[#8A9BB0]"
                }`}
              >
                Jakarta
              </button>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            {mockLeaderboard.map((item) => (
              <div
                key={item.key}
                className={`flex items-center justify-between p-2.5 rounded border ${
                    item.current ? "bg-yellow-500/10 border-yellow-500" : "bg-[#162033] border-[#1E3050]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-[#E67E22] w-6">#{item.pos}</span>
                  <div>
                    <h5 className="font-bold text-white">{item.name}</h5>
                    <span className="text-[10px] text-[#8A9BB0] uppercase">{item.rank}</span>
                  </div>
                </div>
                <span className="font-title font-bold text-emerald-400">{item.xp.toLocaleString()} XP</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// June 2025 event dates
const EVENTS_IN_JUNE = [
  { date: 4, name: "Jakarta CQB Skirmish @Taktis", type: "Skirmish", color: "bg-emerald-600" },
  { date: 15, name: "MilSim Battle: Indonesia Challenge", type: "MilSim", color: "bg-red-600" },
  { date: 22, name: "Grand Speedsoft Cup Tournament", type: "Turnamen", color: "bg-amber-600" }
];

// -------------------------------------------------------------
// [7] STRIKEEVENT™ DIREKTORI & REGISTER
// -------------------------------------------------------------
function StrikeEventPage() {
  const [activeDate, setActiveDate] = useState<number | null>(null);

  const filteredEventList = useMemo(() => {
    if (activeDate === null) return EVENTS_IN_JUNE;
    return EVENTS_IN_JUNE.filter(e => e.date === activeDate);
  }, [activeDate]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* FEATURED EVENT BIG CARD */}
      <div className="bg-gradient-to-b from-[#162033] to-[#0D1B2A] border-2 border-red-500/40 rounded-lg p-6 relative overflow-hidden">
        <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded uppercase tracking-wider animate-pulse">
          🔥 EVENT UNGGULAN NASIONAL
        </div>
        
        <div className="space-y-4 max-w-2xl">
          <span className="text-[#8A9BB0] text-[11px] font-mono tracking-widest uppercase">MILSIM SKELETON 2025</span>
          <h2 className="text-3xl sm:text-4xl font-heading font-black text-white uppercase leading-tight">INDONESIA MILSIM CHALLENGE: OPERATION JAYAPURA</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div>
              <span className="text-[#8A9BB0] block uppercase text-[10px]">Tanggal Ops</span>
              <span className="text-white font-bold">15 - 16 Juni 2025</span>
            </div>
            <div>
              <span className="text-[#8A9BB0] block uppercase text-[10px]">Lokasi</span>
              <span className="text-white font-bold">Kamp Taktis Serpong</span>
            </div>
            <div>
              <span className="text-[#8A9BB0] block uppercase text-[10px]">Tiket Masuk</span>
              <span className="text-[#E67E22] font-bold">Rp150.000 / Peserta</span>
            </div>
            <div>
              <span className="text-[#8A9BB0] block uppercase text-[10px]">Slot Tersisa</span>
              <span className="text-emerald-400 font-bold">23 Slot Terakhir</span>
            </div>
          </div>

          <div className="w-full bg-[#162033] h-2 rounded-full overflow-hidden border border-[#1E3050]">
            <div className="bg-gradient-to-r from-red-600 to-[#E67E22] h-full w-[88%]"></div>
          </div>

          <button className="bg-red-600 hover:bg-red-700 text-white font-heading font-bold text-xs uppercase tracking-wide py-3 px-6 rounded-sm transition">
            Daftar Masuk Turnamen Sekarang (Simulasi Tiket)
          </button>
        </div>
      </div>

      {/* CALENDAR & LIST GRID CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* INLINE JUN 2025 CALENDAR */}
        <div className="lg:col-span-5 bg-[#0D1B2A] border border-[#1E3050] p-6 rounded-lg space-y-4">
          <div className="flex justify-between items-center border-b border-[#1E3050] pb-2">
            <h4 className="font-heading font-black text-white text-xs uppercase tracking-wider">🗓️ KALENDER EVENT JUNI 2025</h4>
            <span className="text-[10px] text-[#4CAF50] font-bold">3 EVENT TERDAFTAR</span>
          </div>

          {/* Calendar days mapping */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs">
            {["MIN", "SEN", "SEL", "RAB", "KAM", "JUM", "SAB"].map(d => (
              <span key={d} className="font-bold text-[#8A9BB0] py-1">{d}</span>
            ))}
            {/* June 2025 starts on Sunday. Blank spaces: 0. Days: 30 */}
            {Array.from({ length: 30 }).map((_, idx) => {
              const day = idx + 1;
              const hasEv = EVENTS_IN_JUNE.find(e => e.date === day);
              
              return (
                <button
                  key={idx}
                  onClick={() => setActiveDate(activeDate === day ? null : day)}
                  className={`py-2 rounded transition relative border cursor-pointer ${
                    activeDate === day
                      ? "bg-[#4CAF50]/20 border-[#4CAF50] text-[#4CAF50]"
                      : hasEv
                      ? "bg-[#162033] border-[#1E3050] text-white hover:border-[#4CAF50]"
                      : "bg-[#0D1B2A] border-transparent text-[#8A9BB0] hover:bg-[#162033]"
                  }`}
                >
                  <span className="font-bold">{day}</span>
                  {hasEv && (
                    <span className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full ${hasEv.color}`}></span>
                  )}
                </button>
              );
            })}
          </div>
          <button onClick={() => setActiveDate(null)} className="text-[10px] text-[#4CAF50] hover:underline block text-center uppercase font-bold">
            Tampilkan Semua Event Hari Ini
          </button>
        </div>

        {/* LIST EVENT FILTERED */}
        <div className="lg:col-span-7 bg-[#0D1B2A] border border-[#1E3050] p-6 rounded-lg space-y-4 flex-1">
          <h4 className="font-heading font-black text-white text-xs uppercase tracking-wider border-b border-[#1E3050] pb-2">
            📋 DIRECTORY LAPANGAN & TURNAMEN AKTIF
          </h4>

          <div className="space-y-4">
            {filteredEventList.map((e, idx) => (
              <div key={idx} className="bg-[#162033] border-l-4 border-[#4CAF50] p-4 rounded flex justify-between items-center gap-4">
                <div>
                  <span className="text-[9px] bg-[#0E1B2A] border border-[#1E3050] text-[#E67E22] font-bold py-0.5 px-2 rounded tracking-widest uppercase">
                    {e.type}
                  </span>
                  <h5 className="font-heading font-black text-[#F0F0F0] text-sm uppercase mt-1">
                    {e.name}
                  </h5>
                  <p className="text-xs text-[#8A9BB0]">Juni {e.date}, 2025 · Kapasitas: Lulus Standard StrikeID™</p>
                </div>
                <button className="bg-[#4CAF50] hover:bg-[#2E7D32] hover:scale-105 duration-150 text-[10px] font-bold py-1.5 px-3 rounded uppercase text-white shrink-0">
                  Join Ticket
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// [8] REGULATORY DEPLOYMENT STRIKEID™ VERIFICATION
// -------------------------------------------------------------
function StrikeIDPage() {
  const [fileSelected, setFileSelected] = useState<string | null>(null);
  const [verifyProgress, setVerifyProgress] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const startVerificationSim = () => {
    if (!fileSelected) return;
    setIsVerifying(true);
    setVerifyProgress(0);
    const interval = setInterval(() => {
      setVerifyProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setIsVerifying(false);
          return 100;
        }
        return p + 20;
      });
    }, 400);
  };

  const faqs = [
    { q: "Apakah olahraga airsoft gun legal di bawah hukum Indonesia?", a: "Ya, Airsoft gun wajib dikategorikan sebagai alat olahraga rekreasi di bawah Federasi Olahraga (KORMI/Porgasi) berpedoman pada Perkapolri No. 8 Tahun 2012. Unit dilarang keras dikonversi menjadi senjata api." },
    { q: "Berapa batas maksimal kecepatan peluru (FPS) yang aman?", a: "Melalui standard StrikeID™ FPS lab, unit diizinkan beroperasi dengan aman pada batas 300 - 450 FPS bergantung segmentasi (AEG CQB vs Sniper Bolt Action)." },
    { q: "Apakah dokumen KTP wajib diunggah saat mendaftar?", a: "Ya, sesuai tata tertib StrikeZone.id. Dokumen di-enkripsi menyeluruh dan hanya digunakan sebagai audit internal legalitas rentang usia operator di atas 18 tahun." }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* SIMULATOR UPLOAD FOR KTP */}
        <div className="lg:col-span-6 bg-[#0D1B2A] border border-[#1E3050] p-6 rounded-lg space-y-4">
          <h4 className="font-heading font-black text-white text-sm uppercase tracking-wider border-b border-[#1E3050] pb-2">
            🛡️ STRIKEID™ KYC VERIFICATION PROCESS
          </h4>

          <div className="border border-dashed border-[#1E3050] rounded-lg p-6 text-center space-y-4">
            <p className="text-xs text-[#8A9BB0]">Unggah foto KTP digital beresolusi jelas untuk klaim Sertifikasi Legal taktis.</p>
            
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setFileSelected("ktp_reza.png")}
                className={`text-xs py-2 px-4 rounded ${
                  fileSelected ? "bg-emerald-600 text-white" : "bg-[#162033] text-[#8A9BB0] border border-[#1E3050]"
                }`}
              >
                {fileSelected ? "✓ KTP_REZA.PNG TERPILIH" : "PILIH FILE CONTOH KTP"}
              </button>
            </div>

            {fileSelected && (
              <div className="space-y-2">
                <button
                  onClick={startVerificationSim}
                  disabled={isVerifying}
                  className="bg-[#4CAF50] hover:bg-[#2E7D32] text-xs font-bold font-heading text-white py-2.5 px-6 rounded uppercase transition inline-block cursor-pointer"
                >
                  {isVerifying ? "PROSES DETEKSI AI..." : "MULAI VERIFIKASI SEKARANG"}
                </button>

                {isVerifying && (
                  <div className="w-full bg-[#162033] h-2 rounded-full overflow-hidden border border-[#1E3050] mt-2">
                    <div className="bg-[#4CAF50] h-full duration-300" style={{ width: `${verifyProgress}%` }} />
                  </div>
                )}

                {verifyProgress === 100 && (
                  <p className="text-xs text-[#4CAF50] font-bold block uppercase tracking-wider">✓ STRIKEID™ ANDA AKTIF & LEGAL TERDAFTAR</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* COMPREHENSIVE LEGAL LAW ACCORDION */}
        <div className="lg:col-span-6 bg-[#0D1B2A] border border-[#1E3050] p-6 rounded-lg space-y-4">
          <h4 className="font-heading font-black text-white text-sm uppercase tracking-wider border-b border-[#1E3050] pb-2">
            💡 EDUKASI REGULASI OPERATOR (FAQ)
          </h4>

          <div className="space-y-3">
            {faqs.map((f, idx) => (
              <div key={idx} className="bg-[#162033] border border-[#1E3050] rounded">
                <button
                  onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                  className="w-full text-left p-3 flex justify-between items-center text-xs text-[#F0F0F0] font-bold uppercase tracking-wider focus:outline-none"
                >
                  <span>{f.q}</span>
                  {faqOpen === idx ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>
                {faqOpen === idx && (
                  <div className="p-3 pt-0 border-t border-[#1E3050]/50 text-[11px] text-[#8A9BB0] leading-relaxed">
                    {f.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// -------------------------------------------------------------
// [9] CHECK_OUT WORKFLOW & ORDER CALCULATION
// -------------------------------------------------------------
function CartAndCheckoutPage({ cart, setCart, navigateTo }: { cart: any[], setCart: any, navigateTo: (t: string) => void }) {
  const [step, setStep] = useState(1);
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0); // value in Rp
  const [usePoints, setUsePoints] = useState(false);
  const [carrier, setCarrier] = useState("jne-reg");
  const [carrierCost, setCarrierCost] = useState(35000);
  const [insurance, setInsurance] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  
  const [formFields, setFormFields] = useState({
    name: "Lt. Reza Hendra",
    phone: "081298457788",
    city: "Jakarta Selatan",
    addr: "Kavling Taktis, Gang M4, No. 47"
  });

  const cartSubtotal = useMemo(() => {
    return cart.reduce((acc, item) => {
      const p = item.product;
      const actualPrice = p.price * (1 - p.discount / 100);
      return acc + (actualPrice * item.qty);
    }, 0);
  }, [cart]);

  const handleQtyChange = (id: string, dir: "inc" | "dec") => {
    setCart((prev: any[]) => {
      return prev.map((item: any) => {
        if (item.product.id === id) {
          const targetQty = dir === "inc" ? item.qty + 1 : item.qty - 1;
          return { ...item, qty: Math.max(1, targetQty) };
        }
        return item;
      });
    });
  };

  const handleRemove = (id: string) => {
    setCart((prev: any[]) => prev.filter((item) => item.product.id !== id));
  };

  // Coupon handler
  const validateCoupon = () => {
    if (couponCode.toUpperCase() === "STRIKE10") {
      setAppliedDiscount(cartSubtotal * 0.1);
    } else {
      setAppliedDiscount(0);
      alert("Kode kupon salah/tidak terdaftar!");
    }
  };

  const pointsDeduction = usePoints ? 12500 : 0;
  const insuranceCost = insurance ? 25000 : 0;
  const grandTotal = Math.max(0, cartSubtotal - appliedDiscount - pointsDeduction + carrierCost + insuranceCost);

  return (
    <div className="space-y-6 animate-fadeIn relative">
      
      {/* STEPS TIMELINE BAR */}
      <section className="bg-[#0D1B2A] border border-[#1E3050] p-4 rounded-lg flex items-center justify-center gap-4 text-xs font-heading font-black">
        {[
          { id: 1, label: "1. RINGKASAN ITEMS" },
          { id: 2, label: "2. ALAMAT DEPLOY" },
          { id: 3, label: "3. EKSPEDISI" },
          { id: 4, label: "4. METODE PEMBAYARAN" }
        ].map((s) => (
          <span key={s.id} className={`py-1 px-3 border rounded-sm ${
            step === s.id ? "bg-[#4CAF50] text-[#080E18] border-[#4CAF50]" : "bg-transparent text-[#8A9BB0] border-[#1E3050]"
          }`}>
            {s.label}
          </span>
        ))}
      </section>

      {cart.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: CORE INPUT PANEL PER STEP */}
          <div className="lg:col-span-8 bg-[#0D1B2A] border border-[#1E3050] p-6 rounded-lg space-y-6">
            
            {/* STEP 1: REVIEW CART */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="font-heading text-base font-black text-white uppercase tracking-wider">📦 Keranjang Operasi Anda</h3>
                
                <div className="divide-y divide-[#1E3050] space-y-4">
                  {cart.map((item) => {
                    const discountedPrice = item.product.price * (1 - item.product.discount / 100);
                    return (
                      <div key={item.product.id} className="flex flex-col sm:flex-row items-center justify-between pt-4 gap-4">
                        <div className="flex items-center gap-4">
                          <span className="text-3xl bg-[#162033] p-2.5 rounded">
                            {item.product.category.includes("Sniper") ? "🎯" : "💥"}
                          </span>
                          <div>
                            <h5 className="font-heading font-bold text-sm text-white uppercase">{item.product.name}</h5>
                            <p className="text-xs text-[#8A9BB0]">{item.product.brand} · {item.product.fps} FPS</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="flex items-center border border-[#1E3050] rounded overflow-hidden text-xs">
                            <button onClick={() => handleQtyChange(item.product.id, "dec")} className="px-2.5 py-1 bg-[#162033] hover:text-[#4CAF50]">-</button>
                            <span className="px-3 py-1 font-bold bg-[#0D1B2A] text-white">{item.qty}</span>
                            <button onClick={() => handleQtyChange(item.product.id, "inc")} className="px-2.5 py-1 bg-[#162033] hover:text-[#4CAF50]">+</button>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-xs text-[#8A9BB0] block font-mono">Rp {discountedPrice.toLocaleString("id-ID")} x {item.qty}</span>
                            <span className="font-heading font-black text-white text-sm">Rp {(discountedPrice * item.qty).toLocaleString("id-ID")}</span>
                          </div>

                          <button onClick={() => handleRemove(item.product.id)} className="text-red-500 hover:text-red-400 p-1" title="Hapus">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-end pt-4">
                  <button onClick={() => setStep(2)} className="bg-[#4CAF50] hover:bg-[#2E7D32] text-xs font-heading font-bold text-white py-3 px-8 rounded-sm uppercase tracking-wide">
                    Lanjut Ke Pengiriman &rarr;
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: ADDRESS DEPLOY */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="font-heading text-base font-black text-white uppercase tracking-wider">📍 Koordinat Drop Zone (Alamat Kirim)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-[10px] text-[#8A9BB0] font-bold block uppercase mb-1">Nama Operator Penerima</label>
                    <input type="text" value={formFields.name} onChange={(e) => setFormFields({...formFields, name: e.target.value})} className="w-[100%] bg-[#162033] border border-[#1E3050] text-white p-3 rounded" />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#8A9BB0] font-bold block uppercase mb-1">Telepon (HP)</label>
                    <input type="text" value={formFields.phone} onChange={(e) => setFormFields({...formFields, phone: e.target.value})} className="w-[100%] bg-[#162033] border border-[#1E3050] text-white p-3 rounded" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[10px] text-[#8A9BB0] font-bold block uppercase mb-1">Alamat Lengkap Operasi</label>
                    <textarea value={formFields.addr} onChange={(e) => setFormFields({...formFields, addr: e.target.value})} className="w-[100%] bg-[#162033] border border-[#1E3050] text-white p-3 rounded h-20" />
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button onClick={() => setStep(1)} className="border border-[#1E3050] hover:bg-[#162033] text-xs font-bold font-heading py-3 px-6 rounded-sm uppercase">
                    &larr; Kembali
                  </button>
                  <button onClick={() => setStep(3)} className="bg-[#4CAF50] hover:bg-[#2E7D32] text-xs font-bold font-heading py-3 px-8 rounded-sm uppercase tracking-wide">
                    Metode Ekspedisi &rarr;
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: COURIERS SHIPPING */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="font-heading text-base font-black text-white uppercase tracking-wider">🚚 Jalur Logistik Pengiriman</h3>
                <div className="space-y-3 font-medium text-xs">
                  {[
                    { key: "jne-reg", cost: 35000, label: "JNE Regular (Military Road-Ops) · 2-3 Hari", val: 35000 },
                    { key: "jne-yes", cost: 55000, label: "JNE YES (Express Stealth Delivery) · Esok Sampai", val: 55000 },
                    { key: "gosend", cost: 25000, label: "GoSend SameDay (Khusus Area Jabodetabek Saja) · Hari Ini", val: 25000 }
                  ].map((sh) => (
                    <label key={sh.key} className="flex items-center justify-between p-4 bg-[#162033] border border-[#1E3050] text-[#8A9BB0] hover:text-white rounded cursor-pointer">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="courierOption"
                          checked={carrier === sh.key}
                          onChange={() => {
                            setCarrier(sh.key);
                            setCarrierCost(sh.cost);
                          }}
                          className="mr-2 accent-[#4CAF50]"
                        />
                        <span>{sh.label}</span>
                      </div>
                      <span className="font-heading font-black text-white">Rp {sh.cost.toLocaleString("id-ID")}</span>
                    </label>
                  ))}
                </div>

                <div className="flex justify-between pt-4">
                  <button onClick={() => setStep(2)} className="border border-[#1E3050] hover:bg-[#162033] text-xs font-bold font-heading py-3 px-6 rounded-sm uppercase">
                    &larr; Kembali
                  </button>
                  <button onClick={() => setStep(4)} className="bg-[#4CAF50] hover:bg-[#2E7D32] text-xs font-bold font-heading py-3 px-8 rounded-sm uppercase tracking-wide">
                    Lanjut Ke Pembayaran &rarr;
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: PAYMENT SELECTION */}
            {step === 4 && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="font-heading text-base font-black text-white uppercase tracking-wider">💳 Kanal Transfer Dana Operasi</h3>
                <p className="text-xs text-[#8A9BB0] leading-relaxed">Pilih salah satu metode aman terenskripsi otomatis escrow.</p>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <button className="bg-[#162033] border border-[#4CAF50] p-4 text-center rounded text-white font-bold uppercase tracking-wider flex items-center justify-center gap-2">
                    🏦 BANK TRANSFER VA
                  </button>
                  <button className="bg-[#162033] border border-[#1E3050] p-4 text-center rounded text-[#8A9BB0] hover:text-white font-bold uppercase tracking-wider">
                    📱 QRIS DEPOSIT INSTAN
                  </button>
                </div>

                <div className="border border-[#1E3050] p-4 rounded text-center text-xs space-y-2">
                  <p className="text-[#8A9BB0]">KIRIM PEMBAYARAN KE NO. REKENING VIRTUAL ACCOUNT BCA MANDIRI BERIKUT:</p>
                  <p className="text-xl font-heading font-black text-[#4CAF50] tracking-widest block uppercase">BCA VA: 8047 3822 1290 8</p>
                  <span className="text-[10px] text-[#8A9BB0]">Status deteksi pembayaran instan terverifikasi pasca transfer selesai digulirkan.</span>
                </div>

                <div className="flex justify-between pt-4">
                  <button onClick={() => setStep(3)} className="border border-[#1E3050] hover:bg-[#162033] text-xs font-bold font-heading py-3 px-6 rounded-sm uppercase">
                    &larr; Kembali
                  </button>
                  <button
                    onClick={() => setSuccessModalOpen(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-bold text-xs uppercase tracking-wide py-3 px-8 rounded-sm transition"
                  >
                    Saya Sudah Transfer — Finis &rarr;
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* RIGHT COLUMN: REVENUE CALCULATORS & STICKY SUMMARY */}
          <div className="lg:col-span-4 bg-[#0D1B2A] border border-[#1E3050] p-6 rounded-lg space-y-4">
            <h4 className="font-heading font-black text-white text-sm uppercase tracking-wider">🛠️ RINGKASAN REKENING</h4>
            
            <div className="space-y-2.5 text-xs border-b border-[#1E3050] pb-4">
              <div className="flex justify-between">
                <span className="text-[#8A9BB0]">Subtotal Items</span>
                <span className="text-[#F0F0F0]">Rp {cartSubtotal.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8A9BB0]">Ongkos Kirim Jalur</span>
                <span className="text-[#F0F0F0]">Rp {carrierCost.toLocaleString("id-ID")}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-red-500 font-bold">
                  <span>Diskon Kupon 10%</span>
                  <span>-Rp {appliedDiscount.toLocaleString("id-ID")}</span>
                </div>
              )}
              {usePoints && (
                <div className="flex justify-between text-yellow-500 font-bold">
                  <span>Sarat StrikePoints (≈ 1.250 pts)</span>
                  <span>-Rp 12.500</span>
                </div>
              )}
              {insurance && (
                <div className="flex justify-between">
                  <span className="text-[#8A9BB0]">Layanan Garansi Ops</span>
                  <span className="text-[#F0F0F0]">Rp 25.000</span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center text-sm font-black text-white font-heading uppercase pb-4 border-b border-[#1E3050]">
              <span>TOTAL PEMBAYARAN KAS</span>
              <span className="text-xl text-[#4CAF50]">Rp {grandTotal.toLocaleString("id-ID")}</span>
            </div>

            {/* Coupon input code */}
            <div className="space-y-2 pt-2 text-xs">
              <p className="text-[10px] text-[#8A9BB0] font-bold uppercase block">MILITARY PROMO COUPON</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Kode e.g., STRIKE10"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 bg-[#162033] border border-[#1E3050] text-[#F0F0F0] text-xs px-2 py-1 rounded placeholder-[#8A9BB0]"
                />
                <button onClick={validateCoupon} className="bg-[#4CAF50] hover:bg-[#2E7D32] px-3.5 rounded text-white font-bold leading-none">
                  SINKRON
                </button>
              </div>
              <p className="text-[9px] text-[#8A9BB0]">Gunakan kode kupon <span className="text-emerald-400 font-bold">STRIKE10</span> untuk klaim potongan 10%.</p>
            </div>

            {/* Toggle StrikePoints & Insurance */}
            <div className="space-y-2 border-t border-[#1E3050] pt-4 text-xs font-semibold">
              <label className="flex items-center text-[#8A9BB0] hover:text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={usePoints}
                  onChange={() => setUsePoints(!usePoints)}
                  className="mr-2 accent-[#4CAF50]"
                />
                Gunakan 1.250 Strike Points (-Rp12.500)
              </label>
              
              <label className="flex items-center text-[#8A9BB0] hover:text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={insurance}
                  onChange={() => setInsurance(!insurance)}
                  className="mr-2 accent-[#4CAF50]"
                />
                Include Asuransi Logistik (+Rp25.000)
              </label>
            </div>

          </div>

        </div>
      ) : (
        <div className="bg-[#0D1B2A] border border-[#1E3050] rounded-lg p-12 text-center text-[#8A9BB0] space-y-4">
          <ShoppingCart className="mx-auto text-[#4CAF50]" size={48} />
          <p className="text-sm font-bold uppercase">Keranjang Kosong, Operator</p>
          <p className="text-xs max-w-sm mx-auto">Tampaknya belum ada item taktis yang Anda siapkan untuk misi skirmish kali ini.</p>
          <button onClick={() => navigateTo("katalog")} className="bg-[#4CAF50] hover:bg-[#2E7D32] text-xs font-bold py-2.5 px-6 rounded uppercase transition text-white">
            Belanja Sekarang
          </button>
        </div>
      )}

      {/* CONFIRMATION SUCCESS DIALOG MODAL */}
      {successModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080E18]/85 backdrop-blur-sm">
          <div className="bg-[#0D1B2A] border-2 border-[#4CAF50] max-w-sm w-full p-6 text-center rounded space-y-4 shadow-2xl relative">
            <CheckCircle className="text-[#4CAF50] mx-auto" size={48} />
            <h4 className="font-heading font-black text-xl text-white uppercase">Misi Berhasil Terkirim!</h4>
            <p className="text-xs text-[#8A9BB0] leading-relaxed">Pesanan Anda telah diproses. Tim kami akan segera melakukan uji inspeksi FPS laboratorium fisik sebelum pengiriman dilaksanakan.</p>
            <p className="text-[10px] text-[#4CAF50] font-mono uppercase tracking-widest block font-bold">NOMOR RESI INTEL: #SZ2026-9482</p>
            <button
              onClick={() => {
                setSuccessModalOpen(false);
                setCart([]);
                navigateTo("landing");
              }}
              className="bg-[#4CAF50] hover:bg-[#2E7D32] text-xs font-bold py-2.5 w-full rounded uppercase text-white cursor-pointer font-heading"
            >
              Kembali Ke Beranda Taktis
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
