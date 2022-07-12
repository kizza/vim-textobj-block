function textobj#result(start_linenr, end_linenr)
  return ['V',
  \  [0, a:start_linenr, 1, 0],
  \  [0, a:end_linenr, len(getline(a:end_linenr)) + 1, 0]]
endfunction
