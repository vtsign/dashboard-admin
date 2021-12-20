import { Avatar, Box, Card, CardContent, Grid, Typography } from '@mui/material';
import PeopleIcon from '@mui/icons-material/PeopleOutlined';

export const TotalCustomers = (props) => (
  <Card
	sx={{ height: '100%' }}
	{...props}
  >
	  <CardContent>
		  <Grid
			container
			spacing={3}
			sx={{ justifyContent: 'space-between' }}
		  >
			  <Grid item xs={12}>
				  <Avatar
					sx={{
						backgroundColor: 'success.main',
						height: 56,
						width: 56
					}}
				  >
					  <PeopleIcon/>
				  </Avatar>
			  </Grid>
			  <Grid item xs={12}>
				  <Typography
					color="textSecondary"
					gutterBottom
					variant="overline"
				  >
					  Tổng số người dùng
				  </Typography>
				  <Typography
					color="textPrimary"
					variant="h4"
				  >
					  {props.totalUser}
				  </Typography>
			  </Grid>
		  </Grid>
	  </CardContent>
  </Card>
);
