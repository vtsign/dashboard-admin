import React, { useState } from "react";
import {
	Box,
	Button,
	Card,
	CardContent,
	CardHeader,
	Divider,
	Grid,
	TextField,
	InputLabel,
} from "@mui/material";
import Router, { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import userApi from "../../api/userApi";
import { useToast } from "../toast/useToast";
import { responseMessage } from "../global";

const UserProfileDetails = ({ userInfo, selectedImage }) => {
	const [loading, setLoading] = useState(false);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const { success, error } = useToast();
	const history = useRouter();

	const onSubmitChange = async (formData) => {
		setLoading(true);
		try {
			if (selectedImage) {
				const data = new FormData();
				data.append("avatar", selectedImage);
				await userApi.updateAvatar(data);
			}
			await userApi.updateUserProfile(formData);
		} catch (err) {
			setLoading(false);
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
			return;
		} finally {
			setLoading(false);
			success("Cập nhật thông tin cá nhân thành công");
			history.reload();
		}
	};
	return (
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
							Họ và tên đệm <span style={{ color: "red" }}>*</span>
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
							Địa chỉ Email <span style={{ color: "red" }}>*</span>
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
							Số điện thoại <span style={{ color: "red" }}>*</span>
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
									message: "Số điện thoại phải là số và bắt đầu là 0 hoặc +",
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
	);
};

export default UserProfileDetails;
