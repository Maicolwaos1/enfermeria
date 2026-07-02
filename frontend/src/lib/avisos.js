// Avisos flotantes de la app (éxito, error, información).
// Las páginas llaman a estas funciones y no a la librería directamente:
// si algún día se cambia de librería de notificaciones, solo se toca aquí.
import { notifications } from '@mantine/notifications';

export function exito(mensaje) {
  notifications.show({ message: mensaje, color: 'azul' });
}

export function error(mensaje) {
  notifications.show({ message: mensaje, color: 'red' });
}

export function aviso(mensaje) {
  notifications.show({ message: mensaje, color: 'yellow' });
}
