import * as categoryService from '../services/categoryService.js';

export async function index(req, res) {
  const categories = await categoryService.findAll(req.userId);
  return res.json(categories);
}

export async function show(req, res) {
  const category = await categoryService.findById(Number(req.params.id));

  if (!category) {
    return res.status(404).json({ error: 'Categoria não encontrada' });
  }

  return res.json(category);
}

export async function store(req, res) {
  try {
    const category = await categoryService.create({
      name: req.body.name,
      userId: req.userId,
    });

    return res.status(201).json(category);
  } catch (error) {
    if (error.message === 'CATEGORY_ALREADY_EXISTS') {
      return res.status(409).json({ error: 'Categoria já existe' });
    }
    throw error;
  }
}

export async function update(req, res) {
  const category = await categoryService.update(
    Number(req.params.id),
    req.body,
  );

  if (!category) {
    return res.status(404).json({ error: 'Categoria não encontrada' });
  }

  return res.json(category);
}

export async function remove(req, res) {
  const category = await categoryService.remove(Number(req.params.id));

  if (!category) {
    return res.status(404).json({ error: 'Categoria não encontrada' });
  }

  return res.json({
    message: 'Categoria deletada com sucesso',
    deleted: category,
  });
}
