import Head from "next/head";
import { CacheProvider } from "@emotion/react";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { createEmotionCache } from "../utils/create-emotion-cache";
import { theme } from "../theme";
import { ToastProvider } from "../components/toast/providers/ToastProvider.js";
import { parseCookies } from 'nookies'

const clientSideEmotionCache = createEmotionCache();

const App = (props) => {
	const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

	const getLayout = Component.getLayout ?? ((page) => page);

	return (
		<CacheProvider value={emotionCache}>
			<Head>
				<title>VTSign Pro</title>
				<meta name="viewport" content="initial-scale=1, width=device-width" />
			</Head>
			<LocalizationProvider dateAdapter={AdapterDateFns}>
				<ThemeProvider theme={theme}>
					<ToastProvider>
						<CssBaseline />
						{getLayout(<Component {...pageProps} />)}
					</ToastProvider>
				</ThemeProvider>
			</LocalizationProvider>
		</CacheProvider>
	);
};

function redirectUser(ctx, location) {
	if (ctx.req) {
		ctx.res.writeHead(302, { Location: location });
		ctx.res.end();
	} else {
		Router.push(location);
	}
}

App.getInitialProps = async ({ Component, ctx }) => {
	let pageProps = {}
	const isLoggedIn = parseCookies(ctx).isLoggedIn === 'true';

	if (Component.getInitialProps) {
		pageProps = await Component.getInitialProps(ctx)
	}

	//nếu chưa đăng nhập thì điều hướng đến trang đăng nhập
	//đến đã đăng nhập muốn vào trang login thì phải nhấn button logout, nên điều hướng đến manage
	if (!isLoggedIn) {
		if (!ctx.pathname.includes("/login")) {
			redirectUser(ctx, "/login");
		}
	}

	return {
		pageProps
	}
}
export default App;
