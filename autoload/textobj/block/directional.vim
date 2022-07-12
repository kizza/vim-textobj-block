function! textobj#block#directional#inclusive_up()
  let current_linenr = line(".")
  let current_indent = indent(current_linenr)

  let prev_not_blank_less_indented = s:find_not_blank_less_indented(current_indent, "up")
  let start_linenr = prev_not_blank_less_indented + 1

  return textobj#result(start_linenr, current_linenr)
endfunction

function! textobj#block#directional#inclusive_down()
  let current_linenr = line(".")
  let current_indent = indent(current_linenr)

  " If we have no indent, there's nothing to match, so go to end of file
  if current_indent == 0
    let end_linenr = line("$")
  else
    let next_not_blank_less_indented = s:find_not_blank_less_indented(current_indent, "down")
    let end_linenr = max([current_linenr, next_not_blank_less_indented - 1])
  endif

  return textobj#result(current_linenr, end_linenr)
endfunction

function! textobj#block#directional#exclusive_down()
  let current_linenr = line(".")
  let current_indent = indent(current_linenr)

  let next_less_indented = s:find_not_blank_less_indented(current_indent, "down")
  let end_of_buffer = line("$")
  let threshold = min(s:strip_zeros(next_less_indented, end_of_buffer))

  let indentation_range = range(current_linenr, threshold)
  let [start_linenr, end_linenr] = s:traverse_indentation(indentation_range)
  return textobj#result(start_linenr, end_linenr)
endfunction

function! textobj#block#directional#exclusive_up()
  let current_linenr = line(".")
  let current_indent = indent(current_linenr)

  let prev_less_indented = s:find_not_blank_less_indented(current_indent, "up")
  let start_of_buffer = 1
  let threshold = max(s:strip_zeros(prev_less_indented, start_of_buffer))

  let indentation_range = reverse(range(threshold, current_linenr))
  let [end_linenr, start_linenr] = s:traverse_indentation(indentation_range)
  return textobj#result(start_linenr, current_linenr)
endfunction

function s:traverse_indentation(scope)
  let start_linenr = a:scope[0]
  let end_linenr = a:scope[0]
  let current_indent = indent(start_linenr)
  let debug = []

  let SameIndent = {linenr -> indent(linenr) == current_indent}
  let LessIndent = {linenr -> indent(linenr) < current_indent}
  let Blank = {linenr -> trim(getline(linenr)) == ""}
  let Selection = { -> s:safe_range(start_linenr, end_linenr)}
  let UniqueSelectionIndents = { -> uniq(sort(Selection()->map({_, linenr -> indent(linenr)}))) }
  let AllSameIndents = { linenr -> [indent(linenr)] == UniqueSelectionIndents() }
  let Break = { -> v:false }
  let Debug = { text -> add(debug, text) }

  for i in a:scope
    if Break()
      " Debug("breaking on ".i)
      break
    endif

    if i == start_linenr
      call Debug("current-line")
    elseif SameIndent(i) && !Blank(i) && AllSameIndents(i)
      let end_linenr = i
      let Break = { -> !SameIndent(i) || Blank(i) }
      call Debug("same-consecutive-indentation")
    elseif SameIndent(i) && !Blank(i)
      let end_linenr = i
      call Debug("found-match")
      break
    elseif LessIndent(i) && !Blank(i)
      let Break = { -> v:true }
      call Debug("less-indent")
    elseif Blank(i)
      call Debug("blank")
    else
      let end_linenr = i
      call Debug("select")
    endif
  endfor

  if get(g:, "textobj#indent#directional#debug") == v:true
    call setline(1, join(debug))
  end

  return [start_linenr, end_linenr]
endfunction

"
" Helpers
"

function s:safe_range(start_linenr, end_linenr)
  if a:start_linenr < a:end_linenr
    return range(a:start_linenr, a:end_linenr)
  else
    return reverse(range(a:end_linenr, a:start_linenr))
  endif
endfunction

function s:add_if_found(number, add)
  if a:number == 0
    return a:number
  else
    return a:number + a:add
  endif
endfunction

function s:strip_zeros(...)
  return copy(a:000)->filter({_, value-> value != 0})
endfunction

function s:is_blank(linenr)
  if a:linenr >= 0 && a:linenr <= line("$")
    return trim(getline(a:linenr)) == ""
  else
    return v:false
  end
endfunction

"
" Search types
"

function s:find_same_indented(current_indent, direction)
  let flags = s:search_flags(a:direction)
  return search('^\s\{'.(a:current_indent).'}\S', flags)
endfunction

function s:find_less_indented(current_indent, direction)
  let flags = s:search_flags(a:direction)
  return search('^\(\s\{'.(a:current_indent).'}\)\@!', flags)
endfunction

function s:find_not_blank_less_indented(current_indent, direction)
  let flags = s:search_flags(a:direction)
  return search('^\(\s\{'.(a:current_indent).'}\)\@![^$]', flags)
endfunction

function s:find_blank(direction)
  let flags = s:search_flags(a:direction)
  return search('^\s*$', flags)
endfunction

" 'b' search Backward instead of forward
" 'n' do Not move the cursor
" 'W' don't Wrap around the end of the file
" 'z' start searching at the cursor column instead of Zero
function s:search_flags(direction)
  if a:direction == "up"
    return "nbzW"
  else
    return "nW"
  end
endfunction
