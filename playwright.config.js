/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
	webServer: {
		command: 'npm run dev',
		port: 3000,
		reuseExistingServer: true,
	},
	testDir: 'tests',
	testIgnore: 'tests/**/.assets/**',
	testMatch: /(.+\.)?(test|spec)\.[jt]s/,
	timeout: 10000,
	use: {
		screenshot: 'only-on-failure',
		trace: 'retain-on-failure',
	},
	projects: [
		{
			name: 'logged in as admin',
			testDir: 'tests/admin',
			use: {
				storageState: 'tests/.auth/admin.json',
			}
		},
		{
			name: 'logged in',
			testDir: 'tests/logged in',
			use: {
				storageState: 'tests/.auth/user.json',
			}
		},
		{
			name: 'logged off',
			testIgnore: ['tests/logged in/**', 'tests/admin/**'],
		},
	]
};

export default config;
