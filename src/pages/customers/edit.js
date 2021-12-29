import React, { useEffect, useState, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
	Avatar,
	Card,
	CardHeader,
	CardContent,
	Box,
	Button,
	Container,
	Divider,
	Grid,
	Typography,
	TextField,
	InputLabel,
	MenuItem,
	TableContainer,
	Table,
	TableHead,
	TableRow,
	TableBody,
	TableCell,
	TablePagination,
	Paper,
} from "@mui/material";
import {
	CheckCircleOutlineRounded,
	Delete,
	HourglassBottom,
	NoteAlt,
	KeyboardArrowDown,
	KeyboardArrowUp,
} from "@mui/icons-material";
import { DashboardLayout } from "../../components/dashboard-layout";
import UserAvatar from "../../components/Profiles/UserAvatar";
import UserProfileDetails from "../../components/Profiles/UserProfileDetails";
import userApi from "src/api/userApi";
import Loading from "src/components/Loading/Loading";
import { useForm, Controller } from "react-hook-form";
import { useToast } from "src/components/toast/useToast";
import { formatNumber, convertTime, payment, responseMessage } from "src/components/global";
import documentApi from "src/api/documentApi";

const roleList = [
	{
		label: "Người dùng",
		value: "USER",
	},
	{
		label: "Quản trị viên",
		value: "ADMIN",
	},
];

export async function getServerSideProps(ctx) {
	let query = ctx.query;
	let id = query.id;
	let pageQuery = query.page ?? null;
	let page = query.page || 1;
	let size = query.size ?? 5;
	let sort_field = query.sort_field ?? "";
	let sort_type = query.sort_type ?? "asc";

	const props = { id, pageQuery, page: parseInt(page), size: parseInt(size), sort_field, sort_type };

	return { props };
}

const EditCustomer = (props) => {
	const [isLoading, setIsLoading] = useState(false);
	const [userInfo, setUserInfo] = useState(null);
	const [transactions, setTransactions] = useState(null);
	const [contracts, setContracts] = useState(0);
	const [role, setRoles] = useState(userInfo ? userInfo?.roles?.[0]?.name : "USER");

	const router = useRouter();
	const { success, error } = useToast();

	const {
		register,
		handleSubmit,
		formState: { errors },
		control,
		getValues,
		setValue,
	} = useForm();

	useEffect(() => {
		setIsLoading(true);
		(async () => {
			try {
				const response = await userApi.getUser(props.id);
				if (response.status === 200) {
					setUserInfo(response.data);
				}
				const transactionsRes = await userApi.getTransactions({
					id: props.id,
					page: props.page,
					size: props.size,
					sort_field: props.sort_field,
					sort_type: props.sort_type,
				});
				if (transactionsRes.status === 200) setTransactions(transactionsRes.data);

				const contractsRes = await documentApi.countAllContracts(props.id);
				if (contractsRes.status === 200) setContracts(contractsRes.data);
				setIsLoading(false);
				if(props.pageQuery)
					window.scrollTo(0, 1000)
			} catch (err) {
				switch (err.status) {
					case 400:
						error("Thiếu thông tin hoặc access token");
						break;
					case 403:
						error("Truy cập bị chặn");
						break;
					case 404:
						error("Tài khoản không tồn tại");
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
	}, [props.id, props.page, props.size, props.sort_type, props.sort_field]);

	const onSubmitChange = async (formData) => {
		formData.role = role;
		setIsLoading(true);

		try {
			const response = await userApi.updateUser(props.id, formData);
			if(response.status === 200) {
				setIsLoading(false);
				success("Cập nhật tài khoản thành công");
				router.reload();
			}
		} catch (err) {
			setIsLoading(false);
			switch (err.status) {
				case 400:
					error("Thiếu thông tin hoặc access token");
					break;
				case 403:
					error("Truy cập bị chặn");
					break;
				case 404:
					error("Tài khoản không tồn tại");
					break;
				case 500:
					error("Máy chủ gặp trục trặc");
					break;
				default:
					error("Đã có lỗi xảy ra");
					break;
			}
		}
	};

	const handleChangePage = async (e, page) => {
		let query = "";
		if (props.size) query += `&size=${props.size}`;
		if (props.sort_field) query += `&sort_field=&${props.sort_field}`;
		if (props.sort_type) query += `&sort_type=&${props.sort_type}`;
		router.push(
			`/customers/edit?id=${props.id}&page=${page + 1}${query}`, null, {
				scroll: true
			}
		);
	};

	const handleChangeRowsPerPage = async (e, rows) => {
		let query = "";
		if (props.sort_field) query += `&sort_field=&${props.sort_field}`;
		if (props.sort_type) query += `&sort_type=&${props.sort_type}`;
		router.push(
			`/customers/edit?id=${props.id}&page=1&size=${rows.props.value}${query}`
		);
	};

	const handleSort = (field) => {
		let type = "asc";
		if (props.sort_field === field && props.sort_type === "asc") type = "desc";
		router.push(
			`/customers/edit?id=${props.id}&page=${1}&size=${
				props.size
			}&sort_field=${field}&sort_type=${type}`
		);
	};

	function displayLabel(data) {
		data.from = data.page * parseInt(props.size) + 1;
		data.to = data.from + parseInt(props.size) - 1;
		return (
			<span>
				từ <b>{Math.min(data.from, data.count)}</b> đến{" "}
				<b>{Math.min(data.to, data.count)}</b> trong <b>{data.count}</b>
				{" giao dịch"}
			</span>
		);
	}

	return (
		<>
			<Head>
				<title>Account | VTSign</title>
			</Head>
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					py: 8,
				}}
			>
				{isLoading && <Loading />}
				{!isLoading && userInfo && (
					<Container maxWidth="lg">
						<Grid
							container
							className="profile__container"
							style={{ display: "flex", justifyContent: "center" }}
							spacing={3}
						>
							<Grid item lg={4}>
								<Card>
									<CardContent>
										<Box
											sx={{
												alignItems: "center",
												display: "flex",
												flexDirection: "column",
											}}
										>
											<Avatar
												src={userInfo.avatar}
												sx={{
													height: 128,
													mb: 2,
													width: 128,
												}}
											/>

											<Typography
												color="textPrimary"
												gutterBottom
												variant="h5"
											>
												{userInfo.first_name} {userInfo.last_name}
											</Typography>
											<Typography color="textSecondary" variant="body2">
												{userInfo.email}
											</Typography>
											<Typography color="textSecondary" variant="body2">
												Số dư {formatNumber(userInfo.balance)} đ
											</Typography>
										</Box>
									</CardContent>
								</Card>
							</Grid>
							<Grid item lg={8} md={6} xs={12}>
								<Card>
									<CardHeader
										subheader="Những thông tin này có thể chỉnh sửa được"
										title="Thông tin cá nhân"
									/>
									<Divider />
									<CardContent>
										<Grid container spacing={3}>
											<Grid item md={6} xs={12}>
												<InputLabel>
													Họ và tên đệm{" "}
													<span style={{ color: "red" }}>*</span>
												</InputLabel>
												<TextField
													id="lastName"
													fullWidth
													placeholder="Nhập họ và tên đệm"
													defaultValue={userInfo.last_name}
													{...register("last_name", {
														required: "Vui lòng nhập họ và tên đệm",
													})}
													error={!!errors.lastName}
													helperText={errors?.lastName?.message}
												/>
											</Grid>
											<Grid item md={6} xs={12}>
												<InputLabel>
													Tên <span style={{ color: "red" }}>*</span>
												</InputLabel>
												<TextField
													name="firstName"
													fullWidth
													placeholder="Nhập tên"
													defaultValue={userInfo.first_name}
													{...register("first_name", {
														required: "Vui lòng nhập tên",
													})}
													error={!!errors.firstName}
													helperText={errors?.firstName?.message}
												/>
											</Grid>
											<Grid item xs={12}>
												<InputLabel>
													Địa chỉ Email{" "}
													<span style={{ color: "red" }}>*</span>
												</InputLabel>
												<TextField
													name="email"
													fullWidth
													placeholder="Nhập địa chỉ email"
													defaultValue={userInfo.email}
													InputProps={{
														readOnly: true,
													}}
												/>
											</Grid>
											<Grid item md={6} xs={12}>
												<InputLabel>
													Số điện thoại{" "}
													<span style={{ color: "red" }}>*</span>
												</InputLabel>
												<TextField
													name="phone"
													fullWidth
													placeholder="Nhập số điện thoại"
													defaultValue={userInfo.phone}
													inputProps={{
														readOnly: true,
													}}
												/>
											</Grid>
											<Grid item md={6} xs={12}>
												<InputLabel>
													Cơ quan <span style={{ color: "red" }}>*</span>
												</InputLabel>
												<TextField
													name="organization"
													fullWidth
													placeholder="Nhập cơ quan"
													defaultValue={userInfo.organization}
													{...register("organization", {
														required: "Vui lòng nhập cơ quan",
													})}
													error={!!errors.organization}
													helperText={errors?.organization?.message}
												/>
											</Grid>
											<Grid item md={12}>
												<InputLabel>
													Địa chỉ <span style={{ color: "red" }}>*</span>
												</InputLabel>
												<TextField
													name="address"
													fullWidth
													placeholder="Nhập địa chỉ"
													defaultValue={userInfo.address}
													{...register("address", {
														required: "Vui lòng nhập địa chỉ",
													})}
													error={!!errors.address}
													helperText={errors?.address?.message}
												/>
											</Grid>
											<Grid item md={6} xs={12}>
												<InputLabel>
													Trạng thái{" "}
													<span style={{ color: "red" }}>*</span>
												</InputLabel>
												<TextField
													name="organization"
													fullWidth
													value={
														userInfo.blocked
															? "Đã bị chặn"
															: userInfo.deleted
															? "Đã bị xóa"
															: "Đang hoạt động"
													}
												/>
											</Grid>
											<Grid item md={6} xs={12}>
												<InputLabel>
													Vai trò
													<span style={{ color: "red" }}>*</span>
												</InputLabel>
												<Controller
													name="roles"
													control={control}
													render={({ ref, value, ...inputProps }) => (
														<TextField
															select
															fullWidth
															variant="outlined"
															// size="small"
															onChange={(e) =>
																setRoles(e.target.value)
															}
															{...inputProps}
															inputRef={ref}
															value={value}
															SelectProps={{
																displayEmpty: true,
															}}
															defaultValue={
																userInfo?.roles?.[0]?.name ?? "USER"
															}
														>
															{roleList.map(({ value, label }) => {
																return (
																	<MenuItem
																		key={value}
																		value={value}
																	>
																		{label}
																	</MenuItem>
																);
															})}
														</TextField>
													)}
												/>
											</Grid>
										</Grid>
									</CardContent>
									<Divider />
									<Box
										sx={{
											display: "flex",
											justifyContent: "flex-end",
											p: 2,
										}}
									>
										<Button
											color="primary"
											variant="contained"
											type="submit"
											onClick={handleSubmit(onSubmitChange)}
										>
											Lưu
										</Button>
									</Box>
								</Card>
							</Grid>
						</Grid>
						<Grid item lg={12} mt={5}>
							<Card>
								<CardHeader title="Quản lý giao dịch">abc</CardHeader>
								<CardContent>
									<TableContainer sx={{ minWidth: 800 }}>
										<Table>
											<TableHead>
												<TableRow style={{ backgroundColor: "#F4F6F8" }}>
													<TableCell
														style={{ fontSize: 14, fontWeight: 600 }}
														onClick={() => handleSort("id")}
													>
														<Box
															style={{
																display: "flex",
																alignItems: "center",
																cursor: "pointer",
															}}
														>
															<p>Mã giao dịch</p>
															{props.sort_field === "id" &&
															props.sort_type === "asc" ? (
																<KeyboardArrowUp />
															) : (
																<KeyboardArrowDown />
															)}
														</Box>{" "}
													</TableCell>
													<TableCell
														style={{ fontSize: 14, fontWeight: 600 }}
														onClick={() => handleSort("amount")}
													>
														<Box
															style={{
																display: "flex",
																alignItems: "center",
																cursor: "pointer",
															}}
														>
															<p>Số tiền</p>
															{props.sort_field === "amount" &&
															props.sort_type === "asc" ? (
																<KeyboardArrowUp />
															) : (
																<KeyboardArrowDown />
															)}
														</Box>{" "}
													</TableCell>
													<TableCell
														style={{ fontSize: 14, fontWeight: 600 }}
														onClick={() => handleSort("createdDate")}
													>
														<Box
															style={{
																display: "flex",
																alignItems: "center",
																cursor: "pointer",
															}}
														>
															<p>Thời gian giao dịch</p>
															{props.sort_field === "createdDate" &&
															props.sort_type === "asc" ? (
																<KeyboardArrowUp />
															) : (
																<KeyboardArrowDown />
															)}
														</Box>{" "}
													</TableCell>
													<TableCell
														style={{ fontSize: 14, fontWeight: 600 }}
														onClick={() => handleSort("status")}
													>
														<Box
															style={{
																display: "flex",
																alignItems: "center",
																cursor: "pointer",
															}}
														>
															<p>Loại giao dịch</p>
															{props.sort_field === "status" &&
															props.sort_type === "asc" ? (
																<KeyboardArrowUp />
															) : (
																<KeyboardArrowDown />
															)}
														</Box>{" "}
													</TableCell>
													<TableCell
														style={{ fontSize: 14, fontWeight: 600 }}
														onClick={() => handleSort("method")}
													>
														<Box
															style={{
																display: "flex",
																alignItems: "center",
																cursor: "pointer",
															}}
														>
															<p>Phương thức thanh toán</p>
															{props.sort_field === "method" &&
															props.sort_type === "asc" ? (
																<KeyboardArrowUp />
															) : (
																<KeyboardArrowDown />
															)}
														</Box>{" "}
													</TableCell>
													<TableCell
														style={{ fontSize: 14, fontWeight: 600 }}
														onClick={() => handleSort("description")}
													>
														<Box
															style={{
																display: "flex",
																alignItems: "center",
																cursor: "pointer",
															}}
														>
															<p>Mô tả</p>
															{props.sort_field === "description" &&
															props.sort_type === "asc" ? (
																<KeyboardArrowUp />
															) : (
																<KeyboardArrowDown />
															)}
														</Box>{" "}
													</TableCell>
												</TableRow>
											</TableHead>
											{transactions && transactions?.list?.length > 0 ? (
												<>
													<TableBody>
														{transactions?.list?.map(
															(transaction, index) => (
																<TableRow
																	hover
																	key={transactions.id}
																>
																	<TableCell
																		style={{
																			lineHeight: "24px",
																		}}
																	>
																		{transaction.id}
																	</TableCell>
																	{transaction.status ===
																		"deposit" ||
																	transaction.status ===
																		"init_balance" ? (
																		<TableCell
																			style={{
																				lineHeight: "24px",
																				color: "green",
																			}}
																			align="right"
																		>
																			{`+ ${formatNumber(
																				transaction.amount
																			)} đ`}
																		</TableCell>
																	) : (
																		<TableCell
																			style={{
																				lineHeight: "24px",
																				color: "red",
																			}}
																			align="right"
																		>
																			{`- ${formatNumber(
																				transaction.amount
																			)} đ`}
																		</TableCell>
																	)}
																	<TableCell
																		style={{
																			lineHeight: "24px",
																		}}
																	>
																		{convertTime(
																			transaction.created_date
																		) ?? ""}
																	</TableCell>
																	<TableCell
																		style={{
																			lineHeight: "24px",
																		}}
																	>
																		{
																			payment.status[
																				transaction.status
																			]
																		}
																	</TableCell>
																	<TableCell
																		style={{
																			lineHeight: "24px",
																		}}
																	>
																		{
																			payment.method[
																				transaction.method
																			]
																		}
																	</TableCell>
																	<TableCell
																		style={{
																			lineHeight: "24px",
																		}}
																	>
																		{transaction.description}
																	</TableCell>
																</TableRow>
															)
														)}
													</TableBody>
													<TablePagination
														rowsPerPageOptions={[5, 10, 25]}
														labelRowsPerPage="Hiển thị mỗi trang"
														labelDisplayedRows={displayLabel}
														count={transactions.total_elements}
														rowsPerPage={props.size}
														page={props.page - 1}
														onPageChange={handleChangePage}
														onRowsPerPageChange={
															handleChangeRowsPerPage
														}
													/>
												</>
											) : (
												<TableBody>
													<TableRow>
														<TableCell colSpan={3}>
															Không tìm thấy dữ liệu phù hợp
														</TableCell>
													</TableRow>
												</TableBody>
											)}
										</Table>
									</TableContainer>
								</CardContent>
							</Card>
						</Grid>
						<Grid item lg={12} mt={5}>
							<Card>
								<CardHeader title="Quản lý tài liệu"></CardHeader>
								<CardContent>
									<Grid container spacing={3}>
										<Grid item xs={3}>
											<Paper
												variant="outlined"
												sx={{
													py: 2.5,
													textAlign: "center",
													backgroundColor: "#D0F2FF",
												}}
											>
												<Box
													sx={{ mb: 0.5 }}
													style={{
														color: "#0B53B7",
													}}
												>
													<NoteAlt sx={{ fontSize: 40 }} />
												</Box>
												<Typography
													variant="h6"
													style={{
														color: "#03297A",
													}}
												>
													{contracts.action_require}
												</Typography>
												<Typography
													variant="body2"
													sx={{ color: "#6487B8" }}
												>
													Tài liệu cần ký
												</Typography>
											</Paper>
										</Grid>
										<Grid item xs={3}>
											<Paper
												variant="outlined"
												sx={{
													py: 2.5,
													textAlign: "center",
													backgroundColor: "#FFF7CD",
												}}
											>
												<Box
													sx={{ mb: 0.5 }}
													style={{
														color: "#B78102",
													}}
												>
													<HourglassBottom sx={{ fontSize: 40 }} />
												</Box>
												<Typography
													variant="h6"
													style={{
														color: "#7A4F02",
													}}
												>
													{contracts.waiting}
												</Typography>
												<Typography
													variant="body2"
													sx={{ color: "#A78745" }}
												>
													Tài liệu chờ ký
												</Typography>
											</Paper>
										</Grid>
										<Grid item xs={3}>
											<Paper
												variant="outlined"
												sx={{
													py: 2.5,
													textAlign: "center",
													backgroundColor: "rgb(200,250,205)",
												}}
											>
												<Box
													sx={{ mb: 0.5 }}
													style={{
														color: "rgb(0,82,73)",
													}}
												>
													<CheckCircleOutlineRounded
														sx={{ fontSize: 40 }}
													/>
												</Box>
												<Typography
													variant="h6"
													style={{
														color: "rgb(0,82,73)",
													}}
												>
													{contracts.completed}
												</Typography>
												<Typography
													variant="body2"
													sx={{ color: "#3A826F" }}
												>
													Tài liệu đã hoàn tất
												</Typography>
											</Paper>
										</Grid>
										<Grid item xs={3}>
											<Paper
												variant="outlined"
												sx={{
													py: 2.5,
													textAlign: "center",
													backgroundColor: "#FFE7D9",
												}}
											>
												<Box
													sx={{ mb: 0.5 }}
													style={{
														color: "#B72136",
													}}
												>
													<Delete sx={{ fontSize: 40 }} />
												</Box>
												<Typography
													variant="h6"
													style={{
														color: "#7A0C2E",
													}}
												>
													{contracts.deleted}
												</Typography>
												<Typography
													variant="body2"
													sx={{ color: "#9F4A5E" }}
												>
													Tài liệu đã xóa
												</Typography>
											</Paper>
										</Grid>
									</Grid>
								</CardContent>
							</Card>
						</Grid>
					</Container>
				)}
			</Box>
		</>
	);
};
EditCustomer.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default EditCustomer;
