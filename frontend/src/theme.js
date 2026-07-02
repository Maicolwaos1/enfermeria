// Tema de Mantine con la identidad del proyecto: azul #2563eb y Poppins.
// Los 10 tonos van de claro a oscuro; el índice 6 es el color primario.
import { createTheme } from '@mantine/core';

export const tema = createTheme({
  fontFamily: "'Poppins', Arial, sans-serif",
  headings: { fontFamily: "'Poppins', Arial, sans-serif", fontWeight: '600' },
  primaryColor: 'azul',
  primaryShade: 6,
  defaultRadius: 'md',
  colors: {
    azul: [
      '#eff6ff', // 0 - fondos suaves (antes --primary-light era dbeafe)
      '#dbeafe', // 1
      '#bfdbfe', // 2
      '#93c5fd', // 3
      '#60a5fa', // 4
      '#3b82f6', // 5
      '#2563eb', // 6 - primario (el azul de siempre)
      '#1d4ed8', // 7 - hover (antes --primary-dark)
      '#1e40af', // 8 - navbar (antes --primary-darker)
      '#1e3a8a', // 9
    ],
  },
});
