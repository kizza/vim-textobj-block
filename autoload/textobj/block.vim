function! textobj#block#inner()
  let current_linenr = line(".")
  let above_blank = s:is_blank(current_linenr - 1)
  let below_blank = s:is_blank(current_linenr + 1)

  let up_linenr = textobj#block#directional#exclusive_up()[1][1]
  if s:jumping_to_same_indent(up_linenr, current_linenr)
    let up_linenr = current_linenr
    while !s:is_blank(up_linenr - 1)
      let up_linenr -= 1
    endwhile
  endif

  let down_linenr = textobj#block#directional#exclusive_down()[2][1]
  if s:jumping_to_same_indent(current_linenr, down_linenr)
    let down_linenr = current_linenr
    while !s:is_blank(down_linenr + 1)
      let down_linenr += 1
    endwhile
  endif

  return textobj#result(up_linenr, down_linenr)
endfunction

function! textobj#block#around()
  let current_linenr = line(".")
  let inner = textobj#block#inner()
  let up_linenr = inner[1][1]
  let down_linenr = inner[2][1]

  let trimming_up = v:false
  while s:is_blank(up_linenr - 1)
    let trimming_up = v:true
    let up_linenr -= 1
  endwhile

  let trimming_down = v:false
  while s:is_blank(down_linenr + 1)
    let trimming_down = v:true
    let down_linenr += 1
  endwhile

  " Leave a single line if trimming in both directions
  if trimming_up == v:true && trimming_down == v:true
    let up_linenr += 1
  end

  return textobj#result(up_linenr, down_linenr)
endfunction

"
" Helpers
"

function s:jumping_to_same_indent(start_linenr, end_linenr)
  let lines = range(a:start_linenr, a:end_linenr)
  let without_blank_lines = s:non_blank_lines(lines)
  let contains_blank_lines = len(lines) > len(without_blank_lines)

  let indents = without_blank_lines->map({_, linenr -> indent(linenr)})
  let all_indents_match = len(uniq(sort(indents))) == 1

  return contains_blank_lines && all_indents_match
endfunction

function s:non_blank_lines(lines)
  return copy(a:lines)->filter({_, linenr -> !s:is_blank(linenr)})
endfunction

function s:is_blank(linenr)
  if a:linenr >= 0 && a:linenr <= line("$")
    return trim(getline(a:linenr)) == ""
  else
    return v:false
  end
endfunction
