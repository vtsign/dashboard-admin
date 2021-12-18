import { useState, useEffect } from "react";
import Head from "next/head";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { Box, Container, Grid } from "@mui/material";
import { Budget } from "../components/dashboard/budget";
import { LatestOrders } from "../components/dashboard/latest-orders";
import { LatestProducts } from "../components/dashboard/latest-products";
import { Sales } from "../components/dashboard/sales";
import { TasksProgress } from "../components/dashboard/tasks-progress";
import { TotalCustomers } from "../components/dashboard/total-customers";
import { TotalProfit } from "../components/dashboard/total-profit";
import { TrafficByDevice } from "../components/dashboard/traffic-by-device";
import { DashboardLayout } from "../components/dashboard-layout";
import userApi from "src/api/userApi";
import documentApi from "src/api/documentApi";

const Dashboard = () => {
	const [dataQuickView, setDataQuickView] = useState({});
	const [type, setType] = useState("month");

	useEffect(() => {
		(async () => {
			const { data: totalUser } = await userApi.countUser(type);
			const { data: totalDeposit } = await userApi.countDeposit(type);
			const { data: totalContracts } = await documentApi.countContract(type);
			setDataQuickView({
				totalUser,
				totalDeposit,
				totalContracts,
			});
		})();
	}, [type]);

	const formatNumber = (num) => {
		num = Math.round((num ?? 0) * 10 + Number.EPSILON) / 10;
		return num?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
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
					py: 8,
				}}
			>
				<FormControl fullWidth>
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
							<TotalCustomers totalUser={dataQuickView.totalUser} />
						</Grid>
						<Grid item xl={4} lg={4} sm={6} xs={12}>
							<TasksProgress totalContracts={dataQuickView.totalContracts} />
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
							<Sales />
						</Grid>
						<Grid item lg={12} md={12} xl={12} xs={12}>
							<Sales />
						</Grid>
						<Grid item lg={12} md={12} xl={12} xs={12}>
							<Sales />
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
