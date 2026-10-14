import { useState, useMemo } from 'react';
import { SearchIcon, CartIcon, HeartIcon, UserIcon, GlobeIcon, ChevronDownIcon, ChevronRightIcon, ArrowLeftIcon, MenuIcon, CloseIcon, LogoutIcon } from './icons';
import { categories, products, Category } from '../data';
import { UserProfile } from './AuthModal';
import AwardBanner from './AwardBanner';

interface HeaderProps {
  currentPage?: string;
  activeCategory?: string;
  cartCount: number;
  wishlistCount: number;
  onCartOpen: () => void;
  onWishlistOpen: () => void;
  onCategorySelect: (id: string, subcategory?: string) => void;
  onSearch: (q: string) => void;
  language: string;
  onLanguageChange: (lang: string) => void;
  onHome: () => void;
  user: UserProfile | null;
  onAuthOpen: (mode?: 'login' | 'signup') => void;
  onLogout: () => void;
  onShowOrders?: () => void;
}

const languages = [
  { code: 'en', label: 'English' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'hi', label: 'हिंदी' },
];

export default function Header({
  currentPage = 'home',
  activeCategory,
  cartCount, wishlistCount, onCartOpen, onWishlistOpen,
  onCategorySelect, onSearch, language, onLanguageChange, onHome,
  user, onAuthOpen, onLogout, onShowOrders
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [langOpen, setLangOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categorySidebarOpen, setCategorySidebarOpen] = useState(false);
  const [selectedDrawerCategory, setSelectedDrawerCategory] = useState<Category | null>(null);
  const [subcategorySearch, setSubcategorySearch] = useState('');

  // Subcategory model counts
  const subcategoryCounts = useMemo(() => {
    const map: Record<string, number> = {};
    products.forEach(p => {
      if (p.subcategory) {
        map[p.subcategory] = (map[p.subcategory] || 0) + 1;
      }
    });
    return map;
  }, []);

  // Category model counts
  const categoryCounts = useMemo(() => {
    const map: Record<string, number> = {};
    products.forEach(p => {
      map[p.category] = (map[p.category] || 0) + 1;
    });
    return map;
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <>
      {/* 1. TOPMOST BLUE PART: ONLY "HEBRON ENTERPRISES — AUTHORISED DEALER" (SCROLLS NORMALLY) */}
      <div className="bg-[#0284c7] text-white border-b border-sky-600 py-3 sm:py-3.5 px-4 text-center shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <span className="text-amber-300 text-sm sm:text-lg lg:text-xl font-black tracking-widest uppercase font-sans drop-shadow-xs">
            HEBRON ENTERPRISES — AUTHORISED DEALER
          </span>
        </div>
      </div>

      {/* 2. ONLY THE C.R.I. PUMPS LOGO CARD IS STICKY AT TOP:0 WITH Z-INDEX 50 */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-3 sm:px-6 py-3 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-6">
          
          {/* Left Column: C.R.I. PUMP LOGO + SIDE TOGGLE BAR */}
          <div className="flex items-center justify-between w-full md:w-auto shrink-0 gap-2 sm:gap-3">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* SIDE TOGGLE BAR BUTTON */}
              <button
                type="button"
                onClick={() => {
                  setSelectedDrawerCategory(null);
                  setCategorySidebarOpen(true);
                }}
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-sky-50 hover:bg-sky-100 text-sky-950 border border-sky-200 hover:border-sky-300 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer group shrink-0"
                title="Browse All Categories & Ranges"
                aria-label="Toggle Categories Sidebar"
              >
                <span className="text-base sm:text-lg group-hover:scale-110 transition-transform">☰</span>
                <span className="font-extrabold tracking-wide hidden sm:inline">View Categories</span>
              </button>

              {/* C.R.I. PUMPS LOGO */}
              <button onClick={onHome} className="flex flex-col items-start group focus:outline-none">
                <img 
                  src="https://www.crifluidsystems.com/za/wp-content/uploads/2021/02/cri-logo-new.png" 
                  alt="C.R.I. Pumps Logo" 
                  className="h-8 sm:h-11 w-auto object-contain transition-transform group-hover:scale-105"
                />
                <span className="text-[9px] sm:text-[10px] text-red-700 font-extrabold italic tracking-tight">
                  Pumping trust... Worldwide.
                </span>
              </button>
            </div>

            {/* Mobile Actions Toggle */}
            <div className="flex items-center gap-2 md:hidden">
              <button onClick={onWishlistOpen} className="relative p-1.5 text-gray-700">
                <HeartIcon size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>

              <button onClick={onCartOpen} className="relative flex items-center gap-1 bg-amber-400 text-gray-950 text-xs font-bold px-2 py-1 rounded">
                <CartIcon size={16} />
                {cartCount > 0 && (
                  <span className="bg-red-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-1 text-gray-700">
                {mobileMenuOpen ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
              </button>
            </div>
          </div>

          {/* Center Column: SEARCH BAR DIRECTLY IN C.R.I. PUMPS COLUMN */}
          <div className="flex-1 w-full max-w-2xl mx-auto md:mx-0">
            <form onSubmit={handleSearch} className="w-full flex">
              <div className="flex w-full rounded-xl overflow-hidden border-2 border-sky-500 focus-within:border-amber-400 transition-colors shadow-sm">
                <input
                  type="text"
                  placeholder="Search Hebron Enterprises for C.R.I. pumps, motors, pipes..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-2 text-xs sm:text-sm outline-none bg-slate-50 text-gray-900 placeholder-gray-500 focus:bg-white transition-colors"
                />
                <button type="submit" className="px-5 bg-amber-400 hover:bg-amber-500 transition-colors text-gray-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 shrink-0">
                  <SearchIcon size={18} />
                  <span className="hidden sm:inline">Search</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: User & Cart Actions (Desktop) */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <button onClick={onWishlistOpen} className="relative p-2 text-gray-700 hover:text-red-600 transition-colors" title="Wishlist">
              <HeartIcon size={22} />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button onClick={onCartOpen} className="relative flex items-center gap-1.5 bg-amber-400 hover:bg-amber-500 text-gray-950 text-xs sm:text-sm font-bold px-3 py-2 rounded-lg transition-colors shadow-md">
              <CartIcon size={18} />
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="bg-red-600 text-white text-[10px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {user ? (
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-1.5 bg-blue-50 text-blue-900 text-xs font-bold px-2.5 py-1.5 rounded-lg border border-blue-200"
              >
                <div className="w-5 h-5 rounded-full bg-amber-400 text-gray-900 font-bold flex items-center justify-center text-[10px]">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span>{user.name.split(' ')[0]}</span>
              </button>
            ) : (
              <button
                onClick={() => onAuthOpen?.('login')}
                className="flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-lg bg-blue-900 text-white hover:bg-blue-800 transition-colors"
              >
                <UserIcon size={14} />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <>
            <div className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-xs" onClick={() => setMobileMenuOpen(false)} />
            <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-2xl z-50 max-h-[80vh] overflow-y-auto animate-fade-in">
              <div className="p-4 space-y-1">
                <div className="bg-gradient-to-r from-amber-500 to-amber-400 p-3 rounded-xl text-gray-950 font-extrabold text-center mb-3 shadow-sm">
                  <p className="text-sm tracking-wider uppercase">HEBRON ENTERPRISES</p>
                  <p className="text-[10px] font-bold text-gray-900 tracking-widest uppercase mt-0.5">Authorised Main Dealer — C.R.I. Pumps</p>
                </div>
                <div className="flex items-center justify-between pb-3 mb-2 border-b border-gray-100">
                  {user ? (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-amber-400 text-gray-900 font-bold flex items-center justify-center text-sm shadow-xs">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900 line-clamp-1">{user.name}</p>
                        <button onClick={() => { setMobileMenuOpen(false); onLogout(); }} className="text-[10px] text-red-600 font-semibold underline">
                          Log out
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={() => { setMobileMenuOpen(false); onAuthOpen('login'); }}
                      className="flex items-center gap-2 text-blue-700 font-bold text-sm bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200"
                    >
                      <UserIcon size={18} /> Login / Register
                    </button>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 flex items-center"><GlobeIcon size={16} /></span>
                    <select
                      value={language}
                      onChange={e => onLanguageChange(e.target.value)}
                      className="text-xs bg-gray-100 rounded px-2 py-1 text-gray-700 outline-none"
                    >
                      {languages.map(l => (
                        <option key={l.code} value={l.code}>{l.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 pt-2 pb-1">All Categories</p>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => { onCategorySelect(cat.id); setMobileMenuOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50 text-gray-700 text-sm text-left transition-colors"
                  >
                    <span className="text-lg">{cat.icon}</span>
                    <span className="font-medium">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </header>

      {/* AWARD PHOTO BANNER - PROMINENTLY RESTORED AT TOP ON HOME PAGE */}
      {currentPage === 'home' && <AwardBanner />}

      {/* CATEGORIES SIDEBAR DRAWER (SLIDE-OUT FROM LEFT) */}
      {categorySidebarOpen && (
        <>
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/60 z-[99] backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => {
              setCategorySidebarOpen(false);
              setSelectedDrawerCategory(null);
            }}
          />

          {/* Slide-out Sidebar Panel */}
          <aside
            className="fixed top-0 left-0 bottom-0 w-[310px] sm:w-[390px] bg-white z-[100] shadow-2xl flex flex-col overflow-hidden animate-slide-right"
            aria-label="Categories Sidebar Navigation"
          >
            {/* LEVEL 1: ALL CATEGORIES VIEW */}
            {!selectedDrawerCategory ? (
              <>
                {/* Drawer Header */}
                <div className="bg-[#0284c7] text-white p-4 sm:p-5 flex items-center justify-between shadow-md">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-lg">
                      🗂️
                    </span>
                    <div>
                      <h2 className="text-sm sm:text-base font-extrabold tracking-wide text-white uppercase">
                        Product Categories
                      </h2>
                      <p className="text-[11px] text-sky-100 font-medium">
                        C.R.I. Pumps & Engineering Solutions
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setCategorySidebarOpen(false);
                      setSelectedDrawerCategory(null);
                    }}
                    className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Close categories sidebar"
                  >
                    <CloseIcon size={20} />
                  </button>
                </div>

                {/* Quick Actions Shortcuts */}
                <div className="p-3 bg-slate-50 border-b border-gray-200 flex items-center gap-2">
                  <button
                    onClick={() => {
                      onCategorySelect('all');
                      setCategorySidebarOpen(false);
                    }}
                    className="flex-1 py-2 px-3 rounded-lg bg-white hover:bg-sky-50 text-sky-900 border border-gray-200 hover:border-sky-300 text-xs font-bold text-center transition-all shadow-2xs cursor-pointer"
                  >
                    ⚡ View All Products
                  </button>
                  <button
                    onClick={() => {
                      onCategorySelect('agri');
                      setCategorySidebarOpen(false);
                    }}
                    className="py-2 px-3 rounded-lg bg-amber-400 hover:bg-amber-500 text-gray-950 text-xs font-bold transition-all shadow-2xs cursor-pointer"
                  >
                    📜 TN Rate Contract
                  </button>
                </div>

                {/* Level 1 Category List Header */}
                <div className="p-2.5 bg-slate-100/70 border-b border-gray-200 text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center justify-between">
                  <span>Select Category to View Ranges</span>
                  <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-gray-200 text-gray-600 font-semibold">
                    {categories.length} Departments
                  </span>
                </div>

                {/* Level 1 Category List */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2.5 scrollbar-thin">
                  {categories.map(cat => {
                    const isActive = activeCategory === cat.id;
                    const count = categoryCounts[cat.id] || 0;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setSelectedDrawerCategory(cat);
                          setSubcategorySearch('');
                        }}
                        className={`w-full p-3.5 rounded-xl border text-left transition-all duration-200 flex items-center justify-between gap-3 group cursor-pointer ${
                          isActive
                            ? 'border-sky-400 bg-sky-50/70 shadow-xs'
                            : 'border-gray-200 bg-white hover:border-sky-300 hover:bg-sky-50/30 hover:shadow-xs'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span
                            className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-2xs"
                            style={{ background: cat.bgColor || '#f0f9ff' }}
                          >
                            {cat.icon}
                          </span>
                          <div className="min-w-0">
                            <p className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-sky-900 transition-colors truncate">
                              {cat.name} Pumps
                            </p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[11px] text-gray-500 font-medium">
                                {cat.subcategories.length} ranges available
                              </span>
                              {count > 0 && (
                                <>
                                  <span className="text-gray-300">•</span>
                                  <span className="text-[10px] text-sky-700 font-semibold bg-sky-100/70 px-1.5 py-0.2 rounded">
                                    {count} models
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-sky-600 shrink-0">
                          <span className="text-[11px] font-bold text-sky-700 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline">
                            Ranges
                          </span>
                          <span className="w-7 h-7 rounded-lg bg-gray-50 group-hover:bg-sky-100 text-gray-400 group-hover:text-sky-700 flex items-center justify-center transition-colors">
                            <ChevronRightIcon size={16} />
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              /* LEVEL 2: SUBCATEGORIES DRILL-DOWN VIEW */
              <>
                {/* Level 2 Navigation Header */}
                <div className="bg-[#0284c7] text-white p-3.5 sm:p-4 flex items-center justify-between shadow-md">
                  <button
                    onClick={() => {
                      setSelectedDrawerCategory(null);
                      setSubcategorySearch('');
                    }}
                    className="flex items-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-all cursor-pointer active:scale-95"
                    title="Return to all categories"
                  >
                    <ArrowLeftIcon size={16} />
                    <span>All Categories</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-sky-100">
                      Subcategories
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setCategorySidebarOpen(false);
                      setSelectedDrawerCategory(null);
                    }}
                    className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Close sidebar"
                  >
                    <CloseIcon size={18} />
                  </button>
                </div>

                {/* Selected Category Identity Banner */}
                <div className="p-3.5 sm:p-4 bg-sky-50/80 border-b border-sky-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 shadow-xs"
                      style={{ background: selectedDrawerCategory.bgColor || '#e0f2fe' }}
                    >
                      {selectedDrawerCategory.icon}
                    </span>
                    <div>
                      <h3 className="text-sm sm:text-base font-extrabold text-gray-900 leading-tight">
                        {selectedDrawerCategory.name} Pumps
                      </h3>
                      <p className="text-[11px] text-gray-500 font-medium">
                        {selectedDrawerCategory.subcategories.length} product ranges available
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onCategorySelect(selectedDrawerCategory.id, 'All');
                      setCategorySidebarOpen(false);
                      setSelectedDrawerCategory(null);
                    }}
                    className="text-[11px] font-bold text-sky-700 hover:text-sky-900 bg-white hover:bg-sky-100 border border-sky-200 px-2.5 py-1.5 rounded-lg transition-all shadow-2xs whitespace-nowrap cursor-pointer"
                  >
                    View All →
                  </button>
                </div>

                {/* Search / Filter Subcategories (helpful for categories with many ranges like Agri) */}
                {selectedDrawerCategory.subcategories.length > 6 && (
                  <div className="p-2.5 bg-slate-50 border-b border-gray-200">
                    <div className="relative">
                      <input
                        type="text"
                        value={subcategorySearch}
                        onChange={e => setSubcategorySearch(e.target.value)}
                        placeholder={`Search ${selectedDrawerCategory.name} ranges...`}
                        className="w-full pl-8 pr-7 py-1.5 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-sky-500 text-gray-900"
                      />
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                        🔍
                      </span>
                      {subcategorySearch && (
                        <button
                          onClick={() => setSubcategorySearch('')}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs cursor-pointer"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Subcategories List: Clicking navigates to products of that subcategory */}
                <div className="flex-1 overflow-y-auto p-3 space-y-1.5 scrollbar-thin">
                  {/* Option to view all models of this category */}
                  <button
                    onClick={() => {
                      onCategorySelect(selectedDrawerCategory.id, 'All');
                      setCategorySidebarOpen(false);
                      setSelectedDrawerCategory(null);
                    }}
                    className="w-full p-2.5 rounded-xl border border-sky-200 bg-sky-50/70 hover:bg-sky-100 text-sky-950 font-bold text-xs flex items-center justify-between transition-all cursor-pointer group shadow-2xs mb-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">⚡</span>
                      <span>All {selectedDrawerCategory.name} Models</span>
                    </div>
                    <span className="text-sky-700 font-extrabold group-hover:translate-x-0.5 transition-transform">
                      →
                    </span>
                  </button>

                  {selectedDrawerCategory.subcategories
                    .filter(sub =>
                      !subcategorySearch.trim() ||
                      sub.toLowerCase().includes(subcategorySearch.toLowerCase().trim())
                    )
                    .map((sub, idx) => {
                      const count = subcategoryCounts[sub] || 0;
                      return (
                        <button
                          key={sub}
                          type="button"
                          onClick={() => {
                            onCategorySelect(selectedDrawerCategory.id, sub);
                            setCategorySidebarOpen(false);
                            setSelectedDrawerCategory(null);
                          }}
                          className="w-full p-2.5 sm:p-3 rounded-xl border border-gray-200 bg-white hover:border-sky-400 hover:bg-sky-50/50 transition-all flex items-center justify-between text-left group shadow-2xs hover:shadow-xs cursor-pointer"
                          style={{ animationDelay: `${idx * 25}ms` }}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="w-2 h-2 rounded-full bg-sky-500 group-hover:scale-125 transition-transform shrink-0" />
                            <span className="text-xs sm:text-sm font-semibold text-gray-800 group-hover:text-sky-950 transition-colors line-clamp-1">
                              {sub}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 ml-2">
                            {count > 0 && (
                              <span className="text-[10px] font-bold text-gray-600 bg-gray-100 group-hover:bg-sky-100 group-hover:text-sky-800 px-2 py-0.5 rounded-full transition-colors">
                                {count} {count === 1 ? 'model' : 'models'}
                              </span>
                            )}
                            <span className="text-gray-400 group-hover:text-sky-600 group-hover:translate-x-0.5 transition-all text-xs">
                              →
                            </span>
                          </div>
                        </button>
                      );
                    })}

                  {selectedDrawerCategory.subcategories.filter(sub =>
                    !subcategorySearch.trim() ||
                    sub.toLowerCase().includes(subcategorySearch.toLowerCase().trim())
                  ).length === 0 && (
                    <div className="text-center py-10 bg-slate-50 rounded-xl border border-gray-200 mt-2">
                      <p className="text-xs text-gray-500">No ranges matching "{subcategorySearch}"</p>
                      <button
                        onClick={() => setSubcategorySearch('')}
                        className="text-xs text-sky-600 font-bold underline mt-1 cursor-pointer"
                      >
                        Clear search
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Drawer Footer */}
            <div className="p-3.5 bg-slate-100 border-t border-gray-200 text-center text-xs text-gray-600">
              <p className="font-bold text-gray-900">Hebron Enterprises</p>
              <p className="text-[11px] text-gray-500 mt-0.5">Authorised Main Dealer • 100% Factory Warranty</p>
            </div>
          </aside>
        </>
      )}
    </>
  );
}
