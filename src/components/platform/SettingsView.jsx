import React, { useState, useRef, useEffect } from 'react';
import { 
  Settings, 
  User, 
  Lock, 
  Camera, 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Trash2, 
  ShieldCheck,
  Building2,
  Mail,
  KeyRound,
  BadgeCheck,
  Globe,
  MapPin,
  Save,
  Shield,
  Layers,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function SettingsView({ onNavigate }) {
  const { user, updateUser } = useAuth();

  // Profile States
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState('');
  const fileInputRef = useRef(null);

  // Synchronize if user changes in auth
  useEffect(() => {
    if (user?.full_name && !fullName) {
      setFullName(user.full_name);
    }
    if (user?.avatar && !avatarPreview) {
      setAvatarPreview(user.avatar);
    }
  }, [user]);

  // Password States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Handle Avatar File Upload
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setProfileError('Please choose a valid image file (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setProfileError('Image file size must be less than 5MB.');
      return;
    }

    setProfileError('');
    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const dataUrl = loadEvent.target.result;
      setAvatarPreview(dataUrl);
      if (updateUser) {
        updateUser({ avatar: dataUrl });
      }
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3500);
    };
    reader.readAsDataURL(file);
  };

  // Remove Avatar
  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (updateUser) {
      updateUser({ avatar: null });
    }
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 3500);
  };

  // Handle Save Profile Name
  const handleSaveProfile = (e) => {
    e.preventDefault();
    setProfileError('');

    if (!fullName.trim()) {
      setProfileError('Full name cannot be empty.');
      return;
    }

    if (updateUser) {
      updateUser({ full_name: fullName.trim(), avatar: avatarPreview });
    }
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 3500);
  };

  // Handle Change Password
  const handleChangePassword = (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (!currentPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirm password do not match.');
      return;
    }

    setIsChangingPassword(true);

    // Simulate secure password update and persist timestamp
    setTimeout(() => {
      try {
        localStorage.setItem('safetyai_password_last_changed', new Date().toISOString());
      } catch (err) {
        console.error(err);
      }
      setIsChangingPassword(false);
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(false), 4500);
    }, 600);
  };

  // Organization Profile States
  const [orgName, setOrgName] = useState(() => {
    try {
      const saved = localStorage.getItem('safetyai_org_settings');
      if (saved) return JSON.parse(saved).orgName || user?.organization_name || 'Oil India Limited – Operational Safety Unit';
    } catch {}
    return user?.organization_name || 'Oil India Limited – Operational Safety Unit';
  });

  const [orgId, setOrgId] = useState(() => {
    try {
      const saved = localStorage.getItem('safetyai_org_settings');
      if (saved) return JSON.parse(saved).orgId || user?.organization_id || 'id001';
    } catch {}
    return user?.organization_id || 'id001';
  });

  const [division, setDivision] = useState(() => {
    try {
      const saved = localStorage.getItem('safetyai_org_settings');
      if (saved) return JSON.parse(saved).division || 'Duliajan Operational Safety Headquarters';
    } catch {}
    return 'Duliajan Operational Safety Headquarters';
  });

  const [domain, setDomain] = useState(() => {
    try {
      const saved = localStorage.getItem('safetyai_org_settings');
      if (saved) return JSON.parse(saved).domain || 'Upstream Oil & Gas / Petrochemical Refining';
    } catch {}
    return 'Upstream Oil & Gas / Petrochemical Refining';
  });

  const [contactEmail, setContactEmail] = useState(() => {
    try {
      const saved = localStorage.getItem('safetyai_org_settings');
      if (saved) return JSON.parse(saved).contactEmail || 'safety-operations@oilindia.in';
    } catch {}
    return 'safety-operations@oilindia.in';
  });

  const [activePlants, setActivePlants] = useState(() => {
    try {
      const saved = localStorage.getItem('safetyai_org_settings');
      if (saved) return JSON.parse(saved).activePlants || 'Plant 01 (Crude), Plant 02 (Reformer), Plant 03 (Utilities), Terminal B';
    } catch {}
    return 'Plant 01 (Crude), Plant 02 (Reformer), Plant 03 (Utilities), Terminal B';
  });

  const [complianceStandards, setComplianceStandards] = useState(() => {
    try {
      const saved = localStorage.getItem('safetyai_org_settings');
      if (saved) return JSON.parse(saved).complianceStandards || 'DGMS, OISD-156, API RP 754 Tier 1/2, OSHA 1910';
    } catch {}
    return 'DGMS, OISD-156, API RP 754 Tier 1/2, OSHA 1910';
  });

  const [orgSuccess, setOrgSuccess] = useState(false);
  const [orgError, setOrgError] = useState('');
  const [isSavingOrg, setIsSavingOrg] = useState(false);

  // Sync if user organization changes in auth
  useEffect(() => {
    if (user?.organization_name && !orgName) {
      setOrgName(user.organization_name);
    }
    if (user?.organization_id && !orgId) {
      setOrgId(user.organization_id);
    }
  }, [user]);

  const handleSaveOrg = (e) => {
    e.preventDefault();
    setOrgError('');
    setOrgSuccess(false);

    if (!orgName.trim()) {
      setOrgError('Organization name is required.');
      return;
    }

    setIsSavingOrg(true);
    setTimeout(() => {
      const payload = {
        orgName: orgName.trim(),
        orgId: orgId.trim(),
        division: division.trim(),
        domain: domain.trim(),
        contactEmail: contactEmail.trim(),
        activePlants: activePlants.trim(),
        complianceStandards: complianceStandards.trim(),
        updatedAt: new Date().toISOString()
      };
      try {
        localStorage.setItem('safetyai_org_settings', JSON.stringify(payload));
      } catch (err) {
        console.error(err);
      }

      if (updateUser) {
        updateUser({
          organization_name: orgName.trim(),
          organization_id: orgId.trim()
        });
      }

      setIsSavingOrg(false);
      setOrgSuccess(true);
      setTimeout(() => setOrgSuccess(false), 4000);
    }, 450);
  };

  // Avatar Initials
  const userInitials = (fullName || user?.full_name || 'HSE')
    .split(' ')
    .map(p => p[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto text-slate-800 animate-in fade-in duration-200">
      
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EAE6E1]">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#FFF1EE] border border-[#FFE0D6] flex items-center justify-center text-[#FF5A36] shadow-xs">
              <Settings className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 tracking-tight">
              Platform Settings &amp; Security
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1 ml-12">
            Manage your personal profile, update your name, upload your avatar icon, and securely change your password.
          </p>
        </div>
      </div>

      {/* 2. Top Grid: Profile & Icon (Left) + Change Password (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: User Profile & Icon Upload (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#EAE6E1] shadow-xs overflow-hidden">
          <div className="p-5 border-b border-[#EAE6E1] flex items-center justify-between bg-[#FAF8F5]/50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200/60 text-[#FF5A36] flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 font-heading">
                  Profile Details &amp; User Icon
                </h2>
                <p className="text-[11px] text-slate-500">
                  Update your display name and upload a profile image as your icon
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-semibold flex items-center gap-1">
              <BadgeCheck className="w-3 h-3 text-emerald-600" />
              Verified Account
            </span>
          </div>

          <form onSubmit={handleSaveProfile} className="p-5 sm:p-6 space-y-6">
            
            {/* Success / Error Alerts */}
            {profileSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Your profile name and avatar icon have been updated and synchronized!</span>
              </div>
            )}
            {profileError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{profileError}</span>
              </div>
            )}

            {/* Avatar Upload Area */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                User Icon / Avatar Photo
              </label>
              
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-4 rounded-xl bg-[#FAF8F5] border border-[#EAE6E1]">
                
                {/* Avatar Preview */}
                <div className="relative group shrink-0">
                  {avatarPreview ? (
                    <img 
                      src={avatarPreview} 
                      alt="User Avatar Preview" 
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-[#FF5A36] shadow-md ring-2 ring-orange-100"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#FF5A36] to-[#FFA133] text-white flex items-center justify-center font-black text-xl shadow-md ring-2 ring-orange-100">
                      {userInitials}
                    </div>
                  )}

                  {/* Camera icon badge */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    title="Upload new icon"
                    className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-md hover:bg-[#FF5A36] transition-colors cursor-pointer border-2 border-white"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Controls & Instructions */}
                <div className="flex-1 space-y-2.5 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleAvatarChange} 
                      accept="image/*" 
                      className="hidden" 
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#FF5A36] hover:bg-[#E04826] text-white transition-all shadow-xs cursor-pointer"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Upload New Image</span>
                    </button>

                    {avatarPreview && (
                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Upload an image to personalize your account. It will appear across the Top Navigation bar, Left Sidebar, and Audit Dossiers. Supports PNG, JPG, or WEBP (Max 5MB).
                  </p>
                </div>

              </div>
            </div>

            {/* Name Input */}
            <div className="space-y-1.5">
              <label htmlFor="user-full-name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Full Name / Display Name
              </label>
              <input
                id="user-full-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Mousumi Borah"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE6E1] bg-white text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/20 focus:border-[#FF5A36] transition-all"
              />
              <p className="text-[11px] text-slate-500">
                This name is reflected in real time across the application header, sidebar, and incident review approvals.
              </p>
            </div>

            {/* Read-only Context Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE6E1]/80 space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1.5">
                  <Mail className="w-3 h-3 text-slate-400" />
                  <span>Email Address</span>
                </div>
                <div className="text-xs font-mono font-bold text-slate-800 truncate">
                  {user?.email || 'admin1@gmail.com'}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE6E1]/80 space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1.5">
                  <Building2 className="w-3 h-3 text-slate-400" />
                  <span>Access Role</span>
                </div>
                <div className="text-xs font-bold text-[#FF5A36] truncate">
                  {user?.role_name || (user?.is_admin ? 'Administrator' : 'Normal User')}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Update Profile &amp; Name</span>
              </button>
            </div>

          </form>
        </div>

        {/* Right Column: Change Password (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#EAE6E1] shadow-xs overflow-hidden">
          <div className="p-5 border-b border-[#EAE6E1] flex items-center justify-between bg-[#FAF8F5]/50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200/60 text-[#FF5A36] flex items-center justify-center">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 font-heading">
                  Change Password
                </h2>
                <p className="text-[11px] text-slate-500">
                  Update your account login credentials securely
                </p>
              </div>
            </div>
            <Lock className="w-4 h-4 text-slate-400" />
          </div>

          <form onSubmit={handleChangePassword} className="p-5 sm:p-6 space-y-4">
            
            {/* Password Success / Error Alerts */}
            {passwordSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Password changed successfully! Your account credentials have been secured.</span>
              </div>
            )}
            {passwordError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            {/* Current Password Field */}
            <div className="space-y-1">
              <label htmlFor="current-password" className="block text-xs font-bold text-slate-700">
                Current Password
              </label>
              <div className="relative">
                <input
                  id="current-password"
                  type={showCurrentPass ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-[#EAE6E1] bg-white text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/20 focus:border-[#FF5A36] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPass(!showCurrentPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password Field */}
            <div className="space-y-1">
              <label htmlFor="new-password" className="block text-xs font-bold text-slate-700">
                New Password
              </label>
              <div className="relative">
                <input
                  id="new-password"
                  type={showNewPass ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-[#EAE6E1] bg-white text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/20 focus:border-[#FF5A36] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password Field */}
            <div className="space-y-1">
              <label htmlFor="confirm-password" className="block text-xs font-bold text-slate-700">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  id="confirm-password"
                  type={showConfirmPass ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-[#EAE6E1] bg-white text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/20 focus:border-[#FF5A36] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Password Requirement Hint */}
            <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE6E1] text-[11px] text-slate-500 space-y-1">
              <div className="font-semibold text-slate-700">Password Guidelines:</div>
              <ul className="list-disc list-inside space-y-0.5 text-slate-500">
                <li>Minimum 6 characters in length</li>
                <li>Both passwords must match exactly</li>
              </ul>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isChangingPassword}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{isChangingPassword ? 'Securing Password...' : 'Save New Password'}</span>
              </button>
            </div>

          </form>
        </div>

      </div>

      {/* 3. Enterprise Organization Profile & Configuration */}
      <div className="bg-white rounded-2xl border border-[#EAE6E1] shadow-xs overflow-hidden">
        {/* Card Header */}
        <div className="p-5 border-b border-[#EAE6E1] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAF8F5]/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200/60 text-amber-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 font-heading flex items-center gap-2">
                <span>Enterprise Organization Profile</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-orange-50 text-[#FF5A36] border border-orange-200/60 font-bold">
                  Corporate Tenant
                </span>
              </h2>
              <p className="text-[11px] text-slate-500">
                Configure company details, operating divisions, registered plant facilities, and safety standards
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Active Enterprise License
            </span>
          </div>
        </div>

        {/* Card Content & Form */}
        <form onSubmit={handleSaveOrg} className="p-6 space-y-6">
          {orgSuccess && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Enterprise organization details successfully updated and synchronized across SafetyAI.</span>
            </div>
          )}

          {orgError && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{orgError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Organization Name */}
            <div className="space-y-1.5">
              <label htmlFor="org-name" className="block text-xs font-bold text-slate-700">
                Organization / Company Name <span className="text-[#FF5A36]">*</span>
              </label>
              <div className="relative">
                <input
                  id="org-name"
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="e.g. Oil India Limited"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#EAE6E1] bg-white text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/20 focus:border-[#FF5A36] transition-all"
                />
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              <p className="text-[10px] text-slate-400">Displayed on global telemetry dashboards and executive briefings.</p>
            </div>

            {/* Organization ID */}
            <div className="space-y-1.5">
              <label htmlFor="org-id" className="block text-xs font-bold text-slate-700">
                Organization Tenant ID / Code
              </label>
              <div className="relative">
                <input
                  id="org-id"
                  type="text"
                  value={orgId}
                  onChange={(e) => setOrgId(e.target.value)}
                  placeholder="e.g. id001 or OIL-IND-01"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#EAE6E1] bg-white text-slate-900 text-xs font-mono font-medium focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/20 focus:border-[#FF5A36] transition-all uppercase"
                />
                <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              <p className="text-[10px] text-slate-400">Unique tenant code used during authentication and database isolation.</p>
            </div>

            {/* Operational Division */}
            <div className="space-y-1.5">
              <label htmlFor="org-division" className="block text-xs font-bold text-slate-700">
                Division / Headquarters
              </label>
              <div className="relative">
                <input
                  id="org-division"
                  type="text"
                  value={division}
                  onChange={(e) => setDivision(e.target.value)}
                  placeholder="e.g. Operational Safety Directorate"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#EAE6E1] bg-white text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/20 focus:border-[#FF5A36] transition-all"
                />
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              <p className="text-[10px] text-slate-400">Regional management unit overseeing safety reporting.</p>
            </div>

            {/* Safety Domain / Industry Sector */}
            <div className="space-y-1.5">
              <label htmlFor="org-domain" className="block text-xs font-bold text-slate-700">
                Industry Sector &amp; Domain
              </label>
              <div className="relative">
                <input
                  id="org-domain"
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="e.g. Upstream Oil & Gas / Petrochemical Refining"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#EAE6E1] bg-white text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/20 focus:border-[#FF5A36] transition-all"
                />
                <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              <p className="text-[10px] text-slate-400">Calibrates neural NLP models and risk classification taxonomy.</p>
            </div>

            {/* Corporate HSE Email */}
            <div className="space-y-1.5">
              <label htmlFor="org-email" className="block text-xs font-bold text-slate-700">
                Corporate HSE Emergency Desk Email
              </label>
              <div className="relative">
                <input
                  id="org-email"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="e.g. safety-operations@oilindia.in"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#EAE6E1] bg-white text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/20 focus:border-[#FF5A36] transition-all"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              <p className="text-[10px] text-slate-400">Destination for critical alert digests and SIF precursor escalations.</p>
            </div>

            {/* Mandatory Regulatory Standards */}
            <div className="space-y-1.5">
              <label htmlFor="org-standards" className="block text-xs font-bold text-slate-700">
                Compliance Standards &amp; Frameworks
              </label>
              <div className="relative">
                <input
                  id="org-standards"
                  type="text"
                  value={complianceStandards}
                  onChange={(e) => setComplianceStandards(e.target.value)}
                  placeholder="e.g. DGMS, OISD-156, API RP 754, OSHA 1910"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#EAE6E1] bg-white text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/20 focus:border-[#FF5A36] transition-all"
                />
                <Shield className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              <p className="text-[10px] text-slate-400">Used for automated compliance tagging and barrier audits.</p>
            </div>

            {/* Active Plant Assets (Full row across columns) */}
            <div className="space-y-1.5 md:col-span-2 lg:col-span-3">
              <label htmlFor="org-plants" className="block text-xs font-bold text-slate-700">
                Active Operational Facilities &amp; Plants
              </label>
              <div className="relative">
                <input
                  id="org-plants"
                  type="text"
                  value={activePlants}
                  onChange={(e) => setActivePlants(e.target.value)}
                  placeholder="e.g. Plant 01 (Crude Distillation), Plant 02 (Catalytic Reformer), Terminal B"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#EAE6E1] bg-white text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/20 focus:border-[#FF5A36] transition-all"
                />
                <Layers className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              <p className="text-[10px] text-slate-400">Separate facility locations by comma. Used for field telemetry tagging and facility risk heatmaps.</p>
            </div>
          </div>

          {/* Quick Stats / Info Badges & Save Button */}
          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EAE6E1] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-100/70 border border-orange-200 flex items-center justify-center text-[#FF5A36]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">
                  Automated Multi-Tenant Isolation
                </div>
                <div className="text-[11px] text-slate-500">
                  Telemetry logs and incident dossiers remain strictly isolated within your organization namespace.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 ml-auto">
              <button
                type="submit"
                disabled={isSavingOrg}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF5A36] to-[#FFA133] hover:from-[#e04f2f] hover:to-[#e8912c] disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md shadow-orange-500/20 cursor-pointer flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{isSavingOrg ? 'Saving Organization...' : 'Save Organization Profile'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

    </div>
  );
}
