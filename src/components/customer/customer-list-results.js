import { useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import PropTypes from "prop-types";
import {
	Avatar,
	Box,
	Button,
	Card,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	TableContainer,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TablePagination,
	TableRow,
	Typography,
	Tabs,
	Tab,
	Tooltip,
	Paper,
} from "@mui/material";
import {
	Block,
	Delete,
	Edit,
	LockOpen,
	Restore,
	KeyboardArrowDown,
	KeyboardArrowUp,
} from "@mui/icons-material";
import { useRouter } from "next/router";
import userApi from "src/api/userApi";
import { useToast } from "../toast/useToast";
import Loading from "../Loading/Loading";
import { responseMessage } from "../global";

export const CustomerListResults = ({
	listStatus,
	customers,
	data,
	page,
	size,
	status,
	sortType,
	sortField,
	handleChangePage,
	handleChangeRowsPerPage,
	handleChangeTab,
	handleSort,
	...rest
}) => {
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [openBlockDialog, setOpenBlockDialog] = useState(false);
	const [openRestoreDialog, setOpenRestoreDialog] = useState(false);
	const [openUnblockDialog, setOpenUnblockDialog] = useState(false);
	const [selectedCustomer, setSelectedCustomer] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	const router = useRouter();
	const { success, error } = useToast();

	const handleEditCustomer = async (customer) => {
		router.push(`/customers/edit?id=${customer.id}`);
	};

	const handleDeleteCustomer = async (customer) => {
		setIsLoading(true);
		try {
			const response = await userApi.deleteUser(customer.id);
			if (response.status >= 200 && response.status < 300) {
				setSelectedCustomer(null);
				success("Xóa người dùng thành công");
				setOpenDeleteDialog(false);
				setIsLoading(false);
				router.reload();
			} else {
				switch (response.status) {
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
				return;
			}
		} catch (err) {
			setIsLoading(false);
			error(err.toString() || "Đã có lỗi xảy ra");
		}
	};

	const handleBlockCustomer = async (customer) => {
		setIsLoading(true);
		try {
			const response = await userApi.blockUser(customer.id);
			if (response.status >= 200 && response.status < 300) {
				setSelectedCustomer(null);
				success("Chặn người dùng thành công");
				setOpenBlockDialog(false);
				setIsLoading(false);
				router.reload();
			} else {
				switch (response.status) {
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
				return;
			}
		} catch (err) {
			setIsLoading(false);
			error(err.toString() || "Đã có lỗi xảy ra");
		}
	};

	const handleRestoreCustomer = async (customer) => {
		setIsLoading(true);
		try {
			const response = await userApi.restoreUser(customer.id);
			if (response.status >= 200 && response.status < 300) {
				setSelectedCustomer(null);
				success("Khôi phục người dùng thành công");
				setOpenRestoreDialog(false);
				setIsLoading(false);
				router.reload();
			} else {
				switch (response.status) {
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
				return;
			}
		} catch (err) {
			setIsLoading(false);
			error(err.toString() || "Đã có lỗi xảy ra");
		}
	};

	const handleUnblockCustomer = async (customer) => {
		setIsLoading(true);
		try {
			const response = await userApi.unblockUser(customer.id);
			if (response.status >= 200 && response.status < 300) {
				setSelectedCustomer(null);
				success("Bỏ chặn người dùng thành công");
				setOpenUnblockDialog(false);
				setIsLoading(false);
				router.reload();
			} else {
				switch (response.status) {
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
				setIsLoading(false)
				return;
			}
		} catch (err) {
			setIsLoading(false);
			error(err.toString() || "Đã có lỗi xảy ra");
		}
	};

	function displayLabel(data) {
		data.from = data.page * parseInt(size) + 1;
		data.to = data.from + parseInt(size) - 1;
		return (
			<span>
				từ <b>{Math.min(data.from, data.count)}</b> đến{" "}
				<b>{Math.min(data.to, data.count)}</b> trong <b>{data.count}</b>
				{" người dùng"}
			</span>
		);
	}

	const showIconSort = (sortType === 'desc' ? <KeyboardArrowUp /> : <KeyboardArrowDown />)

	return (
		<>
			{isLoading && <Loading />}
			<Tabs
				value={status ?? ""}
				onChange={handleChangeTab}
				indicatorColor="primary"
				textColor="primary"
				variant="scrollable"
			>
				{listStatus?.map(({ value, label, total }) => (
					<Tab key={value} label={`${label} (${total})`} value={value} />
				))}
			</Tabs>
			<Card {...rest}>
				<PerfectScrollbar>
					<Box sx={{ minWidth: 1050 }}>
						<TableContainer component={Paper}>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell onClick={() => handleSort("firstName")}>
											<Box
												style={{
													display: "flex",
													alignItems: "center",
													cursor: "pointer",
												}}
											>
												<p>Tên</p>
												{/* {sortField === "firstName" && sortType === "asc" ? (
													<KeyboardArrowUp />
												) : (
													<KeyboardArrowDown />
												)} */}
												{sortField === "firstName" && showIconSort}
											</Box>{" "}
										</TableCell>
										<TableCell onClick={() => handleSort("email")}>
											<Box
												style={{
													display: "flex",
													alignItems: "center",
													cursor: "pointer",
												}}
											>
												<p>Email</p>
												{/* {sortField === "email" && sortType === "asc" ? (
													<KeyboardArrowUp />
												) : (
													<KeyboardArrowDown />
												)} */}
												{sortField === "email" && showIconSort}
											</Box>{" "}
										</TableCell>
										<TableCell onClick={() => handleSort("address")}>
											<Box
												style={{
													display: "flex",
													alignItems: "center",
													cursor: "pointer",
												}}
											>
												<p>Địa chỉ</p>
												{/* {sortField === "address" && sortType === "asc" ? (
													<KeyboardArrowUp />
												) : (
													<KeyboardArrowDown />
												)} */}
												{sortField === "address" && showIconSort}
											</Box>{" "}
										</TableCell>
										<TableCell onClick={() => handleSort("phone")}>
											<Box
												style={{
													display: "flex",
													alignItems: "center",
													cursor: "pointer",
												}}
											>
												<p>Số điện thoại</p>
												{/* {sortField === "phone" && sortType === "asc" ? (
													<KeyboardArrowUp />
												) : (
													<KeyboardArrowDown />
												)} */}

												{sortField === "phone" && showIconSort}
											</Box>{" "}
										</TableCell>
										<TableCell onClick={() => handleSort("organization")}>
											<Box
												style={{
													display: "flex",
													alignItems: "center",
													cursor: "pointer",
												}}
											>
												<p>Cơ quan</p>
												{/* {sortField === "organization" && sortType === "asc" ? (
													<KeyboardArrowUp />
												) : (
													<KeyboardArrowDown />
												)} */}
												{sortField === "organization" && showIconSort}
											</Box>{" "}
										</TableCell>
										<TableCell align="center">Thao tác</TableCell>
									</TableRow>
								</TableHead>
								{data && data.list.length > 0 ? (
									<TableBody>
										{data.list.map((item) => (
											<TableRow hover key={item.id}>
												<TableCell>
													<Box
														sx={{
															alignItems: "center",
															display: "flex",
														}}
													>
														<Avatar
															src={item.avatar}
															sx={{ mr: 2 }}
														></Avatar>
														<Typography
															color="textPrimary"
															variant="body1"
														>
															{item.first_name} {item.last_name}
														</Typography>
													</Box>
												</TableCell>
												<TableCell>{item.email}</TableCell>
												<TableCell>{item.address}</TableCell>
												<TableCell>{item.phone}</TableCell>
												<TableCell>{item.organization}</TableCell>
												{status === "deleted" ? (
													<TableCell align="center">
														<IconButton
															style={{ color: "green" }}
															onClick={() => {
																setOpenRestoreDialog(true);
																setSelectedCustomer(item);
															}}
														>
															<Restore />
														</IconButton>
													</TableCell>
												) : status === "blocked" ? (
													<TableCell align="center">
														<IconButton
															style={{ color: "rgb(52,152,219)" }}
															onClick={() => handleEditCustomer(item)}
														>
															<Edit />
														</IconButton>
														<IconButton
															style={{ color: "green" }}
															onClick={() => {
																setOpenUnblockDialog(true);
																setSelectedCustomer(item);
															}}
														>
															<LockOpen />
														</IconButton>
														<IconButton
															style={{ color: "rgb(76,175,80)" }}
															onClick={() => {
																setOpenDeleteDialog(true);
																setSelectedCustomer(item);
															}}
														>
															<Delete />
														</IconButton>
													</TableCell>
												) : (
													<TableCell align="center">
														<IconButton
															style={{ color: "rgb(52,152,219)" }}
															onClick={() => handleEditCustomer(item)}
														>
															<Edit />
														</IconButton>
														<IconButton
															style={{ color: "red" }}
															onClick={() => {
																setOpenBlockDialog(true);
																setSelectedCustomer(item);
															}}
														>
															<Block />
														</IconButton>
														<IconButton
															style={{ color: "rgb(76,175,80)" }}
															onClick={() => {
																setOpenDeleteDialog(true);
																setSelectedCustomer(item);
															}}
														>
															<Delete />
														</IconButton>
													</TableCell>
												)}
											</TableRow>
										))}
									</TableBody>
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
					</Box>
				</PerfectScrollbar>
				{data.list.length > 0 && (
					<TablePagination
						component="div"
						labelRowsPerPage="Hiển thị mỗi trang"
						labelDisplayedRows={displayLabel}
						count={data.total_elements}
						onPageChange={handleChangePage}
						onRowsPerPageChange={handleChangeRowsPerPage}
						page={page - 1}
						rowsPerPage={size}
						rowsPerPageOptions={[5, 10, 25]}
					/>
				)}
				<Dialog open={openDeleteDialog} fullWidth maxWidth="xs">
					<DialogTitle>Xóa người dùng</DialogTitle>
					<DialogContent>Bạn có chắc muốn xóa người dùng này?</DialogContent>
					<DialogActions>
						<Button variant="outlined" onClick={() => setOpenDeleteDialog(false)}>
							Đóng
						</Button>
						<Button
							variant="contained"
							color="primary"
							// disabled={formik.isSubmitting}
							onClick={() => handleDeleteCustomer(selectedCustomer)}
							type="submit"
						>
							Đồng ý
						</Button>
					</DialogActions>
				</Dialog>
				<Dialog open={openBlockDialog} fullWidth maxWidth="xs">
					<DialogTitle>Chặn người dùng</DialogTitle>
					<DialogContent>Bạn có chắc muốn chặn người dùng này?</DialogContent>
					<DialogActions>
						<Button variant="outlined" onClick={() => setOpenBlockDialog(false)}>
							Đóng
						</Button>
						<Button
							variant="contained"
							color="primary"
							// disabled={formik.isSubmitting}
							onClick={() => handleBlockCustomer(selectedCustomer)}
							type="submit"
						>
							Đồng ý
						</Button>
					</DialogActions>
				</Dialog>
				<Dialog open={openRestoreDialog} fullWidth maxWidth="xs">
					<DialogTitle>Khôi phục người dùng</DialogTitle>
					<DialogContent>Bạn có chắc muốn khôi phục người dùng này?</DialogContent>
					<DialogActions>
						<Button variant="outlined" onClick={() => setOpenRestoreDialog(false)}>
							Đóng
						</Button>
						<Button
							variant="contained"
							color="primary"
							onClick={() => handleRestoreCustomer(selectedCustomer)}
							type="submit"
						>
							Đồng ý
						</Button>
					</DialogActions>
				</Dialog>
				<Dialog open={openUnblockDialog} fullWidth maxWidth="xs">
					<DialogTitle>Bỏ chặn người dùng</DialogTitle>
					<DialogContent>Bạn có chắc muốn bỏ chặn người dùng này?</DialogContent>
					<DialogActions>
						<Button variant="outlined" onClick={() => setOpenUnblockDialog(false)}>
							Đóng
						</Button>
						<Button
							variant="contained"
							color="primary"
							onClick={() => handleUnblockCustomer(selectedCustomer)}
							type="submit"
						>
							Đồng ý
						</Button>
					</DialogActions>
				</Dialog>
			</Card>
		</>
	);
};

CustomerListResults.propTypes = {
	customers: PropTypes.array.isRequired,
};
