import * as authService from '../services/authService.js';

export async function register(req, res) {
  try {
    const user = await authService.register(req.body);
    return res.status(201).json(user);
  } catch (error) {
    if (error.message === 'EMAIL_ALREADY_EXISTS') {
      return res.status(409).json({ error: 'Email já cadastrado' });
    }
    throw error;
  }
}

export async function login(req, res) {
  try {
    const result = await authService.login(req.body);
    return res.json(result);
  } catch (error) {
    if (error.message === 'INVALID_CREDENTIALS') {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }
    throw error;
  }
}

export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email é obrigatório' });
    }

    await authService.forgotPassword(email);

    return res.json({
      message: 'Se o email existir, você receberá um link de recuperação',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

export async function resetPassword(req, res) {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res
        .status(400)
        .json({ error: 'Token e nova senha são obrigatórios' });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: 'A senha deve ter no mínimo 6 caracteres' });
    }

    await authService.resetPassword(token, password);

    return res.json({ message: 'Senha alterada com sucesso' });
  } catch (error) {
    if (error.message === 'TOKEN_INVALID_OR_EXPIRED') {
      return res.status(400).json({ error: 'Token inválido ou expirado' });
    }
    console.error('Reset password error:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
