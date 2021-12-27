import React, { useState } from "react";
import {
	Box,
	Button,
	Card,
	CardContent,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid,
	InputAdornment,
	MenuItem,
	SvgIcon,
	TextField,
	Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material"
import { Search as SearchIcon } from "../../icons/search";
import { useFormik } from "formik";
import * as Yup from "yup";
import userApi from "src/api/userApi";
import { useToast } from "../toast/useToast";
import { useRouter } from "next/router";
import Loading from "../Loading/Loading";
import { responseMessage } from "../global";

export const CustomerListToolbar = (props) => {
	const [openAddCustomerDialog, setOpenAddCustomerDialog] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [search, setSearch] = useState("");

	const router = useRouter();
	const { success, error } = useToast();

	const REG_PHONE = /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
	const formik = useFormik({
		initialValues: {
			email: "",
			password: "",
			phone: "",
			organization: "",
			address: "",
			role: "USER",
			first_name: "",
			last_name: "",
		},
		validationSchema: Yup.object({
			email: Yup.string()
				.email("Email không đúng định dạng")
				.max(255)
				.required("Vui lòng nhập địa chỉ email"),
			password: Yup.string().max(255).required("Vui lòng nhập mật khẩu"),
			phone: Yup.string()
				.matches(REG_PHONE, "Số điện thoại không đúng định dạng")
				.max(255)
				.required("Vui lòng nhập số điện thoại"),
			organization: Yup.string().max(255).required("Vui lòng nhập cơ quan"),
			address: Yup.string().max(255).required("Vui lòng nhập địa chỉ"),
			role: Yup.string().max(255).required("Vui lòng nhập vai trò"),
			first_name: Yup.string().max(255).required("Vui lòng nhập tên"),
			last_name: Yup.string().max(255).required("Vui lòng nhập họ và tên đệm"),
		}),
		onSubmit: async (formData) => {
			setIsLoading(true);
			try {
				const response = await userApi.createUser(formData);
				if (response.status >= 200 && response.status < 300) {
					setIsLoading(false);
					success("Thêm người dùng thành công");
					setOpenAddCustomerDialog(false);
					router.reload();
				} else {
					setIsLoading(false);
					switch (response.status) {
						case 403:
							error("Truy cập bị chặn");
							break;
						case 409:
							error("Tài khoản đã tồn tại");
							break;
						case 419:
							error("Thiếu thông tin");
							break;
						case 500:
							error("Máy chủ gặp trục trặc");
							break;
						default:
							"Đã có lỗi xảy ra";
					}
				}
			} catch (err) {
				setIsLoading(false);
				error(err.toString() || "Đã có lỗi xảy ra");
			}
		},
	});

	const handleEnterSearch = (e) => {
		if(e.keyCode === 13) {
			props.handleSearch(e.target.value);
		}
	}
	return (
		<Box {...props}>
			{isLoading && <Loading />}
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
						Thêm người dùng
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
										<InputAdornment
											position="start"
										>
											<SvgIcon color="action" fontSize="small">
												<SearchIcon />
											</SvgIcon>
										</InputAdornment>
									),
									endAdornment: (
										<InputAdornment
											position="end"
											style={{ cursor: "pointer" }}
											onClick={(e) => {
												props.handleSearch("");
												setSearch("");
											}}
										>
											<SvgIcon color="action" fontSize="small">
												<Close />
											</SvgIcon>
										</InputAdornment>
									),
								}}
								value={search}
								placeholder="Tìm kiếm người dùng"
								variant="outlined"
								onChange={(e) => setSearch(e.target.value)}
								onKeyDown={handleEnterSearch}
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
				<form onSubmit={formik.handleSubmit}>
					<DialogTitle>Thêm người dùng</DialogTitle>
					<DialogContent dividers>
						<Grid container spacing={3}>
							<Grid item md={6}>
								<TextField
									error={Boolean(
										formik.touched.first_name && formik.errors.first_name
									)}
									fullWidth
									helperText={
										formik.touched.first_name && formik.errors.first_name
									}
									label="Tên"
									margin="normal"
									name="first_name"
									onBlur={formik.handleBlur}
									onChange={formik.handleChange}
									value={formik.values.first_name}
									variant="outlined"
								/>
							</Grid>
							<Grid item md={6}>
								<TextField
									error={Boolean(
										formik.touched.last_name && formik.errors.last_name
									)}
									fullWidth
									helperText={formik.touched.last_name && formik.errors.last_name}
									label="Họ và tên đệm"
									margin="normal"
									name="last_name"
									onBlur={formik.handleBlur}
									onChange={formik.handleChange}
									value={formik.values.last_name}
									variant="outlined"
								/>
							</Grid>
							<Grid item md={6}>
								<TextField
									error={Boolean(formik.touched.email && formik.errors.email)}
									fullWidth
									helperText={formik.touched.email && formik.errors.email}
									label="Địa chỉ email"
									margin="normal"
									name="email"
									onBlur={formik.handleBlur}
									onChange={formik.handleChange}
									type="email"
									value={formik.values.email}
									variant="outlined"
									autoComplete="off"
								/>
							</Grid>
							<Grid item md={6}>
								<TextField
									error={Boolean(
										formik.touched.password && formik.errors.password
									)}
									fullWidth
									helperText={formik.touched.password && formik.errors.password}
									label="Mật khẩu"
									margin="normal"
									name="password"
									onBlur={formik.handleBlur}
									onChange={formik.handleChange}
									type="password"
									value={formik.values.password}
									variant="outlined"
									autoComplete="off"
								/>
							</Grid>
							<Grid item md={6}>
								<TextField
									error={Boolean(formik.touched.phone && formik.errors.phone)}
									fullWidth
									helperText={formik.touched.phone && formik.errors.phone}
									label="Số điện thoại"
									margin="normal"
									name="phone"
									onBlur={formik.handleBlur}
									onChange={formik.handleChange}
									value={formik.values.phone}
									variant="outlined"
								/>
							</Grid>
							<Grid item md={6}>
								<TextField
									error={Boolean(
										formik.touched.organization && formik.errors.organization
									)}
									fullWidth
									helperText={
										formik.touched.organization && formik.errors.organization
									}
									label="Cơ quan"
									margin="normal"
									name="organization"
									onBlur={formik.handleBlur}
									onChange={formik.handleChange}
									value={formik.values.organization}
									variant="outlined"
								/>
							</Grid>
							<Grid item md={6}>
								<TextField
									error={Boolean(formik.touched.address && formik.errors.address)}
									fullWidth
									helperText={formik.touched.address && formik.errors.address}
									label="Địa chỉ"
									margin="normal"
									name="address"
									onBlur={formik.handleBlur}
									onChange={formik.handleChange}
									value={formik.values.address}
									variant="outlined"
								/>
							</Grid>
							<Grid item md={6}>
								<TextField
									error={Boolean(formik.touched.role && formik.errors.role)}
									fullWidth
									helperText={formik.touched.role && formik.errors.role}
									label="Vai trò"
									margin="normal"
									name="role"
									onBlur={formik.handleBlur}
									onChange={formik.handleChange}
									value={formik.values.role}
									variant="outlined"
									select
								>
									<MenuItem value="USER">Người dùng</MenuItem>
									<MenuItem value="ADMIN">Quản trị viên</MenuItem>
								</TextField>
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
							disabled={formik.isSubmitting}
							type="submit"
						>
							Đồng ý
						</Button>
					</DialogActions>
				</form>
			</Dialog>
		</Box>
	);
};
