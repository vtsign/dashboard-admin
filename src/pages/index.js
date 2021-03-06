import { useEffect, useState } from "react";
import Head from "next/head";
import { Box, Container, FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material";
import { Budget } from "../components/dashboard/budget";
import { Sales } from "../components/dashboard/sales";
import { TasksProgress } from "../components/dashboard/tasks-progress";
import { TotalCustomers } from "../components/dashboard/total-customers";
import { DashboardLayout } from "../components/dashboard-layout";
import userApi from "src/api/userApi";
import documentApi from "src/api/documentApi";

const dataContractInit = {
	datasets: [
		{
			backgroundColor: "#3F51B5",
			barPercentage: 0.5,
			barThickness: 24,
			borderRadius: 4,
			categoryPercentage: 0.5,
			data: [],
			label: "Tài liệu đã gửi",
			maxBarThickness: 40,
		},
		{
			backgroundColor: "#3FEEEE",
			barPercentage: 0.5,
			barThickness: 24,
			borderRadius: 4,
			categoryPercentage: 0.5,
			data: [],
			label: "Tài liệu đã hoàn thành",
			maxBarThickness: 40,
		},
	],
	labels: [],
};

const dataUserInit = {
	datasets: [
		{
			backgroundColor: "#3F51B5",
			barPercentage: 0.5,
			barThickness: 24,
			borderRadius: 4,
			categoryPercentage: 0.5,
			data: [],
			label: "Số người đùng",
			maxBarThickness: 40,
		},
	],
	labels: [],
};

const dataMoneyInit = {
	datasets: [
		{
			backgroundColor: "#3F51B5",
			barPercentage: 0.5,
			barThickness: 24,
			borderRadius: 4,
			categoryPercentage: 0.5,
			data: [],
			label: "Số tiền nạp vào",
			maxBarThickness: 40,
		},
	],
	labels: [],
};

const Dashboard = () => {
	const [dataQuickView, setDataQuickView] = useState({});
	const [moneyType, setMoneyType] = useState("month");
	const [userType, setUserType] = useState("month");
	const [contractType, setContractType] = useState("month");
	const [type, setType] = useState("month");
	const [dataUser, setDataUser] = useState(dataUserInit);
	const [dataMoney, setDataMoney] = useState(dataMoneyInit);
	const [dataContract, setDataContract] = useState(dataContractInit);

	useEffect(() => {
		(async () => {
			try {
				const { data: totalUser } = await userApi.countUser(type);
				const { data: totalDeposit } = await userApi.countDeposit(type);
				const { data: totalContracts } = await documentApi.countContract(type);

				setDataQuickView({
					totalUser,
					totalDeposit,
					totalContracts,
				});
			} catch (err) {
				switch (err.status) {
					case 403:
						error("Truy cập bị chặn");
						break;
					case 404:
						error("Loại dữ liệu không tồn tại");
						break;
					case 500:
						error("Máy chủ gặp trục trặc");
						break;
					default:
						error("Đã có lỗi xảy ra");
						break;
				}
			}
		})();
	}, [type]);

	useEffect(() => {
		(async () => {
			const { data: statisticUser, status } = await userApi.statisticUser(userType);
			if(status !== 200) {
				switch (status) {
					case 403:
						error("Truy cập bị chặn");
						break;
					case 404:
						error("Loại dữ liệu không tồn tại");
						break;
					case 500:
						error("Máy chủ gặp trục trặc");
						break;
					default:
						error("Đã có lỗi xảy ra");
						break;
				}
				return;
			}

			setDataUser({
				...dataUser,
				datasets: [
					{
						...dataUser.datasets[0],
						data: statisticUser.map((item) => item.value),
					},
				],
				labels: statisticUser.map((item) => item.name),
			});
		})();
	}, [userType]);

	useEffect(() => {
		(async () => {
			const { data: statisticMoney, status } = await userApi.statisticMoney(moneyType);
			if(status !== 200) {
				switch (status) {
					case 403:
						error("Truy cập bị chặn");
						break;
					case 404:
						error("Loại dữ liệu không tồn tại");
						break;
					case 500:
						error("Máy chủ gặp trục trặc");
						break;
					default:
						error("Đã có lỗi xảy ra");
						break;
				}
				return;
			}

			setDataMoney({
				...dataMoney,
				datasets: [
					{
						...dataMoney.datasets[0],
						data: statisticMoney.map((item) => item.value),
					},
				],
				labels: statisticMoney.map((item) => item.name),
			});
		})();
	}, [moneyType]);

	useEffect(() => {
		(async () => {
			const { data: statisticContract, status } = await documentApi.statisticContract(contractType);
			if(status !== 200) {
				switch (response.status) {
					case 403:
						error("Truy cập bị chặn");
						break;
					case 404:
						error("Loại dữ liệu không tồn tại");
						break;
					case 500:
						error("Máy chủ gặp trục trặc");
						break;
					default:
						error("Đã có lỗi xảy ra");
						break;
				}
				return;
			}
			setDataContract({
				...dataContract,
				datasets: [
					{
						...dataContract.datasets[0],
						data: statisticContract["sent"].map((item) => item.value),
					},
					{
						...dataContract.datasets[1],
						data: statisticContract["completed"].map((item) => item.value),
					},
				],
				labels: statisticContract["sent"].map((item) => item.name),
			});
		})();
	}, [contractType]);

	const handleChangeFilterQuickView = (event) => {
		setType(event.target.value);
	};

	return (
		<>
			<Head>
				<title>Thống kê | VTSign</title>
			</Head>
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					py: 8,
				}}
			>
				<Container maxWidth={false}>
					<FormControl style={{ minWidth: "200px", float: "right" }}>
						<InputLabel id="demo-simple-select-label">Chọn thời gian</InputLabel>
						<Select
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							value={type}
							label="Chọn thời gian"
							onChange={handleChangeFilterQuickView}
						>
							<MenuItem value="date">Ngày</MenuItem>
							<MenuItem value="week">Tuần</MenuItem>
							<MenuItem value="month">Tháng</MenuItem>
							<MenuItem value="year">Năm</MenuItem>
							<MenuItem value='all'>Tất cả</MenuItem>
						</Select>
					</FormControl>
					<Grid container spacing={3}>
						<Grid item lg={4} sm={6} xl={4} xs={12}>
							<Budget
								totalDeposit={dataQuickView.totalDeposit}
							/>
						</Grid>
						<Grid item xl={4} lg={4} sm={6} xs={12}>
							<TotalCustomers totalUser={dataQuickView.totalUser} />
						</Grid>
						<Grid item xl={4} lg={4} sm={6} xs={12}>
							<TasksProgress totalContracts={dataQuickView.totalContracts} />
						</Grid>
						<Grid item lg={12} md={12} xl={12} xs={12}>
							<Sales
								title="Thống kê người dùng"
								data={dataUser}
								setType={setUserType}
								type={userType}
							/>
						</Grid>
						<Grid item lg={12} md={12} xl={12} xs={12}>
							<Sales
								title="Thống kê tiền"
								data={dataMoney}
								setType={setMoneyType}
								type={moneyType}
							/>
						</Grid>
						<Grid item lg={12} md={12} xl={12} xs={12}>
							<Sales
								type={contractType}
								data={dataContract}
								title="Thống kê tài liệu"
								setType={setContractType}
							/>
						</Grid>
					</Grid>
				</Container>
			</Box>
		</>
	);
};

Dashboard.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Dashboard;
