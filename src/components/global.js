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

export const responseMessage = {
	400: "Cú pháp không hợp lệ",
	401: "Người dùng chưa được xác thực",
	403: "Người dùng không có quyền truy cập",
	404: "Nội dung không tồn tại",
	500: "Máy chủ gặp trục trặc"
}

export const formatNumber = (num) => {
	num = Math.round((num ?? 0) * 10 + Number.EPSILON) / 10;
	return num?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};

export const convertTime = (time) => {
	return moment(time).format("DD/MM/YYYY LT");
};
