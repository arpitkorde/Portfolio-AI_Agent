import React, { useEffect } from 'react';
import { THEME } from '../constants';

// Fallback theme
const DEFAULT_THEME = {
    primary: '#0f172a',
    secondary: '#1e293b',
    accent: '#06b6d4',
    vibe: 'Modern Corporate'
};

interface Theme {
    primary: string;
    secondary: string;
    accent: string;
    vibe?: string;
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    useEffect(() => {
        // Determine theme from constants (which comes from profile.json)
        // We need to ensure we exporting this new field in constants.ts
        // For now, we'll assume it might be there, or fallback.

        // Check if window.profileData has theme (in case inserted by script directly) 
        // or if we import it. Since constants.ts does `import profileData from '../data/profile.json'`,
        // we should access it there.

        // Let's assume we pass the theme as a prop or read from a global config.
        // For this implementation, we will update constants.ts to export `THEME`.

        // Ideally, we'd import { THEME } from '../constants', but let's see how constants.ts is structured.
        // I'll update constants.ts next to export the theme.

        // Temporary logic to read from imported data (simulated):
        const themeToApply = (THEME as any) || DEFAULT_THEME;

        const root = document.documentElement;
        root.style.setProperty('--color-primary', themeToApply.primary);
        root.style.setProperty('--color-secondary', themeToApply.secondary);
        root.style.setProperty('--color-accent', themeToApply.accent);

        // Calculate a hover variant if not provided (simple brightness adjust or just use same)
        // For now, let's just use the accent color or a hardcoded shift if we can't manipulation hex easily without a lib.
        // Simpler: just set the same or let the CSS var be overridden if provided.

        // Actually, let's try to parse the hex to darken/lighten slightly for hover
        // or just assume the AI provides it? 
        // The prompt asked for accent. Let's just use accent for hover for now 
        // or rely on the fact that Tailwind alpha modifiers work if we used RGB vars?
        // Tailwind + Hex vars is tricky for alpha. 
        // Let's just set accentHover to accent for now to be safe, or a fixed variation.
        // Calculate hover color (assuming accent is hex)
        // Simple logic: just use accent for now, or maybe opacity
        root.style.setProperty('--color-accent-hover', themeToApply.accent);

    }, []);

    return <>{children}</>;
};
