# QR Validator

Aplicación web para validar códigos QR contra un archivo Excel. Ideal para control de acceso, eventos, listas de invitados, y más.

## Características

- Carga archivos Excel (.xlsx, .xls)
- Busca el contenido del QR en **TODAS las celdas** del Excel
- Escaneo de QR en tiempo real desde la cámara
- Validación instantánea: APROBADO / NO APROBADO
- 100% privado: todo funciona en el navegador
- Responsive: funciona en móvil y escritorio
- Sin backend necesario

## Uso Local

1. Clona el repositorio
```bash
git clone https://github.com/tu-usuario/qr-validator.git
cd qr-validator
```

2. Abre el archivo directamente o usa un servidor local
```bash
npx serve .
```

3. Abre en tu navegador: `http://localhost:3000`

## Cómo Usar

1. **Cargar Excel**: Haz clic en "Seleccionar Archivo" y carga tu Excel
2. **Iniciar Escaneo**: Presiona "Iniciar Escaneo" para activar la cámara
3. **Escanear QR**: Apunta la cámara al código QR
4. **Ver Resultado**: La app mostrará APROBADO o NO APROBADO

## Requisitos del Excel

- Formato: `.xlsx` o `.xls`
- **NO importa la estructura**: la app busca en todas las celdas
- Busca coincidencia exacta del texto del QR
- Funciona con múltiples hojas

## Privacidad

- El archivo Excel **nunca sale de tu dispositivo**
- No hay servidores ni bases de datos
- Todo el procesamiento es local en tu navegador
- Los datos se pierden al cerrar la pestaña

## Tecnologías

- React 18
- Tailwind CSS
- SheetJS (xlsx) para leer Excel
- jsQR para escanear códigos QR
- Lucide React para iconos

## Autor

Satgrays (Erandi)

## Contribuir

¡Las contribuciones son bienvenidas! Abre un issue o pull request.