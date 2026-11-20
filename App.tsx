import React, { useState } from 'react';
import { 
  Bike, Car, Utensils, Package, Wallet, ShoppingBag, 
  Moon, Sun, Globe, Search, MapPin, ArrowRight, ShieldCheck, 
  Clock, Star, Phone, Mail, Menu, X, CheckCircle, ChevronRight 
} from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<'bn' | 'en'>('bn');
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState<'home' | 'ride' | 'food' | 'parcel' | 'pay'>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [vehicleType, setVehicleType] = useState<'bike' | 'car' | 'intercity'>('bike');
  const [fareCalculated, setFareCalculated] = useState(false);

  const t = {
    bn: {
      brand: 'গুরুগাড়ি',
      tagline: 'আপনার প্রতিদিনের গতি, আপনার ভরসা',
      ride: 'রাইড',
      food: 'ফুড',
      parcel: 'কুরিয়ার',
      pay: 'ওয়ালেট & পে',
      shop: 'মার্ট',
      home: 'হোম',
      about: 'আমাদের সম্পর্কে',
      contact: 'যোগাযোগ',
      bookRide: 'রাইড বুক করুন',
      orderFood: 'খাবার অর্ডার করুন',
      sendParcel: 'পার্সেল পাঠান',
      exploreServices: 'সকল সার্ভিস দেখুন',
      heroTitle: 'আপনার দৈনন্দিন জীবনের সব প্রয়োজন এক অ্যাপে',
      heroSubtitle: 'রাইড, ফুড ডেলিভারি, পার্সেল এবং ডিজিটাল পেমেন্ট - মুহূর্তেই আপনার দোরগোড়ায়।',
      searchPlaceholder: 'কোথায় যেতে চান?',
      findRide: 'রাইড খুঁজুন',
      estimatedFare: 'আনুমানিক ভাড়া:',
      taka: 'টাকা',
      confirmBooking: 'বুকিং কনফার্ম করুন',
      bookingSuccess: 'আপনার রাইড রিকোয়েস্ট সফল হয়েছে! চালক আপনার সাথে যোগাযোগ করছেন।',
      whyGurGari: 'কেন গুরুগাড়ি বেছে নেবেন?',
      safetyFirst: 'সর্বোচ্চ নিরাপত্তা',
      safetyDesc: 'ভেরিফাইড চালক এবং লাইভ ট্র্যাকিং সুবিধা।',
      fastDelivery: 'দ্রুততম ডেলিভারি',
      fastDesc: 'শহরের মধ্যে যেকোনো প্রান্তে দ্রুততম সময়ে পৌঁছে যান।',
      securePay: 'নিরাপদ লেনদেন',
      secureDesc: 'ক্যাশলেস পেমেন্ট এবং সহজ ওয়ালেট ট্রান্সফার।',
      popularRestaurants: 'জনপ্রিয় রেস্তোরাঁ ও খাবার',
      allRights: 'সর্বস্বত্ব সংরক্ষিত © ২০২৬ GurGari.com',
      callUs: 'কল করুন: +৮৮০ ৯৬১২-১২৩৪৫৬'
    },
    en: {
      brand: 'GurGari',
      tagline: 'Your Everyday Motion, Your Trust',
      ride: 'Ride',
      food: 'Food',
      parcel: 'Courier',
      pay: 'Pay & Wallet',
      shop: 'Shop',
      home: 'Home',
      about: 'About Us',
      contact: 'Contact',
      bookRide: 'Book a Ride',
      orderFood: 'Order Food',
      sendParcel: 'Send Parcel',
      exploreServices: 'Explore Services',
      heroTitle: 'Everything You Need, All in One App',
      heroSubtitle: 'Rides, food delivery, parcel courier, and digital payments right at your doorstep.',
      searchPlaceholder: 'Where do you want to go?',
      findRide: 'Find Ride',
      estimatedFare: 'Estimated Fare:',
      taka: 'BDT',
      confirmBooking: 'Confirm Booking',
      bookingSuccess: 'Your ride request is successful! Driver is connecting with you.',
      whyGurGari: 'Why Choose GurGari?',
      safetyFirst: 'Maximum Safety',
      safetyDesc: 'Verified riders and real-time live tracking.',
      fastDelivery: 'Fastest Delivery',
      fastDesc: 'Reach any corner of the city in the shortest time.',
      securePay: 'Secure Transactions',
      secureDesc: 'Cashless payments and easy wallet transfers.',
      popularRestaurants: 'Popular Restaurants & Food',
      allRights: 'All rights reserved © 2026 GurGari.com',
      callUs: 'Call us: +880 9612-123456'
    }
  };

  const currentT = t[lang];

  return (
    <div className={'min-h-screen transition-colors duration-300 ' + (darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900')}>
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white text-xs md:text-sm py-2 px-4 text-center font-medium flex items-center justify-center gap-4">
        <span>🚀 গ্রুরগাড়ি (GurGari.com) - Pathao Style Next-Gen Super App</span>
      </div>

      <header className={'sticky top-0 z-50 backdrop-blur-md border-b transition-colors ' + (darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200')}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-red-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-orange-500/30">
              GG
            </div>
            <div>
              <span className="text-2xl font-black bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                {currentT.brand}
              </span>
              <span className="block text-[10px] text-orange-500 font-semibold tracking-wider">grurgari.com</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 font-medium text-sm">
            <button onClick={() => setActiveTab('home')} className={'hover:text-orange-500 transition ' + (activeTab === 'home' ? 'text-orange-500 font-bold' : '')}>{currentT.home}</button>
            <button onClick={() => setActiveTab('ride')} className={'hover:text-orange-500 transition ' + (activeTab === 'ride' ? 'text-orange-500 font-bold' : '')}>{currentT.ride}</button>
            <button onClick={() => setActiveTab('food')} className={'hover:text-orange-500 transition ' + (activeTab === 'food' ? 'text-orange-500 font-bold' : '')}>{currentT.food}</button>
            <button onClick={() => setActiveTab('parcel')} className={'hover:text-orange-500 transition ' + (activeTab === 'parcel' ? 'text-orange-500 font-bold' : '')}>{currentT.parcel}</button>
            <button onClick={() => setActiveTab('pay')} className={'hover:text-orange-500 transition ' + (activeTab === 'pay' ? 'text-orange-500 font-bold' : '')}>{currentT.pay}</button>
          </nav>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
              className={'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition ' + (darkMode ? 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200' : 'border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-800')}
            >
              <Globe className="w-3.5 h-3.5 text-orange-500" />
              {lang === 'bn' ? 'English' : 'বাংলা'}
            </button>

            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={'p-2 rounded-full border transition ' + (darkMode ? 'border-slate-700 bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200')}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'home' && (
          <div className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-10">
              <div className="space-y-6">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-orange-500/10 text-orange-500 border border-orange-500/20">
                  🔥 grurgari.com — Powered for Bangladesh
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                  {currentT.heroTitle}
                </h1>
                <p className={'text-lg ' + (darkMode ? 'text-slate-400' : 'text-slate-600')}>
                  {currentT.heroSubtitle}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                  <div onClick={() => setActiveTab('ride')} className={'p-4 rounded-2xl border cursor-pointer transition transform hover:-translate-y-1 text-center ' + (darkMode ? 'bg-slate-900 border-slate-800 hover:border-orange-500' : 'bg-white border-slate-200 hover:border-orange-500 shadow-sm')}>
                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                      <Bike className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-sm">{currentT.ride}</h3>
                  </div>

                  <div onClick={() => setActiveTab('food')} className={'p-4 rounded-2xl border cursor-pointer transition transform hover:-translate-y-1 text-center ' + (darkMode ? 'bg-slate-900 border-slate-800 hover:border-orange-500' : 'bg-white border-slate-200 hover:border-orange-500 shadow-sm')}>
                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                      <Utensils className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-sm">{currentT.food}</h3>
                  </div>

                  <div onClick={() => setActiveTab('parcel')} className={'p-4 rounded-2xl border cursor-pointer transition transform hover:-translate-y-1 text-center ' + (darkMode ? 'bg-slate-900 border-slate-800 hover:border-orange-500' : 'bg-white border-slate-200 hover:border-orange-500 shadow-sm')}>
                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                      <Package className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-sm">{currentT.parcel}</h3>
                  </div>

                  <div onClick={() => setActiveTab('pay')} className={'p-4 rounded-2xl border cursor-pointer transition transform hover:-translate-y-1 text-center ' + (darkMode ? 'bg-slate-900 border-slate-800 hover:border-orange-500' : 'bg-white border-slate-200 hover:border-orange-500 shadow-sm')}>
                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                      <Wallet className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-sm">{currentT.pay}</h3>
                  </div>
                </div>
              </div>

              <div className={'p-6 sm:p-8 rounded-3xl border shadow-2xl relative overflow-hidden ' + (darkMode ? 'bg-slate-900 border-slate-800 shadow-orange-500/5' : 'bg-white border-slate-200 shadow-xl')}>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Bike className="text-orange-500" /> {currentT.bookRide}
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">PICKUP LOCATION</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-orange-500" />
                      <input 
                        type="text" 
                        value={pickup}
                        onChange={e => setPickup(e.target.value)}
                        placeholder="e.g. Dhanmondi 27, Dhaka" 
                        className={'w-full pl-10 pr-4 py-3 rounded-xl text-sm border focus:outline-none focus:border-orange-500 transition ' + (darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900')}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">DROP-OFF LOCATION</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-red-500" />
                      <input 
                        type="text" 
                        value={dropoff}
                        onChange={e => setDropoff(e.target.value)}
                        placeholder="e.g. Gulshan 1, Dhaka" 
                        className={'w-full pl-10 pr-4 py-3 rounded-xl text-sm border focus:outline-none focus:border-orange-500 transition ' + (darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900')}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2">
                    <button 
                      onClick={() => setVehicleType('bike')}
                      className={'py-2 px-3 rounded-xl text-xs font-bold border transition ' + (vehicleType === 'bike' ? 'bg-orange-500 text-white border-orange-500' : darkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-300 text-slate-700')}
                    >
                      🏍️ Bike
                    </button>
                    <button 
                      onClick={() => setVehicleType('car')}
                      className={'py-2 px-3 rounded-xl text-xs font-bold border transition ' + (vehicleType === 'car' ? 'bg-orange-500 text-white border-orange-500' : darkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-300 text-slate-700')}
                    >
                      🚗 Car
                    </button>
                    <button 
                      onClick={() => setVehicleType('intercity')}
                      className={'py-2 px-3 rounded-xl text-xs font-bold border transition ' + (vehicleType === 'intercity' ? 'bg-orange-500 text-white border-orange-500' : darkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-300 text-slate-700')}
                    >
                      🚐 Intercity
                    </button>
                  </div>

                  <button 
                    onClick={() => setFareCalculated(true)}
                    className="w-full mt-4 py-3.5 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 hover:opacity-95 transition"
                  >
                    {currentT.findRide}
                  </button>

                  {fareCalculated && (
                    <div className={'mt-4 p-4 rounded-2xl border ' + (darkMode ? 'bg-slate-800 border-orange-500/30' : 'bg-orange-50 border-orange-200')}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-semibold text-orange-500">{currentT.estimatedFare}</span>
                        <span className="text-xl font-black text-orange-500">৳ {vehicleType === 'bike' ? '145' : vehicleType === 'car' ? '380' : '1,250'}</span>
                      </div>
                      <button 
                        onClick={() => alert(currentT.bookingSuccess)}
                        className="w-full mt-2 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-500 transition"
                      >
                        {currentT.confirmBooking}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'food' && (
          <div className="space-y-8 py-6">
            <h2 className="text-3xl font-black">{currentT.food} — GurGari Food</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {['Kacchi Bhai', "Sultan's Dine", 'Pizza Burg'].map((res, i) => (
                <div key={i} className={'p-5 rounded-3xl border ' + (darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200')}>
                  <h3 className="font-bold text-lg mb-2">{res}</h3>
                  <p className="text-xs text-orange-500 font-semibold">⚡ 25-30 min delivery</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className={'border-t mt-20 py-8 text-center text-xs ' + (darkMode ? 'bg-slate-900 border-slate-800 text-slate-500' : 'bg-white border-slate-200 text-slate-500')}>
        <p>{currentT.allRights}</p>
      </footer>
    </div>
  );
}
