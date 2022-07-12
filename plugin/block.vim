if exists('g:loaded_textobj_block')
  finish
endif
let g:loaded_textobj_block = 1

call textobj#user#plugin('block', {
\   'up': {
\     'select-a-function': 'textobj#block#directional#inclusive_up',
\     'select-a': 'aK',
\     'select-i-function': 'textobj#block#directional#exclusive_up',
\     'select-i': 'iK',
\   },
\   'down': {
\     'select-a-function': 'textobj#block#directional#inclusive_down',
\     'select-a': 'aJ',
\     'select-i-function': 'textobj#block#directional#exclusive_down',
\     'select-i': 'iJ',
\   },
\   'block': {
\     'select-a-function': 'textobj#block#around',
\     'select-a': 'ab',
\     'select-i-function': 'textobj#block#inner',
\     'select-i': 'ib',
\   },
\ })
