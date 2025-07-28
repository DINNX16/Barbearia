// src/middlewares/authMiddleware.js
console.log('DEBUG: Arquivo authMiddleware.js carregado'); 
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const authMiddleware = {};
authMiddleware.verifyToken = (req, res, next) => {
  console.log('DEBUG: Middleware verifyToken executado'); 
  const authHeader = req.headers.authorization || req.headers.Authorization;
  
  if (!authHeader) {
    return res.status(401).json({ 
      success: false, 
      message: 'Token de acesso requerido' 
    });
  }

  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : authHeader;

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Token de acesso requerido' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('DEBUG: Token válido para usuário:', decoded.id);
    req.user = decoded;
    next();
  } catch (error) {
    console.log('DEBUG: Token inválido:', error.message);
    return res.status(403).json({ 
      success: false, 
      message: 'Token inválido ou expirado' 
    });
  }
};
authMiddleware.authorize = (allowedRoles) => {
  return (req, res, next) => {
    console.log('DEBUG: Middleware authorize executado. Tipo de usuário:', req.user ? req.user.tipo_usuario : 'N/A'); 
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Usuário não autenticado' 
      });
    }

    if (!allowedRoles.includes(req.user.tipo_usuario)) {
      console.log(`DEBUG: Acesso negado. Usuário: ${req.user.tipo_usuario}, Permitidos: ${allowedRoles}`);
      return res.status(403).json({ 
        success: false, 
        message: 'Acesso negado. Permissões insuficientes.' 
      });
    }

    console.log('DEBUG: Usuário autorizado');
    next();
  };
};
module.exports = authMiddleware;
