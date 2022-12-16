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
exports.authenticateToken = exports.generateRefreshToken = exports.generateAccessToken = exports.tokenRefreshRouter = void 0;
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../database/database");
const dotenv = __importStar(require("dotenv"));
exports.tokenRefreshRouter = express_1.default.Router();
dotenv.config();
function generateAccessToken(userIdAndEmail) {
    return jsonwebtoken_1.default.sign(userIdAndEmail, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '20s',
    });
}
exports.generateAccessToken = generateAccessToken;
function generateRefreshToken(userIdAndEmail) {
    return __awaiter(this, void 0, void 0, function* () {
        const refreshToken = jsonwebtoken_1.default.sign(userIdAndEmail, process.env.REFRESH_TOKEN_SECRET);
        yield (0, database_1.pushRefreshToken)(refreshToken, userIdAndEmail.id);
        return refreshToken;
    });
}
exports.generateRefreshToken = generateRefreshToken;
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token)
        return res.sendStatus(401);
    jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, userIdAndEmail) => {
        if (err)
            return res.sendStatus(403);
        req.userIdAndEmail = userIdAndEmail;
        next();
    });
}
exports.authenticateToken = authenticateToken;
exports.tokenRefreshRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const refreshToken = req.body.token;
    if (!refreshToken)
        return res.sendStatus(401);
    const refreshTokenUser = (_a = (yield (0, database_1.findUserByRefreshToken)(refreshToken))) === null || _a === void 0 ? void 0 : _a.joyrUser;
    if (!refreshTokenUser)
        return res.sendStatus(403);
    jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decodedElement) => {
        if (err)
            return res.sendStatus(403);
        const decodedElementObject = JSON.parse(JSON.stringify(decodedElement));
        const userIdAndEmail = {
            id: decodedElementObject.id,
            email: decodedElementObject.email,
        };
        const newAccessToken = generateAccessToken(userIdAndEmail);
        res.send({ accessToken: newAccessToken });
        console.log('new access token generated');
    });
}));