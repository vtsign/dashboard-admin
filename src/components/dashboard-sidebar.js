import { useEffect } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { Box, Divider, Drawer, useMediaQuery } from '@mui/material';
import { ChartBar as ChartBarIcon } from '../icons/chart-bar';
import { Lock as LockIcon } from '../icons/lock';
import { User as UserIcon } from '../icons/user';
import { Users as UsersIcon } from '../icons/users';
import { NavItem } from './nav-item';

const items = [
	{
		href: '/',
		icon: (<ChartBarIcon fontSize="small"/>),
		title: 'Dashboard'
	},
	{
		href: '/customers',
		icon: (<UsersIcon fontSize="small"/>),
		title: 'Customers'
	},
	{
		href: '/account',
		icon: (<UserIcon fontSize="small"/>),
		title: 'Account'
	},
	{
		href: '/logout',
		icon: (<LockIcon fontSize="small"/>),
		title: 'Logout'
	}
];

export const DashboardSidebar = (props) => {
	const { open, onClose } = props;
	const router = useRouter();
	const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'), {
		defaultMatches: true,
		noSsr: false
	});

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
				display: 'flex',
				flexDirection: 'column',
				height: '100%'
			}}
		  >
			  <div>
				  <Box sx={{ p: 2, textAlign: 'center' }}>
					  <NextLink
						href="/"
						passHref
					  >
						  <a>
							  <img style={{ width: '50%' }}
								   src="/static/images/logo-white.png"
								   alt="me"/>
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
			  </Box>
			  <Divider sx={{ borderColor: '#2D3748' }}/>
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
					backgroundColor: 'neutral.900',
					color: '#FFFFFF',
					width: 280
				}
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
				backgroundColor: 'neutral.900',
				color: '#FFFFFF',
				width: 280
			}
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
	open: PropTypes.bool
};
