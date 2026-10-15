# LSM Música

Reproductor de audio que ocupa la pantalla disponible con controles clásicos de escritorio y la paleta del escudo del colegio: rojo `#a92724`, dorado `#c5942a`, marfil `#ebe7d9` y negro `#1e1c1a`. La interfaz solo muestra títulos y controles. Pulsa la imagen de un disco para escucharlo; vuelve a pulsarla para pausar o continuar. Incluye Marcha Sanmartiniana, Himno Sanmartiniano, Himno Nacional del Perú, Marcha de las Banderas y cinco danzas: Carnaval de Macari, Carnaval de Huanupampa, Carnaval de Huaccana, Cofradia de San Miguel y Qapac Kachampa. Los controles de reproducción, progreso y volumen permanecen visibles mientras se recorre la lista de discos.

**Sitio:** https://lsm-modding-team.github.io/lsm-music/

## Desarrollo

Sitio estático sin dependencias ni compilación. Desde la raíz:

```sh
python3 -m http.server 8000
```

Abre http://localhost:8000. El catálogo se define en `app.js`; los botones de los discos están en `index.html`. Los archivos Ogg originales incluyen alternativas MP3 para compatibilidad con navegadores.

## GitHub Pages

Configura **Settings → Pages → Deploy from a branch → master → / (root)**. GitHub publica los archivos estáticos de esta carpeta. `.nojekyll` evita el procesamiento de Jekyll. Todas las rutas de recursos son relativas para funcionar bajo `/lsm-music/`.

## Recursos y créditos

Audios y texturas originales de los discos sanmartinianos, de las cinco danzas de secundaria y de los dos discos de formación, procedentes de [LSMMod26.2Neoforge](https://github.com/LSM-Modding-Team/LSMMod26.2Neoforge), copiados sin modificar sus originales. Crédito musical de la Marcha Sanmartiniana y del Himno Sanmartiniano: **Tobías Vílchez Pinedo**, según los metadatos del mod. Cada disco utiliza su textura original actual del mod; los títulos de las danzas y de formación siguen sus nombres de ítem en español. Las versiones MP3 se convierten desde esos Ogg. Los recursos conservan los derechos de sus titulares; este repositorio no les concede una licencia adicional.
