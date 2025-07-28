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
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
        console.error('ERRO: JWT_SECRET não está definido nas variáveis de ambiente em authMiddleware!');
        return res.status(500).json({ message: 'Erro de configuração do servidor: JWT_SECRET não encontrado.' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    console.log('DEBUG VERIFY: Token decodificado (payload):', decoded);
    console.log('DEBUG VERIFY: ID do usuário no payload:', decoded.id_usuario);
    console.log('DEBUG VERIFY: Tipo de usuário no payload:', decoded.tipo_usuario);
    
    req.user = decoded; 
    console.log('DEBUG: Token válido para usuário:', req.user.id_usuario); 
    next();
  } catch (error) {
    console.log('DEBUG: Token inválido:', error.message);
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ success: false, message: 'Token expirado. Faça login novamente.' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ success: false, message: 'Token inválido ou malformado.' });
    }
    return res.status(403).json({ 
      success: false, 
      message: 'Token inválido ou expirado' 
    });
  }
};

authMiddleware.authorize = (allowedRoles) => {
  return (req, res, next) => {
    // --- NOVO LOG AQUI ---
    console.log('DEBUG AUTHORIZE: Middleware authorize executado.');
    console.log('DEBUG AUTHORIZE: req.user no authorize:', req.user);
    console.log('DEBUG AUTHORIZE: Tipo de usuário em req.user:', req.user ? req.user.tipo_usuario : 'N/A');
    console.log('DEBUG AUTHORIZE: Papéis permitidos:', allowedRoles);
    // --- FIM DO NOVO LOG ---

    if (!req.user) {
      console.log('DEBUG AUTHORIZE: Usuário não autenticado para autorização (req.user é nulo/undefined).');
      return res.status(401).json({ 
        success: false, 
        message: 'Usuário não autenticado' 
      });
    }

    if (!allowedRoles.includes(req.user.tipo_usuario)) {
      console.log(`DEBUG AUTHORIZE: Acesso negado. Usuário: ${req.user.tipo_usuario}, Permitidos: ${allowedRoles}`);
      return res.status(403).json({ 
        success: false, 
        message: 'Acesso negado. Permissões insuficientes.' 
      });
    }

    console.log('DEBUG AUTHORIZE: Usuário autorizado.');
    next();
  };
};

module.exports = authMiddleware;
