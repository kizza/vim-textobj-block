import assert from "assert";
import bootVim, {getBuffer, setBuffer, WithVim} from "nvim-test-js";
import * as path from "path";

const withVim = (test: WithVim) =>
  bootVim(test, {vimrc: path.resolve(__dirname, "helpers", "vimrc.vim")})

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

        await setBuffer(nvim, buffer, "ruby");

        await nvim.command('execute("normal diJ")')

        const expected = [
          "begin",
          "",
          "  fourth",
          "end",
        ]
        assert.equal(await getBuffer(nvim), expected.join("\n"))
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

        await setBuffer(nvim, buffer, "ruby");

        await nvim.command('execute("normal diK")')

        const expected = [
          "begin",
          "  first",
          "",
          "end",
        ]
        assert.equal(await getBuffer(nvim), expected.join("\n"))
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

        await setBuffer(nvim, buffer, "ruby");

        await nvim.command('execute("normal diJ")')

        const expected = [
          "begin",
          "end",
          "",
          "begin",
          "  code",
          "end",
        ]
        assert.equal(await getBuffer(nvim), expected.join("\n"))
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

        await setBuffer(nvim, buffer, "ruby");

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
        assert.equal(await getBuffer(nvim), expected.join("\n"))
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

        await setBuffer(nvim, buffer, "ruby");

        await nvim.command('execute("normal diK")')

        const expected = [
          "begin",
          "  first",
          "",
          "end",
        ]
        assert.equal(await getBuffer(nvim), expected.join("\n"))
      }));
  });
})
