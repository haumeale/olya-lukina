export default {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-tailwindcss'
  ],
  overrides: [
    {
      files: ['**/*.vue'],
      customSyntax: 'postcss-html',
    },
  ],
}