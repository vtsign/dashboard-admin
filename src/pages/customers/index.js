import React, { useEffect, useState, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Box, Container } from "@mui/material";
import { CustomerListResults } from "../../components/customer/customer-list-results";
import { CustomerListToolbar } from "../../components/customer/customer-list-toolbar";
import { DashboardLayout } from "../../components/dashboard-layout";
import userApi from "src/api/userApi";
import Loading from "src/components/Loading/Loading";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material"


const listStatus = [
	{
		label: "Đang hoạt động",
		value: "",
		total: 0,
	},
	{
		label: "Đã bị chặn",
		value: "blocked",
		total: 0,
	},
	{
		label: "Đã bị xóa",
		value: "deleted",
		total: 0,
	},
];

const Customers = (props) => {
	const didMount = useRef(false);
	// const [search, setSearch] = useState("");
	const [data, setData] = useState();
	const [isLoading, setIsLoading] = useState(false);
	const [ascending, setAscending] = useState(true);

	const router = useRouter();
	const page = parseInt(router.query.page) || 1;
	const size = parseInt(router.query.size) || 5;
	const status = router.query.status || "";
	const search = router.query.search || "";
	const sortField = router.query.sortField ?? "";
	const sortType = router.query.sortType ?? "asc";

	useEffect(() => {
		(async () => {
			try {
				setIsLoading(true);
				const { data: allUsers } = await userApi.getUsers({
					page,
					pageSize: size,
					keyword: search,
					sortField,
					sortType: sortType
				});
				listStatus[0].total = allUsers.total_elements;
				const { data: blockedUsers } = await userApi.getBlockedUsers({
					page,
					pageSize: size,
					keyword: search,
					sortField,
					sortType: sortType,
				});
				listStatus[1].total = blockedUsers.total_elements;
				const { data: deletedUsers } = await userApi.getDeletedUsers({
					page,
					pageSize: size,
					keyword: search,
					sortField,
					sortType: sortType,
				});
				listStatus[2].total = deletedUsers.total_elements;
				if (status === "deleted") {
					setData(deletedUsers);
					setIsLoading(false);
				}
				if (status === "blocked") {
					setData(blockedUsers);
					setIsLoading(false);
				}
				if (status === "" || typeof status === "undefined") {
					setData(allUsers);
					setIsLoading(false);
				}
			} catch (err) {
				console.log(err);
				setIsLoading(false);
			}
		})();
	}, [page, size, status, search, sortField, sortType]);

	const handleChangePage = async (e, page) => {
		router.push(`/customers?page=${page + 1}&size=${size}&status=${status}&search=${search}&sortField=${sortField}&sortType=${sortType}`);
	};

	const handleChangeRowsPerPage = async (e, rows) => {
		router.push(
			`/customers?page=1&size=${rows.props.value}&status=${status}&search=${search}&sortField=${sortField}&sortType=${sortType}`
		);
	};

	const handleChangeTab = (e, status) => {
		router.push(
			`customers?page=${1}&size=${size}&status=${status}&search=${search}&sortField=${sortField}&sortType=${sortType}`
		);
	};

	const handleSearch = (event) => {
		router.push(
			`/customers?page=${1}&size=${size}&status=${status}&search=${
				event.target.value
			}&sortField=Email&sortType=${sortType}`
		);
	};

	const handleSort = (field) => {
		let type = "asc";
		if(sortType === "asc")
			type = "desc";
		router.push(
			`/customers?page=${page}&size=${size}&status=${status}&search=${search}&sortField=${field}&sortType=${type}`
		);

	}

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
					<CustomerListToolbar handleSearch={handleSearch} />
					<Box sx={{ mt: 3 }}>
						{data && (
							<CustomerListResults
								listStatus={listStatus}
								data={data}
								page={page}
								size={size}
								status={status}
								sortType={sortType}
								ascending={ascending}
								setAscending={setAscending}
								handleChangeTab={handleChangeTab}
								handleChangePage={handleChangePage}
								handleChangeRowsPerPage={handleChangeRowsPerPage}
								handleSort={handleSort}
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
