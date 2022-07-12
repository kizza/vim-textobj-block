import assert from "assert";
import {getLines, populateBuffer} from "./helpers/buffer";
import {withVim} from "./helpers/vim";

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
        await populateBuffer(nvim, buffer, "ruby");

        await nvim.command('execute("normal dib")')

        const expected = [
          "begin",
          "",
          "",
          "end",
        ]
        assert.equal(await getLines(nvim), expected.join("\n"))
      }));

    it("around block", () =>
      withVim(async nvim => {
        await populateBuffer(nvim, buffer, "ruby");

        await nvim.command('execute("normal dab")')

        const expected = [
          "begin",
          "",
          "end",
        ]
        assert.equal(await getLines(nvim), expected.join("\n"))
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
        await populateBuffer(nvim, buffer, "ruby");

        await nvim.command('execute("normal dib")')

        const expected = [
          "begin",
          "",
          "",
          "end",
          "  end",
        ]
        assert.equal(await getLines(nvim), expected.join("\n"))
      }));

    it("around block", () =>
      withVim(async nvim => {
        await populateBuffer(nvim, buffer, "ruby");

        await nvim.command('execute("normal dab")')

        const expected = [
          "begin",
          "",
          "end",
          "  end",
        ]
        assert.equal(await getLines(nvim), expected.join("\n"))
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
        await populateBuffer(nvim, buffer, "ruby");

        await nvim.command('execute("normal dib")')

        const expected = [
          "begin",
          "",
          "",
          "end",
        ]
        assert.equal(await getLines(nvim), expected.join("\n"))
      }));

    it("around block", () =>
      withVim(async nvim => {
        await populateBuffer(nvim, buffer, "ruby");

        await nvim.command('execute("normal dab")')

        const expected = [
          "begin",
          "",
          "end",
        ]
        assert.equal(await getLines(nvim), expected.join("\n"))
      }))
  });
})
