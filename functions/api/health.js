export async function onRequestGet(context) {
  const base = new URL(context.request.url).origin;
  const checks = await Promise.allSettled([
    fetch(`${base}/api/hd2/v1/war`),
    fetch(`${base}/api/steam/players`),
  ]);

  const hd2 = checks[0].status === 'fulfilled' ? checks[0].value.status : 0;
  const steam = checks[1].status === 'fulfilled' ? checks[1].value.status : 0;
  return Response.json({
    ok: hd2 >= 200 && hd2 < 500,
    service: 'HELLDIVE-DB API proxy',
    hd2: { status: hd2 },
    steam: { status: steam },
    time: new Date().toISOString(),
  }, { headers: { 'cache-control': 'no-store' } });
}
