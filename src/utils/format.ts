export const fmt = (n: number): string => {
  const abs = Math.abs(n);
  let str;
  if (abs >= 1e9) str = (abs / 1e9).toFixed(2) + "B";
  else if (abs >= 1e6) str = (abs / 1e6).toFixed(2) + "M";
  else if (abs >= 1e3) str = (abs / 1e3).toFixed(2) + "K";
  else str = abs.toFixed(2);
  return (n < 0 ? "-" : "") + "$" + str;
};

export const fmtNum = (n: number, decimals = 6): string => {
  if (Math.abs(n) < 1e-10) return "~0";
  if (Math.abs(n) < 0.0001) return n.toExponential(2);
  return parseFloat(n.toFixed(decimals)).toString();
};
