# 🛠️ GUIDE ADMIN PANEL - CRUD Complet

**Statut:** ✅ **COMPLET ET FONCTIONNEL**

---

## 📋 FONCTIONNALITÉS IMPLÉMENTÉES

### ✅ CRUD Projets
- ✅ Créer un nouveau projet
- ✅ Modifier un projet existant
- ✅ Supprimer un projet
- ✅ Toggle visibilité (visible/caché)
- ✅ Toggle featured (projet à la une)
- ✅ Champs gérés:
  - Titre FR/EN
  - Statut (concept/en cours/livré)
  - Description FR/EN
  - Stack technique
  - Lien live
  - Ordre d'affichage

### ✅ CRUD Témoignages
- ✅ Créer un nouveau témoignage
- ✅ Modifier un témoignage
- ✅ Supprimer un témoignage
- ✅ Toggle visibilité
- ✅ Champs gérés:
  - Nom
  - Rôle/Poste
  - Entreprise
  - Contenu FR/EN
  - URL photo
  - URL vidéo
  - Ordre d'affichage

### ✅ Messages Contact
- ✅ Voir tous les messages reçus
- ✅ Lire les détails d'un message
- ✅ Marquer comme lu/non lu
- ✅ Supprimer un message
- ✅ Répondre via email (lien mailto)

### ✅ Contenu Dynamique
- ✅ Éditer les textes du site sans code
- ✅ Champs gérés:
  - Badge Hero
  - Tagline Hero
  - URL GROW TECH
  - Badge CTA GROW TECH
  - Placeholder témoignages
  - WhatsApp
  - GitHub
  - LinkedIn
  - URL CV

---

## 🚀 UTILISATION

### 1. Accéder à l'admin

**URL:** `https://votre-site.netlify.app/#/admin`

**Login:**
- Email: (celui configuré dans Supabase)
- Mot de passe: (celui configuré dans Supabase)

### 2. Dashboard

Le dashboard affiche:
- Statistiques (nombre de projets, témoignages, messages)
- Accès rapide aux différentes sections

### 3. Gestion des Projets

**Accès:** `/admin/projects`

**Actions:**
1. Cliquez sur "Nouveau projet" pour créer
2. Remplissez le formulaire (FR/EN)
3. Cliquez sur "Créer"
4. Pour modifier: cliquez sur ✏️
5. Pour supprimer: cliquez sur 🗑
6. Pour cacher: cliquez sur 👁/🙈
7. Pour featured: cliquez sur ⭐

**Champs obligatoires:**
- Titre FR
- Titre EN
- Description FR
- Description EN

**Champs optionnels:**
- Stack (séparée par des virgules)
- Lien live
- Ordre (par défaut: 0)

### 4. Gestion des Témoignages

**Accès:** `/admin/testimonials`

**Actions:**
1. Cliquez sur "Nouveau témoignage"
2. Remplissez le formulaire
3. Cliquez sur "Créer"
4. Pour modifier: cliquez sur ✏️
5. Pour supprimer: cliquez sur 🗑

### 5. Gestion des Messages

**Accès:** `/admin/messages`

**Fonctionnalités:**
- Liste des messages à gauche
- Détails du message sélectionné à droite
- Messages non lus mis en évidence
- Bouton "Répondre" ouvre le client email

### 6. Gestion du Contenu

**Accès:** `/admin/content`

**Champs modifiables:**
- **Hero Badge:** Texte du badge de disponibilité
- **Hero Tagline:** Sous-titre principal
- **GROW TECH URL:** Lien vers le site de l'agence
- **GROW TECH CTA Badge:** Texte "Bientôt disponible"
- **Testimonials Placeholder:** Texte quand pas de témoignages
- **WhatsApp:** Numéro de téléphone
- **GitHub:** URL du profil
- **LinkedIn:** URL du profil
- **CV URL:** Lien vers le PDF du CV

---

## 📊 STRUCTURE BASE DE DONNÉES

### Table: projects

```sql
CREATE TABLE projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title_fr TEXT NOT NULL,
  title_en TEXT NOT NULL,
  status TEXT CHECK (status IN ('delivered', 'in_progress', 'concept')) NOT NULL,
  description_fr TEXT,
  description_en TEXT,
  stack TEXT[],
  live_url TEXT,
  display_order INT DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Table: testimonials

```sql
CREATE TABLE testimonials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  person_name TEXT NOT NULL,
  person_role TEXT,
  company TEXT,
  content_fr TEXT,
  content_en TEXT,
  photo_url TEXT,
  video_url TEXT,
  is_visible BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Table: messages

```sql
CREATE TABLE messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Table: site_config

```sql
CREATE TABLE site_config (
  key TEXT PRIMARY KEY,
  value_fr TEXT,
  value_en TEXT,
  value_generic TEXT
);
```

---

## 🔧 CONFIGURATION SUPABASE

### 1. Créer un projet Supabase

1. Allez sur https://supabase.com/dashboard
2. Créez un nouveau projet
3. Notez:
   - Project URL
   - Anon Key (dans Settings > API)

### 2. Créer les tables

Exécutez le SQL dans l'éditeur SQL de Supabase (voir section "Structure Base de Données" ci-dessus)

### 3. Activer RLS

```sql
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
```

### 4. Créer les policies

```sql
-- Public read access
CREATE POLICY "Public can view projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public can view testimonials" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Public can view site_config" ON site_config FOR SELECT USING (true);

-- Public can insert messages
CREATE POLICY "Public can insert messages" ON messages FOR INSERT WITH CHECK (true);

-- Authenticated can manage everything
CREATE POLICY "Authenticated can manage projects" ON projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can manage testimonials" ON testimonials FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can manage messages" ON messages FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can manage site_config" ON site_config FOR ALL USING (auth.role() = 'authenticated');
```

### 5. Créer un utilisateur admin

1. Allez dans Authentication > Users
2. Cliquez sur "Add user" > "Create new user"
3. Entrez:
   - Email: votre email
   - Password: un mot de passe fort
4. Ce compte sera utilisé pour l'admin panel

---

## 🔐 SÉCURITÉ

### Authentification
- Supabase Auth (email + mot de passe)
- Session persistante
- Auto-refresh token
- Redirect automatique si non authentifié

### Row Level Security (RLS)
- Activé sur toutes les tables
- Public: lecture seule (sauf messages)
- Authenticated: CRUD complet

### Variables d'environnement
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**IMPORTANT:** Ne jamais committer `.env` dans Git !

---

## 📱 NAVIGATION ADMIN

```
/admin/login              → Page de connexion
/admin/dashboard          → Tableau de bord (accueil)
/admin/projects           → CRUD projets
/admin/testimonials       → CRUD témoignages
/admin/messages           → Messages contact
/admin/content            → Contenu dynamique
```

---

## 🎨 UI/UX ADMIN

### Layout
- Sidebar navigation (réductible)
- Header avec logout
- Contenu principal avec routes

### Composants
- `AdminLayout` : Wrapper avec sidebar + header
- `AdminProjects` : CRUD projets
- `AdminTestimonials` : CRUD témoignages
- `AdminMessages` : Liste + détails messages
- `AdminContent` : Éditeur de contenu

### Styles
- Glassmorphism (cohérent avec le portfolio)
- Couleurs: cyan accent, dark bg
- Responsive (sidebar rétractable)

---

## 🐛 DÉPANNAGE

### Problème: "Invalid credentials"
**Solution:** Vérifiez email/mot de passe dans Supabase Authentication

### Problème: "Permission denied"
**Solution:** Vérifiez les RLS policies dans Supabase

### Problème: Données non affichées
**Solution:** Vérifiez les variables d'environnement VITE_SUPABASE_*

### Problème: Build échoue
**Solution:** 
```bash
npm install
npm run build
```

---

## 📈 PROCHAINES ÉTAPES

### À implémenter (optionnel)
- [ ] Upload d'images (Supabase Storage)
- [ ] Pagination des messages
- [ ] Export des données (CSV)
- [ ] Notifications email nouveaux messages
- [ ] Dashboard avec graphiques
- [ ] Backup automatique

---

## ✅ CHECKLIST DÉPLOIEMENT

- [ ] Supabase projet créé
- [ ] Tables créées (SQL exécuté)
- [ ] RLS activé
- [ ] Policies créées
- [ ] User admin créé
- [ ] Variables d'environnement configurées sur Netlify
- [ ] Test connexion admin
- [ ] Test CRUD projets
- [ ] Test CRUD témoignages
- [ ] Test contenu dynamique
- [ ] Test formulaire contact + messages

---

**Statut:** ✅ **PRÊT PRODUCTION**

**Temps implémentation:** ~4 heures

**Valeur ajoutée:** 
- Gestion contenu sans code
- Maintenance facilitée
- Produit professionnel

---

*Document créé par Senior Frontend Developer IA*  
*Date: 2025*
