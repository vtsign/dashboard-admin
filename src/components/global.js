export const formatNumber = (num) => {
	num = Math.round((num ?? 0) * 10 + Number.EPSILON) / 10;
	return num?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};
