# Stane-Junior Portfolio

Portfolio professionnel pour Stane-Junior Aniambossou - Étudiant Développeur & Fondateur d'Agence GROW TECH.

## Stack Technique

- **Frontend**: React 18 + Vite
- **Styling**: TailwindCSS v4
- **Animations**: Framer Motion
- **Backend/DB**: Supabase (PostgreSQL)
- **Routing**: React Router v6 (Hash mode)
- **Particles**: @tsparticles/react
- **Déploiement**: Netlify

## Fonctionnalités

### Portfolio Public
- Design bilingue FR/EN avec switch instantané
- Curseur personnalisé avec effet de traînée
- Fond particules interactif
- Sections: Hero, À propos, Compétences, Projets, GROW TECH, Vision, Témoignages, Contact
- Animations au scroll avec Framer Motion
- Formulaire de contact connecté à Supabase
- Responsive mobile-first

### Admin Panel
- Authentification sécurisée via Supabase Auth
- Dashboard avec vue d'ensemble
- Gestion CRUD des projets
- Gestion CRUD des témoignages
- Édition du contenu dynamique
- Configuration des liens sociaux

## Installation Locale

### Prérequis
- Node.js 18+
- npm ou yarn
- Un compte Supabase

### Étapes

1. **Cloner le repository**
```bash
git clone <repository-url>
cd portfolio-stane
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**
```bash
cp .env.example .env
```

Editez `.env` avec vos clés Supabase:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

4. **Lancer le serveur de développement**
```bash
npm run dev
```

Le site sera disponible à `http://localhost:5173`

## Configuration Supabase

### 1. Créer un projet Supabase

1. Allez sur [Supabase Dashboard](https://supabase.com/dashboard)
2. Créez un nouveau projet
3. Notez votre project URL et anon key

### 2. Créer les tables

Exécutez ce SQL dans l'éditeur SQL de Supabase:

```sql
-- Table: projects
CREATE TABLE projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title_fr TEXT NOT NULL,
  title_en TEXT NOT NULL,
  status TEXT CHECK (status IN ('delivered', 'in_progress', 'concept')) NOT NULL,
  description_fr TEXT,
  description_en TEXT,
  stack TEXT[],
  live_url TEXT,
  case_study_fr JSONB,
  case_study_en JSONB,
  image_url TEXT,
  display_order INT DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table: testimonials
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

-- Table: messages
CREATE TABLE messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table: site_config
CREATE TABLE site_config (
  key TEXT PRIMARY KEY,
  value_fr TEXT,
  value_en TEXT,
  value_generic TEXT
);

-- Insert initial config
INSERT INTO site_config VALUES
  ('hero_badge', 'Disponible pour missions freelance', 'Available for freelance missions', NULL),
  ('hero_tagline', 'Je ne construis pas juste des sites web. Je code des solutions à des problèmes que j''ai observés, vécus, compris.', 'I don''t just build websites. I code solutions to problems I''ve observed, lived, and understood.', NULL),
  ('hero_stat_1_value', NULL, NULL, '5+'),
  ('hero_stat_1_label', 'Projets livrés', 'Delivered projects', NULL),
  ('hero_stat_2_value', NULL, NULL, '6'),
  ('hero_stat_2_label', 'Membres GROW TECH', 'GROW TECH members', NULL),
  ('hero_stat_3_value', NULL, NULL, '2'),
  ('hero_stat_3_label', 'Co-fondateurs', 'Co-founders', NULL),
  ('growtech_url', NULL, NULL, ''),
  ('growtech_cta_badge', 'Bientôt disponible', 'Coming soon', NULL),
  ('testimonials_placeholder', 'Les témoignages arrivent bientôt — les projets, eux, sont déjà là.', 'Testimonials coming soon — the projects are already there.', NULL),
  ('whatsapp', NULL, NULL, '+2290199218112'),
  ('github', NULL, NULL, 'https://github.com/Stane316/'),
  ('linkedin', NULL, NULL, 'https://www.linkedin.com/in/stane-aniambossou-2a412b3b8/'),
  ('is_available', NULL, NULL, 'true'),
  ('cv_url', NULL, NULL, '');

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

-- Policies: Public read access for projects, testimonials, site_config
CREATE POLICY "Public can view projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public can view testimonials" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Public can view site_config" ON site_config FOR SELECT USING (true);

-- Policy: Public can insert messages
CREATE POLICY "Public can insert messages" ON messages FOR INSERT WITH CHECK (true);

-- Policy: Only authenticated users can update/delete
CREATE POLICY "Authenticated can update projects" ON projects FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can delete projects" ON projects FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can update testimonials" ON testimonials FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can delete testimonials" ON testimonials FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can manage site_config" ON site_config FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can read messages" ON messages FOR SELECT USING (auth.role() = 'authenticated');
```

### 3. Créer un compte admin

1. Allez dans Authentication > Users dans Supabase
2. Cliquez sur "Add user" > "Create new user"
3. Entrez votre email et mot de passe
4. Ce compte sera utilisé pour accéder au panel admin

## Déploiement sur Netlify

### 1. Préparer le repository

Assurez-vous que `.env` est dans `.gitignore`:
```
.env
.env.local
node_modules/
dist/
```

### 2. Builder localement (optionnel)

```bash
npm run build
```

Vérifiez que la build fonctionne sans erreur.

### 3. Déployer sur Netlify

**Option A: Via l'interface Netlify**

1. Connectez-vous à [Netlify](https://app.netlify.com)
2. Cliquez sur "Add new site" > "Import an existing project"
3. Connectez votre repository Git
4. Configurez les variables d'environnement:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Les settings de build sont déjà dans `netlify.toml`
6. Cliquez sur "Deploy site"

**Option B: Via Netlify CLI**

```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

### 4. Configurer le domaine

1. Dans Netlify, allez dans "Domain settings"
2. Ajoutez votre domaine personnalisé
3. Configurez les DNS selon les instructions

## Structure des fichiers

```
portfolio-stane/
├── src/
│   ├── main.tsx                 # Entry point
│   ├── App.tsx                  # Router + Contexts
│   ├── index.css                # Global styles + Design system
│   ├── contexts/
│   │   └── LanguageContext.tsx  # FR/EN bilingual support
│   ├── lib/
│   │   ├── supabase.ts          # Supabase client
│   │   └── i18n.ts              # Translations
│   ├── routes/
│   │   ├── Portfolio.tsx        # Main portfolio page
│   │   └── Admin.tsx            # Admin panel routes
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── CustomCursor.tsx
│   │   ├── sections/
│   │   │   ├── Hero.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Skills.tsx
│   │   │   ├── Projects.tsx
│   │   │   ├── GrowTech.tsx
│   │   │   ├── Vision.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   └── Contact.tsx
│   │   └── ui/
│   │       └── ParticlesBackground.tsx
│   └── admin/                   # Admin components (optional)
├── public/
│   └── images/                  # Static assets
├── .env.example                 # Environment template
├── netlify.toml                 # Netlify config
├── vite.config.ts               # Vite config
├── tailwind.config.js           # Tailwind config
└── README.md
```

## Personnalisation

### Changer les couleurs

Editez les variables CSS dans `src/index.css`:

```css
:root {
  --bg-primary: #0A0A1E;
  --accent-cyan: #00BFFF;
  --accent-blue: #1A6FC4;
  /* ... */
}
```

### Ajouter un photo

Placez votre photo dans `public/images/` et mettez à jour le chemin dans les composants.

### Modifier les traductions

Editez `src/lib/i18n.ts` pour ajouter ou modifier les traductions FR/EN.

## Scripts disponibles

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## License

© 2025 Stane-Junior Aniambossou. Tous droits réservés.

## Contact

- **WhatsApp**: +229 01 99 21 81 12
- **GitHub**: https://github.com/Stane316/
- **LinkedIn**: https://www.linkedin.com/in/stane-aniambossou-2a412b3b8/
- **Agence**: GROW TECH - Votre Vision, Notre Technologie.
