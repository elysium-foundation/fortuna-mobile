import Through from 'through2';
import ObjectMultiplex from '@metamask/object-multiplex';
import pump from 'pump';

type TransformCallback = (error?: Error | null, data?: unknown) => void;

interface TransformStream extends NodeJS.ReadWriteStream {
  push(chunk: unknown, encoding?: BufferEncoding): boolean;
}

/**
 * Returns a stream transform that parses JSON strings passing through
 * @return {NodeJS.ReadWriteStream}
 */
function jsonParseStream(): NodeJS.ReadWriteStream {
  return Through.obj(function (
    this: TransformStream,
    serialized: string,
    _: string,
    cb: TransformCallback
  ) {
    try {
      this.push(JSON.parse(serialized));
      cb();
    } catch (error) {
      cb(error as Error);
    }
  });
}

/**
 * Returns a stream transform that calls {@code JSON.stringify}
 * on objects passing through
 * @return {NodeJS.ReadWriteStream} the stream transform
 */
function jsonStringifyStream(): NodeJS.ReadWriteStream {
  return Through.obj(function (
    this: TransformStream,
    obj: unknown,
    _: string,
    cb: TransformCallback
  ) {
    try {
      this.push(JSON.stringify(obj));
      cb();
    } catch (error) {
      cb(error as Error);
    }
  });
}

/**
 * Sets up stream multiplexing for the given stream
 * @param {NodeJS.ReadWriteStream} connectionStream - the stream to mux
 * @return {NodeJS.ReadWriteStream} the multiplexed stream
 */
function setupMultiplex(connectionStream: NodeJS.ReadWriteStream): NodeJS.ReadWriteStream {
  const mux = new ObjectMultiplex();
  pump(connectionStream, mux, connectionStream, (err: Error | undefined) => {
    if (err) {
      console.warn('Multiplexing error:', err);
    }
  });
  return mux;
}

export { jsonParseStream, jsonStringifyStream, setupMultiplex };
