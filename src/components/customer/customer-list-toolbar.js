import React, { useState } from "react";
import {
	Box,
	Button,
	Card,
	CardContent,
	TextField,
	InputAdornment,
	SvgIcon,
	Typography,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Grid,
	Divider,
	InputLabel
} from "@mui/material";
import { Search as SearchIcon } from "../../icons/search";
import { Upload as UploadIcon } from "../../icons/upload";
import { Download as DownloadIcon } from "../../icons/download";

export const CustomerListToolbar = (props) => {
	const [openAddCustomerDialog, setOpenAddCustomerDialog] = useState(false);
	return (
		<Box {...props}>
			<Box
				sx={{
					alignItems: "center",
					display: "flex",
					justifyContent: "space-between",
					flexWrap: "wrap",
					m: -1,
				}}
			>
				<Typography sx={{ m: 1 }} variant="h4">
					Danh sách người dùng
				</Typography>
				<Box sx={{ m: 1 }}>
					<Button
						color="primary"
						variant="contained"
						onClick={() => setOpenAddCustomerDialog(true)}
					>
						Add Customers
					</Button>
				</Box>
			</Box>
			<Box sx={{ mt: 3 }}>
				<Card>
					<CardContent>
						<Box sx={{ maxWidth: 500 }}>
							<TextField
								fullWidth
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<SvgIcon color="action" fontSize="small">
												<SearchIcon />
											</SvgIcon>
										</InputAdornment>
									),
								}}
								placeholder="Tìm kiếm người dùng"
								variant="outlined"
							/>
						</Box>
					</CardContent>
				</Card>
			</Box>
			<Dialog
				open={openAddCustomerDialog}
				onClose={() => setOpenAddCustomerDialog(false)}
				fullWidth
				maxWidth={"lg"}
			>
				<DialogTitle>Thêm người dùng</DialogTitle>
				<DialogContent dividers>
					<Grid container spacing={3}>
						<Grid item md={6}>
							<InputLabel>
								Họ và tên đệm <span style={{ color: "red" }}>*</span>
							</InputLabel>
							<TextField
								id="lastName"
								fullWidth
								placeholder="Nhập họ và tên đệm"
							/>
						</Grid>
						<Grid item md={6}>
							5
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button variant="outlined" onClick={() => setOpenAddCustomerDialog(false)}>
						Đóng
					</Button>
					<Button
						variant="contained"
						color="primary"
						// onClick={hookForm.handleSubmit(handleOk)}
					>
						Đồng ý
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};
