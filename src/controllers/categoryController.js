import * as categoryService from '../services/categoryService.js';

export async function index(req, res) {
  const categories = await categoryService.findAll(1); // userId temporário
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
  const category = await categoryService.create({
    name: req.body.name,
    userId: 1, // temporário até ter autenticação
  });

  return res.status(201).json(category);
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
