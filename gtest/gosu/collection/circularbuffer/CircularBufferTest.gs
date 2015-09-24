package gosu.collection.circularbuffer

uses gw.testharness.RunLevel
uses gw.testharness.ServerTest
uses gw.testharness.TestBase
uses java.util.UUID

@RunLevel(NONE)
@ServerTest
class CircularBufferTest extends TestBase {

  /**
   *  Tests that the BufferBuilder builds the default buffer with the default max buffer size of 32.
   */
  function testDefaultMaxBufferSize() {
    var expected = BufferBuilder.DefaultMaxBufferSize
    var bf = BufferBuilder.newInstance().build()
    assertEquals("Test Default Max Buffer size", expected, bf.MaxSize)
  }

  /**
   *  Tests that the BufferBuilder builds the buffer by taking into account the max buffer size parameter,
   *  if it is specified.
   */
  function testSettingMaxBufferSizeExplicitly() {
    var expected = 64
    var bf = BufferBuilder.newInstance().withMaxBufferSize(expected).build()
    assertEquals("Test Max Buffer size", expected, bf.getMaxSize())
  }

  /**
   *  Tests that the buffer contains only the max number of elements if more than max number
   *  of elements is added (i.e. additional elements are dropped).
   */
  function testBufferUsedSizeWithAdditionsOverMaxSize() {
    var expected = 5
    var bf = BufferBuilder.newInstance<String>().withMaxBufferSize(expected).build()
    (1..expected + 1).each(\elm -> {
      bf.add(UUID.randomUUID().toString())
    })
    assertEquals("Used size check with buffer additions over max size", expected, bf.getUsedSize())
  }

  /**
   *  Tests that the buffer's used size returns the correct number of elements.
   */
  function testBufferUsedSizeWithAdditionsLessThanMaxSize() {
    var expected = 5
    var bf = BufferBuilder.newInstance<String>().withMaxBufferSize(expected + 5).build()
    (1..expected).each(\elm -> {
      bf.add(UUID.randomUUID().toString())
    })
    assertEquals("Used size check with buffer addition less than max size", expected, bf.getUsedSize())
  }
}