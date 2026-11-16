/**
 * Formats a numeric value into Sri Lankan Rupees (LKR) standard display string:
 * e.g., 1650 -> "Rs. 1,650.00"
 */
export const formatLKR = (amount) => {
  const num = Number(amount) || 0;
  return `Rs. ${num.toLocaleString('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export default formatLKR;
