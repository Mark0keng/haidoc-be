const _ = require("lodash");
const path = require("path");
const request = require("supertest");

const db = require("../../models");
const authApi = require("../../api/auth");
const authHelper = require("../../helpers/authHelper");

let apiUrl;

let login;
