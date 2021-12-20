import React, { useEffect, useState, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Box, Container, Grid, Typography } from "@mui/material";
import { DashboardLayout } from "../../components/dashboard-layout";
import UserAvatar from "../../components/Profiles/UserAvatar";
import UserProfileDetails from "../../components/Profiles/UserProfileDetails";
import userApi from "src/api/userApi";
import Loading from "src/components/Loading/Loading";

const EditCustomer = () => {
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		(async () => {

		})();
	}, [])
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
				{/* {loading && <Loading />}
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
				)} */}
			</Box>
		</>
	);
};
EditCustomer.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default EditCustomer;
