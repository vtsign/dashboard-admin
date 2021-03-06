import React, { useEffect, useState, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Box, Container } from "@mui/material";
import { CustomerListResults } from "../../components/customer/customer-list-results";
import { CustomerListToolbar } from "../../components/customer/customer-list-toolbar";
import { DashboardLayout } from "../../components/dashboard-layout";
import userApi from "src/api/userApi";
import Loading from "src/components/Loading/Loading";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";

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
					sortType: sortType,
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
				switch (err.status) {
					case 400:
						error("Thiếu thông tin hoặc token");
						break;
					case 403:
						error("Truy cập bị chặn");
						break;
					case 500:
						error("Máy chủ gặp trục trặc");
						break;
					default:
						error("Đã có lỗi xảy ra");
						break;
				}
				setIsLoading(false);
			}
		})();
	}, [page, size, status, search, sortField, sortType]);

	const handleChangePage = async (e, page) => {
		let query = "";
		if (size) query += `&size=${size}`;
		if (status) query += `&status=${status}`;
		if (search) query += `&search=${search}`;
		if (sortField) query += `&sort_field=&${sortField}`;
		if (sortType) query += `&sort_type=&${sortType}`;
		router.push(`/customers?page=${page + 1}${query}`);
	};

	const handleChangeRowsPerPage = async (e, rows) => {
		let query = "";
		if (status) query += `&status=${status}`;
		if (search) query += `&search=${search}`;
		if (sortField) query += `&sort_field=&${sortField}`;
		if (sortType) query += `&sort_type=&${sortType}`;
		router.push(`/customers?page=1&size=${rows.props.value}${query}`);
	};

	const handleChangeTab = (e, status) => {
		let query = "";
		if (size) query += `&size=${size}`;
		if (search) query += `&search=${search}`;
		if (sortField) query += `&sort_field=&${sortField}`;
		if (sortType) query += `&sort_type=&${sortType}`;
		router.push(`customers?page=${1}&status=${status}${query}`);
	};

	const handleSearch = (search) => {
		let query = "";
		if (size) query += `&size=${size}`;
		if (status) query += `&status=${status}`;
		if (sortField) query += `&sort_field=&${sortField}`;
		if (sortType) query += `&sort_type=&${sortType}`;
		router.push(`/customers?page=${1}${query}&search=${search}`);
	};

	const handleSort = (field) => {
		let type = "asc";
		if (sortType === "asc") type = "desc";
		let query = "";
		if (size) query += `&size=${size}`;
		if (status) query += `&status=${status}`;
		if (search) query += `&search=${search}`;
		router.push(`/customers?page=${1}${query}&sortField=${field}&sortType=${type}`);
	};

	return (
		<>
			<Head>
				<title>Danh sách người dùng | VTSign</title>
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
								sortField={sortField}
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
