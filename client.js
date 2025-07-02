async function startWebTransport() {
  const transport = new WebTransport('https://webtransport-echo-worker.webtransport-demo-live.workers.dev');
  await transport.ready;

  console.log("✅ Connected to WebTransport");

  const writer = transport.datagrams.writable.getWriter();
  writer.write(new TextEncoder().encode("ping"));

  const reader = transport.datagrams.readable.getReader();
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    const msg = new TextDecoder().decode(value);
    console.log("📥 Received:", msg);
  }
}

startWebTransport().catch(console.error);