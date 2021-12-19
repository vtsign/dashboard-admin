import { Bar } from 'react-chartjs-2';
import {
	Box,
	Card,
	CardContent,
	Divider,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	useTheme
} from '@mui/material';

export const Sales = (props) => {
	const { data, title, setType, type } = props;
	const theme = useTheme();

	const options = {
		animation: false,
		cornerRadius: 20,
		layout: { padding: 0 },
		legend: { display: false },
		maintainAspectRatio: false,
		responsive: true,
		xAxes: [
			{
				ticks: {
					fontColor: theme.palette.text.secondary
				},
				gridLines: {
					display: false,
					drawBorder: false
				}
			}
		],
		yAxes: [
			{
				ticks: {
					fontColor: theme.palette.text.secondary,
					beginAtZero: true,
					min: 0
				},
				gridLines: {
					borderDash: [2],
					borderDashOffset: [2],
					color: theme.palette.divider,
					drawBorder: false,
					zeroLineBorderDash: [2],
					zeroLineBorderDashOffset: [2],
					zeroLineColor: theme.palette.divider
				}
			}
		],
		tooltips: {
			backgroundColor: theme.palette.background.paper,
			bodyFontColor: theme.palette.text.secondary,
			borderColor: theme.palette.divider,
			borderWidth: 1,
			enabled: true,
			footerFontColor: theme.palette.text.secondary,
			intersect: false,
			mode: 'index',
			titleFontColor: theme.palette.text.primary
		}
	};
	console.log('sale renders');

	return (
	  <Card>
		  <FormControl>
			  <InputLabel id="demo-simple-select-label">Chọn thời gian</InputLabel>
			  <Select
				labelId="demo-simple-select-label"
				id="demo-simple-select"
				value={type}
				label="Chọn thời gian"
				onChange={(e) => setType(e.target.value)}
			  >
				  <MenuItem value="week">Tuần</MenuItem>
				  <MenuItem value="month">Tháng</MenuItem>
				  <MenuItem value="year">Năm</MenuItem>
				  <MenuItem value="all">Tất cả</MenuItem>
			  </Select>
		  </FormControl>
		  <Divider/>
		  <CardContent>
			  <Box
				sx={{
					height: 400,
					position: 'relative'
				}}
			  >
				  <Bar data={data} options={options}/>
			  </Box>
		  </CardContent>
		  <Divider/>
		  <Box
			sx={{
				display: 'flex',
				justifyContent: 'flex-end',
				p: 2
			}}
		  ></Box>
	  </Card>
	);
};
