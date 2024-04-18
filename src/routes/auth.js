import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { usersSchema } from '../models/users.js';
import { verificarTokenAdmin, verificarTokenUsuario } from '../middlewares/verificarToken.js';



export const authRouter = express.Router();

// Ruta para la autenticación de usuario
authRouter.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({ message: 'Email y contraseña son requeridos' });
      }
  
      const User = await usersSchema.findOne({ "datosCuenta.email": email });
      if (!User) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
  
      const passwordMatch = await bcrypt.compare(password, User.datosCuenta.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }
  
      const secretKey = process.env.JWT_SECRET || 'secreto';
      const token = jwt.sign({ userId: User._id, rol: User.datosCuenta.rol }, secretKey, { expiresIn: '1h' });
  
      res.status(200).cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' }).json({
        message: 'Autenticación exitosa',
        id: User._id,
        role: User.datosCuenta.rol
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  });
  



authRouter.post('/logout', async (req, res) => {
    res.cookie("token","",{
        expires:new Date(0)
    })
    return res.sendStatus(200);
});
authRouter.get('/user', verificarTokenUsuario, (req, res) => {
    res.json({ message: 'Acceso permitido para usuarios normales' });
});
authRouter.get('/admin', verificarTokenAdmin, (req, res) => {
    res.json({ message: 'Acceso permitido para administradores' });
});