import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Box, Container } from "@mui/material";
import { CustomerListResults } from "../components/customer/customer-list-results";
import { CustomerListToolbar } from "../components/customer/customer-list-toolbar";
import { DashboardLayout } from "../components/dashboard-layout";
import userApi from "src/api/userApi";
import Loading from "src/components/Loading/Loading";

// export async function getServerSideProps(ctx) {
// 	const data = {
// 		props: {},
// 	};

// 	try {
// 		const userListRes = await userApi.getUsers();
// 		// const res = await fetch("https://api.vtsign.tech/user/management/list");
// 		// const resData = await userListRes.json();
// 		data.props.res = userListRes;
// 	} catch (err) {
// 		console.log(err);
// 		// data.props.err = err
// 	}

// 	return data;
// }
const Customers = (props) => {
	const [data, setData] = useState();
	const [isLoading, setIsLoading] = useState(false);
	// const location = useLocation();
	const router = useRouter();
	const page = parseInt(router.query.page) || 1;
	const size = parseInt(router.query.size) || 5;
	useEffect(() => {
		(async () => {
			try {
				setIsLoading(true);
				const res = await userApi.getUsers(page, size);
				if (res.status === 200) {
					setData(res.data);
					setIsLoading(false);
				}
			} catch (err) {
				console.log(err);
				setIsLoading(false);
			}
		})();
	}, [page, size]);

	const handleChangePage = async (e, page) => {
		router.push(`/customers?page=${page + 1}&size=${size}`);
	};

	const handleChangeRowsPerPage = async (e, rows) => {
		router.push(`/customers?page=1&size=${rows.props.value}`);
	};

	return (
		<>
			<Head>
				<title>Customers | VTSign</title>
			</Head>
			{isLoading && <Loading />}
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					py: 8,
				}}
			>
				<Container maxWidth={false}>
					<CustomerListToolbar />
					<Box sx={{ mt: 3 }}>
						{data && (
							<CustomerListResults
								data={data}
								page={page}
								size={size}
								handleChangePage={handleChangePage}
								handleChangeRowsPerPage={handleChangeRowsPerPage}
							/>
						)}
					</Box>
				</Container>
			</Box>
		</>
	);
};

Customers.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Customers;
