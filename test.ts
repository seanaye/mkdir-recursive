import { ensureDirExists, exists } from "./mod.ts"
import { assertEquals, assertRejects } from "https://deno.land/std@0.146.0/testing/asserts.ts"

Deno.test({
  name: "it creates nested dirs but not files",
  async fn() {
    const outer = new URL(`${crypto.randomUUID()}/`, import.meta.url)
    const path = new URL(`${crypto.randomUUID()}/${crypto.randomUUID()}/`, outer)
    const file = new URL(`${path}${crypto.randomUUID()}.jpg}`, path)

    assertEquals(await exists(file), false)
    await ensureDirExists(file)
    assertEquals(await exists(path), true)
    assertEquals(await exists(file), false)

    // do cleanup
    await assertRejects(() => Deno.remove(outer))
    await Deno.remove(outer, { recursive: true })
  },
  permissions: {
    read: true,
    write: true
  }
})
