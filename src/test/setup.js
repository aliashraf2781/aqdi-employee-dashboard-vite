import '@testing-library/jest-dom/vitest';

// jsdom does not load tokens.css, so provide the few tokens that code reads at runtime.
const TEST_TOKENS = {
  success: '16 185 129',
  foreground: '66 66 66',
  primary: '12 96 85',
  'primary-foreground': '255 255 255',
};
Object.entries(TEST_TOKENS).forEach(([name, channels]) => {
  document.documentElement.style.setProperty(`--color-${name}`, channels);
});
