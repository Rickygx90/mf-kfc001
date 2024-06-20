export function formatearHoraAFecha(hora: string = ''): Date {
  if (hora === '') return new Date();
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const day = now.getDate();
  const [hour, minutes] = hora.split(':').map(Number);
  const dateWithTime = new Date(year, month, day, hour, minutes);
  return dateWithTime;
}

export function dateIsNotNull(time: any): Date {
  if (!time) {
    return (time = new Date());
  }
  return time;
}

function addZero(value: number): string {
  if (value <= 9) {
    return '0' + value.toString();
  }
  return value.toString();
}

export function formatearFechaAHora(hora: Date = new Date()): string {
  return (
    addZero(hora.getHours()) +
    ':' +
    addZero(hora.getMinutes()) +
    ':' +
    addZero(hora.getSeconds())
  );
}

export function validateResponse(response: any) {
  switch (response.status) {
    case 200: {
      return {
        severity: 'success',
        summary: 'Exito',
        detail: 'La solicitud se proceso correctamente',
      };
    }
    case 500: {
      return {
        severity: 'error',
        summary: 'Error',
        detail: 'Error de servidor',
      };
    }
    case 401: {
      return {
        severity: 'error',
        summary: 'Error',
        detail: 'Error de autenticación',
      };
    }
    default: {
      return {
        severity: 'success',
        summary: 'Exito',
        detail: 'La solicitud se proceso correctamente',
      };
    }
  }
}
