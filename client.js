// client.js
const transport = new WebTransport('https://webtransport-echo-worker.webtransport-demo-live.workers.dev/');
await transport.ready;
console.log('WebTransport connection established.');

const writer = transport.datagrams.writable.getWriter();
await writer.write(new TextEncoder().encode('ping'));
console.log('Sent "ping" to server');

const reader = transport.datagrams.readable.getReader();
while (true) {
  const { value, done } = await reader.read();
  if (done) break;
  if (value) {
    const message = new TextDecoder().decode(value);
    console.log('📥 Received from server:', message);
  }
}