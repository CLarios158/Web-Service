require('dotenv').config()

const { Pool } = require('pg')
const datachecker = require('./datachecker');

// Variables de conexión a la base de datos 
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB,
    password: process.env.DB_PASS,
    port: process.env.PORT
})

const knex = require('knex')({
    client: 'pg',
    connection: {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB,
        password: process.env.DB_PASS,
        //port: process.env.PORT
    }
})


// Librería para encriptar peticiones
// En la encriptación de tipos INTEGER O DOUBLE PRECISION se hace conversión a string y se encripta
var aes256 = require('aes256');
var key = "92AE31A79FEEB2A3";
//var CryptoJS = require("crypto-js");
const encrypt = 0;
var ReverseMd5 = require('reverse-md5');
var md5 = require('md5');




// Función para crear logs de errores
createLog = function (results, valoresEntrada, module) { //
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + '-' + dd + '-' + yyyy;
    var fs = require('fs');
    var util = require('util');

    const dir = './logs';

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    // Nombre de los logs Instancia del sp + Fecha actual + Número de archivo (Para evitar sobrescribir)

    fs.readdir(dir, (err, files) => {

        var log = __dirname + '/logs/ws_db_posit_' + today + '.log';

        if (!fs.existsSync(log)) {

            var log_file = fs.createWriteStream(__dirname + 'ws_db_posit_' + today + '.log', { flags: 'w' });
            log_file.write(util.format(module) + '\n');
            log_file.write(util.format("Valores de entrada") + '\n');
            log_file.write(util.format(valoresEntrada) + '\n');
            log_file.write(util.format("Valores de salida") + '\n');
            log_file.write(util.format(results) + '\n');
        } else {
            valoresEntradaOW = util.format(module) + '\n' + util.format("Valores de entrada") + '\n' + util.format(valoresEntrada) + '\n' + util.format("Valores de salida") + '\n' + util.format(results) + '\n';
            fs.appendFile(log, valoresEntradaOW + '\n', function (err) {
                if (err) throw err;

            });
        }
    });
};


// Función para crear logs de peticiones: createLog(resultado, modulo de petición)
createLogerr = function (results, valoresEntrada, module) { //
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + '-' + dd + '-' + yyyy;
    var fs = require('fs');
    var util = require('util');

    const dir = './logserr';

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    // Nombre de los logs Instancia del sp + Fecha actual + Número de archivo (Para evitar sobrescribir)

    fs.readdir(dir, (err, files) => {

        var log = __dirname + '/logserr/ws_db_posit_' + today + '.log';

        if (!fs.existsSync(log)) {

            var log_file = fs.createWriteStream(__dirname + '/logserr/ws_db_posit_' + today + '.log', { flags: 'w' });
            log_file.write(util.format(module) + '\n');
            log_file.write(util.format("Valores de entrada") + '\n');
            log_file.write(util.format(valoresEntrada) + '\n');
            log_file.write(util.format("Valores de salida") + '\n');
            log_file.write(util.format(results) + '\n');
        } else {
            valoresEntradaOW = util.format(module) + '\n' + util.format("Valores de entrada") + '\n' + util.format(valoresEntrada) + '\n' + util.format("Valores de salida") + '\n' + util.format(results) + '\n';
            fs.appendFile(log, valoresEntradaOW + '\n', function (err) {
                if (err) throw err;
            });
        }
    });
};

const getCatalogoSexo = (request, response) => {
    resultado = {};
    // Query

    //let conexion = request.body;
    //recibir la variable de conecxión
    //var query = "CALL sync_cat_nivel("+conexion+")"
    var query = "SELECT id_sexo, nombre_sexo FROM cat_sexo";
    console.log(query);

    // Se reemplaza las comillas doble por simples para la consulta
    //query = query.replace(/["]+/g, '')

    pool.query(
        query, (error, results) => {
            console.log(error);
            try {

                if (error) {
                    throw error;
                }

                if (encrypt == 1) {
                    setTimeout(function () {
                        results.rows.forEach(function (element) {
                            element.id_sexo != null ? element.id_sexo = aes256.encrypt(key, element.id_sexo.toString()) : element.id_sexo = element.id_sexo;
                            element.nombre_sexo != null ? element.nombre_sexo = aes256.encrypt(key, element.nombre_sexo) : element.nombre_sexo = element.nombre_sexo;
                        })
                        resultado.data = results.rows;
                        response.status(200).json(resultado);
                        // Creación de log
                        createLog(resultado, "sp_consultar_cat_sexo");
                    }, 100);
                } else {

                    results.rows.forEach(function (element) {
                        //console.log(element)
                    })
                    resultado.data = results.rows;
                    response.status(200).json(resultado);
                }
            } catch (error) {
                console.log(error)
                createLogerr(error, valoresEntrada, "sp_consultar_cat_sexo");
            }
        }
    )
}

const getCatalogoMunicipio = (request, response) => {
    resultado = {};
    // Query
    var query = "SELECT cve_municipio,cve_estado,nom_municipio FROM municipio";
    console.log(query);

    // Se reemplaza las comillas doble por simples para la consulta
    //query = query.replace(/["]+/g, '')

    pool.query(
        query, (error, results) => {
            console.log(error);
            try {

                if (error) {
                    throw error;
                }

                if (encrypt == 1) {
                    setTimeout(function () {
                        results.rows.forEach(function (element) {
                            element.id_sexo != null ? element.id_sexo = aes256.encrypt(key, element.id_sexo.toString()) : element.id_sexo = element.id_sexo;
                            element.nombre_sexo != null ? element.nombre_sexo = aes256.encrypt(key, element.nombre_sexo) : element.nombre_sexo = element.nombre_sexo;
                        })
                        resultado.data = results.rows;
                        response.status(200).json(resultado);
                        // Creación de log
                        createLog(resultado, "sp_consultar_cat_municipio");
                    }, 100);
                } else {

                    results.rows.forEach(function (element) {
                        //console.log(element)
                    })
                    resultado.data = results.rows;
                    response.status(200).json(resultado);
                }
            } catch (error) {
                console.log(error)
                createLogerr(error, valoresEntrada, "sp_consultar_cat_municipio");
            }
        }
    )
}

const getCatalogoEstado = (request, response) => {
    resultado = {};
    // Query
    var query = "SELECT cve_estado,nom_estado FROM estado";
    console.log(query);

    // Se reemplaza las comillas doble por simples para la consulta
    //query = query.replace(/["]+/g, '')

    pool.query(
        query, (error, results) => {
            console.log(error);
            try {

                if (error) {
                    throw error;
                }

                if (encrypt == 1) {
                    setTimeout(function () {
                        results.rows.forEach(function (element) {
                            element.id_sexo != null ? element.id_sexo = aes256.encrypt(key, element.id_sexo.toString()) : element.id_sexo = element.id_sexo;
                            element.nombre_sexo != null ? element.nombre_sexo = aes256.encrypt(key, element.nombre_sexo) : element.nombre_sexo = element.nombre_sexo;
                        })
                        resultado.data = results.rows;
                        response.status(200).json(resultado);
                        // Creación de log
                        createLog(resultado, "sp_consultar_cat_sexo");
                    }, 100);
                } else {

                    results.rows.forEach(function (element) {
                        //console.log(element)
                    })
                    resultado.data = results.rows;
                    response.status(200).json(resultado);
                }
            } catch (error) {
                console.log(error)
                createLogerr(error, valoresEntrada, "sp_consultar_cat_sexo");
            }
        }
    )
}

const getCatalogoNivel = (request, response) => {
    resultado = {};
    // Query
    var query = "SELECT id_nivel,nombre_nivel FROM nivel";
    console.log(query);

    // Se reemplaza las comillas doble por simples para la consulta
    //query = query.replace(/["]+/g, '')

    pool.query(
        query, (error, results) => {
            console.log(error);
            try {

                if (error) {
                    throw error;
                }

                if (encrypt == 1) {
                    setTimeout(function () {
                        results.rows.forEach(function (element) {
                            element.id_nivel != null ? element.id_nivel = aes256.encrypt(key, element.id_nivel.toString()) : element.id_nivel = element.id_nivel;
                            element.nombre_nivel != null ? element.nombre_nivel = aes256.encrypt(key, element.nombre_nivel) : element.nombre_nivel = element.nombre_nivel;
                        })
                        resultado.data = results.rows;
                        response.status(200).json(resultado);
                        // Creación de log
                        createLog(resultado, "sp_consultar_cat_nivel");
                    }, 100);
                } else {

                    results.rows.forEach(function (element) {
                        //console.log(element)
                    })
                    resultado.data = results.rows;
                    response.status(200).json(resultado);
                }
            } catch (error) {
                console.log(error)
                createLogerr(error, valoresEntrada, "sp_consultar_cat_nivel");
            }
        }
    )
}

const getCatalogoTipoAsentamiento = (request, response) => {

    // Query
    var query = "SELECT cve_tipo_asenta,nom_tipo_asenta FROM cat_asentamiento";
    console.log(query);

    // Se reemplaza las comillas doble por simples para la consulta
    //query = query.replace(/["]+/g, '')

    pool.query(
        query, (error, results) => {
            console.log(error);
            try {

                if (error) {
                    throw error;
                }

                if (encrypt == 1) {
                    setTimeout(function () {
                        results.rows.forEach(function (element) {
                            element.cve_tipo_asenta != null ? element.cve_tipo_asenta = aes256.encrypt(key, element.cve_tipo_asenta.toString()) : element.cve_tipo_asenta = element.cve_tipo_asenta;
                            element.nom_tipo_asenta != null ? element.nom_tipo_asenta = aes256.encrypt(key, element.nom_tipo_asenta) : element.nom_tipo_asenta = element.nom_tipo_asenta;
                        })
                        resultado.data = results.rows;
                        response.status(200).json(resultado);
                        // Creación de log
                        createLog(resultado, "sp_consultar_cat_tipo_asenta");
                    }, 100);
                } else {

                    results.rows.forEach(function (element) {
                        //console.log(element)
                    })
                    resultado.data = results.rows;
                    response.status(200).json(resultado);
                }
            } catch (error) {
                console.log(error)
                createLogerr(error, valoresEntrada, "sp_consultar_cat_tipo_asenta");
            }
        }
    )
}

const getCatalogoAsentamiento2 = (request, response) => {

    // Query
    var query = "SELECT cve_asenta,cve_municipio,cve_estado,cve_tipo_asenta,nom_asenta,cp FROM asentamiento";
    console.log(query);

    // Se reemplaza las comillas doble por simples para la consulta
    //query = query.replace(/["]+/g, '')

    pool.query(
        query, (error, results) => {
            console.log(error);
            try {

                if (error) {
                    throw error;
                }

                if (encrypt == 1) {
                    setTimeout(function () {
                        results.rows.forEach(function (element) {
                            element.cve_tipo_asenta != null ? element.cve_tipo_asenta = aes256.encrypt(key, element.cve_tipo_asenta.toString()) : element.cve_tipo_asenta = element.cve_tipo_asenta;
                            element.nom_tipo_asenta != null ? element.nom_tipo_asenta = aes256.encrypt(key, element.nom_tipo_asenta) : element.nom_tipo_asenta = element.nom_tipo_asenta;
                        })
                        resultado.data = results.rows;
                        response.status(200).json(resultado);
                        // Creación de log
                        createLog(resultado, "sp_consultar_cat_asenta");
                    }, 100);
                } else {

                    results.rows.forEach(function (element) {
                        //console.log(element)
                    })
                    resultado.data = results.rows;
                    response.status(200).json(resultado);
                }
            } catch (error) {
                console.log(error)
                createLogerr(error, valoresEntrada, "sp_consultar_cat_asenta");
            }
        }
    )
}

const getCatalogoEscuela = (request, response) => {

    // Query
    var query = "SELECT id_lugar,id_nivel,id_centro_desarrollo,cct,nom_escuela,telefono FROM escuela;";
    console.log(query);

    // Se reemplaza las comillas doble por simples para la consulta
    //query = query.replace(/["]+/g, '')

    pool.query(
        query, (error, results) => {
            console.log(error);
            try {

                if (error) {
                    throw error;
                }

                if (encrypt == 1) {
                    setTimeout(function () {
                        results.rows.forEach(function (element) {
                            element.cve_tipo_asenta != null ? element.cve_tipo_asenta = aes256.encrypt(key, element.cve_tipo_asenta.toString()) : element.cve_tipo_asenta = element.cve_tipo_asenta;
                            element.nom_tipo_asenta != null ? element.nom_tipo_asenta = aes256.encrypt(key, element.nom_tipo_asenta) : element.nom_tipo_asenta = element.nom_tipo_asenta;
                        })
                        resultado.data = results.rows;
                        response.status(200).json(resultado);
                        // Creación de log
                        createLog(resultado, "sp_consultar_cat_escuela");
                    }, 100);
                } else {

                    results.rows.forEach(function (element) {
                        //console.log(element)
                    })
                    resultado.data = results.rows;
                    response.status(200).json(resultado);
                }
            } catch (error) {
                console.log(error)
                createLogerr(error, valoresEntrada, "sp_consultar_cat_escuela");
            }
        }
    )
}

const getCatalogoLugar = (request, response) => {

    // Query
    var query = "SELECT id_lugar,cve_asenta,cve_municipio,cve_estado,calle,num_ext,num_int,nombre_lugar,fecha_creacion FROM lugar;";
    console.log(query);

    // Se reemplaza las comillas doble por simples para la consulta
    //query = query.replace(/["]+/g, '')

    pool.query(
        query, (error, results) => {
            console.log(error);
            try {

                if (error) {
                    throw error;
                }

                if (encrypt == 1) {
                    setTimeout(function () {
                        results.rows.forEach(function (element) {
                            element.cve_tipo_asenta != null ? element.cve_tipo_asenta = aes256.encrypt(key, element.cve_tipo_asenta.toString()) : element.cve_tipo_asenta = element.cve_tipo_asenta;
                            element.nom_tipo_asenta != null ? element.nom_tipo_asenta = aes256.encrypt(key, element.nom_tipo_asenta) : element.nom_tipo_asenta = element.nom_tipo_asenta;
                        })
                        resultado.data = results.rows;
                        response.status(200).json(resultado);
                        // Creación de log
                        createLog(resultado, "sp_consultar_cat_lugar");
                    }, 100);
                } else {

                    results.rows.forEach(function (element) {
                        //console.log(element)
                    })
                    resultado.data = results.rows;
                    response.status(200).json(resultado);
                }
            } catch (error) {
                console.log(error)
                createLogerr(error, valoresEntrada, "sp_consultar_cat_lugar");
            }
        }
    )
}

const getCatalogoAsentamineto = (request, response) => {

    valoresEntrada = {};
    resultado = {};

    // Variables de entrada
    const cve_municipio = request.body.cve_municipio;
    valoresEntrada.cve_municipio = cve_municipio;

    // Query
    var query = "SELECT * FROM sp_consultar_cat_asentamiento('" + cve_municipio + "')";
    console.log(query);

    // Se reemplaza las comillas doble por simples para la consulta
    //query = query.replace(/["]+/g, '')

    pool.query(
        query, (error, results) => {
            console.log(error);
            try {

                if (error) {
                    throw error;
                }

                if (encrypt == 1) {
                    setTimeout(function () {
                        results.rows.forEach(function (element) {
                            element.id_sexo != null ? element.id_sexo = aes256.encrypt(key, element.id_sexo.toString()) : element.id_sexo = element.id_sexo;
                            element.nombre_sexo != null ? element.nombre_sexo = aes256.encrypt(key, element.nombre_sexo) : element.nombre_sexo = element.nombre_sexo;
                        })
                        resultado.data = results.rows;
                        response.status(200).json(resultado);
                        // Creación de log
                        createLog(resultado, "sp_consultar_cat_sexo");
                    }, 100);
                } else {

                    results.rows.forEach(function (element) {
                        //console.log(element)
                    })
                    resultado.data = results.rows;
                    response.status(200).json(results.rows);
                }
            } catch (error) {
                console.log(error)
                createLogerr(error, valoresEntrada, "sp_consultar_cat_sexo");
            }
        }
    )
}

const getPreguntas = (request, response) => {
    resultado = {};
    // Query
    var query = "SELECT id_pregunta,numero,pregunta,aseveracion_negativa FROM pregunta";
    console.log(query);

    // Se reemplaza las comillas doble por simples para la consulta
    //query = query.replace(/["]+/g, '')

    pool.query(
        query, (error, results) => {
            console.log(error);
            try {

                if (error) {
                    throw error;
                }

                if (encrypt == 1) {
                    setTimeout(function () {
                        results.rows.forEach(function (element) {
                            element.id_sexo != null ? element.id_sexo = aes256.encrypt(key, element.id_sexo.toString()) : element.id_sexo = element.id_sexo;
                            element.nombre_sexo != null ? element.nombre_sexo = aes256.encrypt(key, element.nombre_sexo) : element.nombre_sexo = element.nombre_sexo;
                        })
                        resultado.data = results.rows;
                        response.status(200).json(resultado);
                        // Creación de log
                        createLog(resultado, "sp_consultar_preguntas");
                    }, 100);
                } else {

                    results.rows.forEach(function (element) {
                        //console.log(element)
                    })
                    resultado.data = results.rows;
                    response.status(200).json(resultado);
                }
            } catch (error) {
                console.log(error)
                createLogerr(error, valoresEntrada, "sp_consultar_preguntas");
            }
        }
    )
}

const validatePIN = (request, response) => {

    valoresEntrada = {};
    resultado = {};

    // Variables de entrada
    const codigo = request.body.codigo;
    valoresEntrada.codigo = codigo;

    // Query
    var query = "SELECT * FROM sp_validar_codigo('" + codigo + "')";
    console.log(query);

    // Se reemplaza las comillas doble por simples para la consulta
    //query = query.replace(/["]+/g, '')

    pool.query(
        query, (error, results) => {
            console.log(error);
            try {

                if (error) {
                    throw error;
                }

                if (encrypt == 1) {
                    setTimeout(function () {
                        results.rows.forEach(function (element) {
                            element.id_sexo != null ? element.id_sexo = aes256.encrypt(key, element.id_sexo.toString()) : element.id_sexo = element.id_sexo;
                            element.nombre_sexo != null ? element.nombre_sexo = aes256.encrypt(key, element.nombre_sexo) : element.nombre_sexo = element.nombre_sexo;
                        })
                        resultado.data = results.rows;
                        response.status(200).json(resultado);
                        // Creación de log
                        createLog(resultado, "sp_validar_codigo");
                    }, 100);
                } else {

                    results.rows.forEach(function (element) {
                        //console.log(element)
                    })
                    resultado.data = results.rows;
                    response.status(200).json(resultado);
                }
            } catch (error) {
                console.log(error)
                createLogerr(error, valoresEntrada, "sp_validar_codigo");
            }
        }
    )
}

const getDatosEscuela = (request, response) => {

    valoresEntrada = {};
    resultado = {};

    // Variables de entrada
    const id_escuela = request.body.id_escuela;
    valoresEntrada.id_escuela = id_escuela;

    // Query
    var query = "SELECT * FROM sp_consultar_escuela('" + id_escuela + "')";
    console.log(query);

    // Se reemplaza las comillas doble por simples para la consulta
    //query = query.replace(/["]+/g, '')

    pool.query(
        query, (error, results) => {
            console.log(error);
            try {

                if (error) {
                    throw error;
                }

                if (encrypt == 1) {
                    setTimeout(function () {
                        results.rows.forEach(function (element) {
                            element.id_sexo != null ? element.id_sexo = aes256.encrypt(key, element.id_sexo.toString()) : element.id_sexo = element.id_sexo;
                            element.nombre_sexo != null ? element.nombre_sexo = aes256.encrypt(key, element.nombre_sexo) : element.nombre_sexo = element.nombre_sexo;
                        })
                        resultado.data = results.rows;
                        response.status(200).json(resultado);
                        // Creación de log
                        createLog(resultado, "sp_consultar_escuela");
                    }, 100);
                } else {

                    results.rows.forEach(function (element) {
                        //console.log(element)
                    })
                    resultado.data = results.rows;
                    response.status(200).json(resultado);
                }
            } catch (error) {
                console.log(error)
                createLogerr(error, valoresEntrada, "sp_consultar_escuela");
            }
        }
    )
}

const registrar_encuesta = (request, response) => {

    valoresEntrada = {};
    resultado = {};

    // Variables de entrada
    const cve_estado_lugar = request.body.cve_estado_lugar;
    valoresEntrada.cve_estado_lugar = cve_estado_lugar;
    const cve_municipio_lugar = request.body.cve_municipio_lugar;
    valoresEntrada.cve_municipio_lugar = cve_municipio_lugar;
    const cve_asenta_lugar = request.body.cve_asenta_lugar;
    valoresEntrada.cve_asenta_lugar = cve_asenta_lugar;
    const lugar = request.body.lugar;
    valoresEntrada.lugar = lugar;
    const calle_lugar = request.body.calle_lugar;
    valoresEntrada.calle_lugar = calle_lugar;
    const num_ext_lugar = request.body.num_ext_lugar;
    valoresEntrada.num_ext_lugar = num_ext_lugar;
    const num_int_lugar = request.body.num_int_lugar;
    valoresEntrada.num_int_lugar = num_int_lugar;
    const nombre = request.body.nombre;
    valoresEntrada.nombre = nombre;
    const apellido1 = request.body.apellido1;
    valoresEntrada.apellido1 = apellido1;
    const apellido2 = request.body.apellido2;
    valoresEntrada.apellido2 = apellido2;
    const curp = request.body.curp;
    valoresEntrada.curp = curp;
    const id_sexo = request.body.id_sexo;
    valoresEntrada.id_sexo = id_sexo;
    const fecha_nacimiento = request.body.fecha_nacimiento;
    valoresEntrada.fecha_nacimiento = fecha_nacimiento;
    var yy = fecha_nacimiento.substr(6, 2);
    var newdate = (yy < 90) ? '20' + yy : '19' + yy;
    newdate += '/' + fecha_nacimiento.substr(0, 2) + '/' + fecha_nacimiento.substr(3, 2);
    const cve_estado_domicilio = request.body.cve_estado_domicilio;
    valoresEntrada.cve_estado_domicilio = cve_estado_domicilio;
    const cve_municipio_domicilio = request.body.cve_municipio_domicilio;
    valoresEntrada.cve_municipio_domicilio = cve_municipio_domicilio;
    const cve_asenta_domicilio = request.body.cve_asenta_domicilio;
    valoresEntrada.cve_asenta_domicilio = cve_asenta_domicilio;
    const calle_domicilio = request.body.calle_domicilio;
    valoresEntrada.calle_domicilio = calle_domicilio;
    const num_ext_domicilio = request.body.num_ext_domicilio;
    valoresEntrada.num_ext_domicilio = num_ext_domicilio;
    const num_int_domicilio = request.body.num_int_domicilio;
    valoresEntrada.num_int_domicilio = num_int_domicilio;

    // Query
    var query = "SELECT * FROM fn_registrar_encuesta('" + cve_estado_lugar + "','" + cve_municipio_lugar + "','" + cve_asenta_lugar + "','" + lugar + "','" + calle_lugar + "','" + num_ext_lugar + "','" + num_int_lugar + "','" + nombre + "','" + apellido1 + "','" + apellido2 + "','" + curp + "'," + id_sexo + ",'" + newdate + "','" + cve_estado_domicilio + "','" + cve_municipio_domicilio + "','" + cve_asenta_domicilio + "','" + calle_domicilio + "','" + num_ext_domicilio + "','" + num_int_domicilio + "')";
    console.log(query);

    // Se reemplaza las comillas doble por simples para la consulta
    //query = query.replace(/["]+/g, '')

    pool.query(
        query, (error, results) => {
            console.log(error);
            try {

                if (error) {
                    throw error;
                }

                if (encrypt == 1) {
                    setTimeout(function () {
                        results.rows.forEach(function (element) {
                            element.id_sexo != null ? element.id_sexo = aes256.encrypt(key, element.id_sexo.toString()) : element.id_sexo = element.id_sexo;
                            element.nombre_sexo != null ? element.nombre_sexo = aes256.encrypt(key, element.nombre_sexo) : element.nombre_sexo = element.nombre_sexo;
                        })
                        resultado.data = results.rows;
                        response.status(200).json(resultado);
                        // Creación de log
                        createLog(resultado, "fn_registrar_encuesta");
                    }, 100);
                } else {

                    results.rows.forEach(function (element) {
                        //console.log(element)
                    })
                    resultado = results.rows;
                    response.status(200).json(resultado);
                }
            } catch (error) {
                console.log(error)
                createLogerr(error, valoresEntrada, "fn_registrar_encuesta");
            }
        }
    )
}

const registrar_encuesta_escuela = (request, response) => {

    valoresEntrada = {};
    resultado = {};

    // Variables de entrada
    const id_lugar = request.body.id_lugar;
    valoresEntrada.id_lugar = id_lugar;
    const grado = request.body.grado;
    valoresEntrada.grado = grado;
    const grupo = request.body.grupo;
    valoresEntrada.grupo = grupo;
    const nombre = request.body.nombre;
    valoresEntrada.nombre = nombre;
    const apellido1 = request.body.apellido1;
    valoresEntrada.apellido1 = apellido1;
    const apellido2 = request.body.apellido2;
    valoresEntrada.apellido2 = apellido2;
    const curp = request.body.curp;
    valoresEntrada.curp = curp;
    const id_sexo = request.body.id_sexo;
    valoresEntrada.id_sexo = id_sexo;
    const fecha_nacimiento = request.body.fecha_nacimiento;
    valoresEntrada.fecha_nacimiento = fecha_nacimiento;
    var yy = fecha_nacimiento.substr(6, 2);
    var newdate = (yy < 90) ? '20' + yy : '19' + yy;
    newdate += '/' + fecha_nacimiento.substr(0, 2) + '/' + fecha_nacimiento.substr(3, 2);
    const cve_estado_domicilio = request.body.cve_estado_domicilio;
    valoresEntrada.cve_estado_domicilio = cve_estado_domicilio;
    const cve_municipio_domicilio = request.body.cve_municipio_domicilio;
    valoresEntrada.cve_municipio_domicilio = cve_municipio_domicilio;
    const cve_asenta_domicilio = request.body.cve_asenta_domicilio;
    valoresEntrada.cve_asenta_domicilio = cve_asenta_domicilio;
    const calle_domicilio = request.body.calle_domicilio;
    valoresEntrada.calle_domicilio = calle_domicilio;
    const num_ext_domicilio = request.body.num_ext_domicilio;
    valoresEntrada.num_ext_domicilio = num_ext_domicilio;
    const num_int_domicilio = request.body.num_int_domicilio;
    valoresEntrada.num_int_domicilio = num_int_domicilio;

    // Query
    var query = "SELECT * FROM fn_registrar_encuesta_escuela(" + id_lugar + "," + grado + ",'" + grupo + "','" + nombre + "','" + apellido1 + "','" + apellido2 + "','" + curp + "'," + id_sexo + ",'" + newdate + "','" + cve_estado_domicilio + "','" + cve_municipio_domicilio + "','" + cve_asenta_domicilio + "','" + calle_domicilio + "','" + num_ext_domicilio + "','" + num_int_domicilio + "')";
    console.log(query);

    // Se reemplaza las comillas doble por simples para la consulta
    //query = query.replace(/["]+/g, '')

    pool.query(
        query, (error, results) => {
            console.log(error);
            try {

                if (error) {
                    throw error;
                }

                if (encrypt == 1) {
                    setTimeout(function () {
                        results.rows.forEach(function (element) {
                            element.id_sexo != null ? element.id_sexo = aes256.encrypt(key, element.id_sexo.toString()) : element.id_sexo = element.id_sexo;
                            element.nombre_sexo != null ? element.nombre_sexo = aes256.encrypt(key, element.nombre_sexo) : element.nombre_sexo = element.nombre_sexo;
                        })
                        resultado.data = results.rows;
                        response.status(200).json(resultado);
                        // Creación de log
                        createLog(resultado, "fn_registrar_encuesta_escuela");
                    }, 100);
                } else {

                    results.rows.forEach(function (element) {
                        //console.log(element)
                    })
                    resultado = results.rows;
                    response.status(200).json(resultado);
                }
            } catch (error) {
                console.log(error)
                createLogerr(error, valoresEntrada, "fn_registrar_encuesta_escuela");
            }
        }
    )
}

const registrar_respuesta = async (request, response) => {


    valoresEntrada = {};
    resultado = {};

    // Variables de entrada
    const array = request.body.array;
    valoresEntrada.array = array;

    const encuestas = array.map(function (name, i) {
        return '(' + (name.id_encuesta) + ',' + (name.id_pregunta) + ',' + (name.respuesta) + ',' + ('NOW()') + ')';
    }).join(',');


    var query = "INSERT INTO respuesta(id_encuesta,id_pregunta,respuesta,fecha_creacion) VALUES " + encuestas + " ";
    console.log(query)
    // Query
    //var query = "SELECT * FROM fn_registrar_respuestas(" + id_encuesta + "," + id_pregunta + "," + respuesta + ")";
    //console.log(query);

    // Se reemplaza las comillas doble por simples para la consulta
    //query = query.replace(/["]+/g, '')



    pool.query(
        query, (error, results) => {
            console.log(error);
            try {

                if (error) {
                    throw error;
                }

                if (encrypt == 1) {
                    setTimeout(function () {
                        results.rows.forEach(function (element) {
                            element.id_sexo != null ? element.id_sexo = aes256.encrypt(key, element.id_sexo.toString()) : element.id_sexo = element.id_sexo;
                            element.nombre_sexo != null ? element.nombre_sexo = aes256.encrypt(key, element.nombre_sexo) : element.nombre_sexo = element.nombre_sexo;
                        })
                        resultado = results.rows;
                        response.status(200).json(resultado);
                        // Creación de log
                        createLog(resultado, "fn_registrar_respuestas");
                    }, 100);
                } else {

                    results.rows.forEach(function (element) {
                        //console.log(element)
                    })
                    resultado = results.rows;
                    response.status(200).json(resultado);
                }
            } catch (error) {
                console.log(error)
                createLogerr(error, valoresEntrada, "fn_registrar_respuestas");
            }
        }
    )
}

const registrar_historial_respuesta = (request, response) => {

    valoresEntrada = {};
    resultado = {};

    // Variables de entrada
    const array = request.body.array;
    valoresEntrada.array = array;

    const encuestas = array.map(function (name, i) {
        return '(' + (name.id_encuesta) + ',' + (name.id_pregunta) + ',' + (name.respuesta) + ',' + ('NOW()') + ')';
    }).join(',');


    var query = "INSERT INTO historial_respuesta(id_encuesta,id_pregunta,respuesta,fecha_creacion) VALUES " + encuestas + " ";
    console.log(query)
    // Query
    //var query = "SELECT * FROM fn_registrar_respuestas(" + id_encuesta + "," + id_pregunta + "," + respuesta + ")";
    //console.log(query);

    // Se reemplaza las comillas doble por simples para la consulta
    //query = query.replace(/["]+/g, '')



    pool.query(
        query, (error, results) => {
            console.log(error);
            try {

                if (error) {
                    throw error;
                }

                if (encrypt == 1) {
                    setTimeout(function () {
                        results.rows.forEach(function (element) {
                            element.id_sexo != null ? element.id_sexo = aes256.encrypt(key, element.id_sexo.toString()) : element.id_sexo = element.id_sexo;
                            element.nombre_sexo != null ? element.nombre_sexo = aes256.encrypt(key, element.nombre_sexo) : element.nombre_sexo = element.nombre_sexo;
                        })
                        resultado = results.rows;
                        response.status(200).json(resultado);
                        // Creación de log
                        createLog(resultado, "fn_registrar_historial_respuestas");
                    }, 100);
                } else {

                    results.rows.forEach(function (element) {
                        //console.log(element)
                    })
                    resultado = results.rows;
                    response.status(200).json(resultado);
                }
            } catch (error) {
                console.log(error)
                createLogerr(error, valoresEntrada, "fn_registrar_historial_respuestas");
            }
        }
    )
}


const registrar_encuestas = async (request, response) => {

    valoresEntrada = {};
    resultado = {};


    // Variables de entrada
    const encuestas = request.body;
    valoresEntrada.encuestas = encuestas;

    let p = encuestas.persona;
    let curp = p.curp;

    if (!datachecker.verificaCurp(curp)) {
        let parts = p.fecha_nacimiento.split('-');
        let mydate = new Date(parts[0], parts[1] - 1, parts[2]);
        curp = datachecker.generaCurp(p.apellido1, p.apellido2, p.nombre, mydate, p.id_sexo, '..');
    }

    console.log('CURP: '+curp)

    const query = "SELECT fn_registrar_encuestas('" + encuestas.persona.nombre + "','" + encuestas.persona.apellido1 + "','" + encuestas.persona.apellido2 + "'," + encuestas.persona.id_sexo + ",'" + curp + "','" + encuestas.persona.fecha_nacimiento + "','" + encuestas.persona.fecha_creacion + "'," + encuestas.lugar.id_lugar + ",'" + encuestas.lugar.nombre_lugar + "','" + encuestas.lugar.calle + "','" + encuestas.lugar.num_ext + "','" + encuestas.lugar.num_int + "','" + encuestas.lugar.cve_asenta + "','" + encuestas.lugar.cve_municipio + "','" + encuestas.lugar.cve_estado + "','" + encuestas.lugar.fecha_creacion + "','" + encuestas.encuesta.grupo + "'," + encuestas.encuesta.grado + ",'" + encuestas.encuesta.calle + "','" + encuestas.encuesta.num_ext + "','" + encuestas.encuesta.num_int + "','" + encuestas.encuesta.cve_asenta + "','" + encuestas.encuesta.cve_municipio + "','" + encuestas.encuesta.cve_estado + "','" + encuestas.encuesta.fecha_creacion + "')";
    let respuestas = null;
    let id_encuesta = null;
    console.log(query);

    pool.query(query, (err, res) => {
        if (err) {
            console.log(err.stack)
            response.status(500).json(500);
        } else {

            res.rows.forEach(i => id_encuesta = i["fn_registrar_encuestas"]);
            respuestas = encuestas.respuesta.map(r => {
                r.id_encuesta = id_encuesta
                return r;
            });
            historial_respuestas = encuestas.historial_respuesta.map(r => {
                r.id_encuesta = id_encuesta
                return r;
            });

            knex('respuesta').insert(respuestas)
                .then(function (e) {
                    console.log(e)
                })
                .catch((err) => {
                    console.log(err);
                    throw err;
                });

            knex('historial_respuesta').insert(historial_respuestas)
                .then(function (e) {
                    console.log(e)
                }).catch((err) => {
                    throw err
                });

            response.status(200).json(200);
        }
    });
}

const consultaWebService = (request, response) => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;

    if (encrypt == 1) {

        var info = {
            version: aes256.encrypt(key, "1.0"),
            fecha: aes256.encrypt(key, today),
            licencia: aes256.encrypt(key, "Perpetua"),
            vigencia: aes256.encrypt(key, "-")
        };
    } else {
        var info = {
            version: "1.0",
            fecha: today,
            licencia: "Perpetua",
            vigencia: "-"
        };
    }
    createLog(response.send(info))
}


module.exports = {
    getCatalogoSexo,
    getCatalogoEstado,
    getCatalogoMunicipio,
    getCatalogoNivel,
    getCatalogoEscuela,
    getCatalogoAsentamiento2,
    getCatalogoLugar,
    getCatalogoTipoAsentamiento,
    getCatalogoAsentamineto,
    getDatosEscuela,
    getPreguntas,
    validatePIN,
    registrar_encuesta,
    registrar_encuesta_escuela,
    registrar_respuesta,
    registrar_historial_respuesta,
    registrar_encuestas,
    consultaWebService
}