// Tweaks panel for EDU ONEQ landing
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "mood": "premium-light",
  "accent": "blue",
  "hero": "split",
  "showOrbs": true,
  "denseSpacing": false
}/*EDITMODE-END*/;

const moodPalettes = {
  'premium-light': {
    '--paper': '#FFFFFF',
    '--ink-0': '#07091A',
    '--ink-10': '#F6F8FC',
    '--ink-9': '#EEF1F8',
    '--brand-wash': '#EEF3FE'
  },
  'dark-tech': {
    '--paper': '#07091A',
    '--ink-0': '#FFFFFF',
    '--ink-1': '#E0E4F0',
    '--ink-2': '#C4CADF',
    '--ink-3': '#9AA3C2',
    '--ink-4': '#9AA3C2',
    '--ink-5': '#6F7AA0',
    '--ink-7': '#4A5784',
    '--ink-8': '#2D3A66',
    '--ink-9': '#1B2447',
    '--ink-10': '#0E1430',
    '--brand-wash': 'rgba(43, 82, 214, 0.14)'
  },
  'editorial': {
    '--paper': '#FBFAF7',
    '--ink-0': '#0A0A0A',
    '--ink-10': '#F0EEE8',
    '--ink-9': '#E5E2D9',
    '--brand-wash': '#FFF4DE'
  }
};

const accentPalettes = {
  'blue':   { '--brand-deep': '#1A37A8', '--brand': '#2B52D6', '--brand-mid': '#4373E5', '--brand-light': '#6B96F0', '--brand-soft': '#B9CCF7' },
  'indigo': { '--brand-deep': '#312E81', '--brand': '#4F46E5', '--brand-mid': '#6366F1', '--brand-light': '#818CF8', '--brand-soft': '#C7D2FE' },
  'teal':   { '--brand-deep': '#0F766E', '--brand': '#14B8A6', '--brand-mid': '#2DD4BF', '--brand-light': '#5EEAD4', '--brand-soft': '#99F6E4' }
};

// keys we set inline on :root so we can clear them when switching moods
const ALL_MOOD_KEYS = Array.from(new Set(
  Object.values(moodPalettes).flatMap(o => Object.keys(o))
));

function applyTweaks(t) {
  const root = document.documentElement;
  const body = document.body;

  // 1) clear any previously inline-set mood vars so the active mood's
  //    stylesheet (.mood-dark { ... } / :root defaults) wins cleanly
  ALL_MOOD_KEYS.forEach(k => root.style.removeProperty(k));

  // 2) toggle mood classes on BOTH html and body (CSS targets either)
  const isDark = t.mood === 'dark-tech';
  const isEditorial = t.mood === 'editorial';
  root.classList.toggle('mood-dark', isDark);
  root.classList.toggle('mood-editorial', isEditorial);
  root.classList.toggle('mood-light', !isDark && !isEditorial);
  body.classList.toggle('mood-dark', isDark);
  body.classList.toggle('mood-editorial', isEditorial);
  body.classList.toggle('mood-light', !isDark && !isEditorial);

  // 3) for dark mood, the .mood-dark stylesheet defines the full palette
  //    in CSS — DO NOT overwrite it with inline navy vars. Only apply
  //    inline mood vars for light/editorial.
  if (!isDark) {
    const mood = moodPalettes[t.mood] || moodPalettes['premium-light'];
    Object.entries(mood).forEach(([k, v]) => root.style.setProperty(k, v));
  }

  // 4) accent applies to all moods
  const acc = accentPalettes[t.accent] || accentPalettes['blue'];
  Object.entries(acc).forEach(([k, v]) => root.style.setProperty(k, v));

  body.classList.toggle('hide-orbs', !t.showOrbs);
  body.classList.toggle('dense', !!t.denseSpacing);
}

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  React.useEffect(() => { applyTweaks(tweaks); }, [tweaks]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection title="Mood">
        <TweakRadio
          label="Theme"
          value={tweaks.mood}
          onChange={v => setTweak('mood', v)}
          options={[
            { value: 'premium-light', label: 'Light' },
            { value: 'dark-tech', label: 'Dark' },
            { value: 'editorial', label: 'Editorial' }
          ]}
        />
        <TweakColor
          label="Accent"
          value={tweaks.accent}
          onChange={v => setTweak('accent', v)}
          options={[
            { value: 'blue', label: 'EDU Blue', color: '#2B52D6' },
            { value: 'indigo', label: 'Indigo', color: '#4F46E5' },
            { value: 'teal', label: 'Teal', color: '#14B8A6' }
          ]}
        />
      </TweakSection>

      <TweakSection title="Layout">
        <TweakToggle
          label="Hero glow orbs"
          value={tweaks.showOrbs}
          onChange={v => setTweak('showOrbs', v)}
        />
        <TweakToggle
          label="Dense spacing"
          value={tweaks.denseSpacing}
          onChange={v => setTweak('denseSpacing', v)}
        />
      </TweakSection>
    </TweaksPanel>
  );
}

const tweaksRoot = document.createElement('div');
document.body.appendChild(tweaksRoot);
ReactDOM.createRoot(tweaksRoot).render(<App />);

// Apply default on load (so initial CSS reflects current tweaks)
applyTweaks(TWEAK_DEFAULTS);
