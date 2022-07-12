import assert from "assert";
import {getLines, populateBuffer} from "./helpers/buffer";
import {withVim} from "./helpers/vim";

describe("vim-textobj-block", () => {
  describe("consecutive same indent", () => {
    it("exclusive downs", () =>
      withVim(async nvim => {
        const buffer = [
          "begin",
          "  f|irst",
          "  second",
          "  third",
          "",
          "  fourth",
          "end",
        ]

        await populateBuffer(nvim, buffer, "ruby");

        await nvim.command('execute("normal diJ")')

        const expected = [
          "begin",
          "",
          "  fourth",
          "end",
        ]
        assert.equal(await getLines(nvim), expected.join("\n"))
      }));

    it("exclusive ups", () =>
      withVim(async nvim => {
        const buffer = [
          "begin",
          "  first",
          "",
          "  second",
          "  third",
          "  f|ourth",
          "end",
        ]

        await populateBuffer(nvim, buffer, "ruby");

        await nvim.command('execute("normal diK")')

        const expected = [
          "begin",
          "  first",
          "",
          "end",
        ]
        assert.equal(await getLines(nvim), expected.join("\n"))
      }));
  });

  describe("competing less indentation with blank line", () => {
    it("exclusive downs", () =>
      withVim(async nvim => {
        const buffer = [
          "begin",
          "  c|ode",
          "    code",
          "    code",
          "end",
          "",
          "begin",
          "  code",
          "end",
        ]

        await populateBuffer(nvim, buffer, "ruby");

        await nvim.command('execute("normal diJ")')

        const expected = [
          "begin",
          "end",
          "",
          "begin",
          "  code",
          "end",
        ]
        assert.equal(await getLines(nvim), expected.join("\n"))
      }));
  });

  describe("inclusive, crossing blank lines, stopping at matching indent", () => {
    it("exclusive downs", () =>
      withVim(async nvim => {
        const buffer = [
          "begin",
          "  code",
          "    code",
          "  end",
          "",
          "  code",
          "    c|ode",
          "end",
        ]

        await populateBuffer(nvim, buffer, "ruby");

        await nvim.command('execute("normal diJ")')

        const expected = [
          "begin",
          "  code",
          "    code",
          "  end",
          "",
          "  code",
          "end",
        ]
        assert.equal(await getLines(nvim), expected.join("\n"))
      }));

    it("exclusive ups", () =>
      withVim(async nvim => {
        const buffer = [
          "begin",
          "  first",
          "",
          "  second",
          "",
          "    third",
          "  f|ourth",
          "end",
        ]

        await populateBuffer(nvim, buffer, "ruby");

        await nvim.command('execute("normal diK")')

        const expected = [
          "begin",
          "  first",
          "",
          "end",
        ]
        assert.equal(await getLines(nvim), expected.join("\n"))
      }));
  });
})
