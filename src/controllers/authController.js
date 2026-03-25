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
