import { Avatar, Card, CardContent, Grid, Typography } from "@mui/material";
import MoneyIcon from "@mui/icons-material/Money";
import { formatNumber } from "../global";

export const Budget = (props) => (
	<Card sx={{ height: "100%" }} {...props}>
		<CardContent>
			<Grid container spacing={3} sx={{ justifyContent: "space-between" }}>
				<Grid item xs={12}>
					<Avatar
						sx={{
							backgroundColor: "error.main",
							height: 56,
							width: 56,
						}}
					>
						<MoneyIcon />
					</Avatar>
				</Grid>
				<Grid item xs={12}>
					<Typography color="textSecondary" gutterBottom variant="overline">
						DOANH THU
					</Typography>
					<Typography color="textPrimary" variant="h4">
						{formatNumber(props.totalDeposit)}
						{" đ"}
					</Typography>
				</Grid>
			</Grid>
		</CardContent>
	</Card>
);
