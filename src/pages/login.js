import React, { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Button, Container, Grid, TextField, Typography } from "@mui/material";
import authApi from "../api/authApi";
import { useToast } from "../components/toast/useToast";
import Loading from "src/components/Loading/Loading";
import { responseMessage } from "src/components/global";

const Login = () => {
	const [isLoading, setIsLoading] = useState(false);
	const { success, error } = useToast();
	const router = useRouter();
	const formik = useFormik({
		initialValues: {
			email: "",
			password: "",
		},
		validationSchema: Yup.object({
			email: Yup.string()
				.email("Must be a valid email")
				.max(255)
				.required("Email is required"),
			password: Yup.string().max(255).required("Password is required"),
		}),
		onSubmit: async (formData) => {
			setIsLoading(true);
			try {
				const response = await authApi.login(formData.email, formData.password);
				let isAdmin = false;
				if (response.status === 200) {
					const { data } = response;
					data.roles.forEach((item) => {
						if (item.name === "ADMIN") {
							isAdmin = true;
						}
					});
					if (!isAdmin) {
						setIsLoading(false);
						error("Tài khoản không có quyền đăng nhập");
					} else {
						setIsLoading(false);
						success("Đăng nhập thành công");
						router.push("/");
					}
				} else {
					switch (response.status) {
						case 401:
							error("Tài khoản hoặc mật khẩu không đúng");
							break;
						case 419:
							error("Thiếu email hoặc password");
							break;
						case 423:
							error("Tài khoản chưa được kích hoạt");
							break;
						case 500:
							error("Máy chủ gặp trục trặc");
							break;
						default:
							"Đã có lỗi xảy ra";
					}
					setIsLoading(false);
					return;
				}
			} catch (err) {
				error("Tài khoản hoặc mật khẩu không đúng");
				setIsLoading(false);
			}
		},
	});

	return (
		<>
			{isLoading && <Loading />}
			<Head>
				<title>Login</title>
			</Head>
			<Box
				component="main"
				sx={{
					alignItems: "center",
					display: "flex",
					flexGrow: 1,
					minHeight: "100%",
				}}
			>
				<Container maxWidth="sm">
					<form onSubmit={formik.handleSubmit}>
						<Box sx={{ my: 3 }}>
							<Typography color="textPrimary" variant="h4">
								Đăng nhập
							</Typography>
						</Box>
						<Grid container spacing={3}></Grid>
						<Box
							sx={{
								pb: 1,
								pt: 3,
							}}
						>
							<Typography align="center" color="textSecondary" variant="body1">
								Đăng nhập bằng địa chỉ email
							</Typography>
						</Box>
						<TextField
							error={Boolean(formik.touched.email && formik.errors.email)}
							fullWidth
							helperText={formik.touched.email && formik.errors.email}
							label="Email"
							margin="normal"
							name="email"
							onBlur={formik.handleBlur}
							onChange={formik.handleChange}
							type="email"
							value={formik.values.email}
							variant="outlined"
						/>
						<TextField
							error={Boolean(formik.touched.password && formik.errors.password)}
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
						/>
						<Box sx={{ py: 2 }}>
							<Button
								color="primary"
								disabled={formik.isSubmitting}
								fullWidth
								size="large"
								type="submit"
								variant="contained"
							>
								Đăng nhập ngay
							</Button>
						</Box>
					</form>
				</Container>
			</Box>
		</>
	);
};

export default Login;
