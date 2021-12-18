import { useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import PropTypes from "prop-types";
import { format } from "date-fns";
import {
	Avatar,
	Box,
	Card,
	Checkbox,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TablePagination,
	TableRow,
	Typography,
	Button,
	IconButton
} from "@mui/material";
import { getInitials } from "../../utils/get-initials";

export const CustomerListResults = ({ customers, data, page, size, handleChangePage, handleChangeRowsPerPage,...rest }) => {

	return (
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
								<TableCell>Tổ chức</TableCell>
								<TableCell>Thao tác</TableCell>
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
									<TableCell>
										<Button>Sửa</Button>
										<Button>Xóa</Button>
										<Button>Chặn</Button>
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
		</Card>
	);
};

CustomerListResults.propTypes = {
	customers: PropTypes.array.isRequired,
};
