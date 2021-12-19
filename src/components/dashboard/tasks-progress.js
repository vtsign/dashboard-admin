import { Avatar, Box, Card, CardContent, Grid, Typography } from '@mui/material';
import InsertChartIcon from '@mui/icons-material/InsertChartOutlined';

export const TasksProgress = (props) => (
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
			  <Grid item>
				  <Typography
					color="textSecondary"
					gutterBottom
					variant="overline"
				  >
					  TÀI LIỆU ĐÃ GỬI
				  </Typography>
				  <Typography
					color="textPrimary"
					variant="h4"
				  >
					  {props.totalContracts?.sent}
				  </Typography>
			  </Grid>
			  <Grid item>
				  <Typography
					color="textSecondary"
					gutterBottom
					variant="overline"
				  >
					  TÀI LIỆU ĐÃ HOÀN THÀNH
				  </Typography>
				  <Typography
					color="textPrimary"
					variant="h4"
				  >
					  {props.totalContracts?.completed}
				  </Typography>
			  </Grid>
			  <Grid item>
				  <Avatar
					sx={{
						backgroundColor: 'warning.main',
						height: 56,
						width: 56
					}}
				  >
					  <InsertChartIcon/>
				  </Avatar>
			  </Grid>
		  </Grid>
		  <Box
			sx={{
				alignItems: 'center',
				display: 'flex',
				pt: 2
			}}
		  >
		  </Box>
	  </CardContent>
  </Card>
);
