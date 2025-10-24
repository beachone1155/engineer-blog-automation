/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'inherit',
            a: {
              color: '#3b82f6',
              textDecoration: 'underline',
              fontWeight: '500',
            },
            strong: {
              color: 'inherit',
              fontWeight: '600',
            },
            'h1, h2, h3, h4, h5, h6': {
              color: 'inherit',
              fontWeight: '600',
            },
            code: {
              color: 'inherit',
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              padding: '0.125rem 0.25rem',
              borderRadius: '0.25rem',
              fontSize: '0.875em',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            pre: {
              backgroundColor: '#1e293b',
              color: '#e2e8f0',
            },
            'pre code': {
              backgroundColor: 'transparent',
              color: 'inherit',
              padding: 0,
            },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
