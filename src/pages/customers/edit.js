import React, { useEffect, useState, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
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
} from "@mui/material";
import { DashboardLayout } from "../../components/dashboard-layout";
import UserAvatar from "../../components/Profiles/UserAvatar";
import UserProfileDetails from "../../components/Profiles/UserProfileDetails";
import userApi from "src/api/userApi";
import Loading from "src/components/Loading/Loading";
import { useForm } from "react-hook-form";
import { useToast } from "src/components/toast/useToast";

export async function getServerSideProps(ctx) {
	let query = ctx.query;
	let id = query.id;

	const props = { id };

	return { props };
}

const EditCustomer = (props) => {
	const [isLoading, setIsLoading] = useState(false);
	const [userInfo, setUserInfo] = useState(null);

	const router = useRouter();
	const { success, error } = useToast();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	useEffect(() => {
		setIsLoading(true);
		(async () => {
			try {
				const response = await userApi.getUser(props.id);
				console.log(response);
				if (response.status === 200) {
					setUserInfo(response.data);
					setIsLoading(false);
				}
			} catch (err) {
				console.log(err);
				setIsLoading(false);
			}
		})();
	}, [props.id]);

	const onSubmitChange = async (formData) => {
		console.log(formData);
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
						<Grid container className="profile__container" style={{ display: "flex", justifyContent: "center"}}>
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
													{...register("phone", {
														required: "Vui lòng nhập số điện thoại",
														pattern: {
															value: /(0)+([0-9]{0,13})\b/,
															message:
																"Số điện thoại phải là số và bắt đầu là 0 hoặc +",
														},
													})}
													error={!!errors.phone}
													helperText={errors?.phone?.message}
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
