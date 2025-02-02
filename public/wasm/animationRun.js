let waves_ptr;
let waveslen_ptr;
function fd_write(fd, iovs, iovs_len, nwritten) {
  let written = 0;
  const HEAP32 = new Int32Array(memory.buffer);

  for (let i = 0; i < iovs_len; i++) {
    const ptr = iovs + i * 8;
    const len = HEAP32[(ptr >> 2) + 1];
    const data = new Uint8Array(memory.buffer, HEAP32[ptr >> 2], len);

    if (len > 0) {
      let result = new TextDecoder("utf8").decode(data).trimEnd();
      if (result) {
        // Ignore empty strings
        console.log(result);
      }
    }

    written += len;
  }

  HEAP32[nwritten >> 2] = written;
  return 0;
}

let memory;
let exports;

export async function initWaves() {
  memory = new WebAssembly.Memory({
    initial: 256,
    maximum: 512,
  });

  try {
    const result = await WebAssembly.instantiateStreaming(
      fetch("./wasm/animation.wasm"),
      {
        env: {
          memory: memory,
          setTempRet0: (value) => {
            console.log(`setTempRet0 called with value: ${value}`);
          },
          emscripten_resize_heap: function (size) {
            try {
              const currentPages = memory.buffer.byteLength / 65536;
              const requestedPages = Math.ceil(size / 65536);
              if (requestedPages > currentPages) {
                memory.grow(requestedPages - currentPages);
              }
              return memory.buffer.byteLength;
            } catch (e) {
              console.error(e);
              return false;
            }
          },
          emscripten_memcpy_big: function (dest, src, num) {
            new Uint8Array(memory.buffer).set(
              new Uint8Array(memory.buffer, src, num),
              dest
            );
          },
          emscripten_memcpy_js: function (dest, src, num) {
            const memoryArray = new Int32Array(memory.buffer);
            memoryArray.set(memoryArray.subarray(src, src + num), dest);
          },
        },

        wasi_snapshot_preview1: { fd_write: fd_write },
      }
    );

    exports = result.instance.exports;
    memory = result.instance.exports.memory;
    // console.log( exports )
    let floatSize = new Float32Array().BYTES_PER_ELEMENT;
    waves_ptr = exports.wasmmalloc(floatSize * 1000 * 1000);
    waveslen_ptr = exports.wasmmalloc(floatSize * 2);
    exports.noiseSeed(1000);
  } catch (err) {
    // console.error("Error initializing WebAssembly:", err);
  }
}

export function getWaves(animationTime, width, height, lineScale, lineDetiles,mouseX,mouseY) {
  if (!exports || !exports.memory) {
    return;
  }

  exports.getWaves(
    waves_ptr,
    waveslen_ptr,
    animationTime,
    width,
    height,
    lineScale,
    lineDetiles,
    mouseX,mouseY
  );
  let lenOutput = new Float32Array(exports.memory.buffer, waveslen_ptr, 2);

  let output = Array.from(
    new Float32Array(exports.memory.buffer, waves_ptr, lenOutput[0])
  );
  let waves = [];
 
  while (output.length > 0) {
    waves.push(output.splice(0, lenOutput[1]));
  }

  return waves;
  
}

export function freeWaves() {
  exports.wasmfree(waves_ptr);
}
