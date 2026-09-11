import React, { useState } from 'react';
import {
  Sliders,
  Check,
  Plus,
  Bell,
  Share2,
  RefreshCw,
  Sparkles,
  MapPin,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { TasteProfile } from '../../types';

interface TasteScreenProps {
  profile: TasteProfile;
  onUpdateProfile: (updated: TasteProfile) => void;
  onConnectBoutique: () => void;
  onExportFeed: () => void;
}

export const TasteScreen: React.FC<TasteScreenProps> = ({
  profile,
  onUpdateProfile,
  onConnectBoutique,
  onExportFeed,
}) => {
  const [indoWestern, setIndoWestern] = useState(profile.aesthetics.indoWestern);
  const [western, setWestern] = useState(profile.aesthetics.western);
  const [traditional, setTraditional] = useState(profile.aesthetics.traditional);

  const [priceTiers, setPriceTiers] = useState(profile.priceTiers);
  const [tags, setTags] = useState<string[]>(profile.prioritizedTags);
  const [alerts, setAlerts] = useState({
    dropAlerts: profile.dropAlerts,
    restockPing: profile.restockPing,
    weeklyDigest: profile.weeklyDigest,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const availableTags = [
    'College Fits',
    'Workwear / Office Kurti',
    'Wedding Guest',
    'Party & Weekend',
    'Jewellery & Jhumkas',
    'Bags & Footwear',
    'Chikankari Handloom',
    'Indo-Western Co-ords',
    'Modern Saree Drapes',
  ];

  const handleTagToggle = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter((t) => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  const handleSavePreferences = () => {
    onUpdateProfile({
      ...profile,
      aesthetics: {
        indoWestern,
        western,
        traditional,
      },
      priceTiers,
      prioritizedTags: tags,
      dropAlerts: alerts.dropAlerts,
      restockPing: alerts.restockPing,
      weeklyDigest: alerts.weeklyDigest,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="pb-28 pt-2 max-w-md mx-auto px-4 space-y-6">
      {/* Top Archival Ledger Header */}
      <div className="flex items-center justify-between border-b border-[#EAE5DE] pb-2">
        <div className="flex items-center space-x-1.5 text-[10px] font-semibold tracking-[0.14em] uppercase text-[#161616]">
          <span className="w-2 h-2 rounded-full bg-[#C83818]" />
          <span>ARCHIVAL LEDGER #049</span>
        </div>
        <div className="flex items-center space-x-1 text-[10px] tracking-wider text-[#8E8A85]">
          <MapPin className="w-3 h-3 text-[#C83818]" />
          <span>INR (₹) • INDIA DELIVERY</span>
        </div>
      </div>

      {/* CURATOR PROFILE CARD */}
      <div className="bg-[#F5F1EB] border border-[#EAE5DE] p-4 space-y-4">
        <div className="flex items-start space-x-3.5">
          {/* Avatar with Verified Status */}
          <div className="relative shrink-0">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-16 h-16 rounded-full object-cover border border-[#EAE5DE]"
              referrerPolicy="no-referrer"
            />
            <span className="absolute bottom-0 right-0 w-4 h-4 bg-[#161616] text-[#FAF8F5] rounded-full flex items-center justify-center text-[10px]">
              ✓
            </span>
          </div>

          <div className="space-y-1 flex-1">
            <div className="flex items-center justify-between">
              <h2 className="font-editorial text-lg font-bold text-[#161616] leading-tight">
                {profile.name}
              </h2>
              <span className="text-[9px] font-bold text-[#C83818] tracking-widest uppercase bg-[#FAF8F5] px-2 py-0.5 border border-[#C83818]/30">
                VERIFIED SCOUT
              </span>
            </div>

            <p className="text-xs text-[#8E8A85]">
              {profile.handle} • {profile.location}
            </p>

            <div className="text-[11px] font-medium text-[#8A6D3B] flex items-center space-x-1">
              <span>✦</span>
              <span>Curator Tier: {profile.tier}</span>
            </div>
          </div>
        </div>

        {/* Bio Quote */}
        <div className="bg-[#FAF8F5] p-3 border border-[#EAE5DE] text-xs text-[#3A3836] italic leading-relaxed">
          <span className="text-[#C83818] font-bold not-italic mr-1">99</span>
          {profile.bio}
        </div>

        {/* 3 Metrics Row */}
        <div className="grid grid-cols-3 divide-x divide-[#EAE5DE] border-t border-[#EAE5DE] pt-3 text-center">
          <div>
            <div className="font-editorial text-lg font-bold text-[#161616]">
              {profile.savedFitsCount}
            </div>
            <div className="text-[9px] font-semibold tracking-wider text-[#8E8A85] uppercase mt-0.5">
              SAVED FITS
            </div>
          </div>

          <div>
            <div className="font-editorial text-lg font-bold text-[#161616]">
              {profile.boardsCount}
            </div>
            <div className="text-[9px] font-semibold tracking-wider text-[#8E8A85] uppercase mt-0.5">
              BOARDS
            </div>
          </div>

          <div>
            <div className="font-editorial text-lg font-bold text-[#161616] flex items-center justify-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C83818]" />
              <span>{profile.dropRadarsCount}</span>
            </div>
            <div className="text-[9px] font-semibold tracking-wider text-[#8E8A85] uppercase mt-0.5">
              DROP RADARS
            </div>
          </div>
        </div>
      </div>

      {/* SECTION: AESTHETICS WEIGHTING */}
      <section className="space-y-3 pt-1">
        <div className="flex items-start space-x-2">
          <span className="w-2.5 h-2.5 bg-[#161616] mt-1 shrink-0" />
          <div className="flex-1">
            <p className="text-xs text-[#3A3836]">
              Select aesthetics powering your daily discover matrix.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="w-2 h-2 bg-[#C83818]" />
          <span className="text-xs font-bold text-[#C83818] tracking-wider uppercase">
            Balanced Equilibrium
          </span>
        </div>

        <p className="text-xs text-[#8E8A85]">
          Calibrate editorial weighting for recommendation frequency.
        </p>

        {/* Visual Multi-Segment Bar */}
        <div className="w-full h-3 bg-[#EAE5DE] flex overflow-hidden">
          <div
            className="bg-[#161616] transition-all duration-300"
            style={{ width: `${indoWestern}%` }}
          />
          <div
            className="bg-[#C83818] transition-all duration-300"
            style={{ width: `${western}%` }}
          />
          <div
            className="bg-[#8E8A85] transition-all duration-300"
            style={{ width: `${traditional}%` }}
          />
        </div>

        {/* 3 Aesthetic Sliders / Toggles */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          {/* Indo-Western */}
          <div className="bg-[#F5F1EB] p-2.5 border border-[#EAE5DE] space-y-1">
            <div className="flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#161616]" />
              <span className="text-[9px] font-bold text-[#161616] uppercase truncate">
                INDO-WESTERN
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-editorial text-lg font-bold text-[#161616]">
                {indoWestern}%
              </span>
              <button
                onClick={() => {
                  const next = indoWestern >= 70 ? 30 : indoWestern + 10;
                  setIndoWestern(next);
                  setWestern(Math.max(10, 100 - next - traditional));
                }}
                className="p-1 hover:text-[#C83818]"
                title="Adjust weight"
              >
                <Sliders className="w-3 h-3 text-[#8E8A85]" />
              </button>
            </div>
          </div>

          {/* Western */}
          <div className="bg-[#F5F1EB] p-2.5 border border-[#EAE5DE] space-y-1">
            <div className="flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C83818]" />
              <span className="text-[9px] font-bold text-[#C83818] uppercase truncate">
                WESTERN
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-editorial text-lg font-bold text-[#161616]">
                {western}%
              </span>
              <button
                onClick={() => {
                  const next = western >= 60 ? 20 : western + 10;
                  setWestern(next);
                  setIndoWestern(Math.max(20, 100 - next - traditional));
                }}
                className="p-1 hover:text-[#C83818]"
                title="Adjust weight"
              >
                <Sliders className="w-3 h-3 text-[#8E8A85]" />
              </button>
            </div>
          </div>

          {/* Traditional */}
          <div className="bg-[#F5F1EB] p-2.5 border border-[#EAE5DE] space-y-1">
            <div className="flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8E8A85]" />
              <span className="text-[9px] font-bold text-[#3A3836] uppercase truncate">
                TRADITIONAL
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-editorial text-lg font-bold text-[#161616]">
                {traditional}%
              </span>
              <button
                onClick={() => {
                  const next = traditional >= 50 ? 10 : traditional + 10;
                  setTraditional(next);
                  setIndoWestern(Math.max(30, 100 - next - western));
                }}
                className="p-1 hover:text-[#C83818]"
                title="Adjust weight"
              >
                <Sliders className="w-3 h-3 text-[#8E8A85]" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: ACTIVE PRICE RADARS */}
      <section className="space-y-3 pt-2">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-2">
            <span className="w-2.5 h-2.5 bg-[#161616] mt-1 shrink-0" />
            <p className="text-xs text-[#3A3836]">
              Active price radars scan drops strictly within configured price bands.
            </p>
          </div>
          <span className="text-[10px] font-bold text-[#8A6D3B] uppercase tracking-wider">
            INR (₹)
          </span>
        </div>

        <div className="space-y-2 pt-1">
          {/* Tier 1 */}
          <div
            onClick={() =>
              setPriceTiers({ ...priceTiers, budget: !priceTiers.budget })
            }
            className="p-3.5 bg-[#F5F1EB] border border-[#EAE5DE] flex items-center justify-between cursor-pointer hover:border-[#161616] transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-4 h-4 border border-[#161616] flex items-center justify-center ${
                  priceTiers.budget ? 'bg-[#161616]' : 'bg-transparent'
                }`}
              >
                {priceTiers.budget && <Check className="w-3 h-3 text-white" />}
              </div>
              <div>
                <h4 className="font-editorial text-sm font-semibold text-[#161616]">
                  Tier 1: Budget Finds
                </h4>
                <p className="text-[11px] text-[#8E8A85]">
                  Under ₹999 &amp; Under ₹1,999
                </p>
              </div>
            </div>
            <span className="text-[9px] font-bold tracking-wider text-[#161616] bg-[#FAF8F5] px-2 py-0.5 border border-[#EAE5DE] uppercase">
              HIGH VOLUME
            </span>
          </div>

          {/* Tier 2 */}
          <div
            onClick={() =>
              setPriceTiers({ ...priceTiers, contemporary: !priceTiers.contemporary })
            }
            className="p-3.5 bg-[#F5F1EB] border border-[#EAE5DE] flex items-center justify-between cursor-pointer hover:border-[#161616] transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-4 h-4 border border-[#161616] flex items-center justify-center ${
                  priceTiers.contemporary ? 'bg-[#161616]' : 'bg-transparent'
                }`}
              >
                {priceTiers.contemporary && <Check className="w-3 h-3 text-white" />}
              </div>
              <div>
                <h4 className="font-editorial text-sm font-semibold text-[#161616]">
                  Tier 2: Contemporary D2C &amp; Premium
                </h4>
                <p className="text-[11px] text-[#8E8A85]">
                  ₹2,000 – ₹7,000
                </p>
              </div>
            </div>
            <span className="text-[9px] font-bold tracking-wider text-[#C83818] bg-[#FAF8F5] px-2 py-0.5 border border-[#C83818]/30 uppercase">
              SWEETSPOT
            </span>
          </div>

          {/* Tier 3 */}
          <div
            onClick={() =>
              setPriceTiers({ ...priceTiers, luxury: !priceTiers.luxury })
            }
            className="p-3.5 bg-[#F5F1EB] border border-[#EAE5DE] flex items-center justify-between cursor-pointer hover:border-[#161616] transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-4 h-4 border border-[#161616] flex items-center justify-center ${
                  priceTiers.luxury ? 'bg-[#161616]' : 'bg-transparent'
                }`}
              >
                {priceTiers.luxury && <Check className="w-3 h-3 text-white" />}
              </div>
              <div>
                <h4 className="font-editorial text-sm font-semibold text-[#161616]">
                  Tier 3: Luxury &amp; Designer Indian
                </h4>
                <p className="text-[11px] text-[#8E8A85]">
                  ₹10,000+ (Archival &amp; Bridal)
                </p>
              </div>
            </div>
            <span className="text-[9px] font-bold tracking-wider text-[#8E8A85] bg-[#FAF8F5] px-2 py-0.5 border border-[#EAE5DE] uppercase">
              OPTIONAL
            </span>
          </div>
        </div>
      </section>

      {/* SECTION: BOUTIQUE SCRAPERS */}
      <section className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <span className="w-2 h-2 bg-[#C83818]" />
          <span className="text-[10px] font-bold text-[#C83818] tracking-widest uppercase">
            SCANNING 12+ STORES
          </span>
        </div>

        <p className="text-xs text-[#8E8A85]">
          Real-time web scrapers polling size availability and cart coupons.
        </p>

        <button
          id="connect-custom-boutique-btn"
          onClick={onConnectBoutique}
          className="w-full bg-[#F5F1EB] hover:bg-[#FAF8F5] text-[#161616] border border-[#EAE5DE] hover:border-[#161616] text-xs font-semibold tracking-wider uppercase py-3.5 flex items-center justify-center space-x-2 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ CONNECT CUSTOM BOUTIQUE / D2C URL</span>
        </button>
      </section>

      {/* SECTION: CONNECTED RETAILERS & PRIORITIZED TAGS */}
      <section className="space-y-3 pt-2">
        <div className="flex items-center justify-between border-b border-[#EAE5DE] pb-1.5">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-[#161616]" />
            <h3 className="font-editorial text-sm font-semibold text-[#161616]">
              Connected Retailers &amp; Deal Scrapers
            </h3>
          </div>
          <span className="text-[9px] font-bold text-[#8E8A85] uppercase">
            {tags.length} PRIORITIZED
          </span>
        </div>

        <p className="text-xs text-[#8E8A85]">
          Prioritize what appears on your primary curatorial feed.
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          {availableTags.map((tag) => {
            const isSelected = tags.includes(tag);
            return (
              <button
                key={tag}
                id={`pref-tag-${tag.replace(/\s+/g, '-')}`}
                onClick={() => handleTagToggle(tag)}
                className={`text-xs px-3 py-1.5 border transition-colors cursor-pointer flex items-center space-x-1.5 ${
                  isSelected
                    ? 'bg-[#C83818] text-white border-[#C83818]'
                    : 'bg-[#F5F1EB] text-[#3A3836] border-[#EAE5DE] hover:border-[#161616]'
                }`}
              >
                <span>{tag}</span>
                {isSelected && <Check className="w-3 h-3" />}
              </button>
            );
          })}
        </div>
      </section>

      {/* SECTION: AUTOMATED TRIGGERS */}
      <section className="space-y-3 pt-2">
        <div className="flex items-center space-x-2 border-b border-[#EAE5DE] pb-1.5">
          <span className="w-2 h-2 bg-[#C83818]" />
          <h3 className="font-editorial text-sm font-semibold text-[#161616]">
            Connected Retailers &amp; Deal Scrapers
          </h3>
        </div>

        <p className="text-xs text-[#8E8A85]">
          Automated triggers sent before sizes run out of stock.
        </p>

        <div className="bg-[#F5F1EB] border border-[#EAE5DE] divide-y divide-[#EAE5DE]">
          {/* Toggle 1 */}
          <div className="p-3.5 flex items-center justify-between">
            <div className="space-y-0.5 pr-3">
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-[#161616]">
                <Bell className="w-3.5 h-3.5 text-[#C83818]" />
                <span>Drop Alerts</span>
              </div>
              <p className="text-[11px] text-[#3A3836]">
                Instant In-App &amp; Push alert when any saved item drops &gt;15%.
              </p>
            </div>
            <button
              onClick={() =>
                setAlerts({ ...alerts, dropAlerts: !alerts.dropAlerts })
              }
              className={`w-11 h-6 transition-colors relative cursor-pointer ${
                alerts.dropAlerts ? 'bg-[#C83818]' : 'bg-[#ECE6DC]'
              }`}
            >
              <span
                className={`block w-4 h-4 bg-white transition-transform ${
                  alerts.dropAlerts ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Toggle 2 */}
          <div className="p-3.5 flex items-center justify-between">
            <div className="space-y-0.5 pr-3">
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-[#161616]">
                <RefreshCw className="w-3.5 h-3.5 text-[#C83818]" />
                <span>Designer Restock Ping</span>
              </div>
              <p className="text-[11px] text-[#3A3836]">
                Restock alert on sold-out indie designer &amp; handloom drops.
              </p>
            </div>
            <button
              onClick={() =>
                setAlerts({ ...alerts, restockPing: !alerts.restockPing })
              }
              className={`w-11 h-6 transition-colors relative cursor-pointer ${
                alerts.restockPing ? 'bg-[#C83818]' : 'bg-[#ECE6DC]'
              }`}
            >
              <span
                className={`block w-4 h-4 bg-white transition-transform ${
                  alerts.restockPing ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Toggle 3 */}
          <div className="p-3.5 flex items-center justify-between">
            <div className="space-y-0.5 pr-3">
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-[#161616]">
                <Sparkles className="w-3.5 h-3.5 text-[#C83818]" />
                <span>Weekly Indian Trend Digest</span>
              </div>
              <p className="text-[11px] text-[#3A3836]">
                Curated broadsheet breakdown of viral street motifs &amp; textile shifts.
              </p>
            </div>
            <button
              onClick={() =>
                setAlerts({ ...alerts, weeklyDigest: !alerts.weeklyDigest })
              }
              className={`w-11 h-6 transition-colors relative cursor-pointer ${
                alerts.weeklyDigest ? 'bg-[#C83818]' : 'bg-[#ECE6DC]'
              }`}
            >
              <span
                className={`block w-4 h-4 bg-white transition-transform ${
                  alerts.weeklyDigest ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* PRIMARY ACTION BUTTONS */}
      <div className="space-y-2.5 pt-2">
        <button
          id="save-taste-profile-btn"
          onClick={handleSavePreferences}
          className="w-full bg-[#161616] hover:bg-[#3A3836] text-[#FAF8F5] text-xs font-semibold tracking-[0.14em] uppercase py-4 flex items-center justify-center space-x-2 transition-colors cursor-pointer"
        >
          {savedSuccess ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>PREFERENCES SAVED SUCCESSFULLY</span>
            </>
          ) : (
            <>
              <span>SAVE TASTE PROFILE &amp; PREFERENCES</span>
            </>
          )}
        </button>

        <button
          id="export-moodboard-feed-btn"
          onClick={onExportFeed}
          className="w-full bg-[#F5F1EB] hover:bg-[#FAF8F5] text-[#161616] border border-[#EAE5DE] hover:border-[#161616] text-xs font-semibold tracking-[0.14em] uppercase py-3.5 flex items-center justify-center space-x-2 transition-colors cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>EXPORT MOODBOARD FEED</span>
        </button>
      </div>

      {/* Footer */}
      <div className="text-center pt-3 pb-6">
        <p className="text-[9px] font-semibold tracking-[0.16em] uppercase text-[#8E8A85]">
          TRENDSTITCH ENGINE • HANDCRAFTED IN INDIA • V2.4.9
        </p>
      </div>
    </div>
  );
};
