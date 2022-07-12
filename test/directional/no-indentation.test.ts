import assert from "assert";
import {getLines, populateBuffer} from "../helpers/buffer";
import {withVim} from "../helpers/vim";

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
        await populateBuffer(nvim, buffer, "ruby");

        await nvim.command('execute("normal diJ")')

        const expected = [
          "",
          "second",
          "  foo",
          "end",
        ]
        assert.equal(await getLines(nvim), expected.join("\n"))
      }));

    it("inclusive downs", () =>
      withVim(async nvim => {
        await populateBuffer(nvim, buffer, "ruby");

        await nvim.command('execute("normal daJ")')

        assert.equal(await getLines(nvim), [])
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
        await populateBuffer(nvim, buffer, "ruby");

        await nvim.command('execute("normal diK")')

        const expected = [
          "first",
          "  foo",
          "end",
          "",
        ]
        assert.equal(await getLines(nvim), expected.join("\n"))
      }));

    it("inclusive ups", () =>
      withVim(async nvim => {
        await populateBuffer(nvim, buffer, "ruby");

        await nvim.command('execute("normal daK")')

        assert.equal(await getLines(nvim), [])
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
        await populateBuffer(nvim, buffer, "ruby");

        await nvim.command('execute("normal diJ")')

        const expected = [
          "",
          "fourth",
        ]
        assert.equal(await getLines(nvim), expected.join("\n"))
      }));

    it("inclusive downs", () =>
      withVim(async nvim => {
        await populateBuffer(nvim, buffer, "ruby");

        await nvim.command('execute("normal daJ")')

        assert.equal(await getLines(nvim), [])
      }));
  })
})
