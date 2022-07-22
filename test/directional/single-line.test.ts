import assert from "assert";
import bootVim, {getBuffer, setBuffer, WithVim} from "nvim-test-js";
import * as path from "path";

const withVim = (test: WithVim) =>
  bootVim(test, {vimrc: path.resolve(__dirname, "../", "helpers", "vimrc.vim")})

describe("Single line tests", () => {
  describe("single nested line", () => {
    const buffer = [
      "begin",
      "  f|oo",
      "end",
    ];

    ["diJ", "daJ", "diK", "daK"].forEach((binding: string) =>
      it(`deletes it with ${binding}`, () =>
        withVim(async nvim => {
          await setBuffer(nvim, buffer, "ruby");

          await nvim.command(`execute("normal ${binding}")`)

          const expected = [
            "begin",
            "end",
          ]
          assert.equal(await getBuffer(nvim), expected.join("\n"))
        }))
    );
  })

  describe("single nested line with padding", () => {
    const buffer = [
      "",
      "begin",
      "  f|oo",
      "end",
      "",
    ];

    ["diJ", "daJ", "diK", "daK"].forEach((binding: string) =>
      it(`deletes it with ${binding}`, () =>
        withVim(async nvim => {
          await setBuffer(nvim, buffer, "ruby");

          await nvim.command(`execute("normal ${binding}")`)

          const expected = [
            "",
            "begin",
            "end",
            "",
          ]
          assert.equal(await getBuffer(nvim), expected.join("\n"))
        }))
    );
  })

  describe("single nested line with padding", () => {
    const buffer = [
      "  ignore",
      "begin",
      "",
      "  f|oo",
      "",
      "end",
      "  ignore",
    ];

    ["diJ", "diK"].forEach((binding: string) =>
      it(`deletes it with exclusive ${binding}`, () =>
        withVim(async nvim => {
          await setBuffer(nvim, buffer, "ruby");

          await nvim.command(`execute("normal ${binding}")`)

          const expected = [
            "  ignore",
            "begin",
            "",
            "",
            "end",
            "  ignore",
          ]
          assert.equal(await getBuffer(nvim), expected.join("\n"))
        }))
    );

    ["daK", "daK"].forEach((binding: string) =>
      it(`deletes it with inclusive ${binding}`, () =>
        withVim(async nvim => {
          await setBuffer(nvim, buffer, "ruby");

          await nvim.command(`execute("normal ${binding}")`)

          const expected = [
            "  ignore",
            "begin",
            "",
            "end",
            "  ignore",
          ]
          assert.equal(await getBuffer(nvim), expected.join("\n"))
        }))
    );
  })

  describe("single line on its own", () => {
    const buffer = [
      "|code",
    ];

    ["diJ", "daJ", "diK", "daK"].forEach((binding: string) =>
      it(`deletes it with ${binding}`, () =>
        withVim(async nvim => {
          await setBuffer(nvim, buffer, "ruby");

          await nvim.command(`execute("normal ${binding}")`)

          assert.equal(await getBuffer(nvim), [])
        }))
    );
  })
})
