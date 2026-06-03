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

## Memoria de la IA

El chat recuerda nombre, idioma preferido, pedidos enviados y conversación reciente usando el navegador del cliente (`localStorage`). Si el cliente vuelve desde el mismo dispositivo, la IA puede saludarlo, recordar pedidos recientes y continuar el hilo de conversación. Para memoria entre diferentes dispositivos se necesitaría agregar una base de datos.

## Activar subida de archivos por email

El formulario "Upload your files" envía los archivos a:

```text
nextprintny@gmail.com
```

En Vercel agrega:

```text
RESEND_API_KEY=tu_clave_de_resend
RESEND_FROM_EMAIL=Next Print NY <tu-email-verificado@tu-dominio.com>
```

Si no configuras `RESEND_FROM_EMAIL`, se usa `Next Print NY <onboarding@resend.dev>`.

## Activar panel privado del negocio

El archivo `admin.html` crea un panel privado para controlar pedidos, ingresos, gastos, inventario, clientes y documentos.

En Vercel agrega estas variables:

```text
ADMIN_EMAIL=tu-email@dominio.com
ADMIN_PASSWORD=una-contraseña-fuerte
ADMIN_SESSION_SECRET=una-frase-secreta-larga
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
```

En Supabase crea la tabla:

```sql
create table business_records (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('order', 'income', 'expense', 'inventory', 'customer', 'document')),
  status text not null default 'new' check (status in ('new', 'in_progress', 'waiting', 'paid', 'completed', 'cancelled')),
  title text not null,
  customer_name text,
  customer_phone text,
  customer_email text,
  description text,
  amount numeric default 0,
  quantity numeric default 0,
  due_date date,
  file_url text,
  created_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

Después de desplegar, entra a:

```text
https://tu-dominio.com/admin.html
```
