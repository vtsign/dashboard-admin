import axiosClient from './axiosClient';

const documentApi = {
	countContract(type = 'month') {
		const url = `/document/management/count-contract?type=${type}`;
		return axiosClient.get(url);
	},
	statisticContract: (type) => {
		const url = `/document/management/statistic-contract?type=${type}`;
		return axiosClient.get(url);
	}
};

export default documentApi;
