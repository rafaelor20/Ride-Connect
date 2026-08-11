#!/bin/bash
set -e

echo "=== [1/4] Parando containers anteriores e limpando volumes ==="
docker compose down -v --remove-orphans 2>/dev/null || true
docker compose -f docker-compose.dbreset.yml down -v --remove-orphans 2>/dev/null || true

echo "=== [2/4] Iniciando PostgreSQL 17 Alpine ==="
docker compose -f docker-compose.dbreset.yml up -d postgres

echo "=== [3/4] Executando migracoes e seed de dados no PostgreSQL (Stage Builder) ==="
docker compose -f docker-compose.dbreset.yml build
docker compose -f docker-compose.dbreset.yml run --rm db-reset

echo "=== [4/4] Subindo aplicacao completa com imagens multi-stage otimizadas (PostgreSQL, Node, React, Nginx) ==="
docker compose up -d --build

echo ""
echo "=========================================================================="
echo "  Ride Connect iniciado com sucesso com Multi-Stage Build!"
echo "  Banco de dados: PostgreSQL 17 Alpine ativo e populado com seed!"
echo "  Status dos containers:"
docker compose ps
echo ""
echo "  Acesse a aplicacao em: http://localhost:8080"
echo "  Credenciais de teste do seed:"
echo "    - Email: user@test.com"
echo "    - Senha: user1Password123 (ou qwerasdf para o Main User)"
echo "=========================================================================="
