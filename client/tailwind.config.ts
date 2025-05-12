import type { Config } from 'tailwindcss';

const config: Config = {
    darkMode: ['class'],
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
        './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
    	extend: {
    		fontFamily: {
    			poppins: [
    				'var(--font-poppins)'
    			]
    		},
    		borderColor: {
    			light: '#EAECF0'
    		},
    		colors: {
    			background: 'hsl(var(--background))',
    			foreground: 'hsl(var(--foreground))',
    			primaryColor: {
    				DEFAULT: '#576F72'
    			},
    			secondaryColor: {
    				DEFAULT: '#344054'
    			},
    			tertiaryColor: {
    				DEFAULT: '#475467'
    			},
    			card: {
    				DEFAULT: 'hsl(var(--card))',
    				foreground: 'hsl(var(--card-foreground))'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover))',
    				foreground: 'hsl(var(--popover-foreground))'
    			},
    			primary: {
    				DEFAULT: 'hsl(var(--primary))',
    				foreground: 'hsl(var(--primary-foreground))'
    			},
    			secondary: {
    				DEFAULT: 'hsl(var(--secondary))',
    				foreground: 'hsl(var(--secondary-foreground))'
    			},
    			muted: {
    				DEFAULT: 'hsl(var(--muted))',
    				foreground: 'hsl(var(--muted-foreground))'
    			},
    			accent: {
    				DEFAULT: 'hsl(var(--accent))',
    				foreground: 'hsl(var(--accent-foreground))'
    			},
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive))',
    				foreground: 'hsl(var(--destructive-foreground))'
    			},
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			chart: {
    				'1': 'hsl(var(--chart-1))',
    				'2': 'hsl(var(--chart-2))',
    				'3': 'hsl(var(--chart-3))',
    				'4': 'hsl(var(--chart-4))',
    				'5': 'hsl(var(--chart-5))'
    			}
    		},
    		fontSize: {
    			primarySize: [
    				'.8rem',
    				{
    					lineHeight: '1.5rem',
    					fontWeight: '400'
    				}
    			],
    			mediumSize: [
    				'1.2875rem',
    				{
    					lineHeight: '1.75rem',
    					fontWeight: '400'
    				}
    			],
				bigSize: [
    				'1.9rem',
    				{
    					lineHeight: '1.75rem',
    					fontWeight: '400'
    				}
    			],
    			secondarySize: [
    				'0.75rem',
    				{
    					lineHeight: '1.125rem',
    					fontWeight: '400'
    				}
    			],
    			tertiarySize: [
    				'0.625rem',
    				{
    					lineHeight: '0.875rem',
    					fontWeight: '400'
    				}
    			]
    		},
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		}
    	}
    },
    plugins: [require("tailwindcss-animate")],
};
export default config;
