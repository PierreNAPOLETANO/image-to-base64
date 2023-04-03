'use strict';

var fileSystem = require('fs');
var path = require('path');
var fetch = require('node-fetch');

function validUrl(url) {
    return /http(s)?:\/\/(\w+:?\w*@)?(\S+)(:\d+)?((?<=\.)\w+)+(\/([\w#!:.?+=&%@!\-/])*)?/gi.test(url);
}

function validTypeImage(image) {
    return /(?<=\S+)\.(jpg|png|jpeg)/gi.test(image);
}

function base64ToNode(buffer) {
    return buffer.toString('base64');
}

function readFileAndConvert(fileName) {
    if (fileSystem.statSync(fileName).isFile()) {
        return base64ToNode(fileSystem.readFileSync(path.resolve(fileName)).toString('base64'));
    }
    return null;
}

function isImage(urlOrImage) {
    return validTypeImage(urlOrImage) ? Promise.resolve(readFileAndConvert(urlOrImage)) : Promise.reject('[*] An error occured: Invalid image [validTypeImage === false]');
}

function imageToBase64(urlOrImage) {
    return validUrl(urlOrImage) ? fetch(urlOrImage).then(function (response) { return response.buffer(); }).then(base64ToNode) : isImage(urlOrImage);
}

module.exports = imageToBase64;
