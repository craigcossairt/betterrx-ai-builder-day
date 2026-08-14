Vendored from https://github.com/cursor/plugins/tree/main/pstack

- Upstream commit: `2a8044425c7bddf429c3bdedf3ab61e791d34d65`
- License: MIT (see `LICENSE`, copyright Lauren Tan)
- Do not edit skill bodies here to "fix" pstack. Change the wrappers under `.claude/skills/poteto-mode` and `.claude/skills/setup-pstack`, or refresh the tree.

Refresh:

```bash
git clone --depth 1 --filter=blob:none --sparse https://github.com/cursor/plugins.git /tmp/cursor-plugins
git -C /tmp/cursor-plugins sparse-checkout set pstack
rm -rf vendor/pstack
cp -a /tmp/cursor-plugins/pstack vendor/pstack
git -C /tmp/cursor-plugins rev-parse HEAD
```

Then update the commit SHA in this file.
