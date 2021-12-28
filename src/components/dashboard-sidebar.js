import { useEffect } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { Box, Divider, Drawer, useMediaQuery } from "@mui/material";
import { ChartBar as ChartBarIcon } from "../icons/chart-bar";
import LogoutIcon from "@mui/icons-material/Logout";
import { User as UserIcon } from "../icons/user";
import { Users as UsersIcon } from "../icons/users";
import { NavItem } from "./nav-item";
import { destroyCookie } from 'nookies'

const items = [
	{
		href: "/",
		icon: <ChartBarIcon fontSize="small" />,
		title: "Thống kê",
	},
	{
		href: "/customers",
		icon: <UsersIcon fontSize="small" />,
		title: "Người dùng",
	},
	{
		href: "/account",
		icon: <UserIcon fontSize="small" />,
		title: "Thông tin tài khoản",
	},
];

export const DashboardSidebar = (props) => {
	const { open, onClose } = props;
	const router = useRouter();
	const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"), {
		defaultMatches: true,
		noSsr: false,
	});

	const handleLogout = () => {
		localStorage.removeItem("user");
		localStorage.removeItem("accessToken");
		localStorage.removeItem("refreshToken");
		localStorage.removeItem("accessTokenExpired");
		localStorage.removeItem("refreshTokenExpired");
		localStorage.removeItem("isLogin");
		window.location.href = "/login";
		destroyCookie(null, 'isLoggedIn')
	};

	useEffect(
		() => {
			if (!router.isReady) {
				return;
			}

			if (open) {
				onClose?.();
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[router.asPath]
	);

	const content = (
		<>
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					height: "100%",
				}}
			>
				<div>
					<Box sx={{ p: 2, textAlign: "center" }}>
						<NextLink href="/" passHref>
							<a>
								<img
									style={{ width: "50%" }}
									src="/static/images/logo-white.png"
									alt="me"
								/>
							</a>
						</NextLink>
					</Box>
				</div>
				<Box sx={{ flexGrow: 1 }}>
					{items.map((item) => (
						<NavItem
							key={item.title}
							icon={item.icon}
							href={item.href}
							title={item.title}
						/>
					))}
					<NavItem
						icon={<LogoutIcon fontSize="small" />}
						title="Đăng xuất"
						href="#"
						onClick={handleLogout}
					/>
				</Box>
				<Divider sx={{ borderColor: "#2D3748" }} />
			</Box>
		</>
	);

	if (lgUp) {
		return (
			<Drawer
				anchor="left"
				open
				PaperProps={{
					sx: {
						backgroundColor: "neutral.900",
						color: "#FFFFFF",
						width: 280,
					},
				}}
				variant="permanent"
			>
				{content}
			</Drawer>
		);
	}

	return (
		<Drawer
			anchor="left"
			onClose={onClose}
			open={open}
			PaperProps={{
				sx: {
					backgroundColor: "neutral.900",
					color: "#FFFFFF",
					width: 280,
				},
			}}
			sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
			variant="temporary"
		>
			{content}
		</Drawer>
	);
};

DashboardSidebar.propTypes = {
	onClose: PropTypes.func,
	open: PropTypes.bool,
};
