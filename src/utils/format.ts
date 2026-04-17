export const fmt = (n: number): string => {
  const abs = Math.abs(n);
  let str;
  if (abs >= 1e9) str = (abs / 1e9).toFixed(2) + "B";
  else if (abs >= 1e6) str = (abs / 1e6).toFixed(2) + "M";
  else if (abs >= 1e3) str = (abs / 1e3).toFixed(2) + "K";
  else {
    str = abs.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  
  // Clean zero check to prevent microscopic remainders from registering incorrectly
  if (n === 0 || str === "0.00") return "$0.00";
  return (n < 0 ? "-" : n > 0 ? "+" : "") + "$" + str;
};

export const fmtNum = (n: number, decimals = 6): string => {
  if (n === 0) return "0";
  
  const abs = Math.abs(n);
  // Reverted dynamically extreme expansion limit. Uses basic formatting rules.
  if (abs < 0.000001) {
    return parseFloat(n.toFixed(decimals)).toString() === "0" ? "0.00..." : parseFloat(n.toFixed(decimals)).toString();
  }
  
  return n.toLocaleString('en-US', { maximumFractionDigits: decimals });
};
