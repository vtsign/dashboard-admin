import axiosClient from './axiosClient';

const userApi = {
	async getUsers(page, size) {
		const url = `/user/management/list?page=${page}&pageSize=${size}`;

		return axiosClient.get(url);
	},
	async createUser(data) {
		const url = `/user/management/create-user`;

		return axiosClient.post(url, data);
	},
	async updateUser(data, id) {
		const url = `/user/management/update-user/${id}`;

		return axiosClient.post(url, data);
	},
	async deleteUser(id) {
		const url = `/user/management/delete-user`;

		const data = {
			status: true,
			id
		};

		return axiosClient.delete(url, { data });
	},
	async blockUser(id) {
		const url = `/user/management/block-user`;

		const data = {
			status: true,
			id
		};

		return axiosClient.put(url, data);
	},
	countDeposit(type = 'month') {
		const url = `/user/management/total-deposit?type=${type}`;
		return axiosClient.get(url);
	},
	countUser(type = 'month') {
		const url = `/user/management/count-user?type=${type}`;
		return axiosClient.get(url);
	},
	statisticUser: (type = 'month') => {
		const url = `/user/management/statistic-user?type=${type}`;
		return axiosClient.get(url);
	},
	statisticMoney: (type = 'month') => {
		const url = `/user/management/statistic-money?type=${type}`;
		return axiosClient.get(url);
	},
	async getUserProfile() {
		const url = "/user/profile";
		const response = await axiosClient.get(url);
		return response;
	},
	async updateUserProfile(data) {
		const url = "/user/profile";
		const response = await axiosClient.post(url, data);
		return response;
	},
	async updateAvatar(data) {
		const url = "/user/update-avatar";
		const response = await axiosClient.post(url, data);
		return response;
	},
};

export default userApi;
