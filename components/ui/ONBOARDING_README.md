# Composant OnboardingTour

## Description

Le composant `OnboardingTour` fournit un guide interactif pour les nouveaux utilisateurs de l'application CACRS. Il utilise le hook `useOnboarding` pour gérer l'état et la progression du tour guidé.

## Fonctionnalités

- **Démarrage automatique** : Le tour se lance automatiquement pour les nouveaux utilisateurs lors de leur première connexion
- **Spotlight dynamique** : Met en évidence les éléments de l'interface avec un effet spotlight
- **Navigation intuitive** : Boutons Précédent/Suivant pour naviguer entre les étapes
- **Barre de progression** : Affiche visuellement l'avancement dans le tour
- **Persistance** : Se souvient si l'utilisateur a déjà complété le tour (localStorage)
- **Bouton flottant** : Permet de relancer le tour à tout moment

## Architecture

### Hook useOnboarding

Le hook `useOnboarding` gère toute la logique d'état :

```typescript
const {
  isActive,        // Le tour est-il actif ?
  currentStep,     // Étape actuelle du tour
  currentStepIndex,// Index de l'étape actuelle
  totalSteps,      // Nombre total d'étapes
  progress,        // Pourcentage de progression
  isCompleted,     // Le tour a-t-il été complété ?
  startTour,       // Démarrer le tour
  nextStep,        // Passer à l'étape suivante
  previousStep,    // Retourner à l'étape précédente
  skipTour,        // Passer le tour
  completeTour,    // Terminer le tour
  resetTour,       // Réinitialiser le tour
} = useOnboarding();
```

### Étapes du tour

Les étapes sont définies dans `hooks/useOnboarding.tsx` :

1. **Tableau de bord** : Vue d'ensemble des statistiques
2. **Gestion des affaires** : Création et suivi des dossiers
3. **Listes de surveillance** : Configuration de la veille
4. **Assistant IA** : Utilisation du chat intelligent
5. **Profil utilisateur** : Paramètres et déconnexion

## Intégration

### 1. Provider dans App.tsx

```tsx
<OnboardingProvider>
  <HashRouter>
    {/* Routes */}
  </HashRouter>
</OnboardingProvider>
```

### 2. Attributs data-tour

Chaque élément de l'interface doit avoir un attribut `data-tour` correspondant :

```tsx
<NavLink to="/dashboard" data-tour="dashboard">
  Tableau de bord
</NavLink>
```

### 3. Utilisation du contexte

```tsx
import { useOnboardingContext } from '../../App';

const { startTour, isCompleted } = useOnboardingContext();
```

## Personnalisation

### Ajouter une étape

Dans `hooks/useOnboarding.tsx`, ajoutez une nouvelle étape :

```typescript
{
  id: 'mon-etape',
  title: 'Titre de l\'étape',
  description: 'Description de l\'étape',
  target: '[data-tour="mon-element"]',
  placement: 'bottom',
  spotlightPadding: 8,
}
```

### Modifier le style

Le composant utilise Tailwind CSS. Les classes peuvent être modifiées dans `components/ui/OnboardingTour.tsx`.

## Bouton flottant

Le bouton `OnboardingButton` permet de relancer le tour :

- Apparaît en bas à droite de l'écran
- Se cache automatiquement quand le tour est actif
- Icône d'aide (point d'interrogation)

## Tests

Pour tester le composant :

1. **Première visite** : Effacez le localStorage et rechargez la page
2. **Tour manuel** : Cliquez sur le bouton flottant en bas à droite
3. **Réinitialisation** : Utilisez `resetTour()` dans la console du navigateur

```javascript
// Dans la console du navigateur
localStorage.removeItem('onboarding_completed');
location.reload();
```

## Accessibilité

- Navigation au clavier supportée
- Labels ARIA sur les boutons
- Contraste des couleurs optimisé
- Scroll automatique vers les éléments ciblés

## Performance

- Utilisation de `useCallback` pour éviter les re-renders
- Debouncing sur le repositionnement lors du scroll/resize
- Transitions CSS pour des animations fluides

## État dans localStorage

Clé : `onboarding_completed`
- `"true"` : Tour complété
- Absent : Tour non complété (s'affichera automatiquement)
