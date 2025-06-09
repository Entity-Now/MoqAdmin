module.exports = {
    'env': {
        'browser': true,
        'es2021': true,
        'node': true
    },
    'extends': [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:vue/vue3-essential'
    ],
    'overrides': [{
        'env': {
            'node': true
        },
        'files': [
            '.eslintrc.{js,cjs}'
        ],
        'parserOptions': {
            'sourceType': 'script'
        }
    }],
    'parserOptions': {
        'ecmaVersion': 'latest',
        'parser': '@typescript-eslint/parser',
        'sourceType': 'module'
    },
    'plugins': [
        '@typescript-eslint',
        'vue'
    ],
    'rules': {
        'no-var': 'off',
        'no-empty': 'off',
        'no-undef': 'off',
        'no-shadow': 'off',
        'no-console': 'off',
        'no-debugger': 'off',
        'no-lone-blocks': 'off',
        'no-extra-parens': 'off',
        'no-multi-spaces': 'off',
        'no-empty-function': 'off',
        'no-duplicate-case': 'off',
        'no-redeclare': 'off',
        'no-func-assign': 'off',
        'no-unreachable': 'off',
        'no-else-return': 'off',
        'no-return-assign': 'off',
        'no-return-await': 'off',
        'no-self-compare': 'off',
        'no-useless-catch': 'off',
        'no-useless-return': 'off',
        'no-mixed-spaces-and-tabs': 'off',
        'no-multiple-empty-lines': 'off',
        'no-trailing-spaces': 'off',
        'no-useless-call': 'off',
        'no-delete-var': 'off',
        'no-useless-escape': 'off',
        'dot-notation': 'off',
        'default-case': 'off',
        'eqeqeq': 'off',
        'curly': 'off',
        'space-before-blocks': 'off',
        'space-in-parens': 'off',
        'space-infix-ops': 'off',
        'space-unary-ops': 'off',
        'arrow-spacing': 'off',
        'array-bracket-spacing': 'off',
        'brace-style': 'off',
        'camelcase': 'off',
        'max-depth': ['off', 4],
        'max-statements': ['off', 100],
        'max-nested-callbacks': ['off', 3],
        'max-statements-per-line': ['off', {
            max: 1
        }],
        'quotes': ['off', 'single', 'avoid-escape'],
        'switch-case-space': 'off',
        'switch-colon-spacing': 'off',
        'switch-space': [0, 'always'],
        'semi': ['off', 'never'],
        'indent': [
            'off',
            4,
            {
                'SwitchCase': 1
            }
        ],

        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/no-explicit-any': 'off',

        'vue/require-default-prop': 'off',
        'vue/prefer-import-from-vue': 'off',
        'vue/multi-word-component-names': 'off',
        'vue/singleline-html-element-content-newline': 'off',
        'vue/multiline-html-element-content-newline': 'off',
        'vue/max-attributes-per-line': ['off', {
            singleline: 5
        }],
        'vue/html-indent': ['off', 4, {
            'attribute': 1,
            'baseIndent': 1,
            'closeBracket': 0,
            'alignAttributesVertically': true,
            'ignores': []
        }],
        'vue/html-self-closing': ['error', {
            'html': {
                'void': 'always',
                'normal': 'never',
                'component': 'always'
            },
            'svg': 'always',
            'math': 'always'
        }]
    }
}