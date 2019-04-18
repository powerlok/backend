
const crypto = require("crypto");

const DADOS_CRIPTOGRAFAR = {
    algoritmo: "aes256",
    codificacao: "utf8",
    segredo: "laredo",
    tipo: "hex"
};

var Utils = {
    replaceAll: function (string, token, newtoken) {

        if (string != null && string != undefined) {
            while (string.indexOf(token) != -1) {
                string = string.replace(token, newtoken);
            }
        } else {
            string = null;
        }

        return string;
    },
    criptografar(senha) {
        const cipher = crypto.createCipher(DADOS_CRIPTOGRAFAR.algoritmo, DADOS_CRIPTOGRAFAR.segredo);
        cipher.update(senha);
        return cipher.final(DADOS_CRIPTOGRAFAR.tipo);
    },
    descriptografar(senha) {
        const decipher = crypto.createDecipher(DADOS_CRIPTOGRAFAR.algoritmo, DADOS_CRIPTOGRAFAR.segredo);
        decipher.update(senha, DADOS_CRIPTOGRAFAR.tipo);
        return decipher.final();
    },
    dateToEN(data) {
        var _data = data.split("/");
        var dia = _data[0];
        var mes = _data[1];
        var _d = _data[2].split(" ");
        var ano = _d[0];
        var hora = _d[1];

        return ano + '-' + ("0" + mes).slice(-2) + '-' + ("0" + dia).slice(-2) + ' ' + hora;
    },
    convertTime(time) {
        var _time = time.split('min');
        var second = (_time[1] != undefined) ? _time[1].replace('s', '') : "00";

        if (_time[0] != null && _time[1] != null) {
            if (("0" + _time[0]).slice(-2) + ':' + ("0" + second).slice(-2) != null) return ("0" + _time[0]).slice(-2) + ':' + ("0" + second).slice(-2);
        } else {
            if (_time[0] != null) return ("0" + _time[0]).replace('s', '').slice(-2);
        }

        return null;
    },
    download(uri, callback) {
        var request = require('request').defaults({ encoding: null });

        request.get(uri, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var data = "data:" + response.headers["content-type"] + ";base64," + new Buffer(body).toString('base64');
                callback(data);
            }
        });
    }
}

module.exports = Utils;