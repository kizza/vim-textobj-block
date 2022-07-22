import assert from "assert";
import bootVim, {getBuffer, setBuffer, WithVim} from "nvim-test-js";
import * as path from "path";

const withVim = (test: WithVim) =>
  bootVim(test, {vimrc: path.resolve(__dirname, "helpers", "vimrc.vim")})

describe("Block", () => {
  describe("including blank lines", () => {
    const buffer = [
      "begin",
      "",
      "above",
      "b|lock",
      "",
      "  code",
      "",
      "  code",
      "",
      "end",
      "",
      "end",
    ]

    it("inner block", () =>
      withVim(async nvim => {
        await setBuffer(nvim, buffer, "ruby");

        await nvim.command('execute("normal dib")')

        const expected = [
          "begin",
          "",
          "",
          "end",
        ]
        assert.equal(await getBuffer(nvim), expected.join("\n"))
      }));

    it("around block", () =>
      withVim(async nvim => {
        await setBuffer(nvim, buffer, "ruby");

        await nvim.command('execute("normal dab")')

        const expected = [
          "begin",
          "",
          "end",
        ]
        assert.equal(await getBuffer(nvim), expected.join("\n"))
      }))
  });

  describe("indented excluding blank lines", () => {
    const buffer = [
      "begin",
      "",
      "  c|ode",
      "",
      "end",
      "  end",
    ]

    it("inner block", () =>
      withVim(async nvim => {
        await setBuffer(nvim, buffer, "ruby");

        await nvim.command('execute("normal dib")')

        const expected = [
          "begin",
          "",
          "",
          "end",
          "  end",
        ]
        assert.equal(await getBuffer(nvim), expected.join("\n"))
      }));

    it("around block", () =>
      withVim(async nvim => {
        await setBuffer(nvim, buffer, "ruby");

        await nvim.command('execute("normal dab")')

        const expected = [
          "begin",
          "",
          "end",
          "  end",
        ]
        assert.equal(await getBuffer(nvim), expected.join("\n"))
      }))
  });

  describe("same indent excluding blank lines", () => {
    const buffer = [
      "begin",
      "",
      "c|ode",
      "",
      "end",
    ]

    it("inner block", () =>
      withVim(async nvim => {
        await setBuffer(nvim, buffer, "ruby");

        await nvim.command('execute("normal dib")')

        const expected = [
          "begin",
          "",
          "",
          "end",
        ]
        assert.equal(await getBuffer(nvim), expected.join("\n"))
      }));

    it("around block", () =>
      withVim(async nvim => {
        await setBuffer(nvim, buffer, "ruby");

        await nvim.command('execute("normal dab")')

        const expected = [
          "begin",
          "",
          "end",
        ]
        assert.equal(await getBuffer(nvim), expected.join("\n"))
      }))
  });
})
