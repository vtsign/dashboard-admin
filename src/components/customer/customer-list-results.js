import { useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
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
	Table,
	TableBody,
	TableCell,
	TableHead,
	TablePagination,
	TableRow,
	Typography,
	Tabs,
	Tab
} from '@mui/material';
import { Block, Delete, Edit } from '@mui/icons-material';
import { useRouter } from 'next/router';
import userApi from 'src/api/userApi';
import { useToast } from '../toast/useToast';

export const CustomerListResults = ({
	listStatus,
	customers,
	data,
	page,
	size,
	status,
	handleChangePage,
	handleChangeRowsPerPage,
	handleChangeTab,
	...rest
}) => {
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [openBlockDialog, setOpenBlockDialog] = useState(false);
	const [selectedCustomer, setSelectedCustomer] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	const router = useRouter();
	const { success, error } = useToast();

	const handleEditCustomer = async (customer) => {
		router.push(`/customers/${customer.id}`);
	};

	const handleDeleteCustomer = async (customer) => {
		setIsLoading(true);
		try {
			const response = await userApi.deleteUser(customer.id);
			if (response.status >= 200 && response.status < 300) {
				setIsLoading(false);
				setSelectedCustomer(null);
				success('Xóa người dùng thành công');
				setOpenDeleteDialog(false);
				router.reload();
			}
		} catch (err) {
			setIsLoading(false);
			error('Đã có lỗi xảy ra');
		}
	};

	const handleBlockCustomer = async (customer) => {
		setIsLoading(true);
		try {
			const response = await userApi.blockUser(customer.id);
			if (response.status >= 200 && response.status < 300) {
				setIsLoading(false);
				setSelectedCustomer(null);
				success('Chặn người dùng thành công');
				setOpenBlockDialog(false);
				router.reload();
			}
		} catch (err) {
			setIsLoading(false);
			error('Đã có lỗi xảy ra');
		}
	};

	return (
		<>
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
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>Tên</TableCell>
									<TableCell>Email</TableCell>
									<TableCell>Địa chỉ</TableCell>
									<TableCell>Số điện thoại</TableCell>
									<TableCell>Cơ quan</TableCell>
									<TableCell align="center">Thao tác</TableCell>
								</TableRow>
							</TableHead>
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
												<Avatar src={item.avatar} sx={{ mr: 2 }}>
													{/* {getInitials(customer.name)} */}
												</Avatar>
												<Typography color="textPrimary" variant="body1">
													{item.first_name} {item.last_name}
												</Typography>
											</Box>
										</TableCell>
										<TableCell>{item.email}</TableCell>
										<TableCell>{item.address}</TableCell>
										<TableCell>{item.phone}</TableCell>
										<TableCell>{item.organization}</TableCell>
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
									</TableRow>
								))}
							</TableBody>
						</Table>
					</Box>
				</PerfectScrollbar>
				<TablePagination
					component="div"
					count={data.total_elements}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
					page={page - 1}
					rowsPerPage={size}
					rowsPerPageOptions={[5, 10, 25]}
				/>
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
			</Card>
		</>
	);
};

CustomerListResults.propTypes = {
	customers: PropTypes.array.isRequired
};
