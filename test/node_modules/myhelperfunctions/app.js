const Joi = require("joi");
const fs = require("fs");
const ini = require("ini");

/**
 * Append zero to length.
 * @param {string} value Value to append zero.
 * @param {number} length Needed length.
 * @returns {string} String with appended zeros id need it.
 */
function appendZeroToLength(value, length) {
  return `${value}`.padStart(length, 0);
}

/**
 * Get date as text.
 * @returns {string} Date as text. Sample: "2018.12.03, 07:32:13.0162 UTC".
 */
function getDateAsText() {
  var currentdate = new Date();
  const nowText =
    currentdate.getFullYear() +
    "." +
    appendZeroToLength(currentdate.getMonth() + 1, 2) +
    "." +
    currentdate.getDate() +
    ", " +
    currentdate.getHours() +
    ":" +
    currentdate.getMinutes() +
    ":" +
    currentdate.getSeconds() +
    "." +
    currentdate.getMilliseconds() +
    " UTC";
  return nowText;
}

/**
 * Log to file.
 * @param {string} text Text to log.
 * @param {string} [file] Log file path.
 */
const logToFile = (text, file) => {
  // Define file name.
  const now = new Date();
  file = `log/${file}-${now.getDate()}.log`;
  const filename =
    file !== undefined ? file : `log/default-${now.getDate()}.log`;

  // Define log text.
  const logText = getDateAsText() + " -> " + text + "\r\n";

  // Save log to file.
  fs.appendFile(filename, logText, "utf8", function (error) {
    if (error) {
      // If error - show in console.
      console.log(getDateAsText() + " -> " + error);
    }
  });
};

function getConfigurationParameter(parameterName, defaultValue, aFile) {
  var result;
  if (aFile === "") {
    aFile = "gimtelProcessor";
  }
  let config = ini.parse(fs.readFileSync(`/etc/code/${aFile}.ini`, "utf-8"));
  if (config[parameterName] === undefined) {
    return (result = config[defaultValue]);
  }
  return config[parameterName];
}

function setConfigurationParameter(parameterName, value, aFile) {
  if (aFile === "") {
    aFile = "gimtelProcessor";
  }
  let config = ini.parse(fs.readFileSync(`/etc/code/${aFile}.ini`, "utf-8"));
  config[parameterName] = value;
  fs.writeFileSync(
    `/etc/code/${aFile}.ini`,
    ini.stringify(config, { section: "" })
  );
}

function validateSchema(body, Modelschema) {
  const schema = Joi.object(Modelschema);
  const { error, value } = schema.validate(body);
  return { error, value };
}

function getCurrentDateTime() {
  var currentdate = new Date();
  var currentDateTime =
    currentdate.getFullYear() +
    "-" +
    appendZeroToLength(currentdate.getMonth() + 1, 2) +
    "-" +
    appendZeroToLength(currentdate.getDate(), 2) +
    " " +
    currentdate.getHours() +
    ":" +
    currentdate.getMinutes() +
    ":" +
    currentdate.getSeconds();
  return currentDateTime;
}

function toTimestamp(strDate) {
  var datum = Date.parse(strDate);
  return datum / 1000;
}

function getCurrentDateTimeHours() {
  var currentdate = new Date();
  var currentDateTime =
    currentdate.getFullYear() +
    "-" +
    appendZeroToLength(currentdate.getMonth() + 1, 2) +
    "-" +
    currentdate.getDate() +
    " " +
    currentdate.getHours() +
    ":00";

  return currentDateTime;
}

function getCurrentDateTimeHoursMinutes() {
  var currentdate = new Date();
  var currentDateTime =
    currentdate.getFullYear() +
    "-" +
    appendZeroToLength(currentdate.getMonth() + 1, 2) +
    "-" +
    currentdate.getDate() +
    "" +
    currentdate.getHours() +
    ":" +
    currentdate.getMinutes();

  return currentDateTime;
}

const helper = {
  validateSchema: validateSchema,
  log: logToFile,
  getConfigurationParameter: getConfigurationParameter,
  getCurrentDateTime: getCurrentDateTime,
  getCurrentDateTimeHours: getCurrentDateTimeHours,
  setConfigurationParameter: setConfigurationParameter,
  getCurrentDateTimeHoursMinutes: getCurrentDateTimeHoursMinutes,
  toTimestamp: toTimestamp,
};
module.exports = {
  helper: helper,
};
