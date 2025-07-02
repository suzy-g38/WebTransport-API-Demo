export default {
  async fetch(request, env, ctx) {
    if (request.headers.get("Upgrade") !== "webtransport") {
      return new Response("Expected WebTransport", {
        status: 400,
        headers: {
          "Alt-Svc": 'h3=":443"',
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    const session = request.webTransport;
    console.log("WebTransport session accepted");

    session.datagrams.readable.pipeTo(new WritableStream({
      write(chunk) {
        const msg = new TextDecoder().decode(chunk);
        console.log("Received from client:", msg);

        if (msg === "ping") {
          const pong = new TextEncoder().encode("pong");
          session.datagrams.writable.getWriter().write(pong);
          console.log("Sent pong back");
        }
      }
    }));

    return new Response(null, {
      status: 200,
      webTransport: session,
      headers: {
        "Alt-Svc": 'h3=":443"',
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
};