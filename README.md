# LSM Música

Colección musical de **LSM Modding Team**. Pulsa la imagen de un disco para escucharlo; vuelve a pulsarla para pausar o continuar. Incluye Marcha Sanmartiniana e Himno Sanmartiniano, con controles de reproducción, progreso y volumen.

**Sitio:** https://lsm-modding-team.github.io/lsm-music/

## Desarrollo

Sitio estático sin dependencias ni compilación. Desde la raíz:

```sh
python3 -m http.server 8000
```

Abre http://localhost:8000. El catálogo se define en `app.js`; las tarjetas y sus duraciones visibles están en `index.html`. Los archivos Ogg originales incluyen alternativas MP3 para compatibilidad con navegadores.

## GitHub Pages

Configura **Settings → Pages → Deploy from a branch → master → / (root)**. GitHub publica los archivos estáticos de esta carpeta. `.nojekyll` evita el procesamiento de Jekyll. Todas las rutas de recursos son relativas para funcionar bajo `/lsm-music/`.

## Recursos y créditos

Audios y texturas originales de los discos `lsm_march` y `lsm_anthem`, procedentes de [LSMMod26.2Neoforge](https://github.com/LSM-Modding-Team/LSMMod26.2Neoforge), copiados sin modificar sus originales. Crédito musical: **Tobías Vílchez Pinedo**, según los metadatos del mod. Las versiones MP3 se convierten desde esos Ogg. Los recursos conservan los derechos de sus titulares; este repositorio no les concede una licencia adicional.
