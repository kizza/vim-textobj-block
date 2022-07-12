# A vim text object for blocks

This plugin allows the expression of matching indentation (blocks), in their entirety, or just above-or-below the current lines.

I've been a massive fan of [vim-textobj-indent](https://github.com/kana/vim-textobj-indent) for a long time.  This additional [vim-textobj-user](https://github.com/kana/vim-textobj-user) aspires for similar functionality - but with the ability to match closing syntax, and to specify `up` or `down` from the current cursor.


## How to use it

The default mappings use `ib` and `ab` for to denoate _around block_ and _inner block_. _Around block_ will include the selection of blank lines (for changing ordeleting a block `cab` or `dab`)

The mappings also allow `iJ` and `iK` for specifying an upper or lower direction within a block. (rather than only being able to work with the entire bloc). You can also use `aJ` and `aK` to all the block matching to extend to include further similarly intended block.

Perhaps the examples below are the best way to describe it.




## Examples

In the below examples `>` denoates the line the cursor starts on, and `|` shows which lines will be referenced (the textobj).

You could substitute `v` below for anyother vim command - such as `d`, `c`, `>` etc



***Inner block***

`ib` select a block (with a matching closing indent, or contiguous indentation)

```
code
 >|code code
  |  code
  |code

   code
code
```



```
code
 >|code
  |code
  |code

   code
code
```



***Around block***

`ab` the same as above but including blank lines (perfect for changing or removing cleanly)

```
code
 >|code code
  |  code
  |code
  |
   code
code
```



```
code
   code

 >|code code
  |  code
  |code
  |
   code
code
```



### Directional elements

For greater precision over _entire_ blocks you can specify just the upper or lower portions.  when interacting with nested indentation I'm often in between the open or close of a block - and just need a _direction_ for an indentation reference to express my intent.

Using `i` (_inner_) or `a` _(around)_ allows you to specify just the block the cursor is on - or to cascade through to blocks on the same indentation.



***Exclusive* indent down**

`viJ` select down to the matching indentation

```
code
   code
 >|code code
  |  code
  |code

   code
code
```



***Inclusive* indent down**

`vaJ` select down to the matching indentation (as well as subsequent matches)

```
code
   code
 >|code code
  |  code
  |code
  |
  |code
code
```



***Exclusive* indent up**

`viK` select up to the matching indentation

```
code
   code

  |code code
  |  code
 >|code
code
```



***Inclusive* indent up**

`vaK` select up to the matching indentation (as well as subsequent matches)

```
code
  |code
  |
  |code code
  |  code
 >|code
code
```
