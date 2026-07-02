import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

// Estilos de Mantine (el orden importa: core primero)
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';

// Fechas en español (date picker, calendarios)
import 'dayjs/locale/es';

import './index.css';
import { tema } from './theme';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MantineProvider theme={tema}>
      <Notifications position="top-center" autoClose={3000} />
      <App />
    </MantineProvider>
  </StrictMode>,
);
