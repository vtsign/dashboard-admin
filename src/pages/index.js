import { useEffect, useState } from 'react';
import Head from 'next/head';
import { Box, Container, FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import { Budget } from '../components/dashboard/budget';
import { Sales } from '../components/dashboard/sales';
import { TasksProgress } from '../components/dashboard/tasks-progress';
import { TotalCustomers } from '../components/dashboard/total-customers';
import { DashboardLayout } from '../components/dashboard-layout';
import userApi from 'src/api/userApi';
import documentApi from 'src/api/documentApi';

const dataContract = {
	datasets: [
		{
			backgroundColor: '#3F51B5',
			barPercentage: 0.5,
			barThickness: 12,
			borderRadius: 4,
			categoryPercentage: 0.5,
			data: [],
			label: 'Tài liệu đã gửi',
			maxBarThickness: 10
		},
		{
			backgroundColor: '#3FEEEE',
			barPercentage: 0.5,
			barThickness: 12,
			borderRadius: 4,
			categoryPercentage: 0.5,
			data: [],
			label: 'Tài liệu đã hoàn thành',
			maxBarThickness: 10
		}
	],
	labels: []
};

const dataUserInit = {
	datasets: [
		{
			backgroundColor: '#3F51B5',
			barPercentage: 0.5,
			barThickness: 12,
			borderRadius: 4,
			categoryPercentage: 0.5,
			data: [1, 2, 3],
			label: 'Số người đùng',
			maxBarThickness: 10
		}
	],
	labels: ['1', '2', '3']
};

const dataMoney = {
	datasets: [
		{
			backgroundColor: '#3F51B5',
			barPercentage: 0.5,
			barThickness: 12,
			borderRadius: 4,
			categoryPercentage: 0.5,
			data: [1, 2, 3],
			label: 'Số tiền nạp vào',
			maxBarThickness: 10
		}
	],
	labels: ['1', '2', '3']
};

const Dashboard = () => {
	const [dataQuickView, setDataQuickView] = useState({});
	const [moneyType, setMoneyType] = useState('week');
	const [userType, setUserType] = useState('month');
	const [contractType, setContractType] = useState('year');
	const [type, setType] = useState('month');
	const [dataUser, setDataUser] = useState(dataUserInit);

	useEffect(() => {
		(async () => {
			const { data: totalUser } = await userApi.countUser(type);
			const { data: totalDeposit } = await userApi.countDeposit(type);
			const { data: totalContracts } = await documentApi.countContract(type);

			setDataQuickView({
				totalUser,
				totalDeposit,
				totalContracts
			});
		})();
	}, [type]);

	useEffect(() => {
		(async () => {
			const { data: statisticUser } = await userApi.statisticUser(userType);
			setDataUser((prev) => {
				prev.datasets = [
					{
						...prev.datasets[0],
						data: statisticUser.map((item) => item.value)
					}
				];
				prev.labels = statisticUser.map((item) => item.name);

				return prev;
			});
			console.log('user effect user');
		})();
	}, [userType, dataUser]);

	useEffect(() => {
		(async () => {
			const { data: statisticMoney } = await userApi.statisticMoney(moneyType);
			dataMoney.datasets = [
				{
					...dataMoney.datasets[0],
					data: statisticMoney.map((item) => item.value)
				}
			];
			dataMoney.labels = statisticMoney.map((item) => item.name);
		})();
		console.log('user effect money');
	}, [moneyType]);

	useEffect(() => {
		(async () => {
			const { data: statisticContract } = await documentApi.statisticContract(contractType);
			dataContract.datasets = [
				{
					...dataContract.datasets[0],
					data: statisticContract['sent'].map((item) => item.value)
				},
				{
					...dataContract.datasets[1],
					data: statisticContract['completed'].map((item) => item.value)
				}
			];
			dataContract.labels = statisticContract['sent'].map((item) => item.name);
		})();
		console.log('user effect document');
	}, [contractType]);

	const formatNumber = (num) => {
		num = Math.round((num ?? 0) * 10 + Number.EPSILON) / 10;
		return num?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
	};

	const handleChangeFilterQuickview = (event) => {
		setType(event.target.value);
	};

	return (
	  <>
		  <Head>
			  <title>Dashboard | Material Kit</title>
		  </Head>
		  <Box
			component="main"
			sx={{
				flexGrow: 1,
				py: 8
			}}
		  >
			  <FormControl>
				  <InputLabel id="demo-simple-select-label">Chọn thời gian</InputLabel>
				  <Select
					labelId="demo-simple-select-label"
					id="demo-simple-select"
					value={type}
					label="Chọn thời gian"
					onChange={handleChangeFilterQuickview}
				  >
					  <MenuItem value="date">Ngày</MenuItem>
					  <MenuItem value="week">Tuần</MenuItem>
					  <MenuItem value="month">Tháng</MenuItem>
					  <MenuItem value="year">Năm</MenuItem>
					  {/* <MenuItem value='all'>Tất cả</MenuItem> */}
				  </Select>
			  </FormControl>
			  <Container maxWidth={false}>
				  <Grid container spacing={3}>
					  <Grid item lg={4} sm={6} xl={4} xs={12}>
						  <Budget
							totalDeposit={dataQuickView.totalDeposit}
							formatNumber={formatNumber}
						  />
					  </Grid>
					  <Grid item xl={4} lg={4} sm={6} xs={12}>
						  <TotalCustomers totalUser={dataQuickView.totalUser}/>
					  </Grid>
					  <Grid item xl={4} lg={4} sm={6} xs={12}>
						  <TasksProgress totalContracts={dataQuickView.totalContracts}/>
					  </Grid>
					  {/* <Grid
            item
            xl={3}
            lg={3}
            sm={6}
            xs={12}
          >
            <TotalProfit sx={{ height: '100%' }} />
          </Grid> */}
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
					  {/* <Grid
            item
            lg={4}
            md={6}
            xl={3}
            xs={12}
          >
            <TrafficByDevice sx={{ height: '100%' }} />
          </Grid> */}
				  </Grid>
			  </Container>
		  </Box>
	  </>
	);
};

Dashboard.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Dashboard;
