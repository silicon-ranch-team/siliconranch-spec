<!-- Thank you for contributing to the Silicon Ranch Spec Driven Development Framework! -->
<!-- Please fill out every section below. Incomplete PRs may be returned for revision. -->

## 🎯 PR Title

<!-- Replace the line above with a concise, descriptive title. Example: -->
<!-- feat(srsp-apply): add resumable sub-stage detection -->

---

## 📝 PR Description

<!-- Provide a short summary of what this PR does and why it matters. -->
<!-- Keep it to 2–4 sentences. -->

---

## 🔧 PR Changes

<!-- List the concrete changes introduced by this PR. -->
<!-- Use bullet points and reference files or skills where relevant. -->

- [ ] Change 1
- [ ] Change 2
- [ ] Change 3

---

## 💡 Why is this important?

<!-- Explain the problem this PR solves or the value it adds to the framework. -->
<!-- Connect it to a spec, issue, or documented limitation if applicable. -->

---

## 🚀 What use case does this enhance or resolve?

<!-- Describe the user/engineer scenario that benefits from these changes. -->
<!-- Example: "Engineers can now resume /srsp-apply from any sub-stage without losing context." -->

---

## 🧪 Evidence

<!-- Provide proof that the change works and does not break existing behavior. -->
<!-- This section is required. Include one or more of the following: -->

- [ ] Manual test steps and results.
- [ ] Screenshot / screen recording.
- [ ] Link to passing CI run or test output.
- [ ] Example spec or CLI command demonstrating the change.

<!-- If no evidence is applicable, explain why and note the risk. -->

---

## ✅ Checklist

- [ ] I have read the [Framework Guide](docs/spec-driven-framework.md).
- [ ] I have updated relevant documentation if needed.
- [ ] I have added or updated tests if applicable.
- [ ] I have run `srsp doctor` on the active spec (if this PR changes SRSP behavior).
- [ ] My commit messages follow the project convention.

---

## 🚀 Release Checklist (only for release branches)

- [ ] `package.json` version matches the release branch/tag (`release/vX.Y.Z` / `vX.Y.Z`).
- [ ] `CHANGELOG.md` has an entry for this version.
- [ ] `package-lock.json` is committed so `npm ci` can run in CI.
- [ ] The `Release Check` workflow is green on this PR.
- [ ] The npm automation token `NPM_TOKEN` is configured in GitHub Actions secrets.
- [ ] This PR targets `main` and was branched from `development`.
- [ ] The `Create Release Tag` workflow will create and push `vX.Y.Z` automatically after this PR merges.
