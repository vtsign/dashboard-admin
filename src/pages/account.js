import Head from "next/head";
import { Box, Container, Grid, Typography } from "@mui/material";
import { DashboardLayout } from "../components/dashboard-layout";
import UserAvatar from "../components/Profiles/UserAvatar";
import UserProfileDetails from "../components/Profiles/UserProfileDetails";
import userApi from "../api/userApi";
import { useState, useEffect } from "react";
import Loading from "src/components/Loading/Loading";

const Account = () => {
	const [userInfo, setUserInfo] = useState(null);
	const [loading, setLoading] = useState(false);
	const [selectedImage, setSelectedImage] = useState(null);

	useEffect(() => {
		(async () => {
			try {
				setLoading(true);
				const response = await userApi.getUserProfile();
				setUserInfo(response.data);
				setLoading(false);
			} catch (err) {
				console.log(err);
			}
		})();
	}, []);

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
				{loading && <Loading />}
				{!loading && userInfo && (
					<Container maxWidth="lg">
						<Typography sx={{ mb: 3 }} variant="h4">
							Account
						</Typography>
						<Grid container className="profile__container">
							<Grid container spacing={3}>
								<Grid item lg={4} md={6} xs={12}>
									<UserAvatar
										userInfo={userInfo}
										selectedImage={selectedImage}
										setSelectedImage={setSelectedImage}
									/>
								</Grid>
								<Grid item lg={8} md={6} xs={12}>
									<UserProfileDetails
										userInfo={userInfo}
										selectedImage={selectedImage}
									/>
								</Grid>
							</Grid>
						</Grid>
					</Container>
				)}
			</Box>
		</>
	);
};

Account.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Account;
