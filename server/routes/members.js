const express = require("express");
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const db = require("../db");

const router = express.Router();

const storage = multer.diskStorage({
  destination: path.join(__dirname, "..", "uploads"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || ".jpg";
    cb(null, `${uuidv4()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Apenas arquivos de imagem são permitidos"));
    }
    cb(null, true);
  },
});

function toBool(value) {
  return value === "sim" || value === "true" || value === true ? 1 : 0;
}

function findFile(files, fieldname) {
  const found = files.find((f) => f.fieldname === fieldname);
  return found ? `/uploads/${found.filename}` : null;
}

// Monta os campos do titular e a lista de filhos a partir do body+arquivos.
// Usado tanto na criação quanto na edição: em edição, campos não alterados
// chegam via foto_atual/conjuge_foto_atual/fotoUrl (do filho) para preservar a foto existente.
function parsePayload(body, files) {
  const casado = toBool(body.casado);
  const temFilhos = toBool(body.tem_filhos);
  const trabalhoIgreja = toBool(body.trabalho_igreja);

  let filhos = [];
  if (temFilhos && body.filhos) {
    try {
      filhos = JSON.parse(body.filhos);
    } catch {
      filhos = [];
    }
  }

  const fotoPath = findFile(files, "foto") || body.foto_atual || null;
  const conjugeFotoPath = casado
    ? findFile(files, "conjuge_foto") || body.conjuge_foto_atual || null
    : null;

  return {
    memberFields: {
      nome: (body.nome || "").trim(),
      foto_path: fotoPath,
      data_nascimento: body.data_nascimento || null,
      data_conversao: body.data_conversao || null,
      endereco: body.endereco || null,
      casado,
      conjuge_nome: casado ? body.conjuge_nome || null : null,
      conjuge_data_nascimento: casado ? body.conjuge_data_nascimento || null : null,
      conjuge_foto_path: conjugeFotoPath,
      tem_filhos: temFilhos,
      trabalho_igreja: trabalhoIgreja,
      trabalho_descricao: trabalhoIgreja ? body.trabalho_descricao || null : null,
    },
    filhos: temFilhos && Array.isArray(filhos) ? filhos : [],
  };
}

function serializeMember(row, children) {
  return {
    id: row.id,
    nome: row.nome,
    fotoUrl: row.foto_path,
    dataNascimento: row.data_nascimento,
    dataConversao: row.data_conversao,
    endereco: row.endereco,
    casado: !!row.casado,
    conjuge: row.casado
      ? {
          nome: row.conjuge_nome,
          dataNascimento: row.conjuge_data_nascimento,
          fotoUrl: row.conjuge_foto_path,
        }
      : null,
    temFilhos: !!row.tem_filhos,
    filhos: children.map((c) => ({
      id: c.id,
      nome: c.nome,
      dataNascimento: c.data_nascimento,
      fotoUrl: c.foto_path,
    })),
    trabalhoIgreja: !!row.trabalho_igreja,
    trabalhoDescricao: row.trabalho_descricao,
    createdAt: row.created_at,
  };
}

// GET /api/members - lista todos
router.get("/", (req, res) => {
  const rows = db.prepare("SELECT * FROM members ORDER BY nome ASC").all();
  const childrenStmt = db.prepare("SELECT * FROM children WHERE member_id = ?");
  const members = rows.map((row) => serializeMember(row, childrenStmt.all(row.id)));
  res.json(members);
});

// GET /api/members/:id - detalhe
router.get("/:id", (req, res) => {
  const row = db.prepare("SELECT * FROM members WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "Irmão não encontrado" });
  const children = db.prepare("SELECT * FROM children WHERE member_id = ?").all(row.id);
  res.json(serializeMember(row, children));
});

const insertMemberStmt = db.prepare(`
  INSERT INTO members (
    nome, foto_path, data_nascimento, data_conversao, endereco,
    casado, conjuge_nome, conjuge_data_nascimento, conjuge_foto_path,
    tem_filhos, trabalho_igreja, trabalho_descricao
  ) VALUES (
    @nome, @foto_path, @data_nascimento, @data_conversao, @endereco,
    @casado, @conjuge_nome, @conjuge_data_nascimento, @conjuge_foto_path,
    @tem_filhos, @trabalho_igreja, @trabalho_descricao
  )
`);

const updateMemberStmt = db.prepare(`
  UPDATE members SET
    nome = @nome, foto_path = @foto_path, data_nascimento = @data_nascimento,
    data_conversao = @data_conversao, endereco = @endereco, casado = @casado,
    conjuge_nome = @conjuge_nome, conjuge_data_nascimento = @conjuge_data_nascimento,
    conjuge_foto_path = @conjuge_foto_path, tem_filhos = @tem_filhos,
    trabalho_igreja = @trabalho_igreja, trabalho_descricao = @trabalho_descricao
  WHERE id = @id
`);

const insertChildStmt = db.prepare(`
  INSERT INTO children (member_id, nome, data_nascimento, foto_path)
  VALUES (@member_id, @nome, @data_nascimento, @foto_path)
`);

const deleteChildrenStmt = db.prepare("DELETE FROM children WHERE member_id = ?");

function insertChildren(memberId, filhos, files) {
  filhos.forEach((filho, index) => {
    if (!filho || !filho.nome) return;
    insertChildStmt.run({
      member_id: memberId,
      nome: filho.nome,
      data_nascimento: filho.dataNascimento || null,
      foto_path: findFile(files, `filho_foto_${index}`) || filho.fotoUrl || null,
    });
  });
}

// POST /api/members - cria cadastro
router.post("/", upload.any(), (req, res) => {
  try {
    const body = req.body;
    const files = req.files || [];

    if (!body.nome || !body.nome.trim()) {
      return res.status(400).json({ error: "Nome é obrigatório" });
    }

    const { memberFields, filhos } = parsePayload(body, files);

    const runTransaction = db.transaction(() => {
      const info = insertMemberStmt.run(memberFields);
      const memberId = info.lastInsertRowid;
      insertChildren(memberId, filhos, files);
      return memberId;
    });

    const memberId = runTransaction();
    const row = db.prepare("SELECT * FROM members WHERE id = ?").get(memberId);
    const children = db.prepare("SELECT * FROM children WHERE member_id = ?").all(memberId);
    res.status(201).json(serializeMember(row, children));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao salvar cadastro" });
  }
});

// PUT /api/members/:id - edita cadastro existente
router.put("/:id", upload.any(), (req, res) => {
  try {
    const existing = db.prepare("SELECT * FROM members WHERE id = ?").get(req.params.id);
    if (!existing) return res.status(404).json({ error: "Irmão não encontrado" });

    const body = req.body;
    const files = req.files || [];

    if (!body.nome || !body.nome.trim()) {
      return res.status(400).json({ error: "Nome é obrigatório" });
    }

    const { memberFields, filhos } = parsePayload(body, files);
    const memberId = Number(req.params.id);

    db.transaction(() => {
      updateMemberStmt.run({ ...memberFields, id: memberId });
      deleteChildrenStmt.run(memberId);
      insertChildren(memberId, filhos, files);
    })();

    const row = db.prepare("SELECT * FROM members WHERE id = ?").get(memberId);
    const children = db.prepare("SELECT * FROM children WHERE member_id = ?").all(memberId);
    res.json(serializeMember(row, children));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar cadastro" });
  }
});

// DELETE /api/members/:id
router.delete("/:id", (req, res) => {
  const result = db.prepare("DELETE FROM members WHERE id = ?").run(req.params.id);
  if (result.changes === 0) {
    return res.status(404).json({ error: "Irmão não encontrado" });
  }
  res.status(204).end();
});

module.exports = router;
