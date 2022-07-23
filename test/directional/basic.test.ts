import assert from "assert";
import {getBuffer, setBuffer, vimRunner} from "nvim-test-js";
import * as path from "path";

const withVim = vimRunner(
  {vimrc: path.resolve(__dirname, "../", "helpers", "vimrc.vim")}
)

describe("Basic tests", () => {
  it("loads the test vimrc", () =>
    withVim(async nvim => {
      const loaded = (await nvim.getVar("test_vimrc_loaded")) as boolean;
      assert.equal(loaded, true);
    }));

  it("can set and read a line", () =>
    withVim(async nvim => {
      await nvim.setLine("Foo");
      const line = await nvim.getLine();
      assert.equal(line, "Foo");
    }));

  describe("matching block including blank lines - down", () => {
    const buffer = [
      "begin",
      "  f|irst",
      "    code",
      "",
      "    code",
      "  end",
      "",
      "  second",
      "    code",
      "  end",
      "end",
    ]

    it("exclusive downs", () =>
      withVim(async nvim => {
        await setBuffer(nvim, buffer, "ruby");

        await nvim.command('execute("normal diJ")')

        const expected = [
          "begin",
          "",
          "  second",
          "    code",
          "  end",
          "end",
        ]
        assert.equal(await getBuffer(nvim), expected.join("\n"))
      }));

    it("inclusive downs", () =>
      withVim(async nvim => {
        await setBuffer(nvim, buffer, "ruby");

        await nvim.command('execute("normal daJ")')

        const expected = [
          "begin",
          "end",
        ]
        assert.equal(await getBuffer(nvim), expected.join("\n"))
      }));
  });

  describe("the basics - up", () => {
    const buffer = [
      "begin",
      "  first",
      "    code",
      "  end",
      "",
      "  second",
      "    code",
      "",
      "    code",
      "  e|nd",
      "end",
    ]

    it("exclusive ups", () =>
      withVim(async nvim => {
        await setBuffer(nvim, buffer, "ruby");

        await nvim.command('execute("normal diK")')

        const expected = [
          "begin",
          "  first",
          "    code",
          "  end",
          "",
          "end",
        ]
        assert.equal(await getBuffer(nvim), expected.join("\n"))
      }));

    it("inclusive ups", () =>
      withVim(async nvim => {
        await setBuffer(nvim, buffer, "ruby");

        await nvim.command('execute("normal daK")')

        const expected = [
          "begin",
          "end",
        ]
        assert.equal(await getBuffer(nvim), expected.join("\n"))
      }));
  });
});
