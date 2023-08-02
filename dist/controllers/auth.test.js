"use strict";
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
const typeorm_1 = require("typeorm");
const bcrypt_1 = __importDefault(require("bcrypt"));
const authController_1 = require("./authController"); // Replace 'your-auth-module' with the correct path to your authentication module
const User_1 = require("../entities/User"); // Replace 'your-user-model' with the correct path to your User model
const Wallet_1 = require("../entities/Wallet"); // Replace 'your-wallet-model' with the correct path to your Wallet model
jest.mock('bcrypt');
jest.mock('uuid');
describe('Authentication functions', () => {
    const mockRequest = (body = {}) => ({
        body,
    });
    const mockResponse = () => {
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
    };
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('login function', () => {
        it('should return 404 if user is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = mockRequest({ email: 'test@example.com', password: 'testpassword' });
            const res = mockResponse();
            (0, typeorm_1.getRepository)(User_1.User).findOne = jest.fn().mockResolvedValue(undefined);
            yield (0, authController_1.login)(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'User not found.' });
        }));
        it('should return 401 if password is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = mockRequest({ email: 'test@example.com', password: 'testpassword' });
            const res = mockResponse();
            (0, typeorm_1.getRepository)(User_1.User).findOne = jest.fn().mockResolvedValue({ email: 'test@example.com', password: 'hashedpassword' });
            bcrypt_1.default.compare.mockResolvedValue(false);
            yield (0, authController_1.login)(req, res);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials.' });
        }));
        it('should return 401 if user is not active', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = mockRequest({ email: 'test@example.com', password: 'testpassword' });
            const res = mockResponse();
            (0, typeorm_1.getRepository)(User_1.User).findOne = jest.fn().mockResolvedValue({ email: 'test@example.com', password: 'hashedpassword', isActive: false });
            yield (0, authController_1.login)(req, res);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Account is disabled.' });
        }));
        it('should return 401 if user has an invitation token', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = mockRequest({ email: 'test@example.com', password: 'testpassword' });
            const res = mockResponse();
            (0, typeorm_1.getRepository)(User_1.User).findOne = jest.fn().mockResolvedValue({ email: 'test@example.com', password: 'hashedpassword', isActive: false, invitationToken: 'testToken' });
            yield (0, authController_1.login)(req, res);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'User needs to accept invitation.' });
        }));
        it('should return 200 with access token if login is successful', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = mockRequest({ email: 'test@example.com', password: 'testpassword' });
            const res = mockResponse();
            const mockUser = { email: 'test@example.com', password: 'hashedpassword', isActive: true, isAdmin: true };
            (0, typeorm_1.getRepository)(User_1.User).findOne = jest.fn().mockResolvedValue(mockUser);
            bcrypt_1.default.compare.mockResolvedValue(true);
            jest.mock('./authController');
            const { generateAccessToken } = require('./authController');
            generateAccessToken.mockReturnValue('testAccessToken');
            yield (0, authController_1.login)(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ accessToken: 'testAccessToken' });
        }));
    });
    describe('signup function', () => {
        it('should return 409 if user already exists', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = mockRequest({ name: 'Test User', email: 'test@example.com', password: 'testpassword', isAdmin: true });
            const res = mockResponse();
            (0, typeorm_1.getRepository)(User_1.User).findOne = jest.fn().mockResolvedValue({ email: 'test@example.com' });
            yield (0, authController_1.signup)(req, res);
            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.json).toHaveBeenCalledWith({ message: 'User already exists' });
        }));
        it('should return 500 if an error occurs during signup', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = mockRequest({ name: 'Test User', email: 'test@example.com', password: 'testpassword', isAdmin: true });
            const res = mockResponse();
            (0, typeorm_1.getRepository)(User_1.User).findOne = jest.fn().mockResolvedValue(undefined);
            jest.spyOn((0, typeorm_1.getRepository)(User_1.User), 'create').mockImplementationOnce(() => {
                throw new Error('Some error occurred');
            });
            yield (0, authController_1.signup)(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
        }));
        it('should create a new user and return 201 if signup is successful', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = mockRequest({ name: 'Test User', email: 'test@example.com', password: 'testpassword', isAdmin: true });
            const res = mockResponse();
            (0, typeorm_1.getRepository)(User_1.User).findOne = jest.fn().mockResolvedValue(undefined);
            jest.spyOn((0, typeorm_1.getRepository)(User_1.User), 'create').mockReturnValueOnce({});
            jest.spyOn((0, typeorm_1.getRepository)(User_1.User), 'save').mockResolvedValue({ id: 1,
                name: 'John Doe',
                email: 'test@example.com',
                password: 'hashedpassword',
                isAdmin: true,
                isActive: true,
                invitationToken: 'token',
                wallets: [], });
            //   const mockWallet = { id: 1, 
            //   name: 'Test Wallet',
            //   balance: 100,
            //   user: { id: 1 }, };
            const mockUser = {
                id: 1,
                name: 'John Doe',
                email: 'john@example.com',
                password: 'hashed_password',
                isAdmin: false,
                isActive: true,
                invitationToken: '',
                wallets: []
            };
            // Create a valid mock Wallet object with the required properties, including 'user'
            const mockWallet = {
                id: 1,
                name: 'Wallet Name',
                balance: 100,
                user: mockUser, // Use the mockUser object for the 'user' property
            };
            jest.spyOn((0, typeorm_1.getRepository)(Wallet_1.Wallet), 'create').mockReturnValueOnce(mockWallet);
            jest.spyOn((0, typeorm_1.getRepository)(Wallet_1.Wallet), 'save').mockResolvedValue(mockWallet);
            yield (0, authController_1.signup)(req, res);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ message: 'User created successfully', userData: { email: 'test@example.com', isAdmin: true } });
        }));
    });
    describe('acceptInvitation function', () => {
        it('should return 404 if user is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = mockRequest({ token: 'invalidToken' });
            const res = mockResponse();
            (0, typeorm_1.getRepository)(User_1.User).findOne = jest.fn().mockResolvedValue(undefined);
            yield (0, authController_1.acceptInvitation)(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token or user not found.' });
        }));
        it('should mark the user as active and return 200 if invitation is accepted', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = mockRequest({ token: 'validToken' });
            const res = mockResponse();
            const mockUser = { invitationToken: 'validToken', isActive: false, save: jest.fn() };
            (0, typeorm_1.getRepository)(User_1.User).findOne = jest.fn().mockResolvedValue(mockUser);
            yield (0, authController_1.acceptInvitation)(req, res);
            expect(mockUser.isActive).toBe(true);
            expect(mockUser.invitationToken).toBe('');
            expect(mockUser.save).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invitation accepted successfully.' });
        }));
        it('should return 500 if an error occurs during invitation acceptance', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = mockRequest({ token: 'validToken' });
            const res = mockResponse();
            (0, typeorm_1.getRepository)(User_1.User).findOne = jest.fn().mockRejectedValue(new Error('Some error occurred'));
            yield (0, authController_1.acceptInvitation)(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Error accepting invitation.' });
        }));
    });
});
