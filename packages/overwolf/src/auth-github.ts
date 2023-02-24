// The login window location is set to the login page to support oAuth redirect
window.location.replace(
  (import.meta.env.VITE_APP_WEB || 'https://www.hogwarts.gg') +
    '/overwolf/auth/github',
);
