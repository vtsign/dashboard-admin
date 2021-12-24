import moment from "moment";

export const payment = {
	status: {
		deposit: "Nạp tiền vào tài khoản",
		payment: "Thanh toán dịch vụ",
		refund: "Hoàn tiền",
		init_balance: "Đăng ký tài khoản",
	},
	method: {
		zalopayapp: "ZaloPay App",
		ATM: "Thẻ ATM",
		CC: "Thẻ tín dụng",
		INIT: "VTSign - Đăng ký tài khoản",
		PAYMENT: "VTSign - Thanh toán dịch vụ",
		REFUND: "VTSign - Hoàn tiền",
	},
};

export const formatNumber = (num) => {
	num = Math.round((num ?? 0) * 10 + Number.EPSILON) / 10;
	return num?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};

export const convertTime = (time) => {
	return moment(time).format("DD/MM/YYYY LT");
};
