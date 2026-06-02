# Next Print NY

Sitio web listo para abrir en Visual Studio Code, subir a GitHub y publicar en Vercel.

## Archivos principales

- `index.html`: contenido de la página.
- `styles.css`: colores, diseño responsive y apariencia de marca.
- `script.js`: menú móvil y chat en la página.
- Selector de idioma ES/EN: la página cambia entre español e inglés sin recargar.
- `api/chat.js`: función serverless para conectar IA en Vercel.
- `assets/logo.svg`: logo editable inspirado en la identidad de la imagen.

## Abrir en Visual Studio Code

1. Abre esta carpeta en VS Code.
2. Instala la extensión "Live Server" si quieres vista previa local.
3. Abre `index.html` con Live Server.

También puedes correr:

```bash
npm run dev
```

## Subir a GitHub

```bash
git init
git add .
git commit -m "Crear sitio Next Print NY"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/next-print-ny.git
git push -u origin main
```

## Publicar en Vercel

1. Entra a Vercel.
2. Importa el repositorio de GitHub.
3. Framework preset: "Other".
4. Build command: dejar vacío.
5. Output directory: dejar vacío.
6. Deploy.

## Activar la IA

En Vercel, agrega estas variables en Project Settings > Environment Variables:

```text
OPENAI_API_KEY=tu_clave_de_openai
OPENAI_MODEL=gpt-4.1-mini
```

Después vuelve a desplegar. El asistente responderá con la identidad de Next Print NY.
