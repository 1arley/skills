# 1arley Skills

Catálogo de skills autorais. Estrutura baseada no layout do [mattpocock/skills](https://github.com/mattpocock/skills) (MIT). Cada pacote fica em `skills/<bucket>/<nome>/SKILL.md`.

## Buckets

- `engineering/`: trabalho diário de código
- `productivity/`: ferramentas de workflow não-código
- `misc/`: mantidas, raramente usadas, não promovidas
- `in-progress/`: beta
- `deprecated/`: não usadas mais

## Skills promovidas

### User-invoked

Claude Code marks these as user-invoked. The matching Codex invocation metadata is not present yet.

- [decision-to-adr](./skills/engineering/decision-to-adr/SKILL.md): Converte registros de decisão em ADRs numerados, preservando a proveniência.
- [grill-with-jev](./skills/productivity/grill-with-jev/SKILL.md): Conduz decisões em rodadas com respostas do JEV validadas por schema.

### Model-invoked

- [code-review](./skills/engineering/code-review/SKILL.md): Revisa um diff segundo os padrões do repositório e a especificação de origem.
- [feature-orchestrator](./skills/engineering/feature-orchestrator/SKILL.md): Coordena a entrega de features não triviais por etapas delimitadas.
- [rails-architecture](./skills/engineering/rails-architecture/SKILL.md): Orienta onde colocar comportamento em aplicações Rails.
- [rails-performance](./skills/engineering/rails-performance/SKILL.md): Investiga e melhora desempenho em aplicações Rails.
- [ruby-style](./skills/engineering/ruby-style/SKILL.md): Orienta convenções práticas de Ruby para código e revisão.
- [ruby-testing](./skills/engineering/ruby-testing/SKILL.md): Ajuda a projetar e depurar testes Ruby confiáveis.
- [rust-architecture](./skills/engineering/rust-architecture/SKILL.md): Orienta limites de módulos e crates e o desenho de APIs em Rust.
- [rust-performance](./skills/engineering/rust-performance/SKILL.md): Mede gargalos de desempenho em Rust antes de otimizar.
- [rust-style](./skills/engineering/rust-style/SKILL.md): Orienta Rust idiomático alinhado às convenções do projeto.
- [rust-testing](./skills/engineering/rust-testing/SKILL.md): Ajuda a projetar e diagnosticar testes em Rust.
- [scoped-git-workflow](./skills/engineering/scoped-git-workflow/SKILL.md): Organiza commits convencionais e push sem absorver mudanças alheias.

## Instalar

```sh
npx skills add 1arley/skills --skill <nome>
npx skills add 1arley/skills --all
```
