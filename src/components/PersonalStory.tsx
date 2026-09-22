import React, { useState } from 'react';
import { UserProfile, ProfilePhoto } from '../types';
import { 
  Mail, 
  Github, 
  Linkedin, 
  Edit3, 
  Check, 
  Plus, 
  Trash2, 
  BookOpen, 
  Image as ImageIcon, 
  ArrowRight, 
  X, 
  Compass, 
  FileCheck2, 
  Upload, 
  Loader2, 
  AlertCircle,
  Terminal,
  Sparkles,
  Target
} from 'lucide-react';
import { compressImage } from '../lib/imageUtils';

interface PersonalStoryProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => Promise<void> | void;
  onNavigateToSprints?: () => void;
  isOwner?: boolean;
}

export const PersonalStory: React.FC<PersonalStoryProps> = ({
  profile,
  onUpdateProfile,
  onNavigateToSprints,
  isOwner = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>(() => ({
    ...profile,
    avatarUrl: profile.avatarUrl || '',
    socials: {
      github: profile.socials?.github ?? '',
      linkedin: profile.socials?.linkedin ?? '',
      email: profile.socials?.email ?? '',
    },
    photos: profile.photos || [],
  }));

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  // Only synchronize external profile updates when NOT actively editing
  React.useEffect(() => {
    if (!isEditing) {
      setFormData({
        ...profile,
        avatarUrl: profile.avatarUrl || '',
        socials: {
          github: profile.socials?.github ?? '',
          linkedin: profile.socials?.linkedin ?? '',
          email: profile.socials?.email ?? '',
        },
        photos: profile.photos || [],
      });
    }
  }, [profile, isEditing]);

  // New photo inputs
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoTitle, setNewPhotoTitle] = useState('');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');
  const [lightboxPhoto, setLightboxPhoto] = useState<ProfilePhoto | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    try {
      await onUpdateProfile(formData);
      setIsEditing(false);
    } catch (err: any) {
      console.error('Save profile failed:', err);
      setSaveError('Het opslaan is mislukt. Controleer je verbinding of probeer een kleinere afbeelding.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      ...profile,
      avatarUrl: profile.avatarUrl || '',
      socials: {
        github: profile.socials?.github ?? '',
        linkedin: profile.socials?.linkedin ?? '',
        email: profile.socials?.email ?? '',
      },
      photos: profile.photos || [],
    });
    setSaveError(null);
    setIsEditing(false);
  };

  const addPhoto = () => {
    if (newPhotoUrl.trim() && newPhotoTitle.trim()) {
      const newP: ProfilePhoto = {
        id: `photo-${Date.now()}`,
        url: newPhotoUrl.trim(),
        title: newPhotoTitle.trim(),
        caption: newPhotoCaption.trim(),
      };
      setFormData(prev => ({
        ...prev,
        photos: [...(prev.photos || []), newP],
      }));
      setNewPhotoUrl('');
      setNewPhotoTitle('');
      setNewPhotoCaption('');
    }
  };

  const removePhoto = (photoId: string) => {
    setFormData(prev => ({
      ...prev,
      photos: (prev.photos || []).filter((p) => p.id !== photoId),
    }));
  };

  const handleAvatarFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsUploadingAvatar(true);
        const compressedUrl = await compressImage(file, 400, 400, 0.85);
        setFormData(prev => ({ ...prev, avatarUrl: compressedUrl }));
      } catch (err: any) {
        console.error('Avatar upload failed:', err);
        alert(err.message || 'Kon de afbeelding niet verwerken.');
      } finally {
        setIsUploadingAvatar(false);
      }
    }
  };

  const handleGalleryPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsUploadingGallery(true);
        const compressedUrl = await compressImage(file, 1200, 1200, 0.85);
        setNewPhotoUrl(compressedUrl);
        if (!newPhotoTitle) {
          setNewPhotoTitle(file.name.replace(/\.[^/.]+$/, ""));
        }
      } catch (err: any) {
        console.error('Gallery photo upload failed:', err);
        alert(err.message || 'Kon de galerijfoto niet verwerken.');
      } finally {
        setIsUploadingGallery(false);
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Section / Student Profile Dossier */}
      <div className="bg-white border border-[#D5D5D0] p-6 sm:p-10 relative">
        {isEditing ? (
          /* EDIT MODE */
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D5D5D0]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#050505] text-white flex items-center justify-center">
                  <Edit3 className="w-5 h-5 text-[#E32636]" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-[#050505]">Profiel & Verhaal Bewerken</h3>
                  <p className="font-mono text-xs text-[#6B6B6B]">Pas je gegevens, studentnummer en verhaal aan. Direct gesynchroniseerd met Supabase.</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="px-3.5 py-2 border border-[#D5D5D0] hover:border-[#050505] text-[#050505] font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
                >
                  <X className="w-3.5 h-3.5 inline mr-1" />
                  Annuleren
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-2 bg-[#050505] hover:bg-[#E32636] text-white font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Opslaan...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Opslaan in Cloud</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {saveError && (
              <div className="p-3 bg-[#050505] border border-[#E32636] text-[#E32636] font-mono text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{saveError}</span>
              </div>
            )}

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-xs uppercase tracking-wider font-bold text-[#050505] mb-1">
                  Volledige Naam
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full text-sm font-medium text-[#050505] border border-[#D5D5D0] px-3 py-2 bg-[#F4F3EF] focus:bg-white focus:outline-2 focus:outline-[#050505]"
                  placeholder="bijv. Thijs Buisman"
                />
              </div>

              <div>
                <label className="block font-mono text-xs uppercase tracking-wider font-bold text-[#050505] mb-1">
                  Studentnummer
                </label>
                <input
                  type="text"
                  value={formData.studentNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, studentNumber: e.target.value }))}
                  className="w-full text-sm font-medium text-[#050505] border border-[#D5D5D0] px-3 py-2 bg-[#F4F3EF] focus:bg-white focus:outline-2 focus:outline-[#050505] font-mono"
                  placeholder="bijv. 1829302"
                />
              </div>

              <div>
                <label className="block font-mono text-xs uppercase tracking-wider font-bold text-[#050505] mb-1">
                  Opleiding / Studierichting
                </label>
                <input
                  type="text"
                  value={formData.studyTrack}
                  onChange={(e) => setFormData(prev => ({ ...prev, studyTrack: e.target.value }))}
                  className="w-full text-sm font-medium text-[#050505] border border-[#D5D5D0] px-3 py-2 bg-[#F4F3EF] focus:bg-white focus:outline-2 focus:outline-[#050505]"
                  placeholder="bijv. HBO-ICT"
                />
              </div>

              <div>
                <label className="block font-mono text-xs uppercase tracking-wider font-bold text-[#050505] mb-1">
                  Onderwijsinstelling
                </label>
                <input
                  type="text"
                  value={formData.institution}
                  onChange={(e) => setFormData(prev => ({ ...prev, institution: e.target.value }))}
                  className="w-full text-sm font-medium text-[#050505] border border-[#D5D5D0] px-3 py-2 bg-[#F4F3EF] focus:bg-white focus:outline-2 focus:outline-[#050505]"
                  placeholder="bijv. Hogeschool Utrecht"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-mono text-xs uppercase tracking-wider font-bold text-[#050505] mb-1">
                  Profielfoto URL / Bestand Uploaden
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.avatarUrl}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData(prev => ({ ...prev, avatarUrl: val }));
                    }}
                    className="flex-1 text-xs border border-[#D5D5D0] px-3 py-2 bg-[#F4F3EF] focus:bg-white focus:outline-2 focus:outline-[#050505] font-mono"
                    placeholder="Plak afbeeldings-URL of upload bestand..."
                  />
                  <label className={`inline-flex items-center gap-1.5 px-3 py-2 border border-[#D5D5D0] text-[#050505] font-mono text-xs uppercase tracking-wider cursor-pointer transition-colors whitespace-nowrap ${
                    isUploadingAvatar ? 'bg-[#050505] text-white' : 'bg-[#F4F3EF] hover:bg-white hover:border-[#050505]'
                  }`}>
                    {isUploadingAvatar ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Comprimeren...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>Kies foto</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isUploadingAvatar}
                      onChange={handleAvatarFileUpload}
                      className="hidden"
                    />
                  </label>
                  {formData.avatarUrl && (
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, avatarUrl: '' }))}
                      className="p-2 border border-[#D5D5D0] hover:border-[#E32636] text-[#6B6B6B] hover:text-[#E32636] text-xs cursor-pointer"
                      title="Verwijder foto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Social Links & Contact */}
            <div className="p-4 bg-[#F4F3EF] border border-[#D5D5D0] space-y-3">
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#050505] flex items-center gap-2">
                <span>CONTACT & VERIFICATIE LINKS</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-mono text-[11px] text-[#6B6B6B] mb-1 flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-[#050505]" />
                    <span>E-mailadres</span>
                  </label>
                  <input
                    type="email"
                    value={formData.socials?.email ?? ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        socials: { ...prev.socials, email: val },
                      }));
                    }}
                    placeholder="student@hu.nl"
                    className="w-full text-xs text-[#050505] border border-[#D5D5D0] px-2.5 py-1.5 bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[11px] text-[#6B6B6B] mb-1 flex items-center gap-1.5">
                    <Linkedin className="w-3 h-3 text-[#050505]" />
                    <span>LinkedIn URL</span>
                  </label>
                  <input
                    type="url"
                    value={formData.socials?.linkedin ?? ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        socials: { ...prev.socials, linkedin: val },
                      }));
                    }}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full text-xs text-[#050505] border border-[#D5D5D0] px-2.5 py-1.5 bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[11px] text-[#6B6B6B] mb-1 flex items-center gap-1.5">
                    <Github className="w-3 h-3 text-[#050505]" />
                    <span>GitHub URL</span>
                  </label>
                  <input
                    type="url"
                    value={formData.socials?.github ?? ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        socials: { ...prev.socials, github: val },
                      }));
                    }}
                    placeholder="https://github.com/..."
                    className="w-full text-xs text-[#050505] border border-[#D5D5D0] px-2.5 py-1.5 bg-white font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Biography Textarea */}
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider font-bold text-[#050505] mb-1.5">
                // ONDERZOEKERSVERHAAL & MOTIVATIE
              </label>
              <textarea
                rows={5}
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                className="w-full text-[#050505] text-sm leading-relaxed p-4 border border-[#D5D5D0] bg-[#F4F3EF] focus:bg-white focus:outline-2 focus:outline-[#050505]"
                placeholder="Beschrijf je achtergrond, je motivatie voor deze minor en je visie op AI..."
              />
            </div>

            {/* Talenten, Passies, Dromen Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-[#F4F3EF] border border-[#D5D5D0]">
              <div>
                <label className="block font-mono text-[11px] font-bold uppercase tracking-wider text-[#050505] mb-1">
                  Talenten (1 per regel)
                </label>
                <textarea
                  rows={4}
                  value={(formData.talents || []).join('\n')}
                  onChange={(e) => {
                    const lines = e.target.value.split('\n');
                    setFormData(prev => ({ ...prev, talents: lines }));
                  }}
                  className="w-full text-xs font-mono p-2.5 bg-white border border-[#D5D5D0] text-[#050505] focus:outline-2 focus:outline-[#050505]"
                  placeholder="Talent 1&#10;Talent 2"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] font-bold uppercase tracking-wider text-[#050505] mb-1">
                  Passies (1 per regel)
                </label>
                <textarea
                  rows={4}
                  value={(formData.passions || []).join('\n')}
                  onChange={(e) => {
                    const lines = e.target.value.split('\n');
                    setFormData(prev => ({ ...prev, passions: lines }));
                  }}
                  className="w-full text-xs font-mono p-2.5 bg-white border border-[#D5D5D0] text-[#050505] focus:outline-2 focus:outline-[#050505]"
                  placeholder="Passie 1&#10;Passie 2"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] font-bold uppercase tracking-wider text-[#050505] mb-1">
                  Dromen (1 per regel)
                </label>
                <textarea
                  rows={4}
                  value={(formData.dreams || []).join('\n')}
                  onChange={(e) => {
                    const lines = e.target.value.split('\n');
                    setFormData(prev => ({ ...prev, dreams: lines }));
                  }}
                  className="w-full text-xs font-mono p-2.5 bg-white border border-[#D5D5D0] text-[#050505] focus:outline-2 focus:outline-[#050505]"
                  placeholder="Droom 1&#10;Droom 2"
                />
              </div>
            </div>
          </div>
        ) : (
          /* VIEW MODE */
          <>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[#D5D5D0]">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="relative flex-shrink-0">
                  {formData.avatarUrl ? (
                    <img
                      src={formData.avatarUrl}
                      alt={formData.name}
                      className="w-28 h-28 sm:w-32 sm:h-32 object-cover border-2 border-[#050505]"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                        const fallback = (e.target as HTMLElement).parentElement?.querySelector('.avatar-initials-fallback') as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div
                    className={`avatar-initials-fallback w-28 h-28 sm:w-32 sm:h-32 bg-[#050505] text-white font-mono font-bold text-3xl items-center justify-center border-2 border-[#050505] ${
                      formData.avatarUrl ? 'hidden' : 'flex'
                    }`}
                  >
                    {formData.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'TB'}
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-[#E32636] text-white font-mono text-[10px] px-1.5 py-0.5 uppercase tracking-widest font-bold">
                    AI
                  </div>
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-white bg-[#050505] px-2.5 py-0.5">
                      MINOR // {formData.minor || 'FUTURE-PROOF MET AI'}
                    </span>
                    <span className="font-mono text-xs text-[#6B6B6B]">
                      {formData.institution} // {formData.studyTrack}
                    </span>
                  </div>

                  <h2 className="font-display text-3xl sm:text-4xl font-black text-[#050505] tracking-tight">
                    {formData.name}
                  </h2>
                  <p className="font-mono text-xs text-[#6B6B6B] mt-1.5 flex items-center gap-2">
                    <span>STUDENTNUMMER:</span>
                    <span className="font-bold text-[#050505] bg-[#F4F3EF] px-2 py-0.5 border border-[#D5D5D0]">
                      {formData.studentNumber || 'ONBEKEND'}
                    </span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 self-end md:self-auto">
                {isOwner && (
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...profile,
                        avatarUrl: profile.avatarUrl || '',
                        socials: {
                          github: profile.socials?.github ?? '',
                          linkedin: profile.socials?.linkedin ?? '',
                          email: profile.socials?.email ?? '',
                        },
                        photos: profile.photos || [],
                      });
                      setSaveError(null);
                      setIsEditing(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-[#D5D5D0] hover:border-[#050505] text-[#050505] hover:bg-[#F4F3EF] font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#050505]" />
                    <span>Gegevens Bewerken</span>
                  </button>
                )}

                {onNavigateToSprints && (
                  <button
                    onClick={onNavigateToSprints}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#050505] hover:bg-[#E32636] text-white font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    <span>Naar Dossiers</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Narrative Editorial Section */}
            <div className="pt-8">
              <div className="flex items-center gap-2 mb-3">
                <Terminal className="w-4 h-4 text-[#050505]" />
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#050505]">
                  // ONDERZOEKERSVERHAAL & MOTIVATIE
                </h3>
              </div>

              <div className="text-[#050505]/85 text-base sm:text-lg leading-relaxed max-w-4xl whitespace-pre-line space-y-4">
                {formData.bio}
              </div>

              {/* Social & Contact Strip */}
              <div className="flex flex-wrap items-center gap-3 mt-8 pt-6 border-t border-[#D5D5D0]">
                {formData.socials.email && (
                  <a
                    href={`mailto:${formData.socials.email}`}
                    className="inline-flex items-center gap-2 px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-[#050505] border border-[#D5D5D0] hover:border-[#050505] hover:bg-[#F4F3EF] transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#050505]" />
                    <span>{formData.socials.email}</span>
                  </a>
                )}
                {formData.socials.linkedin && (
                  <a
                    href={formData.socials.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-[#050505] border border-[#D5D5D0] hover:border-[#050505] hover:bg-[#F4F3EF] transition-colors"
                  >
                    <Linkedin className="w-3.5 h-3.5 text-[#050505]" />
                    <span>LinkedIn</span>
                  </a>
                )}
                {formData.socials.github && (
                  <a
                    href={formData.socials.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-[#050505] border border-[#D5D5D0] hover:border-[#050505] hover:bg-[#F4F3EF] transition-colors"
                  >
                    <Github className="w-3.5 h-3.5 text-[#050505]" />
                    <span>GitHub</span>
                  </a>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* 3-Column Editorial Grid: Talenten, Passies, Dromen */}
      {((formData.talents && formData.talents.length > 0) || 
        (formData.passions && formData.passions.length > 0) || 
        (formData.dreams && formData.dreams.length > 0)) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Talenten & Sterktes */}
          <div className="bg-white border border-[#D5D5D0] p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[#D5D5D0]">
                <Sparkles className="w-4 h-4 text-[#E32636]" />
                <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#050505]">
                  TALENTEN & STERKTES
                </h4>
              </div>
              <ul className="space-y-2.5">
                {(formData.talents || []).map((talent, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-[#050505]/85 leading-relaxed font-sans">
                    <span className="w-1.5 h-1.5 bg-[#050505] rounded-none mt-1.5 flex-shrink-0" />
                    <span>{talent}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Card 2: Passies & AI-Interesses */}
          <div className="bg-white border border-[#D5D5D0] p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[#D5D5D0]">
                <Compass className="w-4 h-4 text-[#050505]" />
                <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#050505]">
                  PASSIES & INTERESSES
                </h4>
              </div>
              <ul className="space-y-2.5">
                {(formData.passions || []).map((passion, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-[#050505]/85 leading-relaxed font-sans">
                    <span className="w-1.5 h-1.5 bg-[#E32636] rounded-none mt-1.5 flex-shrink-0" />
                    <span>{passion}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Card 3: Toekomstdromen & Ambities */}
          <div className="bg-white border border-[#D5D5D0] p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[#D5D5D0]">
                <Target className="w-4 h-4 text-[#050505]" />
                <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#050505]">
                  DROMEN & AMBITIES
                </h4>
              </div>
              <ul className="space-y-2.5">
                {(formData.dreams || []).map((dream, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-[#050505]/85 leading-relaxed font-sans">
                    <span className="w-1.5 h-1.5 bg-[#050505] rounded-none mt-1.5 flex-shrink-0" />
                    <span>{dream}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Visual Archive / Photo Impressions: Only rendered if photos exist or when in edit mode */}
      {((formData.photos && formData.photos.length > 0) || isEditing) && (
        <div className="bg-white border border-[#D5D5D0] p-6 sm:p-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-[#D5D5D0] mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#050505] text-white flex items-center justify-center">
                <ImageIcon className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-[#050505]">
                  Visueel Archief // Impressies & Prototypes
                </h3>
                <p className="font-mono text-xs text-[#6B6B6B]">
                  Sfeerbeelden, Show & Tell presentaties, artifacts en samenwerking binnen het AI-leerteam.
                </p>
              </div>
            </div>

            <span className="font-mono text-xs text-[#6B6B6B] border border-[#D5D5D0] px-2.5 py-1 self-start sm:self-auto uppercase tracking-wide">
              {formData.photos?.length || 0} ITEMS IN ARCHIEF
            </span>
          </div>

          {/* Photos Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {formData.photos && formData.photos.length > 0 ? (
              formData.photos.map((photo) => (
                <div
                  key={photo.id}
                  className="group relative border border-[#D5D5D0] hover:border-[#050505] transition-all flex flex-col bg-white"
                >
                  <div 
                    onClick={() => setLightboxPhoto(photo)}
                    className="relative h-48 w-full overflow-hidden bg-[#050505] cursor-pointer"
                  >
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="w-full h-full object-cover opacity-95 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-[#050505]/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <span className="text-white font-mono text-xs tracking-wider uppercase">
                        [ VERGROOT WEERGAVE ]
                      </span>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between bg-white border-t border-[#D5D5D0]">
                    <div>
                      <h4 className="font-display font-bold text-[#050505] text-sm mb-1">
                        {photo.title}
                      </h4>
                      <p className="text-xs text-[#6B6B6B] leading-relaxed">
                        {photo.caption}
                      </p>
                    </div>

                    {isEditing && (
                      <div className="pt-3 mt-3 border-t border-[#D5D5D0] flex justify-end">
                        <button
                          onClick={() => removePhoto(photo.id)}
                          className="font-mono text-xs text-[#E32636] hover:underline font-bold flex items-center gap-1 cursor-pointer uppercase tracking-wider"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Verwijderen
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-10 text-center bg-[#F4F3EF] border border-dashed border-[#D5D5D0]">
                <ImageIcon className="w-8 h-8 text-[#6B6B6B] mx-auto mb-2" />
                <p className="font-mono text-xs text-[#6B6B6B] uppercase tracking-wider">
                  Geen foto's opgenomen in dit archief.
                </p>
              </div>
            )}
          </div>

          {/* Add Photo Form (Edit Mode) */}
          {isEditing && (
            <div className="mt-6 pt-5 border-t border-[#D5D5D0] bg-[#F4F3EF] p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#050505] flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-[#050505]" />
                  Nieuwe archieffoto toevoegen
                </h4>
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#D5D5D0] hover:border-[#050505] text-[#050505] font-mono text-xs uppercase tracking-wider cursor-pointer transition-colors self-start sm:self-auto">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Kies foto van apparaat</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleGalleryPhotoUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={newPhotoTitle}
                  onChange={(e) => setNewPhotoTitle(e.target.value)}
                  placeholder="Titel (bijv. Prototype test)"
                  className="text-xs px-3 py-2 bg-white border border-[#D5D5D0] font-mono text-[#050505] outline-none"
                />
                <input
                  type="text"
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                  placeholder="Foto URL of kies bestand..."
                  className="text-xs px-3 py-2 bg-white border border-[#D5D5D0] font-mono text-[#050505] outline-none"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newPhotoCaption}
                    onChange={(e) => setNewPhotoCaption(e.target.value)}
                    placeholder="Kort onderschrift..."
                    className="text-xs flex-1 px-3 py-2 bg-white border border-[#D5D5D0] font-mono text-[#050505] outline-none"
                  />
                  <button
                    type="button"
                    onClick={addPhoto}
                    className="px-4 py-2 bg-[#050505] hover:bg-[#E32636] text-white font-mono text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Toevoegen
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Editorial Mission Statement */}
      <div className="bg-[#050505] border border-[#1F1F1F] p-8 sm:p-12 text-white">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#E32636]" />
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#E32636]">
                ONDERZOEKSVISIE // HU MINOR
              </span>
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-black leading-tight tracking-tight">
              "AI vervangt professionals niet, maar professionals die verstandig en ethisch met AI werken vervangen hen die dat nalaten."
            </h3>
            <p className="text-sm text-[#D5D5D0] leading-relaxed pt-1">
              Gedurende 8 sprints bij de Hogeschool Utrecht bouw ik stap voor stap een verifieerbare bewijsvoering op over de 5 HU-leeruitkomsten. Mijn doel is methodische AI-toepassing en professionele autonomie.
            </p>
          </div>

          {onNavigateToSprints && (
            <button
              onClick={onNavigateToSprints}
              className="px-6 py-3.5 bg-white hover:bg-[#E32636] text-[#050505] hover:text-white font-mono text-xs uppercase tracking-widest font-bold transition-colors flex items-center gap-2.5 whitespace-nowrap cursor-pointer self-start md:self-auto"
            >
              <span>Bekijk Sprints (01 - 08)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Floating Save/Cancel bar during editing */}
      {isEditing && (
        <div className="sticky bottom-4 z-40 bg-[#050505] text-white p-4 border border-[#D5D5D0] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Terminal className="w-5 h-5 text-[#E32636] flex-shrink-0" />
            <div>
              <p className="font-display text-sm font-bold text-white">
                Bewerken actief: Profiel & Archief
              </p>
              <p className="font-mono text-[11px] text-[#D5D5D0]">
                Vergeet niet je wijzigingen op te slaan naar de cloud database.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end font-mono text-xs uppercase tracking-wider">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSaving}
              className="px-4 py-2 border border-[#D5D5D0] hover:border-white text-white transition-colors cursor-pointer disabled:opacity-50"
            >
              Annuleren
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2 bg-[#E32636] hover:bg-[#050505] text-white border border-[#E32636] font-bold transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Opslaan...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Opslaan</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Lightbox Modal for Photos */}
      {lightboxPhoto && (
        <div 
          className="fixed inset-0 z-50 bg-[#050505]/90 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setLightboxPhoto(null)}
        >
          <div 
            className="bg-white border border-[#D5D5D0] max-w-3xl w-full overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-[#050505]">
              <img
                src={lightboxPhoto.url}
                alt={lightboxPhoto.title}
                className="w-full max-h-[70vh] object-contain"
              />
              <button
                onClick={() => setLightboxPhoto(null)}
                className="absolute top-3 right-3 p-2 bg-[#050505] text-white border border-[#1F1F1F] hover:bg-[#E32636] transition-colors cursor-pointer"
                aria-label="Sluiten"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5">
              <h3 className="font-display text-base font-bold text-[#050505]">
                {lightboxPhoto.title}
              </h3>
              <p className="font-mono text-xs text-[#6B6B6B] mt-1">
                {lightboxPhoto.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
