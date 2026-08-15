import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Charge next.config.mjs et .env pour l'environnement de test.
  dir: './',
});

const config: Config = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.tsx'],

  // Les tests sont colocalisés : PropertyCard.test.tsx vit à côté de PropertyCard.tsx.
  // Ce motif les ramasse où qu'ils soient dans src/.
  testMatch: ['<rootDir>/src/**/*.test.{ts,tsx}'],

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/*.d.ts',
  ],
};

export default createJestConfig(config);
