"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = exports.handleRefreshTokens = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../database/database");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
function generateAccessToken(user) {
    return jsonwebtoken_1.default.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '30s',
    });
}
exports.generateAccessToken = generateAccessToken;
function generateRefreshToken(user) {
    const refreshToken = jsonwebtoken_1.default.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });
    (0, database_1.pushRefreshToken)(refreshToken, user.id);
    return refreshToken;
}
exports.generateRefreshToken = generateRefreshToken;
function handleRefreshTokens(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const refreshToken = req.body.refreshToken;
        if (!refreshToken)
            return res.sendStatus(401);
        console.log(refreshToken);
        const foundUser = (_a = (yield (0, database_1.findUserByRefreshToken)(refreshToken))) === null || _a === void 0 ? void 0 : _a.joyrUser;
        if (!foundUser)
            return res.sendStatus(403);
        jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err || user.id !== foundUser.id) {
                return res.sendStatus(403);
            }
            res.send(generateAccessToken(user)).status(200);
        });
    });
}
exports.handleRefreshTokens = handleRefreshTokens;
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader)
        return res.sendStatus(401);
    console.log(authHeader);
    const token = authHeader && authHeader.split(' ')[1];
    if (!token)
        return res.sendStatus(401);
    jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err)
            return res.sendStatus(403);
        req.user = user;
        next(user);
    });
}
exports.authenticateToken = authenticateToken;
