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
} from "@mui/material";
import { DashboardLayout } from "../../components/dashboard-layout";
import UserAvatar from "../../components/Profiles/UserAvatar";
import UserProfileDetails from "../../components/Profiles/UserProfileDetails";
import userApi from "src/api/userApi";
import Loading from "src/components/Loading/Loading";
import { useForm, Controller } from "react-hook-form";
import { useToast } from "src/components/toast/useToast";
import { formatNumber } from "src/components/global";

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

	const props = { id };

	return { props };
}

const EditCustomer = (props) => {
	const [isLoading, setIsLoading] = useState(false);
	const [userInfo, setUserInfo] = useState(null);
	const [role, setRoles] = useState();

	const router = useRouter();
	const { success, error } = useToast();

	const {
		register,
		handleSubmit,
		formState: { errors },
		control,
		getValues,
		setValue
	} = useForm();

	useEffect(() => {
		setIsLoading(true);
		(async () => {
			try {
				const response = await userApi.getUser(props.id);
				if (response.status === 200) {
					setUserInfo(response.data);
					setIsLoading(false);
				}
			} catch (err) {
				error(err.toString() || "Đã có lỗi xảy ra");
				setIsLoading(false);
			}
		})();
	}, [props.id]);

	const onSubmitChange = async (formData) => {
		console.log(formData);
		formData.role = role;
		// console.log(roles)
		try {
			await userApi.updateUser(props.id, formData);
			success("Cập nhật tài khoản thành công");
			router.reload();
		} catch (err) {
			error(err.toString() || "Đã có lỗi xảy ra");
		}
	};

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
													value={userInfo.blocked ? "Đã bị chặn" : userInfo.deleted ? "Đã bị xóa" : "Đang hoạt động"}
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
															onChange={e => setRoles(e.target.value)}
															{...inputProps}
															inputRef={ref}
															value={value}
															SelectProps={{
																displayEmpty: true,
															}}
															defaultValue={userInfo?.roles?.[0]?.name ?? "USER"}
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
						{/* </Grid> */}
					</Container>
				)}
			</Box>
		</>
	);
};
EditCustomer.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default EditCustomer;
