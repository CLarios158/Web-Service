const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const db = require('./queries');
const port = process.env.HTTP_PORT;

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

//CONSULTAR RAIZ CON METODO GET
app.get('/', function(req, res){
    res.send("Web service Posit ejecutandose");
});


/*  SELECT  */
app.get('/consultar_catalogo_sexo', db.getCatalogoSexo);
app.get('/consultar_catalogo_estado', db.getCatalogoEstado);
app.get('/consultar_catalogo_municipio', db.getCatalogoMunicipio);
app.get('/consultar_catalogo_nivel', db.getCatalogoNivel);
app.get('/consultar_catalogo_escuela', db.getCatalogoEscuela);
app.get('/consultar_catalogo_lugar', db.getCatalogoLugar);
app.get('/consultar_catalogo_asenta', db.getCatalogoAsentamiento2);
app.get('/consultar_catalogo_tipo_asenta', db.getCatalogoTipoAsentamiento);
app.get('/consultar_preguntas', db.getPreguntas);
app.post('/consultar_catalogo_asentamiento', db.getCatalogoAsentamineto);
app.post('/consultar_escuela', db.getDatosEscuela);
app.post('/validar_pin', db.validatePIN);
app.post('/registrar_encuesta',db.registrar_encuesta);
app.post('/registrar_encuesta_escuela',db.registrar_encuesta_escuela);
app.post('/registrar_respuestas',db.registrar_respuesta);
app.post('/registrar_encuestas',db.registrar_encuestas);
app.post('/registrar_historial_respuestas',db.registrar_historial_respuesta);

app.listen(port, () => console.log(`Web service escuchando por puerto ${process.env.HTTP_PORT}`))