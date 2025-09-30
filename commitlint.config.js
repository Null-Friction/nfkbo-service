module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // New feature
        'fix',      // Bug fix
        'security', // Security fix
        'refactor', // Code refactoring
        'perf',     // Performance improvements
        'test',     // Test additions/changes
        'docs',     // Documentation changes
        'style',    // Code style changes (formatting, etc.)
        'chore',    // Build/tooling changes
        'ci',       // CI/CD changes
        'revert',   // Revert previous commit
      ],
    ],
    'subject-case': [2, 'always', 'sentence-case'],
    'subject-max-length': [2, 'always', 100],
    'body-max-line-length': [2, 'always', 100],
  },
};
