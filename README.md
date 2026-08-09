# mikhailcarcausto-rgb.github.io

Sitio profesional de **Mikhail Carcausto** — Contratos y Abastecimiento para minería.
Estático, sin build, sin dependencias. Se publica solo con hacer `git push`.

```
index.html                 todo el contenido (español = fuente de la verdad)
assets/css/style.css       diseño completo
assets/js/i18n.js          traducciones al inglés + textos de interfaz
assets/js/site.js          idioma, formulario, canales, animaciones
assets/img/favicon.svg     ícono de pestaña
assets/img/og.png          imagen para WhatsApp / LinkedIn al compartir el link
assets/img/og.html         fuente de esa imagen (abrir a 1200×630 y capturar)
```

---

## 1 · Completar tus datos de contacto  ← lo único urgente

Abre `assets/js/site.js`. Arriba de todo está este bloque:

```js
var CONTACT = {
  emailUser: "mikhail.carcausto",
  emailHost: "gmail.com",
  whatsapp: "",      // solo dígitos, con código de país: "51987654321"
  linkedin: "",      // URL completa: "https://www.linkedin.com/in/tu-perfil"
  phone:    ""       // formato visible: "+51 987 654 321"
};
```

**Cualquier campo que dejes en `""` simplemente no aparece en el sitio.** Por eso hoy
solo se ve el correo: nada queda roto ni apuntando a un link muerto. Llena los tres
que faltan, `git push`, y los botones aparecen solos.

---

## 2 · Activar el formulario (una sola vez, 30 segundos)

El formulario usa [FormSubmit](https://formsubmit.co) — gratis, sin cuenta, sin backend.

1. Entra al sitio publicado y envía **una** solicitud de prueba.
2. Llegará un correo de FormSubmit a `mikhail.carcausto@gmail.com` pidiendo confirmar.
3. Haz clic en el botón de activación de ese correo.

Listo. Desde ahí, cada solicitud te llega al inbox como una tabla ordenada, sin que el
visitante salga del sitio.

**Antes de activarlo el formulario igual funciona**: detecta que FormSubmit no responde
y abre el cliente de correo del visitante con el mensaje ya redactado. Nunca se pierde
un contacto — pero la experiencia es peor, así que activa el paso 2 cuanto antes.

El asunto de cada correo llega etiquetado por prioridad, por ejemplo:

```
[A·MINERA] Ana Quispe · Minera Andes
```

---

## 3 · Cómo se decide esa prioridad

En `site.js`, la función `classifyLead()` cruza quién escribe con qué tan apurado está:

| | Tengo un plazo | Este trimestre | Explorando |
|---|---|---|---|
| **Compañía minera** | A | A | B |
| **Proveedor** | A | B | C |
| **Otro** | A | B | C |

Es una regla de arranque, no una verdad. Tú sabes mejor que nadie qué consulta vale la
pena atender el mismo día — si en la práctica los proveedores con plazo encima son los
que más rápido cierran, súbelos a A y listo. Son cinco líneas.

---

## 4 · Correr el sitio localmente

```bash
python -m http.server 4173 --directory site
```

Luego abre `http://localhost:4173`.

---

## 5 · Idiomas

El **español vive en `index.html`** y es la fuente de la verdad. `i18n.js` guarda
únicamente las traducciones al inglés, buscadas por el atributo `data-i18n`.

Si editas un texto en español, no hay que tocar nada más. Si quieres que ese texto
también cambie en inglés, actualiza su clave en `i18n.js`. Las dos versiones no pueden
desincronizarse porque el español nunca está duplicado.

El sitio arranca en el idioma del navegador del visitante y recuerda su elección.

---

## 6 · Dominio propio (opcional)

1. Compra el dominio (p. ej. `carcausto.pe` en Punto.pe, o `.com` en Namecheap).
2. Crea un archivo `CNAME` en la raíz del repo con una sola línea: `carcausto.pe`
3. En tu proveedor de DNS apunta:
   - `A` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` de `www` → `mikhailcarcausto-rgb.github.io`
4. En GitHub: Settings → Pages → Custom domain → escribe el dominio → marca *Enforce HTTPS*.

Después actualiza `<link rel="canonical">` y las etiquetas `og:` en `index.html`.

---

## 7 · Confidencialidad

Los casos están **anonimizados a propósito**. No aparece el nombre del cliente, ni
números de contrato, ni nombres de sistemas internos. Las cifras son reales y se pueden
sustentar en una llamada. Si alguna vez consigues autorización escrita para nombrar a un
cliente, ese es el momento de editarlo — no antes.

---

Sin cookies, sin analítica, sin scripts de terceros. La única llamada externa es a
Google Fonts, y el formulario solo contacta a FormSubmit cuando alguien lo envía.
