import { useEffect, useState, useRef } from 'react'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { User, Lock, LogOut, Save, Mail, MapPin, Building2, Globe, Phone, Calendar, Shield, Camera } from 'lucide-react'
import { motion } from 'framer-motion'
import { SubscriptionCard } from '@/components/subscription/subscription-card'

interface ProfileData {
  full_name: string
  phone: string
  company: string
  website: string
  location: string
  bio: string
  avatar_url: string
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.06, ease: [0.33, 1, 0.68, 1] as const },
  }),
}

function FormField({ label, icon: Icon, children }: { label: string; icon: typeof User; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </Label>
      {children}
    </div>
  )
}

export default function SettingsPage() {
  const { user, signOut } = useAuth()
  const [loading, setLoading] = useState(false)
  const [profileLoading, setProfileLoading] = useState(true)
  const [profileSaving, setProfileSaving] = useState(false)
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [profile, setProfile] = useState<ProfileData>({
    full_name: '',
    phone: '',
    company: '',
    website: '',
    location: '',
    bio: '',
    avatar_url: '',
  })

  useEffect(() => {
    if (!user) return

    const fetchProfile = async () => {
      setProfileLoading(true)
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, phone, company, website, location, bio, avatar_url')
        .eq('id', user.id)
        .maybeSingle()

      if (error) {
        toast.error('Nepodařilo se načíst profil')
      } else if (data) {
        setProfile({
          full_name: data.full_name || '',
          phone: data.phone || '',
          company: data.company || '',
          website: data.website || '',
          location: data.location || '',
          bio: data.bio || '',
          avatar_url: data.avatar_url || '',
        })
      }
      setProfileLoading(false)
    }

    fetchProfile()
  }, [user])

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    if (!file.type.startsWith('image/')) {
      toast.error('Vyberte prosim obrazek')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Obrazek musi byt mensi nez 2MB')
      return
    }

    setAvatarUploading(true)

    try {
      const ext = file.name.split('.').pop()
      const filePath = `${user.id}/avatar.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      const avatarUrl = `${urlData.publicUrl}?t=${Date.now()}`

      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({ id: user.id, email: user.email || '', avatar_url: avatarUrl, updated_at: new Date().toISOString() }, { onConflict: 'id' })

      if (updateError) throw updateError

      setProfile((prev) => ({ ...prev, avatar_url: avatarUrl }))
      toast.success('Profilovy obrazek aktualizovan!')
    } catch (err: any) {
      toast.error(err.message || 'Nepodarilo se nahrat obrazek')
    } finally {
      setAvatarUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setProfileSaving(true)

    const profilePayload = {
      id: user.id,
      email: user.email || '',
      full_name: profile.full_name,
      phone: profile.phone,
      company: profile.company,
      website: profile.website,
      location: profile.location,
      bio: profile.bio,
      avatar_url: profile.avatar_url,
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase
      .from('profiles')
      .upsert(profilePayload, { onConflict: 'id' })

    if (error) {
      toast.error('Nepodařilo se uložit profil')
    } else {
      await supabase.auth.updateUser({
        data: { full_name: profile.full_name },
      })
      toast.success('Profil byl úspěšně uložen!')
    }
    setProfileSaving(false)
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast.error('Hesla se neshodují')
      return
    }

    if (newPassword.length < 6) {
      toast.error('Heslo musí mít alespoň 6 znaků')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) throw error

      toast.success('Heslo bylo úspěšně aktualizováno!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error: any) {
      toast.error(error.message || 'Aktualizace hesla se nezdařila')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success('Úspěšně odhlášeno')
    } catch (error: any) {
      toast.error(error.message || 'Odhlášení se nezdařilo')
    }
  }

  const updateField = (field: keyof ProfileData, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
  }

  const initials = (profile.full_name || user?.email?.split('@')[0] || '?')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="hidden md:block"
      >
        <h1 className="text-2xl font-bold">Nastaveni</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Spravujte sve nastaveni uctu a preference
        </p>
      </motion.div>

      <Tabs defaultValue="profile" className="space-y-5">
        <TabsList>
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="subscription">Predplatne</TabsTrigger>
          <TabsTrigger value="security">Zabezpeceni</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-5">
          {profileLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
            </div>
          ) : (
            <form onSubmit={handleSaveProfile} className="space-y-5">
              <motion.div
                custom={0}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="rounded-2xl bg-white dark:bg-neutral-900 border border-border/40 p-5"
              >
                <div className="flex items-center gap-4">
                  <div className="relative group">
                    {profile.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt="Avatar"
                        className="w-16 h-16 rounded-2xl object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-blue-500 flex items-center justify-center text-white text-xl font-bold">
                        {initials}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={avatarUploading}
                      className="absolute inset-0 rounded-2xl bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                    >
                      {avatarUploading ? (
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      ) : (
                        <Camera className="h-5 w-5 text-white" />
                      )}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-base truncate">
                      {profile.full_name || user?.email?.split('@')[0]}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[11px] font-medium text-blue-500 hover:text-blue-600 mt-0.5 transition-colors"
                    >
                      Zmenit fotku
                    </button>
                  </div>
                </div>
              </motion.div>

              <motion.div
                custom={1}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="rounded-2xl bg-white dark:bg-neutral-900 border border-border/40 p-5 space-y-4"
              >
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Osobni udaje</p>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField label="Cele jmeno" icon={User}>
                    <Input
                      value={profile.full_name}
                      onChange={(e) => updateField('full_name', e.target.value)}
                      placeholder="Vase cele jmeno"
                      className="h-10"
                    />
                  </FormField>
                  <FormField label="Telefon" icon={Phone}>
                    <Input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      placeholder="+420 123 456 789"
                      className="h-10"
                    />
                  </FormField>
                  <FormField label="Firma / Organizace" icon={Building2}>
                    <Input
                      value={profile.company}
                      onChange={(e) => updateField('company', e.target.value)}
                      placeholder="Nazev firmy"
                      className="h-10"
                    />
                  </FormField>
                  <FormField label="Web" icon={Globe}>
                    <Input
                      type="url"
                      value={profile.website}
                      onChange={(e) => updateField('website', e.target.value)}
                      placeholder="https://vase-stranka.cz"
                      className="h-10"
                    />
                  </FormField>
                  <div className="sm:col-span-2">
                    <FormField label="Lokace" icon={MapPin}>
                      <Input
                        value={profile.location}
                        onChange={(e) => updateField('location', e.target.value)}
                        placeholder="Praha, Ceska republika"
                        className="h-10"
                      />
                    </FormField>
                  </div>
                  <div className="sm:col-span-2">
                    <FormField label="O mne" icon={User}>
                      <Textarea
                        value={profile.bio}
                        onChange={(e) => updateField('bio', e.target.value)}
                        placeholder="Kratce o sobe..."
                        rows={3}
                      />
                    </FormField>
                  </div>
                </div>
              </motion.div>

              <motion.div
                custom={2}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="rounded-2xl bg-white dark:bg-neutral-900 border border-border/40 p-5 space-y-4"
              >
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Informace o uctu</p>

                <FormField label="Email" icon={Mail}>
                  <div className="flex gap-2">
                    <Input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="h-10 flex-1"
                    />
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-500/10 px-2.5 rounded-lg">
                      <Shield className="h-3 w-3" />
                      Overeno
                    </span>
                  </div>
                </FormField>

                <FormField label="Ucet vytvoren" icon={Calendar}>
                  <Input
                    value={user?.created_at ? new Date(user.created_at).toLocaleDateString('cs-CZ', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }) : ''}
                    disabled
                    className="h-10"
                  />
                </FormField>
              </motion.div>

              <motion.div
                custom={3}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
              >
                <Button
                  type="submit"
                  disabled={profileSaving}
                  className="w-full h-11 rounded-xl font-semibold"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {profileSaving ? 'Ukladam...' : 'Ulozit profil'}
                </Button>
              </motion.div>
            </form>
          )}
        </TabsContent>

        <TabsContent value="subscription" className="space-y-5">
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="rounded-2xl bg-white dark:bg-neutral-900 border border-border/40 p-5"
          >
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-4">Informace o predplatnem</p>
            {user && <SubscriptionCard userId={user.id} />}
          </motion.div>
        </TabsContent>

        <TabsContent value="security" className="space-y-5">
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="rounded-2xl bg-white dark:bg-neutral-900 border border-border/40 p-5"
          >
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-4">Zmena hesla</p>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <FormField label="Soucasne heslo" icon={Lock}>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Zadejte soucasne heslo"
                  className="h-10"
                />
              </FormField>
              <FormField label="Nove heslo" icon={Lock}>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Zadejte nove heslo"
                  required
                  className="h-10"
                />
              </FormField>
              <FormField label="Potvrzeni noveho hesla" icon={Lock}>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Potvrd'te nove heslo"
                  required
                  className="h-10"
                />
              </FormField>
              <Button type="submit" disabled={loading} className="w-full h-11 rounded-xl font-semibold">
                <Lock className="mr-2 h-4 w-4" />
                {loading ? 'Aktualizuji...' : 'Aktualizovat heslo'}
              </Button>
            </form>
          </motion.div>

          <motion.div
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="rounded-2xl bg-white dark:bg-neutral-900 border border-border/40 p-5"
          >
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-4">Aktivni relace</p>
            <div className="flex items-center justify-between rounded-xl border border-border/40 p-3.5">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Aktualni relace</p>
                <p className="text-xs text-muted-foreground">Toto zarizeni - Aktivni nyni</p>
              </div>
              <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                Aktivni
              </span>
            </div>
          </motion.div>

          <Separator />

          <motion.div
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <Button
              variant="destructive"
              onClick={handleSignOut}
              className="w-full h-11 rounded-xl font-semibold"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Odhlasit se
            </Button>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
