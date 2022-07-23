import assert from "assert";
import {getBuffer, setBuffer, vimRunner} from "nvim-test-js";
import * as path from "path";

const withVim = vimRunner(
  {vimrc: path.resolve(__dirname, "../", "helpers", "vimrc.vim")}
)

describe("No indentation", () => {
  describe("downs", () => {
    const buffer = [
      "f|irst",
      "  foo",
      "end",
      "",
      "second",
      "  foo",
      "end",
    ]

    it("exclusive downs", () =>
      withVim(async nvim => {
        await setBuffer(nvim, buffer, "ruby");

        await nvim.command('execute("normal diJ")')

        const expected = [
          "",
          "second",
          "  foo",
          "end",
        ]
        assert.equal(await getBuffer(nvim), expected.join("\n"))
      }));

    it("inclusive downs", () =>
      withVim(async nvim => {
        await setBuffer(nvim, buffer, "ruby");

        await nvim.command('execute("normal daJ")')

        assert.equal(await getBuffer(nvim), [])
      }));
  })

  describe("ups", () => {
    const buffer = [
      "first",
      "  foo",
      "end",
      "",
      "second",
      "  foo",
      "e|nd",
    ]

    it("exclusive ups", () =>
      withVim(async nvim => {
        await setBuffer(nvim, buffer, "ruby");

        await nvim.command('execute("normal diK")')

        const expected = [
          "first",
          "  foo",
          "end",
          "",
        ]
        assert.equal(await getBuffer(nvim), expected.join("\n"))
      }));

    it("inclusive ups", () =>
      withVim(async nvim => {
        await setBuffer(nvim, buffer, "ruby");

        await nvim.command('execute("normal daK")')

        assert.equal(await getBuffer(nvim), [])
      }));
  })

  describe("consecutive", () => {
    const buffer = [
      "f|irst",
      "second",
      "third",
      "",
      "fourth",
    ]

    it("exclusive downs", () =>
      withVim(async nvim => {
        await setBuffer(nvim, buffer, "ruby");

        await nvim.command('execute("normal diJ")')

        const expected = [
          "",
          "fourth",
        ]
        assert.equal(await getBuffer(nvim), expected.join("\n"))
      }));

    it("inclusive downs", () =>
      withVim(async nvim => {
        await setBuffer(nvim, buffer, "ruby");

        await nvim.command('execute("normal daJ")')

        assert.equal(await getBuffer(nvim), [])
      }));
  })
})
