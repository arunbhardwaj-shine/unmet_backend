export const getLocalIPs = (req) => {
  let ip =
    req.headers['x-client-ip'] ||
    req.headers['x-forwarded-for']?.split(',')[0] ||
    req.headers['x-forwarded'] ||
    req.headers['forwarded-for'] ||
    req.headers['forwarded'] ||
    req.socket?.remoteAddress ||
    'UNKNOWN';

  if (ip.startsWith('::ffff:')) ip = ip.replace('::ffff:', '');

  if (ip.includes(':')) {
    const portIndex = ip.lastIndexOf(':');
    if (portIndex !== -1 && ip.indexOf(']') === -1) {
      ip = ip.substring(0, portIndex);
    }
  }
  return ip;
};