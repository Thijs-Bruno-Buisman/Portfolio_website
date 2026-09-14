import React, { useState } from 'react';
import { UserProfile, ProfilePhoto } from '../types';
import { 
  Sparkles, 
  GraduationCap, 
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
  RotateCcw,
  AlertCircle
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

  // Only synchronize external profile updates when NOT actively editing!
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
      const photos = formData.photos || [];
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
        // Automatically compress image on canvas to max 400x400 px, ~25-40KB
        const compressedUrl = await compressImage(file, 400, 400, 0.82);
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
        // Automatically compress gallery image on canvas to max 1000x1000 px, ~60-90KB
        const compressedUrl = await compressImage(file, 1000, 1000, 0.82);
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
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner / Student Hero */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50/50 rounded-full blur-3xl -z-10 pointer-events-none" />

        {isEditing ? (
          /* EDIT MODE: Complete profile management */
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Profiel & Verhaal Bewerken</h3>
                  <p className="text-xs text-slate-500">Pas je gegevens, studentnummer en verhaal aan. Alles wordt direct opgeslagen in de cloud.</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold transition-all cursor-pointer disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                  Annuleren
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Opslaan in cloud...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Wijzigingen Opslaan</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {saveError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
                <span>{saveError}</span>
              </div>
            )}

            {/* Profile Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Volledige Naam
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full text-sm font-medium text-slate-900 border border-slate-300 rounded-xl px-3 py-2 focus:outline-emerald-500 focus:border-emerald-500 bg-white"
                  placeholder="bijv. Thijs Buisman"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1.5">
                  Studentnummer
                </label>
                <input
                  type="text"
                  value={formData.studentNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, studentNumber: e.target.value }))}
                  className="w-full text-sm font-mono font-semibold text-slate-900 border-2 border-emerald-300 bg-emerald-50/30 rounded-xl px-3 py-2 focus:outline-emerald-500 focus:border-emerald-500"
                  placeholder="bijv. 1855662"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Opleiding / Studierichting
                </label>
                <input
                  type="text"
                  value={formData.studyTrack}
                  onChange={(e) => setFormData(prev => ({ ...prev, studyTrack: e.target.value }))}
                  className="w-full text-sm font-medium text-slate-900 border border-slate-300 rounded-xl px-3 py-2 focus:outline-emerald-500 focus:border-emerald-500 bg-white"
                  placeholder="bijv. HBO Electrical Engineering"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Onderwijsinstelling / Hogeschool
                </label>
                <input
                  type="text"
                  value={formData.institution}
                  onChange={(e) => setFormData(prev => ({ ...prev, institution: e.target.value }))}
                  className="w-full text-sm font-medium text-slate-900 border border-slate-300 rounded-xl px-3 py-2 focus:outline-emerald-500 focus:border-emerald-500 bg-white"
                  placeholder="bijv. Hogeschool Utrecht"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Minor Titel
                </label>
                <input
                  type="text"
                  value={formData.minor}
                  onChange={(e) => setFormData(prev => ({ ...prev, minor: e.target.value }))}
                  className="w-full text-sm font-medium text-slate-900 border border-slate-300 rounded-xl px-3 py-2 focus:outline-emerald-500 focus:border-emerald-500 bg-white"
                  placeholder="bijv. Future-proof met AI"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Profielfoto
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-emerald-100 border border-emerald-200 flex-shrink-0 flex items-center justify-center font-bold text-emerald-800 text-sm">
                    {formData.avatarUrl ? (
                      <img
                        src={formData.avatarUrl}
                        alt="Voorvertoning"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <span>{formData.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'TB'}</span>
                    )}
                  </div>
                  <input
                    type="text"
                    value={formData.avatarUrl || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData(prev => ({ ...prev, avatarUrl: val }));
                    }}
                    className="flex-1 text-xs text-slate-700 border border-slate-300 rounded-xl px-3 py-2 focus:outline-emerald-500 bg-white"
                    placeholder="Plak afbeeldings-URL of upload bestand..."
                  />
                  <label className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-slate-700 text-xs font-semibold cursor-pointer transition-colors whitespace-nowrap ${
                    isUploadingAvatar ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 hover:bg-slate-200'
                  }`}>
                    {isUploadingAvatar ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                        <span>Comprimeren...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5 text-emerald-600" />
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
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs"
                      title="Verwijder foto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Upload een eigen foto (wordt automatisch geoptimaliseerd voor snelle cloudopslag) of plak een link.
                </p>
              </div>
            </div>

            {/* Social Links & Contact */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <span>Contact & Social Links</span>
                <span className="text-[11px] font-normal text-slate-500 normal-case">(zichtbaar voor docenten en beoordelaars)</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-slate-500" />
                    <span>E-mailadres</span>
                  </label>
                  <input
                    type="email"
                    value={formData.socials?.email ?? ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        socials: {
                          ...prev.socials,
                          email: val,
                        },
                      }));
                    }}
                    placeholder="thijs.buisman@student.hu.nl"
                    className="w-full text-xs text-slate-800 border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-emerald-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1.5">
                    <Linkedin className="w-3 h-3 text-[#0A66C2]" />
                    <span>LinkedIn Profiel URL</span>
                  </label>
                  <input
                    type="url"
                    value={formData.socials?.linkedin ?? ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        socials: {
                          ...prev.socials,
                          linkedin: val,
                        },
                      }));
                    }}
                    placeholder="https://linkedin.com/in/jouw-profiel"
                    className="w-full text-xs text-slate-800 border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-emerald-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1.5">
                    <Github className="w-3 h-3 text-slate-800" />
                    <span>GitHub Profiel URL</span>
                  </label>
                  <input
                    type="url"
                    value={formData.socials?.github ?? ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        socials: {
                          ...prev.socials,
                          github: val,
                        },
                      }));
                    }}
                    placeholder="https://github.com/jouw-account"
                    className="w-full text-xs text-slate-800 border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-emerald-500 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Wie ben ik? Textarea */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Wie ben ik? (Persoonlijke introductie & motivatie)
                </label>
              </div>
              <textarea
                rows={5}
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                className="w-full text-slate-800 text-sm leading-relaxed p-3.5 border border-slate-300 rounded-xl focus:outline-emerald-500 focus:border-emerald-500 bg-white"
                placeholder="Vertel wie je bent, wat jouw achtergrond is, waarom je deze AI-minor volgt en wat jou inspireert..."
              />
            </div>
          </div>
        ) : (
          /* VIEW MODE: Clean public presentation */
          <>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="relative">
                  {formData.avatarUrl ? (
                    <img
                      src={formData.avatarUrl}
                      alt={formData.name}
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-slate-200 shadow-sm"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                        const fallback = (e.target as HTMLElement).parentElement?.querySelector('.avatar-initials-fallback') as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div
                    className={`avatar-initials-fallback w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white font-extrabold text-2xl sm:text-3xl items-center justify-center border-2 border-slate-200 shadow-sm ${
                      formData.avatarUrl ? 'hidden' : 'flex'
                    }`}
                  >
                    {formData.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'TB'}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-emerald-600 text-white p-1.5 rounded-lg shadow-sm">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                      Student Minor {formData.minor || 'Future-proof met AI'}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {formData.institution} • {formData.studyTrack}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    {formData.name}
                  </h2>
                  <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                    <span>Studentnummer:</span>
                    <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200 text-xs">
                      {formData.studentNumber || 'Nog niet ingevuld'}
                    </span>
                  </p>
                </div>
              </div>

              {/* Edit Button & Sprint Navigation */}
              <div className="flex items-center gap-3 self-end md:self-auto">
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
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-all cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4 text-emerald-600" />
                    Profiel & Gegevens Bewerken
                  </button>
                )}

                {onNavigateToSprints && (
                  <button
                    onClick={onNavigateToSprints}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm shadow-sm transition-all cursor-pointer"
                  >
                    <FileCheck2 className="w-4 h-4 text-emerald-400" />
                    Naar Sprints & Links
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Wie ben ik? Section */}
            <div className="pt-6">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-bold text-slate-900">Wie ben ik?</h3>
              </div>

              <p className="text-slate-700 text-base leading-relaxed max-w-4xl whitespace-pre-line">
                {formData.bio}
              </p>

              {/* Social Links */}
              <div className="flex flex-wrap items-center gap-3 mt-5 pt-4 border-t border-slate-100">
                {formData.socials.email && (
                  <a
                    href={`mailto:${formData.socials.email}`}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-emerald-600 transition-colors bg-slate-50 hover:bg-emerald-50 px-3 py-1.5 rounded-lg border border-slate-200"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    {formData.socials.email}
                  </a>
                )}
                {formData.socials.linkedin && (
                  <a
                    href={formData.socials.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-blue-600 transition-colors bg-slate-50 hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-slate-200"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                    LinkedIn
                  </a>
                )}
                {formData.socials.github && (
                  <a
                    href={formData.socials.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200"
                  >
                    <Github className="w-3.5 h-3.5" />
                    GitHub
                  </a>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Ruimte voor Foto's & Impressies (Requirement: Ruimte voor foto's) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Foto's & Visuele Impressies
              </h3>
              <p className="text-xs text-slate-500">
                Sfeerbeelden van prototypes, Show & Tell sessies en samenwerking in het leerteam.
              </p>
            </div>
          </div>

          <span className="text-xs text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 font-medium self-start sm:self-auto">
            {formData.photos?.length || 0} foto's geregistreerd
          </span>
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {formData.photos && formData.photos.length > 0 ? (
            formData.photos.map((photo) => (
              <div
                key={photo.id}
                className="group relative rounded-xl border border-slate-200 overflow-hidden bg-slate-50 hover:shadow-md transition-all flex flex-col"
              >
                <div 
                  onClick={() => setLightboxPhoto(photo)}
                  className="relative h-48 w-full overflow-hidden bg-slate-900 cursor-pointer"
                >
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <span className="text-white text-xs font-semibold">
                      Klik om te vergroten
                    </span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between bg-white">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">
                      {photo.title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {photo.caption}
                    </p>
                  </div>

                  {isEditing && (
                    <div className="pt-3 mt-3 border-t border-slate-100 flex justify-end">
                      <button
                        onClick={() => removePhoto(photo.id)}
                        className="text-xs text-red-600 hover:text-red-800 font-semibold flex items-center gap-1 cursor-pointer"
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
            <div className="col-span-full py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <ImageIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500 font-medium">
                Nog geen foto's toegevoegd.
              </p>
            </div>
          )}
        </div>

        {/* Add Photo Form (if in Edit Mode) */}
        {isEditing && (
          <div className="mt-6 pt-5 border-t border-slate-100 bg-slate-50 p-4 rounded-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-emerald-600" />
                Nieuwe foto toevoegen (Upload of URL)
              </h4>
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer transition-colors shadow-2xs self-start sm:self-auto">
                <Upload className="w-3.5 h-3.5 text-emerald-600" />
                <span>Kies foto van computer/telefoon</span>
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
                placeholder="Titel (bijv. Show & Tell presentatie)"
                className="text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-emerald-500"
              />
              <input
                type="text"
                value={newPhotoUrl}
                onChange={(e) => setNewPhotoUrl(e.target.value)}
                placeholder="Foto URL of kies bestand hierboven..."
                className="text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-emerald-500"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newPhotoCaption}
                  onChange={(e) => setNewPhotoCaption(e.target.value)}
                  placeholder="Kort onderschrift..."
                  className="text-xs flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-emerald-500"
                />
                <button
                  type="button"
                  onClick={addPhoto}
                  className="px-3 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Toevoegen
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI Visie & Motivatie */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Mijn AI-Visie & Startpunt
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold leading-snug">
              "AI vervangt mensen niet, maar mensen die verstandig en ethisch met AI werken vervangen mensen die dat niet doen."
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed pt-1">
              Gedurende deze 8 sprints bij de Hogeschool Utrecht bouw ik stap voor stap een solide bewijsvoering op voor de 4 HU-leeruitkomsten. Mijn doel is niet louter tools testen, maar een toekomstbestendige denkwijze en professionele autonomie ontwikkelen.
            </p>
          </div>

          {onNavigateToSprints && (
            <button
              onClick={onNavigateToSprints}
              className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-sm transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer self-start md:self-auto"
            >
              Bekijk Sprints (1 t/m 8)
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Floating Save/Cancel bar during editing */}
      {isEditing && (
        <div className="sticky bottom-4 z-40 bg-slate-900/95 backdrop-blur-md text-white p-3 sm:p-4 rounded-2xl shadow-2xl border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3 animate-slideUp">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div>
              <p className="text-xs sm:text-sm font-semibold text-slate-100">
                Je bewerkt momenteel je profiel, studentnummer, talenten en foto's
              </p>
              <p className="text-[11px] text-slate-400">
                Sla je wijzigingen op zodat ze direct in de cloud-database worden bijgewerkt.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSaving}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-medium transition-colors cursor-pointer disabled:opacity-50"
            >
              Annuleren
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Opslaan...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Wijzigingen Opslaan</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Lightbox Modal for Photos */}
      {lightboxPhoto && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setLightboxPhoto(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl relative animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-slate-950">
              <img
                src={lightboxPhoto.url}
                alt={lightboxPhoto.title}
                className="w-full max-h-[70vh] object-contain"
              />
              <button
                onClick={() => setLightboxPhoto(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-900/80 text-white flex items-center justify-center hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 sm:p-5">
              <h3 className="text-base font-bold text-slate-900">
                {lightboxPhoto.title}
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                {lightboxPhoto.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
